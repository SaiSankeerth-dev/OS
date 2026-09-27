"""Proactive watcher (Phase 13).

The watcher observes OS state and suggests. It never acts:
no tool execution, no approvals, no mutations of the user's world.
Its only writes are its own suggestion bookkeeping (seen/unseen).

Checks are deterministic reads over SQLite:
- aging pending approvals (waiting longer than nag_after_sec)
- approvals that expired unanswered in the last day
- clusters of failed tool runs in the lifecycle log
"""
from __future__ import annotations

import json
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Suggestion:
    kind: str
    text: str
    ts: float = field(default_factory=time.time)
    suggestion_id: int = 0


_FAILURE_MARKERS = ("failed", "produced nothing", "couldn't verify")


class Watcher:
    """Read-only observer. check() returns fresh suggestions."""

    def __init__(
        self,
        state_store=None,
        approval_store=None,
        nag_after_sec: float = 600,
        cooldown_sec: float = 86400,
        failure_window_sec: float = 86400,
        min_failures: int = 2,
    ) -> None:
        self._state = state_store
        self._approvals = approval_store
        self._nag_after = nag_after_sec
        self._cooldown = cooldown_sec
        self._failure_window = failure_window_sec
        self._min_failures = min_failures

    # ---- public ------------------------------------------------------

    def check(self) -> list[Suggestion]:
        """Run every check. Read-only against the user's world; only
        the watcher's own suggestion rows are written (deduped by
        cooldown)."""
        found: list[Suggestion] = []
        for fn in (
            self._check_aging_pending,
            self._check_expired,
            self._check_failures,
        ):
            try:
                found.extend(fn())
            except Exception:
                continue  # a broken check must never break the turn
        fresh: list[Suggestion] = []
        for s in found:
            if self._state is not None and self._state.recent_suggestion(
                s.kind, s.text, self._cooldown
            ):
                continue
            if self._state is not None:
                s.suggestion_id = self._state.save_suggestion(
                    s.kind, s.text
                )
            fresh.append(s)
        return fresh

    def unseen(self, limit: int = 5) -> list[dict]:
        if self._state is None:
            return []
        return self._state.unseen_suggestions(limit=limit)

    def mark_seen(self, suggestion_id: int) -> None:
        if self._state is not None:
            self._state.mark_suggestion_seen(suggestion_id)

    # ---- checks ------------------------------------------------------

    def _check_aging_pending(self) -> list[Suggestion]:
        if self._approvals is None:
            return []
        now = time.time()
        aged = [
            p
            for p in self._approvals.load_pending()
            if now - p.created_ts > self._nag_after
        ]
        if not aged:
            return []
        n = len(aged)
        mins = int((now - aged[0].created_ts) // 60)
        return [
            Suggestion(
                kind="aging_pending",
                text=(
                    f"{n} draft{'s' if n != 1 else ''} "
                    f"{'have' if n != 1 else 'has'} been waiting on your "
                    f"approval for ~{mins} minutes. "
                    "Say 'approve' or 'reject' when you're ready."
                ),
            )
        ]

    def _check_expired(self) -> list[Suggestion]:
        if self._approvals is None:
            return []
        cutoff = time.time() - 86400
        n = 0
        for e in self._approvals.recent(limit=100):
            if e.get("status") != "EXPIRED":
                continue
            try:
                ts = datetime.fromisoformat(str(e["ts"])).timestamp()
            except ValueError:
                continue
            if ts >= cutoff:
                n += 1
        if not n:
            return []
        return [
            Suggestion(
                kind="expired_approvals",
                text=(
                    f"{n} approval{'s' if n != 1 else ''} expired "
                    "unanswered in the last day. Want to redo any of them?"
                ),
            )
        ]

    def _check_failures(self) -> list[Suggestion]:
        if self._state is None:
            return []
        cutoff = time.time() - self._failure_window
        n = 0
        for e in self._state.get_events("lifecycle", limit=200):
            try:
                payload = json.loads(e.get("data") or "{}")
            except ValueError:
                continue
            if payload.get("stage") != "REMEMBER":
                continue
            detail = str(payload.get("detail", "")).lower()
            if not any(m in detail for m in _FAILURE_MARKERS):
                continue
            try:
                ts = datetime.fromisoformat(e["ts"]).timestamp()
            except (ValueError, KeyError):
                continue
            if ts >= cutoff:
                n += 1
        if n < self._min_failures:
            return []
        return [
            Suggestion(
                kind="recent_failures",
                text=(
                    f"{n} tool runs failed recently. "
                    "Something may be off with a skill - "
                    "say 'check skills' and I'll look."
                ),
            )
        ]
