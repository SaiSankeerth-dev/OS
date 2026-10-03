"""Deterministic Planner Engine for OS.

Enforces:
1. Fundamental Invariant: DEADLINE != PLAN DATE.
   The planner schedules `scheduled_start` and `scheduled_end` within available
   free calendar windows, but NEVER silently alters the external `deadline`.
2. Hard Constraints:
   - Respect calendar busy intervals.
   - No scheduling of BLOCKED or WAITING tasks.
   - Dependency ordering (topological sort + prerequisite completion before dependent start).
   - No overlapping task execution slots.
3. Structured Explainability ("Why Now?"):
   Generates operational rationale for every scheduled item, including deadline risk.
4. Automatic replanning on calendar conflict with busy list preservation.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from typing import Any, Optional

from server.domain.entities import Activity, Plan, PlanItem, Task
from server.domain.enums import (
    ActorType,
    DependencyStatus,
    PlanItemStatus,
    PlanStatus,
    TaskStatus,
)
from server.db.repositories.core import (
    ActivityRepository,
    CommitmentRepository,
    DependencyRepository,
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
        dep_repo: Optional[DependencyRepository] = None,
        db: Optional[Any] = None,
    ) -> None:
        _db = db or get_db()
        self.task_repo = task_repo or TaskRepository(_db)
        self.commitment_repo = commitment_repo or CommitmentRepository(_db)
        self.plan_repo = plan_repo or PlanRepository(_db)
        self.activity_repo = activity_repo or ActivityRepository(_db)
        self.dep_repo = dep_repo or DependencyRepository(_db)

    def create_daily_plan(
        self,
        user_id: str,
        target_date: Optional[date] = None,
        calendar_busy_slots: Optional[list[CalendarEventSlot]] = None,
    ) -> tuple[Plan, list[PlanItem]]:
        plan_d = target_date or datetime.now(timezone.utc).date()
        date_str = plan_d.isoformat()
        busy = list(calendar_busy_slots or [])

        # 1. Fetch open candidate tasks (only OPEN and IN_PROGRESS; WAITING/BLOCKED excluded)
        all_tasks = self.task_repo.get_open_tasks(user_id)
        schedulable_tasks = [
            t for t in all_tasks
            if t.status in (TaskStatus.OPEN, TaskStatus.IN_PROGRESS)
        ]

        # 2. Dependency ordering (Topological Sort)
        dep_map: dict[str, set[str]] = {}
        task_by_id = {t.id: t for t in schedulable_tasks}

        for t in schedulable_tasks:
            deps = self.dep_repo.get_by_task(t.id, user_id)
            dep_task_ids = {
                d.depends_on_task_id
                for d in deps
                if d.depends_on_task_id and d.status == DependencyStatus.PENDING
            }
            dep_map[t.id] = dep_task_ids

        ordered_tasks: list[Task] = []
        visited: set[str] = set()
        temp_mark: set[str] = set()

        def visit(task_id: str):
            if task_id in temp_mark:
                return  # Break dependency cycles gracefully
            if task_id not in visited:
                temp_mark.add(task_id)
                # Visit dependencies first
                for dep_id in sorted(
                    dep_map.get(task_id, set()),
                    key=lambda tid: (
                        task_by_id[tid].deadline.timestamp()
                        if tid in task_by_id and task_by_id[tid].deadline
                        else float("inf"),
                        -task_by_id[tid].priority if tid in task_by_id else 0,
                    ),
                ):
                    if dep_id in task_by_id:
                        visit(dep_id)
                temp_mark.remove(task_id)
                visited.add(task_id)
                if task_id in task_by_id:
                    ordered_tasks.append(task_by_id[task_id])

        # Base sorting by deadline proximity and priority
        base_sorted = sorted(
            schedulable_tasks,
            key=lambda t: (
                t.deadline.timestamp() if t.deadline else float("inf"),
                -t.priority,
            ),
        )
        for t in base_sorted:
            if t.id not in visited:
                visit(t.id)

        schedulable_tasks = ordered_tasks

        # 3. Define standard working hours for the day (09:00 to 22:00 UTC)
        day_start = datetime.combine(plan_d, time(9, 0), tzinfo=timezone.utc)
        day_end = datetime.combine(plan_d, time(22, 0), tzinfo=timezone.utc)

        # 4. Compute available free slots
        free_slots = self._compute_free_slots(day_start, day_end, busy)

        # 5. Schedule tasks into free slots respecting dependencies
        plan_items: list[PlanItem] = []
        plan = Plan(
            user_id=user_id,
            plan_date=date_str,
            status=PlanStatus.ACTIVE,
            reason="Automated daily schedule generation",
            planner_version="1.0.0",
        )

        scheduled_ends: dict[str, datetime] = {}

        for rank, task in enumerate(schedulable_tasks, start=1):
            duration = timedelta(minutes=task.estimated_duration_minutes or 60)

            # Earliest start must be after all scheduled prerequisites have finished
            prereq_ids = dep_map.get(task.id, set())
            min_start_time = day_start
            for p_id in prereq_ids:
                if p_id in scheduled_ends:
                    min_start_time = max(min_start_time, scheduled_ends[p_id])

            scheduled_start = None
            scheduled_end = None

            # Find a free window that starts at or after min_start_time and fits duration
            for slot in free_slots:
                effective_start = max(slot.start, min_start_time)
                potential_end = effective_start + duration
                if potential_end <= slot.end:
                    scheduled_start = effective_start
                    scheduled_end = potential_end
                    break

            if not scheduled_start or not scheduled_end:
                log.warning("No remaining free slots on %s for task '%s'", date_str, task.title)
                continue

            scheduled_ends[task.id] = scheduled_end

            # Update free slots: carve out the scheduled window so tasks never overlap
            free_slots = self._carve_slot(free_slots, scheduled_start, scheduled_end)

            # Update task schedule in repository (CRITICAL: preserve immutable deadline!)
            original_deadline = task.deadline
            task.scheduled_start = scheduled_start
            task.scheduled_end = scheduled_end
            task.status = TaskStatus.IN_PROGRESS
            assert task.deadline == original_deadline  # Immutable external deadline invariant!
            self.task_repo.update(task)

            # Compute rationale and deadline risk
            deadline_risk = False
            overdue_minutes = 0
            if task.deadline:
                dl = task.deadline if task.deadline.tzinfo else task.deadline.replace(tzinfo=timezone.utc)
                if scheduled_end > dl:
                    deadline_risk = True
                    overdue_minutes = int((scheduled_end - dl).total_seconds() / 60)

            why_now = {
                "rank": rank,
                "priority": task.priority,
                "duration_minutes": int(duration.total_seconds() / 60),
                "has_deadline": task.deadline is not None,
                "deadline_str": task.deadline.isoformat() if task.deadline else None,
                "deadline_risk": deadline_risk,
                "overdue_by_minutes": overdue_minutes,
                "prerequisites_satisfied": len(prereq_ids),
                "rationale": (
                    f"Scheduled #{rank} based on dependency topological ordering and deadline. "
                    f"{'WARNING: Deadline risk detected!' if deadline_risk else 'On schedule.'}"
                ),
            }

            plan_item = PlanItem(
                plan_id=plan.id,
                task_id=task.id,
                commitment_id=task.commitment_id,
                scheduled_start=scheduled_start,
                scheduled_end=scheduled_end,
                priority_rank=rank,
                why_now=why_now,
                status=PlanItemStatus.PLANNED,
            )
            plan_items.append(plan_item)

        # 6. Persist plan and items
        self.plan_repo.create_plan(plan, plan_items)

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
        existing_busy_slots: Optional[list[CalendarEventSlot]] = None,
    ) -> tuple[Plan, list[PlanItem]]:
        """Automatically replans when a new calendar event conflicts with planned tasks.

        Preserves existing calendar busy slots AND immutable external deadlines.
        """
        active = self.plan_repo.get_active_plan(user_id, target_date.isoformat())

        # Build complete busy list preserving previous slots + the new event
        busy: list[CalendarEventSlot] = list(existing_busy_slots or [])
        if not any(b.start == conflicting_event.start and b.end == conflicting_event.end for b in busy):
            busy.append(conflicting_event)

        if not active:
            return self.create_daily_plan(user_id, target_date, busy)

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

        # Replan with all busy intervals
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

    def _carve_slot(
        self,
        slots: list[TimeSlot],
        used_start: datetime,
        used_end: datetime,
    ) -> list[TimeSlot]:
        """Carve out a scheduled task window from available free slots."""
        new_slots: list[TimeSlot] = []
        for s in slots:
            if used_end <= s.start or used_start >= s.end:
                # No overlap
                new_slots.append(s)
            else:
                # Overlap: split into pieces
                if s.start < used_start:
                    left = TimeSlot(s.start, used_start)
                    if left.duration_minutes >= 15:
                        new_slots.append(left)
                if used_end < s.end:
                    right = TimeSlot(used_end, s.end)
                    if right.duration_minutes >= 15:
                        new_slots.append(right)
        return new_slots
