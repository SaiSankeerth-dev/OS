"""World model repositories for People, Projects, Goals, Evidence, Memories, and Agent Runs."""
from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from typing import Any, Optional

from server.domain.entities import (
    AgentRun,
    Evidence,
    Goal,
    Memory,
    Notification,
    Person,
    Project,
)
from server.domain.enums import AgentRunStatus
from ..database import DatabaseEngine, get_db


def _dt_to_iso(dt: Optional[datetime]) -> Optional[str]:
    return dt.isoformat() if dt else None


def _iso_to_dt(iso_str: Optional[str]) -> Optional[datetime]:
    if not iso_str:
        return None
    try:
        return datetime.fromisoformat(iso_str)
    except Exception:
        return None


class WorldModelRepository:
    def __init__(self, db: DatabaseEngine = get_db()) -> None:
        self.db = db

    # ---- People -------------------------------------------------------------
    def create_person(self, p: Person) -> Person:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO people (id, user_id, name, email, phone, organization, role, avatar_url, metadata, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    p.id,
                    p.user_id,
                    p.name,
                    p.email,
                    p.phone,
                    p.organization,
                    p.role,
                    p.avatar_url,
                    json.dumps(p.metadata),
                    _dt_to_iso(p.created_at) or now,
                    _dt_to_iso(p.updated_at) or now,
                ),
            )
        return p

    def find_person_by_name_or_email(self, query: str, user_id: str = "default_user") -> Optional[Person]:
        with self.db.connection() as conn:
            row = conn.execute(
                "SELECT * FROM people WHERE user_id = ? AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ?) LIMIT 1",
                (user_id, f"%{query.lower()}%", f"%{query.lower()}%"),
            ).fetchone()
            if not row:
                return None
            return Person(
                id=row["id"],
                user_id=row["user_id"],
                name=row["name"],
                email=row["email"],
                phone=row["phone"],
                organization=row["organization"],
                role=row["role"],
                avatar_url=row["avatar_url"],
                metadata=json.loads(row["metadata"] or "{}"),
                created_at=_iso_to_dt(row["created_at"]) or datetime.now(timezone.utc),
                updated_at=_iso_to_dt(row["updated_at"]) or datetime.now(timezone.utc),
            )

    def list_people(self, user_id: str = "default_user") -> list[Person]:
        with self.db.connection() as conn:
            cursor = conn.execute("SELECT * FROM people WHERE user_id = ? ORDER BY name ASC", (user_id,))
            return [
                Person(
                    id=row["id"],
                    user_id=row["user_id"],
                    name=row["name"],
                    email=row["email"],
                    phone=row["phone"],
                    organization=row["organization"],
                    role=row["role"],
                    avatar_url=row["avatar_url"],
                    metadata=json.loads(row["metadata"] or "{}"),
                    created_at=_iso_to_dt(row["created_at"]) or datetime.now(timezone.utc),
                    updated_at=_iso_to_dt(row["updated_at"]) or datetime.now(timezone.utc),
                )
                for row in cursor.fetchall()
            ]

    # ---- Projects -----------------------------------------------------------
    def create_project(self, prj: Project) -> Project:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO projects (id, user_id, name, description, status, deadline, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    prj.id,
                    prj.user_id,
                    prj.name,
                    prj.description,
                    prj.status,
                    _dt_to_iso(prj.deadline),
                    _dt_to_iso(prj.created_at) or now,
                    _dt_to_iso(prj.updated_at) or now,
                ),
            )
        return prj

    def find_project_by_name(self, name: str, user_id: str = "default_user") -> Optional[Project]:
        with self.db.connection() as conn:
            row = conn.execute(
                "SELECT * FROM projects WHERE user_id = ? AND LOWER(name) LIKE ? LIMIT 1",
                (user_id, f"%{name.lower()}%"),
            ).fetchone()
            if not row:
                return None
            return Project(
                id=row["id"],
                user_id=row["user_id"],
                name=row["name"],
                description=row["description"],
                status=row["status"],
                deadline=_iso_to_dt(row["deadline"]),
                created_at=_iso_to_dt(row["created_at"]) or datetime.now(timezone.utc),
                updated_at=_iso_to_dt(row["updated_at"]) or datetime.now(timezone.utc),
            )

    def list_projects(self, user_id: str = "default_user") -> list[Project]:
        with self.db.connection() as conn:
            cursor = conn.execute("SELECT * FROM projects WHERE user_id = ? ORDER BY name ASC", (user_id,))
            return [
                Project(
                    id=row["id"],
                    user_id=row["user_id"],
                    name=row["name"],
                    description=row["description"],
                    status=row["status"],
                    deadline=_iso_to_dt(row["deadline"]),
                    created_at=_iso_to_dt(row["created_at"]) or datetime.now(timezone.utc),
                    updated_at=_iso_to_dt(row["updated_at"]) or datetime.now(timezone.utc),
                )
                for row in cursor.fetchall()
            ]

    # ---- Goals --------------------------------------------------------------
    def create_goal(self, g: Goal) -> Goal:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO goals (id, user_id, title, description, status, target_date, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    g.id,
                    g.user_id,
                    g.title,
                    g.description,
                    g.status,
                    _dt_to_iso(g.target_date),
                    _dt_to_iso(g.created_at) or now,
                    _dt_to_iso(g.updated_at) or now,
                ),
            )
        return g

    def list_goals(self, user_id: str = "default_user") -> list[Goal]:
        with self.db.connection() as conn:
            cursor = conn.execute("SELECT * FROM goals WHERE user_id = ? ORDER BY title ASC", (user_id,))
            return [
                Goal(
                    id=row["id"],
                    user_id=row["user_id"],
                    title=row["title"],
                    description=row["description"],
                    status=row["status"],
                    target_date=_iso_to_dt(row["target_date"]),
                    created_at=_iso_to_dt(row["created_at"]) or datetime.now(timezone.utc),
                    updated_at=_iso_to_dt(row["updated_at"]) or datetime.now(timezone.utc),
                )
                for row in cursor.fetchall()
            ]

    # ---- Evidence -----------------------------------------------------------
    def create_evidence(self, e: Evidence) -> Evidence:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            if e.source_id:
                conn.execute(
                    """
                    INSERT OR IGNORE INTO sources (id, user_id, type, name, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (e.source_id, e.user_id, e.source_id.split('_')[0], e.source_id, now, now),
                )
            conn.execute(
                """
                INSERT OR REPLACE INTO evidence (id, user_id, source_id, source_event_id, evidence_type, external_id, title, content, uri, metadata, occurred_at, content_hash, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    e.id,
                    e.user_id,
                    e.source_id,
                    e.source_event_id,
                    e.evidence_type,
                    e.external_id,
                    e.title,
                    e.content,
                    e.uri,
                    json.dumps(e.metadata),
                    _dt_to_iso(e.occurred_at),
                    e.content_hash,
                    _dt_to_iso(e.created_at) or now,
                ),
            )
        return e

    def get_evidence(self, evidence_id: str, user_id: str = "default_user") -> Optional[Evidence]:
        with self.db.connection() as conn:
            row = conn.execute("SELECT * FROM evidence WHERE id = ? AND user_id = ?", (evidence_id, user_id)).fetchone()
            if not row:
                return None
            return Evidence(
                id=row["id"],
                user_id=row["user_id"],
                source_id=row["source_id"],
                source_event_id=row["source_event_id"],
                evidence_type=row["evidence_type"],
                external_id=row["external_id"],
                title=row["title"],
                content=row["content"],
                uri=row["uri"],
                metadata=json.loads(row["metadata"] or "{}"),
                occurred_at=_iso_to_dt(row["occurred_at"]),
                content_hash=row["content_hash"],
                created_at=_iso_to_dt(row["created_at"]) or datetime.now(timezone.utc),
            )

    # ---- Agent Runs ---------------------------------------------------------
    def record_agent_run(self, run: AgentRun) -> AgentRun:
        now = datetime.now(timezone.utc).isoformat()
        with self.db.transaction() as conn:
            conn.execute(
                """
                INSERT INTO agent_runs (
                    id, user_id, agent_type, workflow_type, model_provider,
                    model_name, model_version, parent_run_id, source_event_id,
                    task_id, status, input_reference, output_reference,
                    error, started_at, completed_at, latency_ms, input_tokens,
                    output_tokens, retry_count, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    run.id,
                    run.user_id,
                    run.agent_type,
                    run.workflow_type,
                    run.model_provider,
                    run.model_name,
                    run.model_version,
                    run.parent_run_id,
                    run.source_event_id,
                    run.task_id,
                    run.status.value,
                    json.dumps(run.input_reference) if run.input_reference else None,
                    json.dumps(run.output_reference) if run.output_reference else None,
                    json.dumps(run.error) if run.error else None,
                    _dt_to_iso(run.started_at),
                    _dt_to_iso(run.completed_at),
                    run.latency_ms,
                    run.input_tokens,
                    run.output_tokens,
                    run.retry_count,
                    _dt_to_iso(run.created_at) or now,
                ),
            )
        return run

    def update_agent_run(self, run: AgentRun) -> AgentRun:
        with self.db.transaction() as conn:
            conn.execute(
                """
                UPDATE agent_runs SET
                    status = ?, output_reference = ?, error = ?,
                    completed_at = ?, latency_ms = ?, input_tokens = ?,
                    output_tokens = ?, retry_count = ?
                WHERE id = ? AND user_id = ?
                """,
                (
                    run.status.value,
                    json.dumps(run.output_reference) if run.output_reference else None,
                    json.dumps(run.error) if run.error else None,
                    _dt_to_iso(run.completed_at),
                    run.latency_ms,
                    run.input_tokens,
                    run.output_tokens,
                    run.retry_count,
                    run.id,
                    run.user_id,
                ),
            )
        return run

    def list_agent_runs(self, user_id: str = "default_user", limit: int = 20) -> list[AgentRun]:
        with self.db.connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM agent_runs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
                (user_id, limit),
            )
            return [
                AgentRun(
                    id=row["id"],
                    user_id=row["user_id"],
                    agent_type=row["agent_type"],
                    workflow_type=row["workflow_type"],
                    model_provider=row["model_provider"],
                    model_name=row["model_name"],
                    model_version=row["model_version"],
                    parent_run_id=row["parent_run_id"],
                    source_event_id=row["source_event_id"],
                    task_id=row["task_id"],
                    status=AgentRunStatus(row["status"]),
                    input_reference=json.loads(row["input_reference"]) if row["input_reference"] else None,
                    output_reference=json.loads(row["output_reference"]) if row["output_reference"] else None,
                    error=json.loads(row["error"]) if row["error"] else None,
                    started_at=_iso_to_dt(row["started_at"]),
                    completed_at=_iso_to_dt(row["completed_at"]),
                    latency_ms=row["latency_ms"],
                    input_tokens=row["input_tokens"],
                    output_tokens=row["output_tokens"],
                    retry_count=row["retry_count"],
                    created_at=_iso_to_dt(row["created_at"]) or datetime.now(timezone.utc),
                )
                for row in cursor.fetchall()
            ]
