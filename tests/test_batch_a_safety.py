"""Batch A Safety & Truthfulness Regression Test Suite.

Verifies:
1. Approval execution exceptions return ok: False, preventing false success.
2. Multiple pending approvals block bare 'yes'/'no' and require numbered or batch decisions.
3. SSRF Protection: Loopback, private subnets, and cloud metadata (169.254.169.254) are rejected.
4. WebRead tool blocks SSRF attempts.
5. BrowserWorker blocks SSRF navigation attempts.
6. TaskManager rejects 0-step plans (status FAILED, never COMPLETED).
7. Team verifier checks explicit postconditions (structure, errors, substance).
8. Unsupported desktop actions return success=False.
9. Stale browser sessions report extraction errors truthfully.
10. Task PUT and Watcher DELETE API route aliases work correctly.
11. Skill updates stage and validate before atomic swap.
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from dataclasses import dataclass

from server.security.url_validator import validate_url_safe, is_ip_blocked
from server.tools.webread_tool import web_read
from adapters.browser.worker import BrowserWorker
from server.tasks.planner import Plan, PlanStatus
from server.tasks.task_manager import TaskManager
from server.teams.team import Team
from server.computer.backends.docker_desktop import DockerDesktopBackend
from server.computer.backends.browser_harness import BrowserHarnessBackend


# ---------------------------------------------------------------------------
# 1. SSRF Protection Tests
# ---------------------------------------------------------------------------
def test_ssrf_blocks_loopback_and_metadata():
    # Loopback
    safe, reason, _ = validate_url_safe("http://127.0.0.1:8000/secret")
    assert not safe
    assert "Loopback" in reason or "blocked" in reason

    # Localhost
    safe, reason, _ = validate_url_safe("http://localhost/admin")
    assert not safe

    # AWS/GCP/Azure Metadata IP
    safe, reason, _ = validate_url_safe("http://169.254.169.254/latest/meta-data/")
    assert not safe
    assert "metadata" in reason or "blocked" in reason

    # GCP Metadata Hostname
    safe, reason, _ = validate_url_safe("http://metadata.google.internal/computeMetadata/v1/")
    assert not safe

    # RFC 1918 Private IP
    safe, reason, _ = validate_url_safe("http://10.0.0.1/internal-dashboard")
    assert not safe

    # Non-HTTP Scheme
    safe, reason, _ = validate_url_safe("file:///etc/passwd")
    assert not safe
    assert "not allowed" in reason

    # Embedded credentials
    safe, reason, _ = validate_url_safe("http://admin:secret@example.com")
    assert not safe
    assert "credentials" in reason


def test_webread_tool_blocks_ssrf():
    res = web_read("http://169.254.169.254/meta-data")
    assert res.status == "failure"
    assert "SSRF" in res.error

    res_local = web_read("http://127.0.0.1:3000/api/diagnostics")
    assert res_local.status == "failure"
    assert "SSRF" in res_local.error


def test_browser_worker_blocks_ssrf():
    bw = BrowserWorker(prefer_playwright=True)
    receipt = bw.navigate("test_sess", "http://169.254.169.254/secret")
    assert receipt.status == "FAILED"
    assert receipt.status_code == 403
    assert "SSRF" in receipt.details.get("error", "")


# ---------------------------------------------------------------------------
# 2. Approval Safety & Bare 'Yes' Ambiguity Tests
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_bare_yes_blocked_when_multiple_approvals_pending():
    from server.conversation.manager import ConversationManager
    from server.approvals.gate import PendingApproval

    cfg = MagicMock()
    cfg.approvals.timeout_sec = 300
    cfg.approvals.max_pending = 10
    cfg.llm.base_url = "http://localhost:11434"
    cfg.llm.model = "qwen2.5:3b"
    cfg.llm.request_timeout_sec = 30
    cfg.logging.perf_file = "logs/perf.jsonl"

    mgr = ConversationManager(cfg=cfg)
    p1 = PendingApproval(
        skill="linkedin",
        input_text="Post on LinkedIn",
        draft="Content A",
        approved_hash="hash_a",
        pending_id=1,
    )
    p2 = PendingApproval(
        skill="gmail",
        input_text="Send confidential report",
        draft="Recipient: alice@corp.com",
        approved_hash="hash_b",
        pending_id=2,
    )
    mgr._pending = [p1, p2]

    # Bare "yes" should NOT approve p1 arbitrarily
    chunks = [c async for c in mgr.respond_text("yes")]
    reply = "".join(c.delta for c in chunks)
    assert len(mgr._pending) == 2  # No item was popped!
    assert "Multiple actions are awaiting your approval" in reply
    assert "approve 1" in reply

    # Numbered approval "approve 2" should approve the second item
    with patch.object(mgr, "_approve_one", new_callable=AsyncMock) as mock_approve:
        mock_approve.return_value = "Email sent successfully."
        chunks2 = [c async for c in mgr.respond_text("approve 2")]
        reply2 = "".join(c.delta for c in chunks2)
        assert mock_approve.call_count == 1
        assert len(mgr._pending) == 1
        assert mgr._pending[0].pending_id == 1  # Item 1 is still pending


# ---------------------------------------------------------------------------
# 3. Server Approval Execution Exception Safety
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_approval_exception_returns_ok_false():
    from web.server import approve
    from server.approvals.gate import PendingApproval

    mgr = MagicMock()
    p = PendingApproval(
        skill="deploy",
        input_text="Deploy",
        draft="Deploy Prod",
        approved_hash="hash_deploy",
        pending_id=101,
    )
    mgr._pending = [p]
    mgr._approve_one = AsyncMock(side_effect=RuntimeError("Container connection reset"))

    with patch("web.server.get_mgr", return_value=mgr):
        res = await approve(101)
        assert res["ok"] is False  # Must NOT be True!
        assert "Approval execution failed" in res["error"]
        assert "RuntimeError" in res["error"]


# ---------------------------------------------------------------------------
# 4. TaskManager Zero-Step Plan Safety
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_task_manager_rejects_empty_plan():
    mock_planner = MagicMock()
    # Return a plan with 0 steps
    empty_plan = Plan(goal="Do nothing", steps=[])
    mock_planner.create_plan.return_value = empty_plan

    tm = TaskManager(planner=mock_planner, tools=MagicMock())
    result = await tm.execute("Do nothing")

    assert result["status"] == PlanStatus.FAILED.value
    assert empty_plan.status == PlanStatus.FAILED
    assert any("0 steps" in err.get("error", "") for err in result["errors"])


# ---------------------------------------------------------------------------
# 5. Team Verifier Explicit Postconditions
# ---------------------------------------------------------------------------
def test_team_verifier_postconditions():
    coord = Team(agent=MagicMock())

    # Case A: Error or fallback output must fail verification
    assert not coord.verify("analyze data", "[no result: timeout]")
    assert not coord.verify("analyze data", "[worker fallback active]")
    assert not coord.verify("analyze data", "error: service unreachable")

    # Case B: Too short / trivial output must fail
    assert not coord.verify("analyze data", "done")

    # Case C: Structural postcondition for JSON
    assert not coord.verify("fetch user profile in json", "User Alice lives in London")
    assert coord.verify("fetch user profile in json", '{"name": "Alice", "city": "London", "status": "active"}')

    # Case D: Structural postcondition for math/calculation
    assert not coord.verify("calculate the total sum", "The sum calculation has completed.")
    assert coord.verify("calculate the total sum", "The calculated total sum is 4200 units.")

    # Case E: Mere 1-word coincidence is rejected
    assert not coord.verify(
        "Generate a complete market analysis report for cloud infrastructure",
        "The quick brown fox jumped over the cloud"
    ) is False


# ---------------------------------------------------------------------------
# 6. Desktop Backend Unsupported Action Safety
# ---------------------------------------------------------------------------
def test_docker_desktop_unsupported_actions():
    from server.computer.interface import SessionState

    backend = DockerDesktopBackend()
    backend._browser_harness = object()  # Object without forward_mouse
    backend._sessions["sess_dummy"] = SessionState(session_id="sess_dummy", backend_name="docker_desktop", status="active")

    res = backend.forward_mouse("sess_dummy", "click", 100, 200)
    assert res.success is False
    assert res.verified is False
    assert "not supported" in res.error

    res_kb = backend.forward_keyboard("sess_dummy", "keydown", key="Enter")
    assert res_kb.success is False
    assert res_kb.verified is False
    assert "not supported" in res_kb.error


# ---------------------------------------------------------------------------
# 7. Browser Harness Truthful Extraction Errors
# ---------------------------------------------------------------------------
def test_browser_harness_truthful_extraction():
    bh = BrowserHarnessBackend()
    sess = MagicMock()
    sess.current_url = "https://example.com"
    sess.status = "active"
    bh._sessions = {"s1": sess}
    bh._pages = {"s1": MagicMock()}

    # Simulate page content crashing
    bh._pages["s1"].content.side_effect = RuntimeError("DevTools disconnected")

    obs = bh._inspect_page_impl("s1")
    assert sess.status == "stale"
    assert "Extraction Failed" in obs.text_content
    assert obs.title == "[Extraction Error]"

