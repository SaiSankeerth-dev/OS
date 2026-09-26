"""Approval gate.

One rule, enforced in code rather than asked of the model:
nothing externally visible happens until the user approves the
EXACT text they were shown. If that text changes after approval,
the approval is invalid and the action is refused.

A single pending approval lives on the ConversationManager at a
time - this is a turn-based interface, so a human approves one
thing before moving to the next, same as the rest of OS's design.
"""
from __future__ import annotations

import hashlib
import sqlite3
from dataclasses import dataclass
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
