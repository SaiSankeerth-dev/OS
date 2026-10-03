"""Phase 2: unified SQLite state for OS.

One database file (data/os_state.db) holding:
  tasks        - durable task records with a status lifecycle
  task_events  - append-only log of every task status transition
                 (this is what makes rollback honest: the history
                 is never rewritten, only appended to)
  events       - general OS event bus log
  sessions     - conversation session persistence across restarts
  approvals    - mirror of the approval audit trail
                 (server/approvals/gate.py::ApprovalStore writes the
                 authoritative `runs` table; this table is the
                 forward-looking home for the same data)

Design rules:
  - SQLite only, stdlib only. Zero new dependencies.
  - Writes are small and committed immediately; the DB is the
    source of truth, memory is just a cache.
  - "Restart" means: drop the StateStore object, make a new one
    on the same file. Everything must survive that.
"""
from __future__ import annotations

import sqlite3
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'PENDING',
    payload     TEXT NOT NULL DEFAULT '{}',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS task_events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id     INTEGER NOT NULL REFERENCES tasks(id),
    ts          TEXT NOT NULL,
    old_status  TEXT,
    new_status  TEXT NOT NULL,
    note        TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          TEXT NOT NULL,
    kind        TEXT NOT NULL,
    source      TEXT NOT NULL DEFAULT '',
    data        TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS sessions (
    id          TEXT PRIMARY KEY,
    updated_at  TEXT NOT NULL,
    state       TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS approvals (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          TEXT NOT NULL,
    skill       TEXT NOT NULL,
    input       TEXT NOT NULL,
    draft       TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    status      TEXT NOT NULL
);
-- Phase 13: proactive watcher suggestions. Watchers may only suggest;
-- this table is the watcher's own bookkeeping (seen/unseen), not a
-- side effect on the user's world.
CREATE TABLE IF NOT EXISTS suggestions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          TEXT NOT NULL,
    kind        TEXT NOT NULL,
    text        TEXT NOT NULL,
    seen        INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_task_events_task ON task_events(task_id);
CREATE INDEX IF NOT EXISTS idx_events_kind ON events(kind);
"""

VALID_STATUSES = {
    "PENDING",
    "RUNNING",
    "WAITING_APPROVAL",
    "APPROVED",
    "REJECTED",
    "DONE",
    "FAILED",
    "ROLLED_BACK",
}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class Task:
    id: int
    title: str
    status: str
    payload: str
    created_at: str
    updated_at: str


class StateStore:
    """Durable OS state. One file, survives process restarts."""

    def __init__(self, db_path: str | Path = "data/os_state.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init(self) -> None:
        conn = self._connect()
        try:
            conn.executescript(SCHEMA)
            conn.commit()
        finally:
            conn.close()

    # ---- tasks ----------------------------------------------------
    def create_task(self, title: str, payload: str = "{}") -> Task:
        now = _now()
        conn = self._connect()
        try:
            cur = conn.execute(
                "INSERT INTO tasks (title, status, payload, created_at, updated_at)"
                " VALUES (?,?,?,?,?)",
                (title, "PENDING", payload, now, now),
            )
            task_id = cur.lastrowid
            conn.execute(
                "INSERT INTO task_events (task_id, ts, old_status, new_status, note)"
                " VALUES (?,?,?,?,?)",
                (task_id, now, None, "PENDING", "created"),
            )
            conn.commit()
            return self.get_task(task_id)
        finally:
            conn.close()

    def get_task(self, task_id: int) -> Task | None:
        conn = self._connect()
        try:
            row = conn.execute(
                "SELECT * FROM tasks WHERE id = ?", (task_id,)
            ).fetchone()
            return Task(**dict(row)) if row else None
        finally:
            conn.close()

    def delete_task(self, task_id: int) -> None:
        """Permanently remove a task and its events. Raises KeyError if missing."""
        if self.get_task(task_id) is None:
            raise KeyError(f"no such task: {task_id}")
        conn = self._connect()
        try:
            conn.execute("DELETE FROM task_events WHERE task_id = ?", (task_id,))
            conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            conn.commit()
        finally:
            conn.close()

    def list_tasks(self, status: str | None = None) -> list[Task]:
        conn = self._connect()
        try:
            if status:
                rows = conn.execute(
                    "SELECT * FROM tasks WHERE status = ? ORDER BY id", (status,)
                ).fetchall()
            else:
                rows = conn.execute("SELECT * FROM tasks ORDER BY id").fetchall()
            return [Task(**dict(r)) for r in rows]
        finally:
            conn.close()

    def set_task_status(
        self, task_id: int, new_status: str, note: str = ""
    ) -> Task:
        if new_status not in VALID_STATUSES:
            raise ValueError(f"unknown task status: {new_status!r}")
        task = self.get_task(task_id)
        if task is None:
            raise KeyError(f"no such task: {task_id}")
        now = _now()
        conn = self._connect()
        try:
            conn.execute(
                "UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?",
                (new_status, now, task_id),
            )
            conn.execute(
                "INSERT INTO task_events (task_id, ts, old_status, new_status, note)"
                " VALUES (?,?,?,?,?)",
                (task_id, now, task.status, new_status, note),
            )
            conn.commit()
            return self.get_task(task_id)
        finally:
            conn.close()

    def task_history(self, task_id: int) -> list[dict]:
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT ts, old_status, new_status, note FROM task_events"
                " WHERE task_id = ? ORDER BY id",
                (task_id,),
            ).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    def rollback_task(self, task_id: int, steps: int = 1) -> Task:
        """Revert a task to an earlier status using the event log.

        The log itself is append-only: the rollback is recorded as a
        new event, so the fact that a rollback happened is never lost.
        """
        history = self.task_history(task_id)
        if len(history) <= steps:
            raise ValueError("nothing to roll back to")
        target = history[-(steps + 1)]["new_status"] or "PENDING"
        task = self.set_task_status(
            task_id, "ROLLED_BACK", note=f"rolled back toward {target}"
        )
        # then restore the target status as its own audited step
        return self.set_task_status(
            task_id, target, note=f"rollback completed ({steps} step(s))"
        )

    # ---- events ---------------------------------------------------
    def log_event(self, kind: str, source: str = "", data: str = "{}") -> int:
        conn = self._connect()
        try:
            cur = conn.execute(
                "INSERT INTO events (ts, kind, source, data) VALUES (?,?,?,?)",
                (_now(), kind, source, data),
            )
            conn.commit()
            return cur.lastrowid
        finally:
            conn.close()

    def get_events(self, kind: str | None = None, limit: int = 100) -> list[dict]:
        conn = self._connect()
        try:
            if kind:
                rows = conn.execute(
                    "SELECT * FROM events WHERE kind = ? ORDER BY id DESC LIMIT ?",
                    (kind, limit),
                ).fetchall()
            else:
                rows = conn.execute(
                    "SELECT * FROM events ORDER BY id DESC LIMIT ?", (limit,)
                ).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    def search_events(
        self, kind: str, query: str, limit: int = 20
    ) -> list[dict]:
        """Keyword search over an event kind's data. Phase 6: memory."""
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT * FROM events WHERE kind = ? AND data LIKE ? "
                "ORDER BY id DESC LIMIT ?",
                (kind, f"%{query}%", limit),
            ).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    def delete_event(self, event_id: int) -> None:
        """Delete one event row. Phase 12: memory_forget."""
        conn = self._connect()
        try:
            conn.execute("DELETE FROM events WHERE id = ?", (event_id,))
            conn.commit()
        finally:
            conn.close()

    # ---- watcher suggestions (Phase 13) --------------------------------
    # The watcher's own bookkeeping. Watchers may only suggest; these
    # rows track what was suggested and seen, nothing else.

    def save_suggestion(self, kind: str, text: str) -> int:
        conn = self._connect()
        try:
            cur = conn.execute(
                "INSERT INTO suggestions (ts, kind, text, seen) "
                "VALUES (?,?,?,0)",
                (_now(), kind, text),
            )
            conn.commit()
            return int(cur.lastrowid)
        finally:
            conn.close()

    def recent_suggestion(
        self, kind: str, text: str, within_sec: float
    ) -> bool:
        """True if the same suggestion was made within the window."""
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT ts FROM suggestions WHERE kind = ? AND text = ? "
                "ORDER BY id DESC LIMIT 5",
                (kind, text),
            ).fetchall()
            now = time.time()
            for r in rows:
                try:
                    ts = datetime.fromisoformat(r[0]).timestamp()
                except ValueError:
                    continue
                if now - ts < within_sec:
                    return True
            return False
        finally:
            conn.close()

    def unseen_suggestions(self, limit: int = 5) -> list[dict]:
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT id, ts, kind, text FROM suggestions "
                "WHERE seen = 0 ORDER BY id ASC LIMIT ?",
                (max(1, limit),),
            ).fetchall()
            return [
                {"id": r[0], "ts": r[1], "kind": r[2], "text": r[3]}
                for r in rows
            ]
        finally:
            conn.close()

    def mark_suggestion_seen(self, suggestion_id: int) -> None:
        conn = self._connect()
        try:
            conn.execute(
                "UPDATE suggestions SET seen = 1 WHERE id = ?",
                (suggestion_id,),
            )
            conn.commit()
        finally:
            conn.close()

    # ---- sessions -------------------------------------------------
    def save_session(self, session_id: str, state: str) -> None:
        conn = self._connect()
        try:
            conn.execute(
                "INSERT INTO sessions (id, updated_at, state) VALUES (?,?,?)"
                " ON CONFLICT(id) DO UPDATE SET updated_at=excluded.updated_at,"
                " state=excluded.state",
                (session_id, _now(), state),
            )
            conn.commit()
        finally:
            conn.close()

    def load_session(self, session_id: str) -> str | None:
        conn = self._connect()
        try:
            row = conn.execute(
                "SELECT state FROM sessions WHERE id = ?", (session_id,)
            ).fetchone()
            return row["state"] if row else None
        finally:
            conn.close()

    # ---- approvals mirror -----------------------------------------
    def log_approval(
        self, skill: str, input_text: str, draft: str, content_hash: str, status: str
    ) -> int:
        conn = self._connect()
        try:
            cur = conn.execute(
                "INSERT INTO approvals (ts, skill, input, draft, content_hash, status)"
                " VALUES (?,?,?,?,?,?)",
                (_now(), skill, input_text, draft, content_hash, status),
            )
            conn.commit()
            return cur.lastrowid
        finally:
            conn.close()

    def get_approvals(self, status: str | None = None) -> list[dict]:
        conn = self._connect()
        try:
            if status:
                rows = conn.execute(
                    "SELECT * FROM approvals WHERE status = ? ORDER BY id",
                    (status,),
                ).fetchall()
            else:
                rows = conn.execute(
                    "SELECT * FROM approvals ORDER BY id"
                ).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    # ---- health ---------------------------------------------------
    def health(self) -> dict:
        """Database health summary, shown by `os doctor`."""
        conn = self._connect()
        try:
            integrity = conn.execute("PRAGMA integrity_check").fetchone()[0]
            counts = {}
            for table in ("tasks", "task_events", "events", "sessions", "approvals"):
                counts[table] = conn.execute(
                    f"SELECT COUNT(*) FROM {table}"
                ).fetchone()[0]
            size = self.db_path.stat().st_size
            return {
                "path": str(self.db_path),
                "ok": integrity == "ok",
                "integrity": integrity,
                "size_bytes": size,
                "tables": counts,
            }
        finally:
            conn.close()
