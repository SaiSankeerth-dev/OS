"""Phase 2 tests: StateStore persistence, rollback, events, sessions."""
import sqlite3

from server.state import StateStore


def _store(tmp_path) -> StateStore:
    return StateStore(tmp_path / "os_state.db")


def test_task_survives_restart(tmp_path):
    s1 = _store(tmp_path)
    task = s1.create_task("write the report", payload='{"priority": "high"}')
    assert task.status == "PENDING"

    # "restart": drop the store, open a new one on the same file
    del s1
    s2 = _store(tmp_path)
    again = s2.get_task(task.id)
    assert again is not None
    assert again.title == "write the report"
    assert again.payload == '{"priority": "high"}'
    assert again.status == "PENDING"


def test_status_transitions_are_logged_and_rollback_works(tmp_path):
    s = _store(tmp_path)
    task = s.create_task("demo task")
    s.set_task_status(task.id, "RUNNING")
    s.set_task_status(task.id, "WAITING_APPROVAL", note="needs sai's ok")

    history = s.task_history(task.id)
    assert [h["new_status"] for h in history] == [
        "PENDING",
        "RUNNING",
        "WAITING_APPROVAL",
    ]

    rolled = s.rollback_task(task.id)
    assert rolled.status == "RUNNING"
    # the rollback itself is in the log - history is never rewritten
    kinds = [h["new_status"] for h in s.task_history(task.id)]
    assert kinds[-2:] == ["ROLLED_BACK", "RUNNING"]


def test_invalid_status_is_rejected(tmp_path):
    s = _store(tmp_path)
    task = s.create_task("bad status task")
    try:
        s.set_task_status(task.id, "EXPLODING")
    except ValueError:
        pass
    else:
        raise AssertionError("expected ValueError")
    assert s.get_task(task.id).status == "PENDING"


def test_events_log_and_filter(tmp_path):
    s = _store(tmp_path)
    s.log_event("watcher.notice", source="price_watcher", data='{"item": "gpu"}')
    s.log_event("task.created", source="cli")
    all_events = s.get_events()
    assert len(all_events) == 2
    assert s.get_events(kind="watcher.notice")[0]["source"] == "price_watcher"


def test_session_roundtrip_survives_restart(tmp_path):
    s1 = _store(tmp_path)
    s1.save_session("sess-1", '{"turns": 3}')
    del s1
    s2 = _store(tmp_path)
    assert s2.load_session("sess-1") == '{"turns": 3}'
    assert s2.load_session("nope") is None


def test_approval_mirror_records_waiting_approval(tmp_path):
    s = _store(tmp_path)
    s.log_approval(
        skill="linkedin",
        input_text="draft a linkedin post about x",
        draft="exact text shown",
        content_hash="abc123",
        status="WAITING_APPROVAL",
    )
    rows = s.get_approvals(status="WAITING_APPROVAL")
    assert len(rows) == 1
    assert rows[0]["skill"] == "linkedin"
    assert rows[0]["content_hash"] == "abc123"


def test_health_reports_ok(tmp_path):
    s = _store(tmp_path)
    s.create_task("health check task")
    h = s.health()
    assert h["ok"] is True
    assert h["integrity"] == "ok"
    assert h["tables"]["tasks"] == 1
    assert h["path"].endswith("os_state.db")


def test_schema_tables_exist(tmp_path):
    s = _store(tmp_path)
    conn = sqlite3.connect(s.db_path)
    tables = {
        r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
    }
    conn.close()
    assert {"tasks", "task_events", "events", "sessions", "approvals"} <= tables
