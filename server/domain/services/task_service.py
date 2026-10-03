"""Domain services for Tasks and Dependencies.

Enforces:
1. Deterministic task lifecycle:
   OPEN -> IN_PROGRESS -> WAITING | BLOCKED -> COMPLETION_CANDIDATE -> COMPLETED | CANCELLED
2. Explicit first-class dependencies:
   Tasks waiting on people, approvals, external events, or other tasks.
3. Automatic unblocking:
   When dependencies are marked SATISFIED, the task transitions WAITING -> OPEN.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Optional

from server.domain.entities import Activity, Dependency, Task
from server.domain.enums import (
    ActorType,
    DependencyStatus,
    DependencyType,
    TaskStatus,
)
from server.db.repositories.core import (
    ActivityRepository,
    DependencyRepository,
    TaskRepository,
)
from server.db.database import get_db

log = logging.getLogger("os.domain.tasks")


class InvalidTaskStateTransitionError(ValueError):
    pass


class TaskService:
    VALID_TRANSITIONS: dict[TaskStatus, set[TaskStatus]] = {
        TaskStatus.OPEN: {
            TaskStatus.IN_PROGRESS,
            TaskStatus.WAITING,
            TaskStatus.BLOCKED,
            TaskStatus.COMPLETION_CANDIDATE,
            TaskStatus.CANCELLED,
        },
        TaskStatus.IN_PROGRESS: {
            TaskStatus.WAITING,
            TaskStatus.BLOCKED,
            TaskStatus.COMPLETION_CANDIDATE,
            TaskStatus.CANCELLED,
        },
        TaskStatus.WAITING: {
            TaskStatus.OPEN,
            TaskStatus.IN_PROGRESS,
            TaskStatus.BLOCKED,
            TaskStatus.CANCELLED,
        },
        TaskStatus.BLOCKED: {
            TaskStatus.OPEN,
            TaskStatus.IN_PROGRESS,
            TaskStatus.WAITING,
            TaskStatus.CANCELLED,
        },
        TaskStatus.COMPLETION_CANDIDATE: {
            TaskStatus.COMPLETED,
            TaskStatus.OPEN,
            TaskStatus.IN_PROGRESS,
            TaskStatus.CANCELLED,
        },
        TaskStatus.COMPLETED: {
            TaskStatus.OPEN,
        },
        TaskStatus.CANCELLED: {
            TaskStatus.OPEN,
        },
    }

    def __init__(
        self,
        repo: Optional[TaskRepository] = None,
        dep_repo: Optional[DependencyRepository] = None,
        activity_repo: Optional[ActivityRepository] = None,
    ) -> None:
        db = get_db()
        self.repo = repo or TaskRepository(db)
        self.dep_repo = dep_repo or DependencyRepository(db)
        self.activity_repo = activity_repo or ActivityRepository(db)

    def create_task(
        self,
        user_id: str,
        title: str,
        commitment_id: Optional[str] = None,
        project_id: Optional[str] = None,
        description: Optional[str] = None,
        priority: int = 50,
        estimated_duration_minutes: int = 60,
        deadline: Optional[datetime] = None,
        scheduled_start: Optional[datetime] = None,
        scheduled_end: Optional[datetime] = None,
        assigned_agent_id: Optional[str] = None,
    ) -> Task:
        t = Task(
            user_id=user_id,
            commitment_id=commitment_id,
            project_id=project_id,
            title=title,
            description=description,
            status=TaskStatus.OPEN,
            priority=priority,
            estimated_duration_minutes=estimated_duration_minutes,
            deadline=deadline,
            scheduled_start=scheduled_start,
            scheduled_end=scheduled_end,
            assigned_agent_id=assigned_agent_id,
        )
        self.repo.create(t)

        self.activity_repo.log(
            Activity(
                user_id=user_id,
                actor_type=ActorType.OS,
                event_type="task.created",
                entity_type="task",
                entity_id=t.id,
                summary=f"Created task: '{title}'",
                metadata={"priority": priority, "commitment_id": commitment_id},
            )
        )
        return t

    def transition_state(
        self,
        task_id: str,
        new_status: TaskStatus,
        user_id: str = "default_user",
        reason: str = "",
        verified: bool = False,
    ) -> Task:
        t = self.repo.get(task_id, user_id)
        if not t:
            raise ValueError(f"Task '{task_id}' not found")

        if new_status == t.status:
            return t

        allowed = self.VALID_TRANSITIONS.get(t.status, set())
        if new_status not in allowed:
            raise InvalidTaskStateTransitionError(
                f"Cannot transition task '{t.title}' from {t.status.value} to {new_status.value}"
            )

        if new_status == TaskStatus.COMPLETED and not verified and t.status != TaskStatus.COMPLETION_CANDIDATE:
            new_status = TaskStatus.COMPLETION_CANDIDATE

        old_status = t.status
        t.status = new_status
        now = datetime.now(timezone.utc)
        if new_status == TaskStatus.COMPLETED:
            t.completed_at = now

        self.repo.update(t)

        self.activity_repo.log(
            Activity(
                user_id=user_id,
                actor_type=ActorType.OS,
                event_type="task.status_changed",
                entity_type="task",
                entity_id=t.id,
                summary=f"Task '{t.title}' transitioned from {old_status.value} to {new_status.value}" + (f": {reason}" if reason else ""),
                metadata={"old_status": old_status.value, "new_status": new_status.value, "verified": verified},
            )
        )
        return t

    def add_dependency(
        self,
        user_id: str,
        task_id: str,
        dependency_type: DependencyType,
        depends_on_task_id: Optional[str] = None,
        person_id: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Dependency:
        dep = Dependency(
            user_id=user_id,
            task_id=task_id,
            depends_on_task_id=depends_on_task_id,
            person_id=person_id,
            dependency_type=dependency_type,
            status=DependencyStatus.PENDING,
            description=description,
        )
        self.dep_repo.create(dep)

        # Transition task to WAITING if it is OPEN
        task = self.repo.get(task_id, user_id)
        if task and task.status == TaskStatus.OPEN:
            self.transition_state(task_id, TaskStatus.WAITING, user_id, reason=f"Waiting on {dependency_type.value}: {description or ''}")

        return dep

    def resolve_dependency(self, dep_id: str, user_id: str = "default_user") -> None:
        self.dep_repo.update_status(dep_id, DependencyStatus.SATISFIED, user_id)

        # Check if the task has any remaining pending dependencies
        # First retrieve task_id for this dep
        with self.dep_repo.db.connection() as conn:
            row = conn.execute("SELECT task_id FROM dependencies WHERE id = ?", (dep_id,)).fetchone()
            if not row:
                return
            task_id = row["task_id"]

        all_deps = self.dep_repo.get_by_task(task_id, user_id)
        still_pending = any(d.status in (DependencyStatus.PENDING, DependencyStatus.BLOCKED) for d in all_deps)

        task = self.repo.get(task_id, user_id)
        if task and task.status in (TaskStatus.WAITING, TaskStatus.BLOCKED) and not still_pending:
            self.transition_state(task_id, TaskStatus.OPEN, user_id, reason="All dependencies resolved")

    def get_waiting_tasks(self, user_id: str = "default_user") -> list[dict]:
        """Returns tasks that are currently waiting with dependency descriptions."""
        with self.repo.db.connection() as conn:
            cursor = conn.execute(
                """
                SELECT t.id, t.title, t.status, d.dependency_type, d.description, p.name AS person_name
                FROM tasks t
                JOIN dependencies d ON d.task_id = t.id
                LEFT JOIN people p ON p.id = d.person_id
                WHERE t.user_id = ? AND t.status = 'WAITING' AND d.status = 'PENDING'
                """,
                (user_id,),
            )
            return [dict(r) for r in cursor.fetchall()]

    def get_blocked_tasks(self, user_id: str = "default_user") -> list[dict]:
        """Returns tasks that are blocked with dependency descriptions."""
        with self.repo.db.connection() as conn:
            cursor = conn.execute(
                """
                SELECT t.id, t.title, t.status, d.dependency_type, d.description
                FROM tasks t
                JOIN dependencies d ON d.task_id = t.id
                WHERE t.user_id = ? AND (t.status = 'BLOCKED' OR d.status = 'BLOCKED')
                """,
                (user_id,),
            )
            return [dict(r) for r in cursor.fetchall()]
