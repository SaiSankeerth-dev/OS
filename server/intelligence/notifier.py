"""Proactive Notification Engine for OS V3.

Implements the governance policy:
  WATCH -> NOTICE -> SUGGEST -> WAIT -> DRAFT -> SHOW -> REVISE -> PUBLISH -> VERIFY
Enforces quiet hours, threshold gating, and notification queueing.
"""
from __future__ import annotations

import json
import logging
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from .models import CandidateRepo, DiscoverySettings, RepoScore
from .github_service import get_discovery_service

log = logging.getLogger("os.intelligence.notifier")


class ProactiveNotifier:
    def __init__(self, db_path: str | Path = "data/discovery.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS discovery_notifications (
                    id TEXT PRIMARY KEY,
                    repo_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    why_it_matters TEXT NOT NULL,
                    score REAL NOT NULL,
                    tier TEXT NOT NULL,
                    actions_json TEXT NOT NULL,
                    status TEXT NOT NULL,
                    queued_for_quiet_hours INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.execute("CREATE INDEX IF NOT EXISTS idx_notif_repo ON discovery_notifications(repo_id)")
            conn.commit()

    def is_in_quiet_hours(self, settings: DiscoverySettings, current_hour: Optional[int] = None) -> bool:
        """Check if current time is within user-configured quiet hours."""
        if current_hour is None:
            current_hour = datetime.now().hour

        start = settings.quiet_hours_start
        end = settings.quiet_hours_end

        if start > end:
            # e.g. 23 to 7
            return current_hour >= start or current_hour < end
        else:
            return start <= current_hour < end

    def process_candidate_for_notification(
        self,
        candidate: CandidateRepo,
        settings: Optional[DiscoverySettings] = None,
        force: bool = False,
    ) -> Optional[Dict[str, Any]]:
        """Evaluate candidate and generate a proactive notification if threshold met and not duplicate."""
        if not candidate.score or candidate.dismissed:
            return None

        if candidate.score.is_disqualified:
            return None

        cfg = settings or get_discovery_service().get_settings()
        if not cfg.notifications_enabled and not force:
            return None

        # Check threshold
        if candidate.score.total_score < cfg.min_worthwhile_score and not force:
            return None

        # Check if already notified
        with sqlite3.connect(self.db_path) as conn:
            existing = conn.execute(
                "SELECT id FROM discovery_notifications WHERE repo_id = ?",
                (candidate.repo_id,),
            ).fetchone()
            if existing:
                return None

        in_quiet = self.is_in_quiet_hours(cfg)
        notif_id = f"notif_{uuid.uuid4().hex[:10]}"
        tier_label = "High Priority Discovery" if candidate.score.total_score >= cfg.min_high_priority_score else "Worthwhile Candidate"
        title = f"{tier_label}: {candidate.name} ({candidate.stars} stars)"

        why_it_matters = (
            candidate.research.why_it_matters_now
            if candidate.research and candidate.research.why_it_matters_now
            else f"Observed growth with {candidate.stars} stars and score {candidate.score.total_score}/100."
        )

        actions = [
            {"id": "evaluate", "label": "Evaluate in Virtual Lab", "type": "primary"},
            {"id": "research", "label": "View Deep Research", "type": "glass"},
            {"id": "dismiss", "label": "Dismiss", "type": "ghost"},
        ]

        notif_data = {
            "id": notif_id,
            "repo_id": candidate.repo_id,
            "title": title,
            "summary": candidate.description or "Promising open-source repository discovered.",
            "why_it_matters": why_it_matters,
            "score": candidate.score.total_score,
            "tier": candidate.score.tier,
            "actions": actions,
            "status": "queued" if in_quiet else "unread",
            "queued_for_quiet_hours": in_quiet,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                INSERT INTO discovery_notifications (
                    id, repo_id, title, summary, why_it_matters, score, tier,
                    actions_json, status, queued_for_quiet_hours, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    notif_data["id"],
                    notif_data["repo_id"],
                    notif_data["title"],
                    notif_data["summary"],
                    notif_data["why_it_matters"],
                    notif_data["score"],
                    notif_data["tier"],
                    json.dumps(notif_data["actions"]),
                    notif_data["status"],
                    1 if in_quiet else 0,
                    notif_data["created_at"],
                ),
            )
            conn.commit()

        return notif_data

    def list_notifications(self, unread_only: bool = False, limit: int = 30) -> List[Dict[str, Any]]:
        query = "SELECT id, repo_id, title, summary, why_it_matters, score, tier, actions_json, status, queued_for_quiet_hours, created_at FROM discovery_notifications"
        params: list[Any] = []
        if unread_only:
            query += " WHERE status = 'unread'"
        query += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)

        with sqlite3.connect(self.db_path) as conn:
            rows = conn.execute(query, params).fetchall()
            return [
                {
                    "id": r[0],
                    "repo_id": r[1],
                    "title": r[2],
                    "summary": r[3],
                    "why_it_matters": r[4],
                    "score": r[5],
                    "tier": r[6],
                    "actions": json.loads(r[7]),
                    "status": r[8],
                    "queued_for_quiet_hours": bool(r[9]),
                    "created_at": r[10],
                }
                for r in rows
            ]

    def mark_action(self, notif_id: str, action: str) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            cur = conn.execute(
                "UPDATE discovery_notifications SET status = ? WHERE id = ?",
                (action, notif_id),
            )
            conn.commit()
            return cur.rowcount > 0


_NOTIFIER: Optional[ProactiveNotifier] = None


def get_notifier() -> ProactiveNotifier:
    global _NOTIFIER
    if _NOTIFIER is None:
        _NOTIFIER = ProactiveNotifier()
    return _NOTIFIER
