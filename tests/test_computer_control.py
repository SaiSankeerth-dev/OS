"""Comprehensive test suite for OS Computer-Use & Multi-Backend Automation.

Covers:
1. Unified ComputerControlInterface contracts & typed exceptions
2. Capability-Aware Backend Registry & intelligent routing across all 5 backends
3. Zero-cost budget guardrails ($0 default for E2B & Skyvern)
4. Windows Harness desktop automation & kill switch
5. Browser Harness profile isolation
6. Safety Guard, URL sanitization & HITL approval gating
7. Bounded Task Loop, verified step transitions & SQLite checkpoints
8. Human Takeover pause & resume lifecycle
9. AI Site Adapters (ChatGPT, Claude, Gemini) & rate limit detection
10. RateLimitsTracker caching, fallbacks & alternative suggestions
11. QuotaAwareScheduler priority queues & checkpoint resumption
12. FastAPI /api/computer/* endpoint verification
"""
from __future__ import annotations

import json
import time
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from config import load_config
from server.computer.ai_sites.chatgpt import ChatGPTAdapter
from server.computer.ai_sites.claude import ClaudeAdapter
from server.computer.ai_sites.gemini import GeminiAdapter
from server.computer.backends.base import BaseComputerBackend
from server.computer.backends.browser_harness import BrowserHarnessBackend
from server.computer.backends.browser_use_desktop import BrowserUseDesktopCompanion
from server.computer.backends.e2b_sandbox import E2BDesktopSandboxBackend
from server.computer.backends.skyvern_adapter import SkyvernBackend
from server.computer.backends.windows_harness import WindowsHarnessBackend
from server.computer.context_memory import ComputerContextMemoryManager
from server.computer.interface import (
    ActionResult,
    BackendCapabilities,
    BackendCostKind,
    BackendUnavailableError,
    ComputerControlError,
    HealthStatus,
    ObservationResult,
    SafetyGateTriggeredError,
    SessionState,
)
from server.computer.rate_limits import ActiveCooldown, RateLimitsTracker
from server.computer.registry import ComputerBackendRegistry, get_computer_registry
from server.computer.safety import ActionRiskLevel, ComputerSafetyGuard
from server.computer.scheduler import QuotaAwareScheduler
from server.computer.task_loop import (
    BoundedTaskExecutor,
    TaskCheckpointStore,
    TaskPlan,
    TaskStep,
)
from web.server import app


# =============================================================================
# 1. Interface & Typed Contracts
# =============================================================================
def test_interface_types_and_exceptions():
    res = ActionResult(
        success=True,
        action="click_element",
        session_id="sess-1",
        backend="browser_harness",
        observed_outcome="Button clicked",
        verified=True,
    )
    assert res.success is True
    assert res.verified is True
    assert res.observed_outcome == "Button clicked"

    obs = ObservationResult(
        session_id="sess-1",
        backend="browser_harness",
        url="https://example.com",
        title="Example Domain",
        text_content="Hello world",
    )
    assert obs.url == "https://example.com"
    assert obs.title == "Example Domain"

    err = SafetyGateTriggeredError("Sensitive action intercepted", details={"ticket": "t1"})
    assert "Sensitive" in str(err)
    assert err.details["ticket"] == "t1"


# =============================================================================
# 2. Registry & Intelligent Routing
# =============================================================================
def test_registry_registration_and_routing():
    reg = ComputerBackendRegistry()
    backends = reg.list_backends()
    assert "browser_harness" in backends
    assert "windows_harness" in backends
    assert "browser_use_desktop" in backends
    assert "e2b_sandbox" in backends
    assert "skyvern" in backends

    # Routing: desktop native -> windows_harness or docker_desktop
    b_win = reg.route_task(requires_desktop=True)
    assert b_win.name in ["windows_harness", "docker_desktop"]

    # Routing: default -> browser_harness
    b_def = reg.route_task("General research")
    assert b_def.name == "browser_harness"

    # Routing: isolation -> raises error if e2b is disabled (default $0 budget)
    with pytest.raises(BackendUnavailableError):
        reg.route_task(requires_isolation=True)


# =============================================================================
# 3. Zero-Cost Budget Guardrails (E2B & Skyvern)
# =============================================================================
def test_e2b_zero_cost_budget_policy():
    # By default, paid cloud sandboxes must be disabled ($0 spending policy)
    e2b = E2BDesktopSandboxBackend(allow_paid_cloud_sandboxes=False)
    health = e2b.health_check()
    assert health.ok is False
    assert "$0" in health.message or "disabled" in health.message

    # Attempting to start session without enabling paid cloud must fail
    with pytest.raises(ComputerControlError) as exc_info:
        e2b.start_session()
    assert "budget policy" in str(exc_info.value) or "disabled" in str(exc_info.value)


def test_skyvern_zero_cost_guardrail():
    # Attempting to target external cloud URL without allow_paid_cloud must be blocked
    sky = SkyvernBackend(base_url="https://api.skyvern.com", allow_paid_cloud=False)
    with pytest.raises(ComputerControlError) as exc_info:
        sky._http_request("tasks")
    assert "zero-cost spending guardrail" in str(exc_info.value)


# =============================================================================
# 4. Windows Desktop Automation & Kill Switch
# =============================================================================
def test_windows_harness_desktop():
    win = WindowsHarnessBackend()
    caps = win.get_capabilities()
    assert caps.supports_desktop is True
    assert caps.cost_classification == BackendCostKind.ZERO_LOCAL

    sess = win.start_session({"session_id": "test-win-sess"})
    assert sess.status == "active"

    # List windows should return list of WindowInfo without crashing
    windows = win.list_windows()
    assert isinstance(windows, list)

    # Emergency kill switch
    win.emergency_stop()
    with pytest.raises(ComputerControlError):
        win.click_element(sess.session_id, (100, 100))

    win.reset_emergency_stop()
    win.close_session(sess.session_id)


# =============================================================================
# 5. Safety Guard, URL Sanitization & HITL Approvals
# =============================================================================
def test_safety_guard_url_sanitization():
    guard = ComputerSafetyGuard()

    # Valid URLs
    assert guard.sanitize_url("https://github.com/SaiSankeerth-dev/OS") == "https://github.com/SaiSankeerth-dev/OS"
    assert guard.sanitize_url("http://localhost:8000") == "http://localhost:8000"

    # Malicious schemes blocked
    with pytest.raises(SafetyGateTriggeredError):
        guard.sanitize_url("javascript:alert(1)")

    with pytest.raises(SafetyGateTriggeredError):
        guard.sanitize_url("file:///etc/passwd")


def test_safety_guard_risk_classification_and_approval():
    guard = ComputerSafetyGuard(require_approval_for_write=True)

    # Read-only
    assert guard.classify_action_risk("observe_screen") == ActionRiskLevel.READ_ONLY
    assert guard.classify_action_risk("open_url") == ActionRiskLevel.READ_ONLY

    # Low risk
    assert guard.classify_action_risk("click_element", target="#submit-search") == ActionRiskLevel.INTERACTIVE_LOW

    # High risk (sensitive keywords)
    assert guard.classify_action_risk("type_text", target="#password") == ActionRiskLevel.HIGH_AUTH_OR_WRITE
    assert guard.classify_action_risk("click_element", target="button.delete-account") == ActionRiskLevel.HIGH_AUTH_OR_WRITE

    # Validating high-risk action without ticket creates pending ticket and raises
    with pytest.raises(SafetyGateTriggeredError) as exc_info:
        guard.validate_action(
            session_id="s1",
            backend="browser_harness",
            action="type_text",
            target="#user_password",
            payload={"text": "supersecret"},
        )
    ticket_id = exc_info.value.details.get("ticket_id")
    assert ticket_id is not None

    # Resolve approval
    ticket = guard.resolve_approval(ticket_id, decision="approve", user="test_user")
    assert ticket.status == "approved"

    # Now validation with approved ticket passes
    guard.validate_action(
        session_id="s1",
        backend="browser_harness",
        action="type_text",
        target="#user_password",
        payload={"text": "supersecret"},
        approval_ticket_id=ticket_id,
    )


def test_safety_guard_emergency_stop():
    guard = ComputerSafetyGuard()
    guard.trigger_emergency_stop()
    assert guard.is_emergency_stopped() is True

    with pytest.raises(SafetyGateTriggeredError):
        guard.sanitize_url("https://example.com")

    with pytest.raises(SafetyGateTriggeredError):
        guard.validate_action("s1", "browser", "observe_screen")

    guard.reset_emergency_stop()
    assert guard.is_emergency_stopped() is False


# =============================================================================
# 6. Bounded Task Loop, Verifications & Checkpoints
# =============================================================================
def test_task_checkpoint_store_persistence(tmp_path):
    db_file = tmp_path / "test_tasks.db"
    store = TaskCheckpointStore(db_path=str(db_file))

    plan = TaskPlan(
        task_id="t-100",
        goal="Search and summarize",
        backend_name="browser_harness",
        session_id="sess-100",
        status="running",
        current_step_index=1,
        steps=[
            TaskStep(step_id="step-1", description="Open Google", action="open_url", target="https://google.com", status="completed", verified=True),
            TaskStep(step_id="step-2", description="Type Query", action="type_text", payload={"text": "OS AI"}, status="pending"),
        ],
    )
    store.save(plan)

    loaded = store.load("t-100")
    assert loaded is not None
    assert loaded.task_id == "t-100"
    assert loaded.status == "running"
    assert loaded.current_step_index == 1
    assert len(loaded.steps) == 2
    assert loaded.steps[0].verified is True


def test_bounded_task_executor_execution(tmp_path):
    db_file = tmp_path / "test_executor.db"
    store = TaskCheckpointStore(db_path=str(db_file))
    executor = BoundedTaskExecutor(checkpoint_store=store)

    # Create dummy mock backend
    mock_backend = MagicMock()
    mock_backend.name = "mock_browser"
    mock_backend.start_session.return_value = SessionState(session_id="m-sess", backend_name="mock_browser")
    mock_backend.observe_screen.return_value = ObservationResult(session_id="m-sess", backend="mock_browser", url="https://example.com", title="Example")
    mock_backend.open_url.return_value = ActionResult(
        success=True,
        action="open_url",
        session_id="m-sess",
        backend="mock_browser",
        observed_outcome="Navigated",
        verified=True,
    )

    reg = get_computer_registry()
    reg.register_backend("mock_browser", mock_backend)

    plan = executor.create_plan(
        goal="Test Mock Goal",
        backend_name="mock_browser",
        steps=[
            TaskStep(step_id="s1", description="Navigate", action="open_url", target="https://example.com"),
        ],
    )

    step = executor.execute_next_step(plan.task_id)
    assert step.status == "completed"
    assert step.verified is True

    # Next step should mark plan completed
    end_step = executor.execute_next_step(plan.task_id)
    assert end_step.status == "completed"

    updated_plan = store.load(plan.task_id)
    assert updated_plan.status == "completed"


def test_human_takeover_lifecycle(tmp_path):
    db_file = tmp_path / "test_takeover.db"
    store = TaskCheckpointStore(db_path=str(db_file))
    executor = BoundedTaskExecutor(checkpoint_store=store)

    plan = executor.create_plan(
        goal="Takeover Test",
        backend_name="windows_harness",
        steps=[TaskStep(step_id="s1", description="Open App", action="open_app")],
    )

    # Start human takeover
    paused = executor.pause_for_human_takeover(plan.task_id, reason="User solving CAPTCHA")
    assert paused.human_takeover_active is True
    assert paused.status == "waiting_human"

    # Attempting to execute step while under human takeover must be rejected
    with pytest.raises(ComputerControlError) as exc_info:
        executor.execute_next_step(plan.task_id)
    assert "human takeover" in str(exc_info.value)

    # Resume control
    resumed = executor.resume_from_human_takeover(plan.task_id)
    assert resumed.human_takeover_active is False
    assert resumed.status == "running"


# =============================================================================
# 7. AI Site Adapters & Rate Limit Detection
# =============================================================================
def test_ai_site_adapters_rate_limits():
    mock_backend = MagicMock()
    mock_backend.name = "mock_browser"

    # 1. ChatGPT adapter rate limit test
    chatgpt = ChatGPTAdapter(mock_backend)
    mock_backend.observe_screen.return_value = ObservationResult(
        session_id="s1",
        backend="mock_browser",
        text_content="You've reached your usage cap for GPT-4o. Try again after 3:45 PM.",
    )
    rl = chatgpt.detect_rate_limit("s1")
    assert rl is not None
    assert rl["is_limited"] is True
    assert "3:45 PM" in str(rl.get("reset_time"))

    # 2. Claude adapter rate limit test
    claude = ClaudeAdapter(mock_backend)
    mock_backend.observe_screen.return_value = ObservationResult(
        session_id="s1",
        backend="mock_browser",
        text_content="You are out of free messages until 4:00 AM.",
    )
    rl_c = claude.detect_rate_limit("s1")
    assert rl_c is not None
    assert rl_c["is_limited"] is True
    assert "4:00 AM" in str(rl_c.get("reset_time"))

    # 3. Gemini adapter rate limit test
    gemini = GeminiAdapter(mock_backend)
    mock_backend.observe_screen.return_value = ObservationResult(
        session_id="s1",
        backend="mock_browser",
        text_content="You've reached your daily limit. Please try again in 2 hours.",
    )
    rl_g = gemini.detect_rate_limit("s1")
    assert rl_g is not None
    assert rl_g["is_limited"] is True


def test_ai_site_code_block_extraction():
    chatgpt = ChatGPTAdapter(MagicMock())
    text = """
Here is the python function:
```python
def add(a, b):
    return a + b
```
And here is a bash command:
```bash
echo "Done"
```
"""
    blocks = chatgpt.extract_code_blocks(text)
    assert len(blocks) == 2
    assert blocks[0]["language"] == "python"
    assert "return a + b" in blocks[0]["code"]
    assert blocks[1]["language"] == "bash"
    assert 'echo "Done"' in blocks[1]["code"]


# =============================================================================
# 8. RateLimitsTracker & Alternatives
# =============================================================================
def test_rate_limits_tracker(tmp_path):
    cache_file = tmp_path / "rate_limits.json"
    tracker = RateLimitsTracker(cache_path=str(cache_file))

    assert tracker.is_available("openai", "gpt-4o") is True

    # Record limit hit with 5 second cooldown
    tracker.record_limit_hit("openai", "gpt-4o", cooldown_sec=5.0, reason="Cap reached")
    assert tracker.is_available("openai", "gpt-4o") is False

    cd = tracker.get_active_cooldown("openai", "gpt-4o")
    assert cd is not None
    assert cd.remaining_seconds > 0.0

    # Suggest alternative
    alt = tracker.suggest_alternative("openai", "gpt-4o")
    assert alt is not None
    assert alt["provider"] != "openai" or alt["model"] != "gpt-4o"

    # Verify persistence to JSON
    with open(cache_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert "cooldowns" in data
    assert "openai:gpt-4o" in data["cooldowns"]


# =============================================================================
# 9. QuotaAwareScheduler
# =============================================================================
def test_quota_aware_scheduler(tmp_path):
    cache_file = tmp_path / "rl.json"
    db_file = tmp_path / "tasks.db"
    tracker = RateLimitsTracker(cache_path=str(cache_file))
    store = TaskCheckpointStore(db_path=str(db_file))
    executor = BoundedTaskExecutor(checkpoint_store=store)

    plan = executor.create_plan(
        goal="Test Scheduled Task",
        backend_name="mock_browser",
        steps=[TaskStep(step_id="s1", description="Step 1", action="none")],
    )

    scheduler = QuotaAwareScheduler(rate_tracker=tracker, task_executor=executor)

    # 1. Enqueue task with rate limit active
    tracker.record_limit_hit("openai", "gpt-4o", cooldown_sec=60.0)
    scheduler.enqueue_task(plan.task_id, priority=1, provider="openai", model="gpt-4o")

    # Tick should delay task due to quota
    ran = scheduler.tick()
    assert ran is None
    status = scheduler.get_status()
    assert status["waiting_quota_count"] == 1


# =============================================================================
# 10. Context Memory & Revision Safety
# =============================================================================
def test_context_memory_revision_safety(tmp_path):
    mem = ComputerContextMemoryManager(workspace_root=str(tmp_path), artifacts_root=str(tmp_path / "artifacts"))

    # Write initial file
    f1 = mem.write_workspace_file_revision_safe("doc.txt", "Version 1")
    assert f1.content == "Version 1"

    # Concurrently modify file directly
    with open(f1.absolute_path, "w", encoding="utf-8") as f:
        f.write("Version 1 (Modified by user)")

    # Attempting to save with stale hash must fail
    with pytest.raises(ValueError) as exc_info:
        mem.write_workspace_file_revision_safe("doc.txt", "Version 2", expected_base_hash=f1.content_hash)
    assert "Revision conflict" in str(exc_info.value)

    # Save artifact
    art = mem.save_artifact("task-123", "screenshot", "screen.png", b"\x89PNG...")
    assert art.file_size_bytes > 0
    artifacts = mem.list_task_artifacts("task-123")
    assert len(artifacts) == 1
    assert artifacts[0]["filename"] == "screen.png"


# =============================================================================
# 11. FastAPI Endpoints (/api/computer/*)
# =============================================================================
def test_fastapi_computer_endpoints():
    client = TestClient(app)

    # 1. Backends list
    res = client.get("/api/computer/backends")
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True
    assert "browser_harness" in data["backends"]

    # 2. Rate limits status
    res_rl = client.get("/api/computer/rate_limits")
    assert res_rl.status_code == 200
    assert "queued_count" in res_rl.json()

    # 3. Emergency stop toggle
    res_stop = client.post("/api/computer/emergency_stop", json={"active": True})
    assert res_stop.status_code == 200
    assert res_stop.json()["emergency_stopped"] is True

    res_reset = client.post("/api/computer/emergency_stop", json={"active": False})
    assert res_reset.status_code == 200
    assert res_reset.json()["emergency_stopped"] is False

    # 4. Create task
    res_task = client.post(
        "/api/computer/tasks",
        json={
            "goal": "Verify website title",
            "backend": "mock_browser",
            "steps": [{"id": "st-1", "description": "Open", "action": "open_url", "target": "https://example.com"}],
        },
    )
    assert res_task.status_code == 200
    task_id = res_task.json()["task_id"]

    # 5. Get task
    res_get = client.get(f"/api/computer/tasks/{task_id}")
    assert res_get.status_code == 200
    assert res_get.json()["task_id"] == task_id

    # 6. Human takeover toggle
    res_to = client.post(f"/api/computer/tasks/{task_id}/takeover")
    assert res_to.status_code == 200
    assert res_to.json()["human_takeover_active"] is True

    res_res = client.post(f"/api/computer/tasks/{task_id}/resume")
    assert res_res.status_code == 200
    assert res_res.json()["human_takeover_active"] is False
