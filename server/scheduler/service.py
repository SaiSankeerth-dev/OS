"""OS Scheduler: user-facing reminders.

"Remind me to call mom at 6pm" → one-time job.
"Remind me to drink water every day at 9am" → recurring.

Built on APScheduler with SQLite persistence (survives restarts).
All local, all free. No external services.

When a reminder fires, it's stored as a notification the dashboard
shows, and (if Telegram is connected) sent to the user's phone.
"""
from __future__ import annotations

import logging
import re
import sqlite3
import time
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Callable

log = logging.getLogger(__name__)


@dataclass
class Reminder:
    id: str
    text: str
    run_at: float  # unix timestamp
    recurring: str | None = None  # "daily", "weekly", None
    created_at: float = 0
    fired: bool = False


def parse_reminder(text: str) -> tuple[str, float, str | None] | None:
    """Parse 'remind me to X at Y' into (text, timestamp, recurring).

    Returns None if not a reminder request.
    Supports:
    - "remind me to call mom at 6pm"
    - "remind me to drink water every day at 9am"
    - "remind me in 30 minutes to check the oven"
    - "remind me tomorrow at 9am to send the email"
    """
    t = text.strip()
    if not re.match(r"^remind\s+me\s+", t, re.IGNORECASE):
        return None

    # Check for recurring first (before stripping)
    recurring = None
    if re.search(r"every\s+day\s+at|daily\s+at", t, re.IGNORECASE):
        recurring = "daily"

    now = datetime.now()
    run_at: datetime | None = None
    task = ""

    # Pattern A: "remind me in 30 minutes to X" (time before task)
    m = re.match(
        r"^remind\s+me\s+in\s+(\d+)\s+(minute|hour)s?\s+(?:to\s+)?(.+)$",
        t, re.IGNORECASE,
    )
    if m:
        n, unit, task = int(m.group(1)), m.group(2).lower(), m.group(3).strip()
        delta = timedelta(minutes=n) if unit == "minute" else timedelta(hours=n)
        run_at = now + delta
        return task, run_at.timestamp(), recurring

    # Pattern B: "remind me to X at Y" / "remind me to X every day at Y"
    # Pattern C: "remind me tomorrow at Y to X" (time before task)
    # Strip the "remind me" prefix
    rest = re.sub(r"^remind\s+me\s+", "", t, flags=re.IGNORECASE)

    # Pattern C: "tomorrow at 9am to send the email"
    m = re.match(
        r"^tomorrow\s+at\s+(.+?)\s+to\s+(.+)$", rest, re.IGNORECASE,
    )
    if m:
        time_str, task = m.group(1).strip(), m.group(2).strip()
        is_tomorrow = True
    else:
        # Pattern B: "to X at Y" / "to X every day at Y"
        is_tomorrow = False
        m = re.match(
            r"^(?:to\s+)?(.+?)\s+(?:every\s+day\s+at|daily\s+at|at)\s+(.+)$",
            rest, re.IGNORECASE,
        )
        if not m:
            return None
        task, time_str = m.group(1).strip(), m.group(2).strip()

    # Parse the time: "6pm", "18:30", "9am"
    m2 = re.match(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", time_str, re.IGNORECASE)
    if not m2:
        return None
    hour = int(m2.group(1))
    minute = int(m2.group(2) or 0)
    ampm = (m2.group(3) or "").lower()
    if ampm == "pm" and hour < 12:
        hour += 12
    if ampm == "am" and hour == 12:
        hour = 0
    run_at = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    if is_tomorrow:
        run_at += timedelta(days=1)
    elif run_at <= now:
        run_at += timedelta(days=1)

    return task, run_at.timestamp(), recurring


class SchedulerService:
    """APScheduler-backed reminder service with SQLite persistence."""

    def __init__(self, db_path: str | Path = "data/scheduler.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()
        self._scheduler = None
        self._on_fire: Callable[[Reminder], None] | None = None

    def _init_db(self) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS reminders (
                    id TEXT PRIMARY KEY,
                    text TEXT NOT NULL,
                    run_at REAL NOT NULL,
                    recurring TEXT,
                    created_at REAL NOT NULL,
                    fired INTEGER DEFAULT 0
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id TEXT PRIMARY KEY,
                    text TEXT NOT NULL,
                    created_at REAL NOT NULL,
                    read INTEGER DEFAULT 0
                )
            """)
            conn.commit()
        finally:
            conn.close()

    def schedule(self, text: str, run_at: float,
                 recurring: str | None = None) -> Reminder:
        """Schedule a reminder. Returns the Reminder."""
        r = Reminder(
            id=uuid.uuid4().hex[:8],
            text=text,
            run_at=run_at,
            recurring=recurring,
            created_at=time.time(),
        )
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute(
                "INSERT INTO reminders (id, text, run_at, recurring, created_at) "
                "VALUES (?, ?, ?, ?, ?)",
                (r.id, r.text, r.run_at, r.recurring, r.created_at),
            )
            conn.commit()
        finally:
            conn.close()
        self._schedule_job(r)
        return r

    def list_pending(self) -> list[Reminder]:
        """List all unfired reminders."""
        conn = sqlite3.connect(self.db_path)
        try:
            rows = conn.execute(
                "SELECT id, text, run_at, recurring, created_at, fired "
                "FROM reminders WHERE fired=0 ORDER BY run_at"
            ).fetchall()
            return [
                Reminder(id=r[0], text=r[1], run_at=r[2], recurring=r[3],
                         created_at=r[4], fired=bool(r[5]))
                for r in rows
            ]
        finally:
            conn.close()

    def cancel(self, reminder_id: str) -> bool:
        """Cancel a reminder. Returns True if found."""
        conn = sqlite3.connect(self.db_path)
        try:
            cur = conn.execute(
                "DELETE FROM reminders WHERE id=? AND fired=0", (reminder_id,)
            )
            conn.commit()
            if cur.rowcount > 0 and self._scheduler:
                try:
                    self._scheduler.remove_job(f"reminder_{reminder_id}")
                except Exception:
                    pass
            return cur.rowcount > 0
        finally:
            conn.close()

    def get_notifications(self, unread_only: bool = True) -> list[dict]:
        """Get fired reminders as notifications."""
        conn = sqlite3.connect(self.db_path)
        try:
            q = ("SELECT id, text, created_at FROM notifications "
                 + ("WHERE read=0 " if unread_only else "")
                 + "ORDER BY created_at DESC LIMIT 50")
            rows = conn.execute(q).fetchall()
            return [
                {"id": r[0], "text": r[1], "created_at": r[2]}
                for r in rows
            ]
        finally:
            conn.close()

    def mark_read(self, notif_id: str) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute(
                "UPDATE notifications SET read=1 WHERE id=?", (notif_id,))
            conn.commit()
        finally:
            conn.close()

    def start(self, on_fire: Callable[[Reminder], None] | None = None) -> None:
        """Start the background scheduler. Loads pending reminders from DB."""
        self._on_fire = on_fire
        try:
            from apscheduler.schedulers.background import BackgroundScheduler
        except ImportError:
            log.warning("APScheduler not installed; scheduler disabled")
            return

        self._scheduler = BackgroundScheduler()
        # Load pending reminders from DB (survives restarts)
        for r in self.list_pending():
            # If a reminder's time passed while we were down, fire it now
            # (unless it's more than 1 hour overdue, then skip)
            if r.run_at < time.time() - 3600:
                log.info("Skipping overdue reminder: %s", r.text)
                self._mark_fired(r.id)
                continue
            self._schedule_job(r)
        self._scheduler.start()
        log.info("Scheduler started with %d pending reminders",
                 len(self.list_pending()))

    def _schedule_job(self, r: Reminder) -> None:
        if not self._scheduler:
            return
        run_date = datetime.fromtimestamp(r.run_at)
        self._scheduler.add_job(
            self._fire,
            "date",
            run_date=run_date,
            args=[r.id],
            id=f"reminder_{r.id}",
            replace_existing=True,
        )
        # For daily recurring, also schedule the next occurrence
        if r.recurring == "daily":
            # The _fire handler will reschedule
            pass

    def _fire(self, reminder_id: str) -> None:
        """Called by APScheduler when a reminder fires."""
        conn = sqlite3.connect(self.db_path)
        try:
            row = conn.execute(
                "SELECT id, text, run_at, recurring, created_at "
                "FROM reminders WHERE id=? AND fired=0",
                (reminder_id,),
            ).fetchone()
            if not row:
                return
            r = Reminder(id=row[0], text=row[1], run_at=row[2],
                         recurring=row[3], created_at=row[4])
            # Create notification
            notif_id = uuid.uuid4().hex[:8]
            conn.execute(
                "INSERT INTO notifications (id, text, created_at) VALUES (?, ?, ?)",
                (notif_id, f"Reminder: {r.text}", time.time()),
            )
            # Mark fired or reschedule if recurring
            if r.recurring == "daily":
                next_run = r.run_at + 86400  # +24h
                conn.execute(
                    "UPDATE reminders SET run_at=?, fired=0 WHERE id=?",
                    (next_run, r.id),
                )
                conn.commit()
                # Reschedule the job
                r.run_at = next_run
                self._schedule_job(r)
            else:
                conn.execute(
                    "UPDATE reminders SET fired=1 WHERE id=?", (r.id,))
                conn.commit()
        finally:
            conn.close()

        if self._on_fire:
            try:
                self._on_fire(r)
            except Exception:
                log.exception("on_fire callback failed")

    def _mark_fired(self, reminder_id: str) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute(
                "UPDATE reminders SET fired=1 WHERE id=?", (reminder_id,))
            conn.commit()
        finally:
            conn.close()

    def stop(self) -> None:
        if self._scheduler:
            self._scheduler.shutdown(wait=False)
            self._scheduler = None
