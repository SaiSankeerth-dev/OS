"""Unified database connection engine for OS.

Provides high-performance, restart-proof, ACID storage with WAL mode for
local SQLite, with automatic schema creation matching the TRD.
"""
from __future__ import annotations

import json
import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Generator, Optional


SQLITE_SCHEMA = """
-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    language TEXT DEFAULT 'en',
    preferred_tts TEXT,
    preferred_fast_model TEXT,
    preferred_reasoning_model TEXT,
    preferred_vision_model TEXT,
    preferred_local_model TEXT,
    local_only_mode INTEGER NOT NULL DEFAULT 0,
    autonomy_level TEXT NOT NULL DEFAULT 'balanced',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    token_expires_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL
);

-- 2. SOURCES & INGESTION
CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONNECTED',
    permissions TEXT NOT NULL DEFAULT '{}',
    external_account_id TEXT,
    last_sync_at TEXT,
    last_error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS source_events (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    external_event_id TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    content_hash TEXT,
    occurred_at TEXT,
    received_at TEXT NOT NULL,
    processing_status TEXT NOT NULL DEFAULT 'RECEIVED',
    processing_attempts INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    UNIQUE(source_id, external_event_id)
);

-- 3. WORLD MODEL ENTITIES: PEOPLE, PROJECTS, GOALS
CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    organization TEXT,
    role TEXT,
    avatar_url TEXT,
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    deadline TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    target_date TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 4. COMMITMENTS, TASKS, DEPENDENCIES
CREATE TABLE IF NOT EXISTS commitments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN',
    priority INTEGER NOT NULL DEFAULT 50,
    deadline TEXT,
    estimated_duration_minutes INTEGER,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    goal_id TEXT REFERENCES goals(id) ON DELETE SET NULL,
    person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    source_event_id TEXT REFERENCES source_events(id) ON DELETE SET NULL,
    confidence REAL DEFAULT 1.0,
    completed_at TEXT,
    cancelled_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    commitment_id TEXT REFERENCES commitments(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    parent_task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN',
    priority INTEGER NOT NULL DEFAULT 50,
    estimated_duration_minutes INTEGER DEFAULT 60,
    deadline TEXT,
    scheduled_start TEXT,
    scheduled_end TEXT,
    assigned_agent_id TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dependencies (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
    person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    dependency_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 5. PLANS & PLAN ITEMS
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    reason TEXT,
    planner_version TEXT DEFAULT '1.0.0',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS plan_items (
    id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    commitment_id TEXT REFERENCES commitments(id) ON DELETE CASCADE,
    scheduled_start TEXT NOT NULL,
    scheduled_end TEXT NOT NULL,
    priority_rank INTEGER DEFAULT 1,
    why_now TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'PLANNED',
    created_at TEXT NOT NULL
);

-- 6. EVIDENCE & ACTIONS
CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_id TEXT REFERENCES sources(id) ON DELETE SET NULL,
    source_event_id TEXT REFERENCES source_events(id) ON DELETE SET NULL,
    evidence_type TEXT NOT NULL,
    external_id TEXT,
    title TEXT,
    content TEXT,
    uri TEXT,
    metadata TEXT NOT NULL DEFAULT '{}',
    occurred_at TEXT,
    content_hash TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS actions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_run_id TEXT,
    task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
    tool_name TEXT NOT NULL,
    risk_level TEXT NOT NULL DEFAULT 'LOW',
    arguments TEXT NOT NULL DEFAULT '{}',
    arguments_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'QUEUED',
    idempotency_key TEXT NOT NULL UNIQUE,
    result TEXT,
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS approvals (
    id TEXT PRIMARY KEY,
    action_id TEXT NOT NULL UNIQUE REFERENCES actions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    arguments_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    requested_at TEXT NOT NULL,
    decided_at TEXT,
    expires_at TEXT
);

CREATE TABLE IF NOT EXISTS verification_results (
    id TEXT PRIMARY KEY,
    action_id TEXT NOT NULL UNIQUE REFERENCES actions(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL,
    status TEXT NOT NULL,
    evidence_id TEXT REFERENCES evidence(id) ON DELETE SET NULL,
    details TEXT NOT NULL DEFAULT '{}',
    verified_at TEXT NOT NULL
);

-- 7. AGENT RUNS, WORKFLOWS, MEMORIES, ACTIVITIES, NOTIFICATIONS
CREATE TABLE IF NOT EXISTS agent_runs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_type TEXT NOT NULL,
    workflow_type TEXT,
    model_provider TEXT,
    model_name TEXT,
    model_version TEXT,
    parent_run_id TEXT REFERENCES agent_runs(id) ON DELETE SET NULL,
    source_event_id TEXT REFERENCES source_events(id) ON DELETE SET NULL,
    task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'QUEUED',
    input_reference TEXT,
    output_reference TEXT,
    error TEXT,
    started_at TEXT,
    completed_at TEXT,
    latency_ms INTEGER,
    input_tokens INTEGER,
    output_tokens INTEGER,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workflow_runs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workflow_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'QUEUED',
    current_step TEXT,
    checkpoint TEXT NOT NULL DEFAULT '{}',
    retry_count INTEGER NOT NULL DEFAULT 0,
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL,
    content TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 1.0,
    importance REAL NOT NULL DEFAULT 0.5,
    source_type TEXT,
    source_id TEXT,
    metadata TEXT NOT NULL DEFAULT '{}',
    expires_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_type TEXT NOT NULL,
    event_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    summary TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS automations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    trigger_config TEXT NOT NULL DEFAULT '{}',
    conditions TEXT NOT NULL DEFAULT '{}',
    workflow_config TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    last_run_at TEXT,
    next_run_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    priority INTEGER NOT NULL DEFAULT 50,
    read_at TEXT,
    created_at TEXT NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_commitments_user_status ON commitments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_commitments_deadline ON commitments(user_id, deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(user_id, deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_schedule ON tasks(user_id, scheduled_start, scheduled_end);
CREATE INDEX IF NOT EXISTS idx_source_events_user ON source_events(user_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_source_events_processing ON source_events(processing_status, received_at);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id, created_at DESC);
"""


class DatabaseEngine:
    """Thread-safe SQLite engine with WAL mode and connection pooling."""

    _instance: Optional[DatabaseEngine] = None
    _lock = threading.Lock()

    def __init__(self, db_path: str | Path = "data/os_unified.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._local = threading.local()
        self._init_schema()

    @classmethod
    def get_instance(cls, db_path: str | Path = "data/os_unified.db") -> DatabaseEngine:
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls(db_path)
            return cls._instance

    def _get_connection(self) -> sqlite3.Connection:
        if not hasattr(self._local, "conn") or self._local.conn is None:
            conn = sqlite3.connect(
                self.db_path,
                timeout=30.0,
                check_same_thread=False,
            )
            conn.row_factory = sqlite3.Row
            # WAL mode for high concurrency + PRAGMAs
            conn.execute("PRAGMA journal_mode = WAL;")
            conn.execute("PRAGMA foreign_keys = ON;")
            conn.execute("PRAGMA busy_timeout = 30000;")
            self._local.conn = conn
        return self._local.conn

    def _init_schema(self) -> None:
        conn = self._get_connection()
        try:
            conn.executescript(SQLITE_SCHEMA)
            # Ensure a default user exists for zero-config local operation
            user_row = conn.execute("SELECT id FROM users WHERE id = 'default_user'").fetchone()
            if not user_row:
                from datetime import datetime, timezone
                now = datetime.now(timezone.utc).isoformat()
                conn.execute(
                    "INSERT INTO users (id, email, display_name, timezone, is_active, created_at, updated_at) "
                    "VALUES ('default_user', 'sai@local.os', 'Sai', 'UTC', 1, ?, ?)",
                    (now, now),
                )
                conn.execute(
                    "INSERT INTO profiles (user_id, first_name, last_name, autonomy_level, created_at, updated_at) "
                    "VALUES ('default_user', 'Sai', '', 'balanced', ?, ?)",
                    (now, now),
                )
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise RuntimeError(f"Failed to initialize unified database schema: {e}") from e

    @contextmanager
    def connection(self) -> Generator[sqlite3.Connection, None, None]:
        conn = self._get_connection()
        yield conn

    @contextmanager
    def transaction(self) -> Generator[sqlite3.Connection, None, None]:
        conn = self._get_connection()
        try:
            conn.execute("BEGIN IMMEDIATE;")
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise


# Process-wide accessor
def get_db(db_path: str | Path = "data/os_unified.db") -> DatabaseEngine:
    return DatabaseEngine.get_instance(db_path)
