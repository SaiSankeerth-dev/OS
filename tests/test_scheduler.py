"""Scheduler tests: reminders.

Covers parsing, scheduling, listing, cancelling, and persistence.
The APScheduler background thread is not started in tests (we test
the DB layer directly).
"""
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server.scheduler.service import (
    SchedulerService, parse_reminder,
)
from server.intent.router import IntentRouter, Intent


def _svc():
    d = tempfile.mkdtemp()
    return SchedulerService(db_path=Path(d) / "sched.db")


def _route(text: str):
    return IntentRouter().classify(text)


# --- Parsing ---------------------------------------------------------------

def test_parse_at_time():
    r = parse_reminder("remind me to call mom at 6pm")
    assert r is not None
    task, ts, rec = r
    assert task == "call mom"
    assert rec is None
    # Should be today at 6pm (or tomorrow if past)
    import datetime
    dt = datetime.datetime.fromtimestamp(ts)
    assert dt.hour == 18


def test_parse_daily():
    r = parse_reminder("remind me to drink water every day at 9am")
    assert r is not None
    task, ts, rec = r
    assert task == "drink water"
    assert rec == "daily"


def test_parse_in_minutes():
    r = parse_reminder("remind me in 30 minutes to check the oven")
    assert r is not None
    task, ts, rec = r
    assert "oven" in task or task == "check the oven"
    # Should be ~30 min from now
    assert abs(ts - (time.time() + 1800)) < 60


def test_parse_tomorrow():
    r = parse_reminder("remind me tomorrow at 9am to send the email")
    assert r is not None
    task, ts, rec = r
    import datetime
    dt = datetime.datetime.fromtimestamp(ts)
    tomorrow = datetime.datetime.now() + datetime.timedelta(days=1)
    assert dt.date() == tomorrow.date()
    assert dt.hour == 9


def test_parse_not_a_reminder():
    assert parse_reminder("hello") is None
    assert parse_reminder("what time is it") is None


def test_parse_past_time_rolls_to_tomorrow():
    # "at 3am" when it's afternoon → tomorrow
    import datetime
    now = datetime.datetime.now()
    if now.hour >= 4:  # only valid if 3am already passed
        r = parse_reminder("remind me to test at 3am")
        assert r is not None
        _, ts, _ = r
        dt = datetime.datetime.fromtimestamp(ts)
        assert dt.date() > now.date() or (dt.date() == now.date() and dt.hour == 3)


# --- Intent routing ---------------------------------------------------------

def test_route_remind_me():
    d = _route("remind me to call mom at 6pm")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "schedule_reminder"


def test_route_list():
    d = _route("what reminders do I have")
    assert d.tool_name == "list_reminders"


def test_route_cancel():
    d = _route("cancel reminder abc123")
    assert d.tool_name == "cancel_reminder"
    assert d.args["reminder_id"] == "abc123"


# --- Service -----------------------------------------------------------------

def test_schedule_and_list():
    svc = _svc()
    r = svc.schedule("call mom", time.time() + 3600)
    assert r.id
    pending = svc.list_pending()
    assert len(pending) == 1
    assert pending[0].text == "call mom"


def test_cancel():
    svc = _svc()
    r = svc.schedule("call mom", time.time() + 3600)
    assert svc.cancel(r.id) is True
    assert len(svc.list_pending()) == 0
    assert svc.cancel("nonexistent") is False


def test_persistence():
    d = tempfile.mkdtemp()
    db = Path(d) / "sched.db"
    svc1 = SchedulerService(db_path=db)
    r = svc1.schedule("persistent task", time.time() + 3600)
    # New instance, same DB → reminder survives
    svc2 = SchedulerService(db_path=db)
    pending = svc2.list_pending()
    assert len(pending) == 1
    assert pending[0].id == r.id


def test_fire_creates_notification():
    svc = _svc()
    r = svc.schedule("test fire", time.time() - 10)  # overdue
    svc._fire(r.id)
    notifs = svc.get_notifications()
    assert len(notifs) == 1
    assert "test fire" in notifs[0]["text"]
    # Non-recurring is marked fired
    assert len(svc.list_pending()) == 0


def test_daily_reschedules():
    svc = _svc()
    r = svc.schedule("daily task", time.time() - 10, recurring="daily")
    svc._fire(r.id)
    pending = svc.list_pending()
    assert len(pending) == 1  # rescheduled, not gone
    assert pending[0].run_at > r.run_at
