"""Negative & Regression Tests for Phase A: Trust and Correctness First.

Verifies:
1. No generic non-empty response can establish VERIFIED.
2. Read-back is strictly required for domain verification (Gmail, Calendar); otherwise UNKNOWN.
3. Browser extraction failure never returns fabricated content.
4. Genuine empty research is distinguished from search failure.
5. SQLite memory metadata cannot execute arbitrary code via eval().
6. Unsupported Computer actions do not synthesize success.
7. Planner detects and reports dependency cycles explicitly.
"""
from datetime import date, datetime, timezone
from pathlib import Path
import pytest

from server.domain.entities import Task, Dependency
from server.domain.enums import (
    DependencyStatus,
    DependencyType,
    PlanStatus,
    TaskStatus,
    VerificationStatus,
)
from server.execution.verifier import (
    CalendarVerifier,
    GenericApiVerifier,
    GmailVerifier,
    PostconditionVerifier,
)
from server.memory.base import MemoryRecord, MemoryType
from server.memory.sqlite_impl import SQLiteMemoryManager
from server.planner.engine import PlannerEngine
from server.tools.websearch_tool import web_search


# ===========================================================================
# 1. Verifier Generic Shortcut Elimination & Postcondition Read-Back
# ===========================================================================

def test_generic_api_verifier_returns_unknown_not_verified():
    """A generic non-empty response must never establish VERIFIED."""
    v = GenericApiVerifier()
    status, details, ev = v.verify(
        action_id="act_gen_1",
        tool_name="unregistered_tool",
        execution_result={"ok": True, "data": "arbitrary_success", "count": 42},
        arguments={"param": "val"},
        user_id="test_user",
    )
    assert status == VerificationStatus.UNKNOWN, f"Expected UNKNOWN, got {status}"
    assert ev is None
    assert "No domain postcondition verifier registered" in details.get("note", "")


def test_gmail_verifier_without_readback_returns_unknown():
    """Gmail sending without external read-back must return UNKNOWN, not VERIFIED."""
    v = GmailVerifier(read_back_fn=None)
    status, details, ev = v.verify(
        action_id="act_gmail_no_rb",
        tool_name="gmail.send_email",
        execution_result={"ok": True, "id": "msg_unconfirmed"},
        arguments={"to": "test@example.com", "subject": "Test"},
        user_id="test_user",
    )
    assert status == VerificationStatus.UNKNOWN
    assert details["read_back"] is False
    assert ev is None


def test_calendar_verifier_without_readback_returns_unknown():
    """Calendar event creation without external read-back must return UNKNOWN, not VERIFIED."""
    v = CalendarVerifier(read_back_fn=None)
    status, details, ev = v.verify(
        action_id="act_cal_no_rb",
        tool_name="google_calendar.create_event",
        execution_result={"ok": True, "id": "evt_unconfirmed"},
        arguments={"title": "Team Standup", "start": "2026-10-18T10:00:00Z"},
        user_id="test_user",
    )
    assert status == VerificationStatus.UNKNOWN
    assert details["read_back"] is False
    assert ev is None


# ===========================================================================
# 2. Browser Extraction Fallback Fabrication Elimination
# ===========================================================================

def test_browser_worker_extraction_failure_does_not_fabricate_content():
    """Extraction failure must never return synthetic '[fallback] Content extracted from ...'."""
    from adapters.browser.worker import BrowserWorker

    worker = BrowserWorker()
    text = worker.extract_text("nonexistent_session_id_xyz")
    assert "[fallback]" not in text
    assert "Content extracted from" not in text
    assert text == "" or "error" in text.lower() or "failed" in text.lower()


# ===========================================================================
# 3. Distinguish Genuine Empty Search from Search Failure
# ===========================================================================

def test_web_search_empty_results_distinguished_from_failure(monkeypatch):
    """When a search query yields 0 results, it should succeed with empty results, not fail."""
    # Mock _html_search and _api_search to simulate legitimate 0 results
    monkeypatch.setattr("server.tools.websearch_tool._html_search", lambda q, n: [])
    monkeypatch.setattr("server.tools.websearch_tool._api_search", lambda q, n: [])

    res = web_search("super_obscure_query_with_no_hits_123456789")
    assert res.status == "success"
    assert res.data["results"] == []
    assert res.data.get("empty") is True

    # Simulated network exception should still produce failure
    def fail_search(q, n):
        raise ConnectionResetError("Connection reset by peer")

    monkeypatch.setattr("server.tools.websearch_tool._html_search", fail_search)
    monkeypatch.setattr("server.tools.websearch_tool._api_search", fail_search)

    res_fail = web_search("any_query")
    assert res_fail.status == "failure"
    assert "Search failed" in res_fail.error


# ===========================================================================
# 4. Safe Deserialization in SQLite Memory (No eval Code Execution)
# ===========================================================================

def test_sqlite_memory_eval_injection_blocked(tmp_path):
    """Metadata containing malicious code must not be executed via eval()."""
    db_file = tmp_path / "memory_test.db"
    mem = SQLiteMemoryManager(str(db_file))

    # Store a normal record with JSON metadata
    rec = MemoryRecord(
        key="user_name",
        value="Sai",
        memory_type=MemoryType.USER_PROFILE,
        metadata={"role": "engineer", "verified": True},
    )
    mem.store(rec)

    # Directly insert malicious payload into metadata column (simulating compromised/legacy DB)
    marker_file = tmp_path / "pwned.txt"
    malicious_payload = f"__import__('pathlib').Path(r'{marker_file}').write_text('PWNED')"

    conn = mem._conn
    conn.execute(
        "INSERT INTO memories (key, value, memory_type, importance, created_at, updated_at, metadata) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        ("exploit_key", "exploit_val", MemoryType.CONVERSATION.value, 1.0, 1000.0, 1000.0, malicious_payload),
    )
    conn.commit()

    # Retrieve all memories - this previously triggered eval() on row[7]
    recs = mem.retrieve("exploit", limit=10)
    assert not marker_file.exists(), "Code execution occurred during metadata deserialization!"

    # Find the exploit record and verify metadata was handled safely
    exploit_rec = next((r for r in recs if r.key == "exploit_key"), None)
    assert exploit_rec is not None
    assert exploit_rec.metadata == {}

    # Verify normal record still deserializes properly
    normal_recs = mem.retrieve("Sai", limit=5)
    normal_rec = next((r for r in normal_recs if r.key == "user_name"), None)
    assert normal_rec is not None
    assert normal_rec.metadata.get("role") == "engineer"


# ===========================================================================
# 5. Unsupported Computer Action Handlers Do Not Synthesize Success
# ===========================================================================

def test_unsupported_computer_actions_do_not_synthesize_success():
    """Calling unimplemented/unsupported actions on computer backends must return success=False."""
    from server.computer.backends.e2b_sandbox import E2BDesktopSandboxBackend
    from server.computer.backends.skyvern_adapter import SkyvernBackend

    # E2B without active sandbox instance
    e2b = E2BDesktopSandboxBackend()
    e2b._sessions["dummy"] = type("Session", (), {"id": "dummy", "status": "active"})()

    res_click = e2b.click_element("dummy", {"x": 100, "y": 100})
    assert res_click.success is False
    assert res_click.verified is False
    assert "not supported" in (res_click.error or "").lower() or "no sandbox" in (res_click.error or "").lower()

    # Skyvern press_key / scroll / switch_tab are unsupported stubs
    skyvern = SkyvernBackend()
    skyvern._sessions["dummy"] = type("Session", (), {"id": "dummy", "status": "active"})()

    res_key = skyvern.press_key("dummy", "Enter")
    assert res_key.success is False
    assert res_key.verified is False
    assert "not supported" in (res_key.error or "").lower()


# ===========================================================================
# 6. Planner Explicit Dependency Cycle Detection
# ===========================================================================

def test_planner_cycle_detection_returns_invalid_plan(tmp_path):
    """When a dependency cycle exists, PlannerEngine must detect it and return PlanStatus.INVALID."""
    from server.db.database import DatabaseEngine
    from server.db.repositories.core import (
        DependencyRepository,
        PlanRepository,
        TaskRepository,
    )

    db_path = str(tmp_path / "planner_test.db")
    db = DatabaseEngine(db_path)
    db._init_schema()

    task_repo = TaskRepository(db)
    dep_repo = DependencyRepository(db)
    plan_repo = PlanRepository(db)

    user_id = "test_planner_user"
    with db.transaction() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO users (id, email, display_name, created_at, updated_at) "
            "VALUES (?, 'planner@test.com', 'Planner User', datetime('now'), datetime('now'))",
            (user_id,),
        )

    # Create Task 1 and Task 2 with a mutual dependency cycle: 1 -> 2 -> 1
    t1 = Task(id="task_cycle_1", user_id=user_id, title="Cycle Task 1", status=TaskStatus.OPEN)
    t2 = Task(id="task_cycle_2", user_id=user_id, title="Cycle Task 2", status=TaskStatus.OPEN)
    task_repo.create(t1)
    task_repo.create(t2)

    dep1 = Dependency(
        user_id=user_id,
        task_id=t1.id,
        depends_on_task_id=t2.id,
        dependency_type=DependencyType.TASK,
        status=DependencyStatus.PENDING,
    )
    dep2 = Dependency(
        user_id=user_id,
        task_id=t2.id,
        depends_on_task_id=t1.id,
        dependency_type=DependencyType.TASK,
        status=DependencyStatus.PENDING,
    )
    dep_repo.create(dep1)
    dep_repo.create(dep2)

    planner = PlannerEngine(
        task_repo=task_repo,
        dep_repo=dep_repo,
        plan_repo=plan_repo,
        db=db,
    )

    plan, items = planner.create_daily_plan(user_id=user_id, target_date=date(2026, 10, 18))

    assert plan.status == PlanStatus.INVALID
    assert "cycle" in plan.reason.lower()
    assert len(items) == 0
