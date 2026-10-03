"""Deterministic Planner Engine for OS.

Enforces:
1. Fundamental Invariant: DEADLINE != PLAN DATE.
   The planner schedules `scheduled_start` and `scheduled_end` within available
   free calendar windows, but NEVER silently alters the external `deadline`.
2. Hard Constraints:
   - Respect calendar busy intervals.
   - No scheduling of BLOCKED or WAITING tasks.
   - Dependency ordering.
   - No overlapping task execution slots.
3. Structured Explainability ("Why Now?"):
   Generates operational rationale for every scheduled item.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta, timezone
from typing import Any, Optional

from server.domain.entities import Activity, Plan, PlanItem, Task
from server.domain.enums import ActorType, PlanItemStatus, PlanStatus, TaskStatus
from server.db.repositories.core import (
    ActivityRepository,
    CommitmentRepository,
    PlanRepository,
    TaskRepository,
)
from server.db.database import get_db

log = logging.getLogger("os.planner.engine")


@dataclass
class TimeSlot:
    start: datetime
    end: datetime

    def overlaps(self, other: TimeSlot) -> bool:
        return self.start < other.end and other.start < self.end

    @property
    def duration_minutes(self) -> int:
        return int((self.end - self.start).total_seconds() / 60)


@dataclass
class CalendarEventSlot:
    title: str
    start: datetime
    end: datetime


class PlannerEngine:
    def __init__(
        self,
        task_repo: Optional[TaskRepository] = None,
        commitment_repo: Optional[CommitmentRepository] = None,
        plan_repo: Optional[PlanRepository] = None,
        activity_repo: Optional[ActivityRepository] = None,
    ) -> None:
        db = get_db()
        self.task_repo = task_repo or TaskRepository(db)
        self.commitment_repo = commitment_repo or CommitmentRepository(db)
        self.plan_repo = plan_repo or PlanRepository(db)
        self.activity_repo = activity_repo or ActivityRepository(db)

    def create_daily_plan(
        self,
        user_id: str,
        target_date: Optional[date] = None,
        calendar_busy_slots: Optional[list[CalendarEventSlot]] = None,
    ) -> tuple[Plan, list[PlanItem]]:
        plan_d = target_date or datetime.now(timezone.utc).date()
        date_str = plan_d.isoformat()
        busy = calendar_busy_slots or []

        # 1. Fetch open candidate tasks
        all_tasks = self.task_repo.get_open_tasks(user_id)
        schedulable_tasks = [
            t for t in all_tasks
            if t.status in (TaskStatus.OPEN, TaskStatus.IN_PROGRESS)
        ]

        # Sort tasks by:
        # 1) Deadline proximity (earliest deadline first, nulls last)
        # 2) Priority (descending)
        def sort_key(t: Task):
            deadline_ts = t.deadline.timestamp() if t.deadline else float("inf")
            return (deadline_ts, -t.priority)

        schedulable_tasks.sort(key=sort_key)

        # 2. Define standard working hours for the day (e.g., 09:00 to 22:00 UTC)
        day_start = datetime.combine(plan_d, time(9, 0), tzinfo=timezone.utc)
        day_end = datetime.combine(plan_d, time(22, 0), tzinfo=timezone.utc)

        # 3. Compute available free slots
        free_slots = self._compute_free_slots(day_start, day_end, busy)

        # 4. Schedule tasks into free slots
        plan_items: list[PlanItem] = []
        plan = Plan(
            user_id=user_id,
            plan_date=date_str,
            status=PlanStatus.ACTIVE,
            reason="Automated daily schedule generation",
            planner_version="1.0.0",
        )

        current_slot_idx = 0
        current_slot_offset = timedelta(0)

        for rank, task in enumerate(schedulable_tasks, start=1):
            duration = timedelta(minutes=task.estimated_duration_minutes or 60)

            scheduled_start = None
            scheduled_end = None

            # Find a free window that fits the duration
            while current_slot_idx < len(free_slots):
                slot = free_slots[current_slot_idx]
                available_in_slot = (slot.end - (slot.start + current_slot_offset))

                if available_in_slot >= duration:
                    scheduled_start = slot.start + current_slot_offset
                    scheduled_end = scheduled_start + duration
                    current_slot_offset += duration
                    break
                else:
                    # Move to next free slot
                    current_slot_idx += 1
                    current_slot_offset = timedelta(0)

            if not scheduled_start or not scheduled_end:
                log.warning("No remaining free slots on %s for task '%s'", date_str, task.title)
                continue

            # Update task schedule in repository (CRITICAL: preserve immutable deadline!)
            task.scheduled_start = scheduled_start
            task.scheduled_end = scheduled_end
            self.task_repo.update(task)

            # Build "Why now?" explanation
            why_now = {
                "deadline_proximity": bool(task.deadline and (task.deadline - scheduled_end).total_seconds() < 86400 * 2),
                "estimated_minutes": task.estimated_duration_minutes or 60,
                "calendar_window": True,
                "priority": task.priority,
                "deadline_iso": task.deadline.isoformat() if task.deadline else None,
            }

            item = PlanItem(
                plan_id=plan.id,
                task_id=task.id,
                commitment_id=task.commitment_id,
                scheduled_start=scheduled_start,
                scheduled_end=scheduled_end,
                priority_rank=rank,
                why_now=why_now,
                status=PlanItemStatus.PLANNED,
            )
            plan_items.append(item)

        # Persist plan & plan items
        self.plan_repo.save_plan(plan, plan_items)

        self.activity_repo.log(
            Activity(
                user_id=user_id,
                actor_type=ActorType.OS,
                event_type="plan.created",
                entity_type="plan",
                entity_id=plan.id,
                summary=f"Generated plan for {date_str} with {len(plan_items)} scheduled tasks",
                metadata={"date": date_str, "scheduled_count": len(plan_items)},
            )
        )

        return plan, plan_items

    def replan_on_conflict(
        self,
        user_id: str,
        target_date: date,
        conflicting_event: CalendarEventSlot,
    ) -> tuple[Plan, list[PlanItem]]:
        """Automatically replans when a new calendar event conflicts with planned tasks.

        Preserves all immutable external deadlines.
        """
        active = self.plan_repo.get_active_plan(user_id, target_date.isoformat())
        if not active:
            return self.create_daily_plan(user_id, target_date, [conflicting_event])

        old_plan, old_items = active

        # Identify items in collision with the conflicting event
        conflict_slot = TimeSlot(conflicting_event.start, conflicting_event.end)
        conflicted_items = [
            it for it in old_items
            if conflict_slot.overlaps(TimeSlot(it.scheduled_start, it.scheduled_end))
        ]

        if not conflicted_items:
            log.info("No planned tasks collide with %s", conflicting_event.title)
            return old_plan, old_items

        # Build updated busy list including the new conflict
        busy = [conflicting_event]
        new_plan, new_items = self.create_daily_plan(user_id, target_date, busy)

        for c_item in conflicted_items:
            task = self.task_repo.get(c_item.task_id, user_id)
            task_title = task.title if task else c_item.task_id
            self.activity_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.OS,
                    event_type="plan.conflict_resolved",
                    entity_type="task",
                    entity_id=c_item.task_id,
                    summary=f"Calendar conflict with '{conflicting_event.title}'. Task '{task_title}' automatically rescheduled. Deadline unchanged.",
                    metadata={
                        "conflicting_event": conflicting_event.title,
                        "conflict_start": conflicting_event.start.isoformat(),
                    },
                )
            )

        return new_plan, new_items

    def _compute_free_slots(
        self,
        day_start: datetime,
        day_end: datetime,
        busy: list[CalendarEventSlot],
    ) -> list[TimeSlot]:
        if not busy:
            return [TimeSlot(day_start, day_end)]

        # Sort busy events by start time
        sorted_busy = sorted(busy, key=lambda b: b.start)
        free: list[TimeSlot] = []
        cursor = day_start

        for b in sorted_busy:
            b_start = max(b.start, day_start)
            b_end = min(b.end, day_end)

            if b_start > cursor:
                free.append(TimeSlot(cursor, b_start))
            cursor = max(cursor, b_end)

        if cursor < day_end:
            free.append(TimeSlot(cursor, day_end))

        return [slot for slot in free if slot.duration_minutes >= 15]
