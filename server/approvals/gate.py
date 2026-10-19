"""Approval gate.

One rule, enforced in code rather than asked of the model:
nothing externally visible happens until the user approves the
EXACT text they were shown. If that text changes after approval,
the approval is invalid and the action is refused.

Pending approvals live in a FIFO queue on the ConversationManager.
Each one expires after config.approvals.timeout_sec (lazy expiry:
pruned whenever the queue is touched) and is logged EXPIRED -
nothing executes on an expired approval.
"""
from __future__ import annotations

import hashlib
import sqlite3
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path


def content_hash(text: str) -> str:
    """Stable fingerprint of exactly what was shown to the user."""
    return hashlib.sha256(text.encode()).hexdigest()[:16]


@dataclass
class PendingApproval:
    skill: str
    input_text: str
    draft: str
    approved_hash: str  # hash of `draft` at the moment it was shown to the user
    run_id: str = ""  # supervisor lifecycle run this approval belongs to
    created_ts: float = field(default_factory=time.time)
    pending_id: int = 0  # Phase 12: row id in the pending table (0 = not persisted)
    # Batch B: machine-readable action to execute on approval (e.g. a
    # browser click). Empty for plain accept/reject approvals.
    action_args: dict = field(default_factory=dict)

    def expired(self, timeout_sec: float) -> bool:
        return (time.time() - self.created_ts) > timeout_sec


class ApprovalStore:
    """Restart-proof log of every draft/approve/reject/publish.

    Answers "what did OS do?" later without trusting anyone's memory
    of it, including the model's.
    """

    def __init__(self, db_path: str | Path = "data/approvals.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS runs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ts TEXT NOT NULL,
                    skill TEXT NOT NULL,
                    input TEXT NOT NULL,
                    draft TEXT NOT NULL,
                    content_hash TEXT NOT NULL,
                    status TEXT NOT NULL
                )
                """
            )
            # Phase 12: the live approval queue, so a restart never loses
            # (or silently drops) a waiting approval.
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS pending (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    skill TEXT NOT NULL,
                    input TEXT NOT NULL,
                    draft TEXT NOT NULL,
                    approved_hash TEXT NOT NULL,
                    run_id TEXT NOT NULL DEFAULT '',
                    created_ts REAL NOT NULL
                )
                """
            )
            # Batch B: machine-readable action args for approvals that
            # execute something on approval (browser clicks etc.).
            cols = [r[1] for r in conn.execute("PRAGMA table_info(pending)")]
            if "action_json" not in cols:
                conn.execute("ALTER TABLE pending ADD COLUMN action_json TEXT")
            # Step 2A: approval state machine. Statuses: pending -> executing
            # -> succeeded | failed | unknown. Atomic claim replaces the lock.
            if "status" not in cols:
                conn.execute("ALTER TABLE pending ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'")
            if "claimed_at" not in cols:
                conn.execute("ALTER TABLE pending ADD COLUMN claimed_at REAL")
            if "result" not in cols:
                conn.execute("ALTER TABLE pending ADD COLUMN result TEXT")
            # On startup, any row stuck in 'executing' (crash mid-action)
            # becomes 'unknown' — never auto-rerun, surfaces for decision.
            conn.execute(
                "UPDATE pending SET status='unknown' WHERE status='executing'"
            )
            # Council blind spot: a hung action sits in 'executing' forever
            # while the server is up. Reap stuck rows past the deadline.
            # 5 minutes is generous; real actions finish in seconds.
            import time as _time
            deadline = _time.time() - 300
            conn.execute(
                "UPDATE pending SET status='unknown' WHERE status='executing' "
                "AND claimed_at IS NOT NULL AND claimed_at < ?",
                (deadline,),
            )
            conn.commit()
        finally:
            conn.close()

    def log(self, skill: str, input_text: str, draft: str, status: str) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute(
                "INSERT INTO runs (ts, skill, input, draft, content_hash, status) "
                "VALUES (?,?,?,?,?,?)",
                (
                    datetime.now(timezone.utc).isoformat(),
                    skill,
                    input_text,
                    draft,
                    content_hash(draft),
                    status,
                ),
            )
            conn.commit()
        finally:
            conn.close()

    def recent(self, limit: int = 10) -> list[dict]:
        """Newest-first audit trail. Phase 10: 'what did I approve?'"""
        conn = sqlite3.connect(self.db_path)
        try:
            rows = conn.execute(
                "SELECT ts, skill, input, status FROM runs "
                "ORDER BY id DESC LIMIT ?",
                (max(1, limit),),
            ).fetchall()
            return [
                {"ts": r[0], "skill": r[1], "input": r[2], "status": r[3]}
                for r in rows
            ]
        finally:
            conn.close()

    # ---- pending queue persistence (Phase 12) ----------------------------

    def save_pending(self, p: PendingApproval) -> int:
        """Persist a queued approval. Returns the row id."""
        import json

        conn = sqlite3.connect(self.db_path)
        try:
            cur = conn.execute(
                "INSERT INTO pending "
                "(skill, input, draft, approved_hash, run_id, created_ts, action_json) "
                "VALUES (?,?,?,?,?,?,?)",
                (
                    p.skill,
                    p.input_text,
                    p.draft,
                    p.approved_hash,
                    p.run_id,
                    p.created_ts,
                    json.dumps(p.action_args) if p.action_args else None,
                ),
            )
            conn.commit()
            return int(cur.lastrowid)
        finally:
            conn.close()

    def load_pending(self) -> list[PendingApproval]:
        """Restore the queue in FIFO order after a restart.

        Step 2A: only loads rows needing action (pending, unknown).
        Succeeded/failed are history, not queued.
        """
        import json

        conn = sqlite3.connect(self.db_path)
        try:
            rows = conn.execute(
                "SELECT id, skill, input, draft, approved_hash, run_id, "
                "created_ts, action_json, status FROM pending "
                "WHERE status IN ('pending', 'unknown') ORDER BY id ASC"
            ).fetchall()

            def _action(raw) -> dict:
                if not raw:
                    return {}
                try:
                    parsed = json.loads(raw)
                except (ValueError, TypeError):
                    return {}
                return parsed if isinstance(parsed, dict) else {}

            return [
                PendingApproval(
                    skill=r[1],
                    input_text=r[2],
                    draft=r[3],
                    approved_hash=r[4],
                    run_id=r[5],
                    created_ts=r[6],
                    pending_id=r[0],
                    action_args=_action(r[7]),
                )
                for r in rows
            ]
        finally:
            conn.close()

    def remove_pending(self, pending_id: int) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute(
                "DELETE FROM pending WHERE id = ?", (pending_id,)
            )
            conn.commit()
        finally:
            conn.close()

    # Step 2A: atomic claim replaces the global lock. Only one claimer wins;
    # losers get rowcount 0 and must return 409 "already handled".
    def claim_pending(self, pending_id: int) -> bool:
        """Atomically claim a pending approval for execution.

        Returns True if this caller won the claim, False if already claimed.
        """
        import time
        conn = sqlite3.connect(self.db_path)
        try:
            cur = conn.execute(
                "UPDATE pending SET status='executing', claimed_at=? "
                "WHERE id=? AND status='pending'",
                (time.time(), pending_id),
            )
            conn.commit()
            return cur.rowcount == 1
        finally:
            conn.close()

    def mark_succeeded(self, pending_id: int, result: str) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute(
                "UPDATE pending SET status='succeeded', result=? WHERE id=?",
                (result[:2000], pending_id),
            )
            conn.commit()
        finally:
            conn.close()

    def mark_failed(self, pending_id: int, error: str) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute(
                "UPDATE pending SET status='failed', result=? WHERE id=?",
                (error[:2000], pending_id),
            )
            conn.commit()
        finally:
            conn.close()

    def get_status(self, pending_id: int) -> str | None:
        """Return the current status, or None if the row doesn't exist."""
        conn = sqlite3.connect(self.db_path)
        try:
            row = conn.execute(
                "SELECT status FROM pending WHERE id=?", (pending_id,)
            ).fetchone()
            return row[0] if row else None
        finally:
            conn.close()

    def reap_stuck_executing(self, timeout_sec: int = 300) -> int:
        """Mark 'executing' rows past the deadline as 'unknown'.

        Council blind spot: a hung action sits in 'executing' forever
        while the server is up. Call this periodically (e.g., on each
        approve) to surface stuck rows for user decision.
        Returns the number of rows reaped.
        """
        import time
        deadline = time.time() - timeout_sec
        conn = sqlite3.connect(self.db_path)
        try:
            cur = conn.execute(
                "UPDATE pending SET status='unknown' WHERE status='executing' "
                "AND claimed_at IS NOT NULL AND claimed_at < ?",
                (deadline,),
            )
            conn.commit()
            return cur.rowcount
        finally:
            conn.close()

    def clear_pending(self) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute("DELETE FROM pending")
            conn.commit()
        finally:
            conn.close()
