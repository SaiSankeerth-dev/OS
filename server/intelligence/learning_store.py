"""Continuous Learning and Feedback Store for OS V3.

Persists user decisions (accept, reject, dismiss, evaluate),
evaluation outcomes, and false-positive discovery signals in SQLite
without uncontrolled runtime self-modification.
"""
from __future__ import annotations

import json
import logging
import sqlite3
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

log = logging.getLogger("os.intelligence.learning")


@dataclass
class UserDecisionRecord:
    repo_id: str
    decision: str  # accept, reject, dismiss, evaluate, integrate
    reason: Optional[str] = None
    rating: Optional[int] = None
    score_at_decision: float = 0.0
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "repo_id": self.repo_id,
            "decision": self.decision,
            "reason": self.reason,
            "rating": self.rating,
            "score_at_decision": self.score_at_decision,
            "timestamp": self.timestamp,
        }


class LearningStore:
    def __init__(self, db_path: str | Path = "data/discovery.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS user_decisions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    repo_id TEXT NOT NULL,
                    decision TEXT NOT NULL,
                    reason TEXT,
                    rating INTEGER,
                    score_at_decision REAL NOT NULL,
                    timestamp TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS evaluation_outcomes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    repo_id TEXT NOT NULL,
                    status TEXT NOT NULL,
                    duration_s REAL NOT NULL,
                    outcome_summary TEXT,
                    timestamp TEXT NOT NULL
                )
                """
            )
            conn.commit()

    def record_decision(
        self,
        repo_id: str,
        decision: str,
        reason: Optional[str] = None,
        rating: Optional[int] = None,
        score: float = 0.0,
    ) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                INSERT INTO user_decisions (repo_id, decision, reason, rating, score_at_decision, timestamp)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (repo_id, decision, reason, rating, score, datetime.now(timezone.utc).isoformat()),
            )
            conn.commit()

    def record_evaluation_outcome(
        self,
        repo_id: str,
        status: str,
        duration_s: float,
        outcome_summary: str,
    ) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                INSERT INTO evaluation_outcomes (repo_id, status, duration_s, outcome_summary, timestamp)
                VALUES (?, ?, ?, ?, ?)
                """,
                (repo_id, status, duration_s, outcome_summary, datetime.now(timezone.utc).isoformat()),
            )
            conn.commit()

    def get_decision_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        with sqlite3.connect(self.db_path) as conn:
            rows = conn.execute(
                """
                SELECT repo_id, decision, reason, rating, score_at_decision, timestamp
                FROM user_decisions
                ORDER BY id DESC LIMIT ?
                """,
                (limit,),
            ).fetchall()
            return [
                {
                    "repo_id": r[0],
                    "decision": r[1],
                    "reason": r[2],
                    "rating": r[3],
                    "score_at_decision": r[4],
                    "timestamp": r[5],
                }
                for r in rows
            ]

    def get_stats(self) -> Dict[str, Any]:
        with sqlite3.connect(self.db_path) as conn:
            total_decisions = conn.execute("SELECT COUNT(*) FROM user_decisions").fetchone()[0]
            accepted = conn.execute("SELECT COUNT(*) FROM user_decisions WHERE decision = 'accept'").fetchone()[0]
            rejected = conn.execute("SELECT COUNT(*) FROM user_decisions WHERE decision IN ('reject', 'dismiss')").fetchone()[0]
            evaluated = conn.execute("SELECT COUNT(*) FROM evaluation_outcomes").fetchone()[0]

            return {
                "total_decisions": total_decisions,
                "accepted_count": accepted,
                "rejected_or_dismissed_count": rejected,
                "evaluated_count": evaluated,
                "acceptance_rate": (accepted / total_decisions) if total_decisions > 0 else 0.0,
            }


_LEARNING_STORE: Optional[LearningStore] = None


def get_learning_store() -> LearningStore:
    global _LEARNING_STORE
    if _LEARNING_STORE is None:
        _LEARNING_STORE = LearningStore()
    return _LEARNING_STORE
