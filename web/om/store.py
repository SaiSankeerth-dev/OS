"""SQLite store for the OpenMuse feature port (web/om).

One database file (data/om.db) holds every ported module's tables so the
dashboard has a single local-first state file to back up. Plain sqlite3,
WAL mode, no ORM — same style as web/store.py.
"""
from __future__ import annotations

import json
import sqlite3
import threading
import time
import uuid
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS computer_commands (
    id TEXT PRIMARY KEY,
    command TEXT NOT NULL,
    cwd TEXT NOT NULL DEFAULT '/workspace',
    status TEXT NOT NULL DEFAULT 'running',
    stdout TEXT NOT NULL DEFAULT '',
    stderr TEXT NOT NULL DEFAULT '',
    exit_code INTEGER,
    truncated INTEGER NOT NULL DEFAULT 0,
    started_at REAL NOT NULL,
    completed_at REAL
);
CREATE TABLE IF NOT EXISTS browser_sessions (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT 'New browser session',
    status TEXT NOT NULL DEFAULT 'idle',
    updated_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    plan TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'running',
    receipt TEXT NOT NULL DEFAULT '{}',
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS run_events (
    id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL,
    seq INTEGER NOT NULL,
    kind TEXT NOT NULL,
    data TEXT NOT NULL DEFAULT '{}',
    created_at REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_run_events_run ON run_events(run_id, seq);
CREATE TABLE IF NOT EXISTS ideas (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    prompt TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT 'general',
    input TEXT NOT NULL DEFAULT '',
    evidence TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'new',
    created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active',
    created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS goal_milestones (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    done INTEGER NOT NULL DEFAULT 0,
    created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS finance_reports (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '{}',
    created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    bytes BLOB NOT NULL,
    created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS threads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'New conversation',
    archived INTEGER NOT NULL DEFAULT 0,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS thread_messages (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_thread_messages_thread ON thread_messages(thread_id, created_at);
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    link TEXT NOT NULL DEFAULT '',
    read INTEGER NOT NULL DEFAULT 0,
    created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS mail_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    query TEXT NOT NULL DEFAULT '',
    keywords TEXT NOT NULL DEFAULT '[]',
    kind TEXT NOT NULL DEFAULT 'general',
    created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS mail_seen (
    id TEXT PRIMARY KEY,
    rule_id TEXT NOT NULL,
    email_id TEXT NOT NULL,
    seen_at REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mail_seen_rule ON mail_seen(rule_id, email_id);
"""


def _connect(path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.executescript(SCHEMA)
    return conn


class OmStore:
    """Thin row-dict store shared by all web/om modules.

    Opens a fresh connection per operation (same pattern as
    web/store.py) so FastAPI worker threads never share a connection.
    """

    def __init__(self, db_path: str | Path = "data/om.db") -> None:
        self.path = Path(db_path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        conn = _connect(self.path)
        conn.close()
        self._lock = threading.Lock()

    # -- generic helpers -------------------------------------------------
    def _row(self, row: sqlite3.Row | None) -> dict | None:
        return dict(row) if row is not None else None

    def _write(self, fn):
        with self._lock:
            conn = _connect(self.path)
            try:
                result = fn(conn)
                conn.commit()
                return result
            finally:
                conn.close()

    def _read(self, fn):
        conn = _connect(self.path)
        try:
            return fn(conn)
        finally:
            conn.close()

    def insert(self, table: str, record: dict) -> dict:
        record = dict(record)
        record.setdefault("id", uuid.uuid4().hex[:12])
        cols = ", ".join(record.keys())
        placeholders = ", ".join("?" for _ in record)

        def op(conn):
            conn.execute(
                f"INSERT INTO {table} ({cols}) VALUES ({placeholders})",
                tuple(record.values()),
            )
            return record

        return self._write(op)

    def get(self, table: str, rid: str) -> dict | None:
        def op(conn):
            cur = conn.execute(f"SELECT * FROM {table} WHERE id = ?", (rid,))
            return self._row(cur.fetchone())

        return self._read(op)

    def list(self, table: str, where: str = "", params: tuple = (),
             order: str = "", limit: int = 200) -> list[dict]:
        def op(conn):
            q = f"SELECT * FROM {table}"
            if where:
                q += f" WHERE {where}"
            if order:
                q += f" ORDER BY {order}"
            q += f" LIMIT {limit}"
            cur = conn.execute(q, params)
            return [dict(r) for r in cur.fetchall()]

        return self._read(op)

    def update(self, table: str, rid: str, patch: dict) -> dict | None:
        sets = ", ".join(f"{k} = ?" for k in patch)

        def op(conn):
            conn.execute(
                f"UPDATE {table} SET {sets} WHERE id = ?",
                tuple(patch.values()) + (rid,),
            )
            cur = conn.execute(f"SELECT * FROM {table} WHERE id = ?", (rid,))
            return self._row(cur.fetchone())

        return self._write(op)

    def delete(self, table: str, rid: str) -> bool:
        def op(conn):
            cur = conn.execute(f"DELETE FROM {table} WHERE id = ?", (rid,))
            return cur.rowcount > 0

        return self._write(op)

    def count(self, table: str, where: str = "", params: tuple = ()) -> int:
        def op(conn):
            q = f"SELECT COUNT(*) AS n FROM {table}"
            if where:
                q += f" WHERE {where}"
            cur = conn.execute(q, params)
            row = cur.fetchone()
            return int(row["n"]) if row else 0

        return self._read(op)


def now() -> float:
    return time.time()


def new_id() -> str:
    return uuid.uuid4().hex[:12]


def jdumps(value) -> str:
    return json.dumps(value, ensure_ascii=False)


def jloads(text: str, default=None):
    try:
        return json.loads(text) if text else default
    except (ValueError, TypeError):
        return default
