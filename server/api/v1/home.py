"""Home Operational Read Model for OS.

Enforces Section 6 & 42 of the PRD/TRD:
When a user opens OS, the home page answers:
    What matters right now?

Home query model provides a single consolidated view:
- Next action (highest priority unblocked task)
- Today's plan & scheduled tasks
- Waiting items (dependencies on people, external events)
- Blocked items
- Upcoming deadlines
- Recent activities
- Pending approvals
- Active agents
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional

from server.domain.enums import CommitmentStatus, TaskStatus
from server.db.repositories.core import (
    ActionApprovalRepository,
    ActivityRepository,
    CommitmentRepository,
    DependencyRepository,
    PlanRepository,
    TaskRepository,
)
from server.db.repositories.world import WorldModelRepository
from server.db.database import get_db


class HomeQueryService:
    def __init__(self, db: Optional[Any] = None) -> None:
        self.db = db or get_db()
        self.commitment_repo = CommitmentRepository(self.db)
        self.task_repo = TaskRepository(self.db)
        self.dep_repo = DependencyRepository(self.db)
        self.plan_repo = PlanRepository(self.db)
        self.activity_repo = ActivityRepository(self.db)
        self.approval_repo = ActionApprovalRepository(self.db)
        self.world_repo = WorldModelRepository(self.db)

    def get_home_view(self, user_id: str = "default_user") -> dict[str, Any]:
        today_str = datetime.now(timezone.utc).date().isoformat()

        # 1. Active plan for today
        active_plan = self.plan_repo.get_active_plan(user_id, today_str)
        today_plan_items = []
        if active_plan:
            plan, items = active_plan
            for it in items:
                task = self.task_repo.get(it.task_id, user_id)
                today_plan_items.append({
                    "id": it.id,
                    "task_id": it.task_id,
                    "title": task.title if task else "Scheduled Task",
                    "start": it.scheduled_start.isoformat(),
                    "end": it.scheduled_end.isoformat(),
                    "why_now": it.why_now,
                    "status": it.status.value,
                })

        # 2. Open commitments & upcoming deadlines
        due_soon = self.commitment_repo.get_due_soon(user_id, limit=5)
        upcoming_deadlines = [
            {
                "id": c.id,
                "title": c.title,
                "deadline": c.deadline.isoformat() if c.deadline else None,
                "priority": c.priority,
                "status": c.status.value,
            }
            for c in due_soon
        ]

        # 3. Waiting tasks
        waiting_tasks = []
        with self.db.connection() as conn:
            cursor = conn.execute(
                """
                SELECT t.id, t.title, d.dependency_type, d.description, p.name AS waiting_for
                FROM tasks t
                JOIN dependencies d ON d.task_id = t.id
                LEFT JOIN people p ON p.id = d.person_id
                WHERE t.user_id = ? AND t.status = 'WAITING' AND d.status = 'PENDING'
                """,
                (user_id,),
            )
            for r in cursor.fetchall():
                waiting_tasks.append({
                    "task_id": r["id"],
                    "title": r["title"],
                    "type": r["dependency_type"],
                    "waiting_for": r["waiting_for"] or r["description"] or "External dependency",
                })

        # 4. Blocked tasks
        blocked_tasks = []
        with self.db.connection() as conn:
            cursor = conn.execute(
                """
                SELECT t.id, t.title, d.description
                FROM tasks t
                JOIN dependencies d ON d.task_id = t.id
                WHERE t.user_id = ? AND (t.status = 'BLOCKED' OR d.status = 'BLOCKED')
                """,
                (user_id,),
            )
            for r in cursor.fetchall():
                blocked_tasks.append({
                    "task_id": r["id"],
                    "title": r["title"],
                    "blocker": r["description"] or "Blocked",
                })

        # 5. Next recommended action
        next_action = None
        open_tasks = self.task_repo.get_open_tasks(user_id)
        schedulable = [t for t in open_tasks if t.status in (TaskStatus.OPEN, TaskStatus.IN_PROGRESS)]
        if schedulable:
            top_task = schedulable[0]
            next_action = {
                "id": top_task.id,
                "title": top_task.title,
                "deadline": top_task.deadline.isoformat() if top_task.deadline else None,
                "estimated_minutes": top_task.estimated_duration_minutes,
                "reason": "Highest priority unblocked task with approaching deadline",
            }

        # 6. Pending approvals
        approvals = self.approval_repo.get_pending_approvals(user_id)
        pending_approvals = [
            {
                "approval_id": ap.id,
                "action_id": ac.id,
                "tool": ac.tool_name,
                "risk_level": ac.risk_level.value,
                "arguments": ac.arguments,
                "arguments_hash": ap.arguments_hash,
                "requested_at": ap.requested_at.isoformat(),
            }
            for ap, ac in approvals
        ]

        # 7. Recent activity timeline
        activities = self.activity_repo.list_recent(user_id, limit=8)
        recent_activity = [
            {
                "id": a.id,
                "actor": a.actor_type.value,
                "event_type": a.event_type,
                "summary": a.summary,
                "timestamp": a.created_at.isoformat(),
            }
            for a in activities
        ]

        # 8. Active agents
        agent_runs = self.world_repo.list_agent_runs(user_id, limit=5)
        active_agents = [
            {
                "run_id": ar.id,
                "agent_type": ar.agent_type,
                "status": ar.status.value,
                "workflow": ar.workflow_type,
            }
            for ar in agent_runs
        ]

        return {
            "greeting": "Good evening, Sai",
            "now": next_action,
            "today_plan": today_plan_items,
            "upcoming_deadlines": upcoming_deadlines,
            "waiting": waiting_tasks,
            "blocked": blocked_tasks,
            "pending_approvals": pending_approvals,
            "recent_activity": recent_activity,
            "active_agents": active_agents,
        }
