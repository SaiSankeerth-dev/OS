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
