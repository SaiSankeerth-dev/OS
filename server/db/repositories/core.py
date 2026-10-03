"""Core domain repositories for OS.

Provides clean CRUD and query operations over the unified database
for Commitments, Tasks, Dependencies, Plans, Ingestion, and Activities.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Optional, Tuple

from server.domain.entities import (
    Action,
    Activity,
    AgentRun,
    Approval,
    Commitment,
    Dependency,
    Evidence,
    Goal,
    Memory,
    Notification,
    Person,
    Plan,
    PlanItem,
    Project,
    Source,
    SourceEvent,
    Task,
    VerificationResult,
)
from server.domain.enums import (
    ActionStatus,
    ActorType,
    AgentRunStatus,
    ApprovalStatus,
    CommitmentStatus,
    DependencyStatus,
    DependencyType,
    PlanItemStatus,
    PlanStatus,
    ProcessingStatus,
    RiskLevel,
    SourceStatus,
    TaskStatus,
    VerificationStatus,
)
from ..database import DatabaseEngine, get_db


def _dt_to_iso(dt: Optional[datetime]) -> Optional[str]:
    if dt is None:
        return None
    return dt.isoformat()


def _iso_to_dt(iso_str: Optional[str]) -> Optional[datetime]:
    if not iso_str:
        return None
    try:
        return datetime.fromisoformat(iso_str)
    except Exception:
        return None


class CommitmentRepository:
    def __init__(self, db: DatabaseEngine = get_db()) -> None:
        self.db = db

    def create(self, c: Commitment) -> Commitment:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO commitments (
                    id, user_id, title, description, status, priority,
                    deadline, estimated_duration_minutes, project_id, goal_id,
                    person_id, source_event_id, confidence, completed_at,
                    cancelled_at, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    c.id,
                    c.user_id,
                    c.title,
                    c.description,
                    c.status.value,
                    c.priority,
                    _dt_to_iso(c.deadline),
                    c.estimated_duration_minutes,
                    c.project_id,
                    c.goal_id,
                    c.person_id,
                    c.source_event_id,
                    c.confidence,
                    _dt_to_iso(c.completed_at),
                    _dt_to_iso(c.cancelled_at),
                    _dt_to_iso(c.created_at) or now,
                    _dt_to_iso(c.updated_at) or now,
                ),
            )
        return c

    def update(self, c: Commitment) -> Commitment:
        now = datetime.now(timezone.utc).isoformat()
        c.updated_at = datetime.fromisoformat(now)
        with self.db.transaction() as conn:
            conn.execute(
                """
                UPDATE commitments SET
                    title = ?, description = ?, status = ?, priority = ?,
                    deadline = ?, estimated_duration_minutes = ?, project_id = ?,
                    goal_id = ?, person_id = ?, source_event_id = ?, confidence = ?,
                    completed_at = ?, cancelled_at = ?, updated_at = ?
                WHERE id = ? AND user_id = ?
                """,
                (
                    c.title,
                    c.description,
                    c.status.value,
                    c.priority,
                    _dt_to_iso(c.deadline),
                    c.estimated_duration_minutes,
                    c.project_id,
                    c.goal_id,
                    c.person_id,
                    c.source_event_id,
                    c.confidence,
                    _dt_to_iso(c.completed_at),
                    _dt_to_iso(c.cancelled_at),
                    now,
                    c.id,
                    c.user_id,
                ),
            )
        return c

    def get(self, commitment_id: str, user_id: str = "default_user") -> Optional[Commitment]:
        with self.db.connection() as conn:
            row = conn.execute(
                "SELECT * FROM commitments WHERE id = ? AND user_id = ?",
                (commitment_id, user_id),
            ).fetchone()
            if not row:
                return None
            return self._row_to_entity(row)

    def list_by_user(
        self,
        user_id: str = "default_user",
        status: Optional[CommitmentStatus] = None,
    ) -> list[Commitment]:
        with self.db.connection() as conn:
            if status:
                cursor = conn.execute(
                    "SELECT * FROM commitments WHERE user_id = ? AND status = ? ORDER BY deadline ASC, priority DESC",
                    (user_id, status.value),
                )
            else:
                cursor = conn.execute(
                    "SELECT * FROM commitments WHERE user_id = ? ORDER BY deadline ASC, priority DESC",
                    (user_id,),
                )
            return [self._row_to_entity(r) for r in cursor.fetchall()]

    def get_open_or_in_progress(self, user_id: str = "default_user") -> list[Commitment]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                """
                SELECT * FROM commitments
                WHERE user_id = ? AND status IN ('OPEN', 'IN_PROGRESS', 'WAITING', 'BLOCKED', 'COMPLETION_CANDIDATE')
                ORDER BY deadline ASC, priority DESC
                """,
                (user_id,),
            )
            return [self._row_to_entity(r) for r in cursor.fetchall()]

    def get_due_soon(self, user_id: str = "default_user", limit: int = 10) -> list[Commitment]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                """
                SELECT * FROM commitments
                WHERE user_id = ? AND status NOT IN ('COMPLETED', 'CANCELLED') AND deadline IS NOT NULL
                ORDER BY deadline ASC LIMIT ?
                """,
                (user_id, limit),
            )
            return [self._row_to_entity(r) for r in cursor.fetchall()]

    def _row_to_entity(self, r: sqlite3.Row) -> Commitment:
        return Commitment(
            id=r["id"],
            user_id=r["user_id"],
            title=r["title"],
            description=r["description"],
            status=CommitmentStatus(r["status"]),
            priority=r["priority"],
            deadline=_iso_to_dt(r["deadline"]),
            estimated_duration_minutes=r["estimated_duration_minutes"],
            project_id=r["project_id"],
            goal_id=r["goal_id"],
            person_id=r["person_id"],
            source_event_id=r["source_event_id"],
            confidence=float(r["confidence"]) if r["confidence"] is not None else 1.0,
            completed_at=_iso_to_dt(r["completed_at"]),
            cancelled_at=_iso_to_dt(r["cancelled_at"]),
            created_at=_iso_to_dt(r["created_at"]) or datetime.now(timezone.utc),
            updated_at=_iso_to_dt(r["updated_at"]) or datetime.now(timezone.utc),
        )


class TaskRepository:
    def __init__(self, db: DatabaseEngine = get_db()) -> None:
        self.db = db

    def create(self, t: Task) -> Task:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO tasks (
                    id, user_id, commitment_id, project_id, parent_task_id,
                    title, description, status, priority, estimated_duration_minutes,
                    deadline, scheduled_start, scheduled_end, assigned_agent_id,
                    completed_at, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    t.id,
                    t.user_id,
                    t.commitment_id,
                    t.project_id,
                    t.parent_task_id,
                    t.title,
                    t.description,
                    t.status.value,
                    t.priority,
                    t.estimated_duration_minutes,
                    _dt_to_iso(t.deadline),
                    _dt_to_iso(t.scheduled_start),
                    _dt_to_iso(t.scheduled_end),
                    t.assigned_agent_id,
                    _dt_to_iso(t.completed_at),
                    _dt_to_iso(t.created_at) or now,
                    _dt_to_iso(t.updated_at) or now,
                ),
            )
        return t

    def update(self, t: Task) -> Task:
        now = datetime.now(timezone.utc).isoformat()
        t.updated_at = datetime.fromisoformat(now)
        with self.db.transaction() as conn:
            conn.execute(
                """
                UPDATE tasks SET
                    title = ?, description = ?, status = ?, priority = ?,
                    estimated_duration_minutes = ?, deadline = ?,
                    scheduled_start = ?, scheduled_end = ?, assigned_agent_id = ?,
                    completed_at = ?, updated_at = ?
                WHERE id = ? AND user_id = ?
                """,
                (
                    t.title,
                    t.description,
                    t.status.value,
                    t.priority,
                    t.estimated_duration_minutes,
                    _dt_to_iso(t.deadline),
                    _dt_to_iso(t.scheduled_start),
                    _dt_to_iso(t.scheduled_end),
                    t.assigned_agent_id,
                    _dt_to_iso(t.completed_at),
                    now,
                    t.id,
                    t.user_id,
                ),
            )
        return t

    def get(self, task_id: str, user_id: str = "default_user") -> Optional[Task]:
        with self.db.connection() as conn:
            row = conn.execute(
                "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
                (task_id, user_id),
            ).fetchone()
            if not row:
                return None
            return self._row_to_entity(row)

    def list_by_commitment(self, commitment_id: str, user_id: str = "default_user") -> list[Task]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM tasks WHERE commitment_id = ? AND user_id = ? ORDER BY priority DESC",
                (commitment_id, user_id),
            )
            return [self._row_to_entity(r) for r in cursor.fetchall()]

    def list_by_user(
        self,
        user_id: str = "default_user",
        status: Optional[TaskStatus] = None,
    ) -> list[Task]:
        with self.db.connection() as conn:
            if status:
                cursor = conn.execute(
                    "SELECT * FROM tasks WHERE user_id = ? AND status = ? ORDER BY deadline ASC, priority DESC",
                    (user_id, status.value),
                )
            else:
                cursor = conn.execute(
                    "SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline ASC, priority DESC",
                    (user_id,),
                )
            return [self._row_to_entity(r) for r in cursor.fetchall()]

    def get_open_tasks(self, user_id: str = "default_user") -> list[Task]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                """
                SELECT * FROM tasks
                WHERE user_id = ? AND status IN ('OPEN', 'IN_PROGRESS', 'WAITING', 'BLOCKED', 'COMPLETION_CANDIDATE')
                ORDER BY scheduled_start ASC, priority DESC
                """,
                (user_id,),
            )
            return [self._row_to_entity(r) for r in cursor.fetchall()]

    def delete(self, task_id: str, user_id: str = "default_user") -> bool:
        with self.db.transaction() as conn:
            res = conn.execute(
                "DELETE FROM tasks WHERE id = ? AND user_id = ?",
                (task_id, user_id),
            )
            return res.rowcount > 0

    def _row_to_entity(self, r: sqlite3.Row) -> Task:
        return Task(
            id=r["id"],
            user_id=r["user_id"],
            commitment_id=r["commitment_id"],
            project_id=r["project_id"],
            parent_task_id=r["parent_task_id"],
            title=r["title"],
            description=r["description"],
            status=TaskStatus(r["status"]),
            priority=r["priority"],
            estimated_duration_minutes=r["estimated_duration_minutes"] or 60,
            deadline=_iso_to_dt(r["deadline"]),
            scheduled_start=_iso_to_dt(r["scheduled_start"]),
            scheduled_end=_iso_to_dt(r["scheduled_end"]),
            assigned_agent_id=r["assigned_agent_id"],
            completed_at=_iso_to_dt(r["completed_at"]),
            created_at=_iso_to_dt(r["created_at"]) or datetime.now(timezone.utc),
            updated_at=_iso_to_dt(r["updated_at"]) or datetime.now(timezone.utc),
        )


class DependencyRepository:
    def __init__(self, db: DatabaseEngine = get_db()) -> None:
        self.db = db

    def create(self, dep: Dependency) -> Dependency:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO dependencies (
                    id, user_id, task_id, depends_on_task_id, person_id,
                    dependency_type, status, description, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    dep.id,
                    dep.user_id,
                    dep.task_id,
                    dep.depends_on_task_id,
                    dep.person_id,
                    dep.dependency_type.value,
                    dep.status.value,
                    dep.description,
                    _dt_to_iso(dep.created_at) or now,
                    _dt_to_iso(dep.updated_at) or now,
                ),
            )
        return dep

    def get_by_task(self, task_id: str, user_id: str = "default_user") -> list[Dependency]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM dependencies WHERE task_id = ? AND user_id = ?",
                (task_id, user_id),
            )
            return [
                Dependency(
                    id=r["id"],
                    user_id=r["user_id"],
                    task_id=r["task_id"],
                    depends_on_task_id=r["depends_on_task_id"],
                    person_id=r["person_id"],
                    dependency_type=DependencyType(r["dependency_type"]),
                    status=DependencyStatus(r["status"]),
                    description=r["description"],
                    created_at=_iso_to_dt(r["created_at"]) or datetime.now(timezone.utc),
                    updated_at=_iso_to_dt(r["updated_at"]) or datetime.now(timezone.utc),
                )
                for r in cursor.fetchall()
            ]

    def update_status(self, dep_id: str, status: DependencyStatus, user_id: str = "default_user") -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                "UPDATE dependencies SET status = ?, updated_at = ? WHERE id = ? AND user_id = ?",
                (status.value, now, dep_id, user_id),
            )

    def get_pending_dependencies(self, user_id: str = "default_user") -> list[Dependency]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM dependencies WHERE user_id = ? AND status = 'PENDING'",
                (user_id,),
            )
            return [
                Dependency(
                    id=r["id"],
                    user_id=r["user_id"],
                    task_id=r["task_id"],
                    depends_on_task_id=r["depends_on_task_id"],
                    person_id=r["person_id"],
                    dependency_type=DependencyType(r["dependency_type"]),
                    status=DependencyStatus(r["status"]),
                    description=r["description"],
                    created_at=_iso_to_dt(r["created_at"]) or datetime.now(timezone.utc),
                    updated_at=_iso_to_dt(r["updated_at"]) or datetime.now(timezone.utc),
                )
                for r in cursor.fetchall()
            ]


class PlanRepository:
    def __init__(self, db: DatabaseEngine = get_db()) -> None:
        self.db = db

    def save_plan(self, plan: Plan, items: list[PlanItem]) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            # Supersede any existing active plan for that plan_date
            conn.execute(
                "UPDATE plans SET status = 'SUPERSEDED', updated_at = ? WHERE user_id = ? AND plan_date = ? AND status = 'ACTIVE'",
                (now, plan.user_id, plan.plan_date),
            )
            conn.execute(
                """
                INSERT INTO plans (id, user_id, plan_date, status, reason, planner_version, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    plan.id,
                    plan.user_id,
                    plan.plan_date,
                    plan.status.value,
                    plan.reason,
                    plan.planner_version,
                    _dt_to_iso(plan.created_at) or now,
                    _dt_to_iso(plan.updated_at) or now,
                ),
            )
            for item in items:
                conn.execute(
                    """
                    INSERT INTO plan_items (
                        id, plan_id, task_id, commitment_id, scheduled_start,
                        scheduled_end, priority_rank, why_now, status, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        item.id,
                        plan.id,
                        item.task_id,
                        item.commitment_id,
                        _dt_to_iso(item.scheduled_start),
                        _dt_to_iso(item.scheduled_end),
                        item.priority_rank,
                        json.dumps(item.why_now),
                        item.status.value,
                        _dt_to_iso(item.created_at) or now,
                    ),
                )

    def get_active_plan(self, user_id: str, plan_date: str) -> Optional[Tuple[Plan, list[PlanItem]]]:
        with self.db.connection() as conn:
            p_row = conn.execute(
                "SELECT * FROM plans WHERE user_id = ? AND plan_date = ? AND status = 'ACTIVE' ORDER BY created_at DESC LIMIT 1",
                (user_id, plan_date),
            ).fetchone()
            if not p_row:
                return None
            plan = Plan(
                id=p_row["id"],
                user_id=p_row["user_id"],
                plan_date=p_row["plan_date"],
                status=PlanStatus(p_row["status"]),
                reason=p_row["reason"],
                planner_version=p_row["planner_version"],
                created_at=_iso_to_dt(p_row["created_at"]) or datetime.now(timezone.utc),
                updated_at=_iso_to_dt(p_row["updated_at"]) or datetime.now(timezone.utc),
            )
            cursor = conn.execute(
                "SELECT * FROM plan_items WHERE plan_id = ? ORDER BY scheduled_start ASC",
                (plan.id,),
            )
            items = [
                PlanItem(
                    id=r["id"],
                    plan_id=r["plan_id"],
                    task_id=r["task_id"],
                    commitment_id=r["commitment_id"],
                    scheduled_start=_iso_to_dt(r["scheduled_start"]) or datetime.now(timezone.utc),
                    scheduled_end=_iso_to_dt(r["scheduled_end"]) or datetime.now(timezone.utc),
                    priority_rank=r["priority_rank"],
                    why_now=json.loads(r["why_now"] or "{}"),
                    status=PlanItemStatus(r["status"]),
                    created_at=_iso_to_dt(r["created_at"]) or datetime.now(timezone.utc),
                )
                for r in cursor.fetchall()
            ]
            return plan, items


class SourceEventRepository:
    def __init__(self, db: DatabaseEngine = get_db()) -> None:
        self.db = db

    def save_event(self, ev: SourceEvent) -> Tuple[SourceEvent, bool]:
        """Save a source event idempotently. Returns (event, is_new)."""
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            # Check unique(source_id, external_event_id)
            existing = conn.execute(
                "SELECT id, processing_status FROM source_events WHERE source_id = ? AND external_event_id = ?",
                (ev.source_id, ev.external_event_id),
            ).fetchone()
            if existing:
                ev.id = existing["id"]
                ev.processing_status = ProcessingStatus(existing["processing_status"])
                return ev, False
            # Ensure source exists in sources table
            src = conn.execute("SELECT id FROM sources WHERE id = ?", (ev.source_id,)).fetchone()
            if not src:
                conn.execute(
                    "INSERT INTO sources (id, user_id, type, name, status, created_at, updated_at) VALUES (?, ?, ?, ?, 'CONNECTED', ?, ?)",
                    (ev.source_id, ev.user_id, ev.source_id.split('_')[0], ev.source_id.replace('_', ' ').title(), now, now),
                )

            conn.execute(
                """
                INSERT INTO source_events (
                    id, source_id, user_id, event_type, external_event_id,
                    payload, content_hash, occurred_at, received_at,
                    processing_status, processing_attempts, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    ev.id,
                    ev.source_id,
                    ev.user_id,
                    ev.event_type,
                    ev.external_event_id,
                    json.dumps(ev.payload),
                    ev.content_hash,
                    _dt_to_iso(ev.occurred_at),
                    _dt_to_iso(ev.received_at) or now,
                    ev.processing_status.value,
                    ev.processing_attempts,
                    _dt_to_iso(ev.created_at) or now,
                ),
            )
            return ev, True

    def get_unprocessed(self, user_id: str = "default_user", limit: int = 20) -> list[SourceEvent]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM source_events WHERE user_id = ? AND processing_status = 'RECEIVED' ORDER BY received_at ASC LIMIT ?",
                (user_id, limit),
            )
            return [
                SourceEvent(
                    id=r["id"],
                    source_id=r["source_id"],
                    user_id=r["user_id"],
                    event_type=r["event_type"],
                    external_event_id=r["external_event_id"],
                    payload=json.loads(r["payload"] or "{}"),
                    content_hash=r["content_hash"],
                    occurred_at=_iso_to_dt(r["occurred_at"]),
                    received_at=_iso_to_dt(r["received_at"]) or datetime.now(timezone.utc),
                    processing_status=ProcessingStatus(r["processing_status"]),
                    processing_attempts=r["processing_attempts"],
                    created_at=_iso_to_dt(r["created_at"]) or datetime.now(timezone.utc),
                )
                for r in cursor.fetchall()
            ]

    def mark_status(self, event_id: str, status: ProcessingStatus) -> None:
        with self.db.transaction() as conn:
            conn.execute(
                "UPDATE source_events SET processing_status = ?, processing_attempts = processing_attempts + 1 WHERE id = ?",
                (status.value, event_id),
            )


class ActivityRepository:
    def __init__(self, db: DatabaseEngine = get_db()) -> None:
        self.db = db

    def log(self, a: Activity) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO activities (
                    id, user_id, actor_type, event_type, entity_type,
                    entity_id, summary, metadata, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    a.id,
                    a.user_id,
                    a.actor_type.value,
                    a.event_type,
                    a.entity_type,
                    a.entity_id,
                    a.summary,
                    json.dumps(a.metadata),
                    _dt_to_iso(a.created_at) or now,
                ),
            )

    def list_recent(self, user_id: str = "default_user", limit: int = 50) -> list[Activity]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
                (user_id, limit),
            )
            return [
                Activity(
                    id=r["id"],
                    user_id=r["user_id"],
                    actor_type=ActorType(r["actor_type"]),
                    event_type=r["event_type"],
                    entity_type=r["entity_type"],
                    entity_id=r["entity_id"],
                    summary=r["summary"],
                    metadata=json.loads(r["metadata"] or "{}"),
                    created_at=_iso_to_dt(r["created_at"]) or datetime.now(timezone.utc),
                )
                for r in cursor.fetchall()
            ]


class ActionApprovalRepository:
    def __init__(self, db: DatabaseEngine = get_db()) -> None:
        self.db = db

    def create_action(self, a: Action) -> Action:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO actions (
                    id, user_id, agent_run_id, task_id, tool_name, risk_level,
                    arguments, arguments_hash, status, idempotency_key, result,
                    started_at, completed_at, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    a.id,
                    a.user_id,
                    a.agent_run_id,
                    a.task_id,
                    a.tool_name,
                    a.risk_level.value,
                    json.dumps(a.arguments),
                    a.arguments_hash,
                    a.status.value,
                    a.idempotency_key,
                    json.dumps(a.result) if a.result else None,
                    _dt_to_iso(a.started_at),
                    _dt_to_iso(a.completed_at),
                    _dt_to_iso(a.created_at) or now,
                ),
            )
        return a

    def create_approval(self, app: Approval) -> Approval:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO approvals (id, action_id, user_id, arguments_hash, status, requested_at, decided_at, expires_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    app.id,
                    app.action_id,
                    app.user_id,
                    app.arguments_hash,
                    app.status.value,
                    _dt_to_iso(app.requested_at) or now,
                    _dt_to_iso(app.decided_at),
                    _dt_to_iso(app.expires_at),
                ),
            )
        return app

    def get_pending_approvals(self, user_id: str = "default_user") -> list[Tuple[Approval, Action]]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                """
                SELECT ap.*, ac.tool_name, ac.risk_level, ac.arguments, ac.status AS action_status,
                       ac.task_id, ac.idempotency_key, ac.created_at AS action_created_at
                FROM approvals ap
                JOIN actions ac ON ac.id = ap.action_id
                WHERE ap.user_id = ? AND ap.status = 'PENDING'
                ORDER BY ap.requested_at ASC
                """,
                (user_id,),
            )
            out = []
            for r in cursor.fetchall():
                approval = Approval(
                    id=r["id"],
                    action_id=r["action_id"],
                    user_id=r["user_id"],
                    arguments_hash=r["arguments_hash"],
                    status=ApprovalStatus(r["status"]),
                    requested_at=_iso_to_dt(r["requested_at"]) or datetime.now(timezone.utc),
                    decided_at=_iso_to_dt(r["decided_at"]),
                    expires_at=_iso_to_dt(r["expires_at"]),
                )
                action = Action(
                    id=r["action_id"],
                    user_id=r["user_id"],
                    task_id=r["task_id"],
                    tool_name=r["tool_name"],
                    risk_level=RiskLevel(r["risk_level"]),
                    arguments=json.loads(r["arguments"] or "{}"),
                    arguments_hash=r["arguments_hash"],
                    status=ActionStatus(r["action_status"]),
                    idempotency_key=r["idempotency_key"],
                    created_at=_iso_to_dt(r["action_created_at"]) or datetime.now(timezone.utc),
                )
                out.append((approval, action))
            return out

    def decide_approval(self, approval_id: str, status: ApprovalStatus, user_id: str = "default_user") -> bool:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            res = conn.execute(
                "UPDATE approvals SET status = ?, decided_at = ? WHERE id = ? AND user_id = ?",
                (status.value, now, approval_id, user_id),
            )
            return res.rowcount > 0

    def record_verification(self, v: VerificationResult) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO verification_results (id, action_id, verification_type, status, evidence_id, details, verified_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(action_id) DO UPDATE SET
                    status = excluded.status,
                    evidence_id = excluded.evidence_id,
                    details = excluded.details,
                    verified_at = excluded.verified_at
                """,
                (
                    v.id,
                    v.action_id,
                    v.verification_type,
                    v.status.value,
                    v.evidence_id,
                    json.dumps(v.details),
                    _dt_to_iso(v.verified_at) or now,
                ),
            )
