"""Comprehensive integration and unit test suite for OS Browser AI Agent.

Covers all 14 required controlled browser execution scenarios:
1. Open a page and verify its title and URL.
2. Search for a known phrase on a local test page.
3. Click a button and verify the page changes.
4. Fill a form and verify the field values.
5. Handle a delayed element.
6. Recover from a navigation timeout.
7. Reject malformed model tool calls.
8. Handle a missing model or unavailable browser.
9. Pause immediately when the human takes control.
10. Resume only through the permitted handoff.
11. Prevent unapproved external writes.
12. Mark a task incomplete when its success criteria are not met.
13. Preserve task progress across UI refresh.
14. Verify that the visible browser and agent controller use the same session.
"""
from __future__ import annotations

import http.server
import json
import socketserver
import threading
import time
from typing import Any, Dict, List
from unittest.mock import AsyncMock, MagicMock, patch
from urllib.parse import parse_qs, urlparse

import pytest

from server.computer.arbiter import ControlState, get_arbiter_registry
from server.computer.backends.browser_harness import BrowserHarnessBackend
from server.computer.browser_agent import (
    AssertionCriterion,
    BrowserAgentEngine,
    BrowserToolRegistry,
    DeterministicSemanticPlanner,
    GoalAnalyzer,
    GoalDecomposition,
    LLMBrowserPlanner,
)
from server.computer.interface import (
    ActionResult,
    ObservationResult,
    SafetyGateTriggeredError,
    SessionNotFoundError,
)
from server.computer.registry import get_computer_registry
from server.computer.safety import ActionRiskLevel, get_computer_safety_guard
from server.computer.task_loop import (
    TaskCheckpointStore,
    TaskPlan,
    TaskStep,
    get_bounded_task_executor,
)
from server.llm.base import ChatChunk, LLMClient, Message


# =============================================================================
# Local Test HTTP Server with Deterministic Fixtures
# =============================================================================

class MockWebHandler(http.server.BaseHTTPRequestHandler):
    """Local test web server simulating search, forms, buttons, and delayed elements."""

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()

        if path == "/":
            html = """
            <!DOCTYPE html>
            <html>
            <head><title>OS Test Home</title></head>
            <body>
                <h1>OS Search Engine</h1>
                <form action="/search" method="get">
                    <input type="text" name="q" placeholder="Search the web" id="search-box" />
                    <button type="submit" id="search-btn">Search</button>
                </form>
                <div id="nav-links">
                    <a href="/button_page" id="btn-page-link">Go to Button Page</a>
                    <a href="/form_page" id="form-page-link">Go to Form Page</a>
                    <a href="/delayed_page" id="delayed-page-link">Go to Delayed Page</a>
                </div>
            </body>
            </html>
            """
            self.wfile.write(html.encode("utf-8"))

        elif path == "/search":
            query = params.get("q", [""])[0]
            html = f"""
            <!DOCTYPE html>
            <html>
            <head><title>Search Results for {query}</title></head>
            <body>
                <h1>Search Results</h1>
                <p>Results for <b>{query}</b></p>
                <ul>
                    <li><a href="/target" id="fern-link">Fern Official Channel - YouTube</a></li>
                    <li><a href="/other">Unrelated Tech Page</a></li>
                </ul>
            </body>
            </html>
            """
            self.wfile.write(html.encode("utf-8"))

        elif path == "/target":
            html = """
            <!DOCTYPE html>
            <html>
            <head><title>Fern Official Channel - AI Research</title></head>
            <body>
                <h1>Fern Official Channel</h1>
                <p>Welcome to Fern AI research channel. Latest videos on agentic AI.</p>
            </body>
            </html>
            """
            self.wfile.write(html.encode("utf-8"))

        elif path == "/button_page":
            html = """
            <!DOCTYPE html>
            <html>
            <head><title>Button Interaction Page</title></head>
            <body>
                <h1 id="status-header">Initial State</h1>
                <button id="action-button" onclick="document.getElementById('status-header').innerText = 'Button Clicked Successfully'">
                    Click Me
                </button>
                <a href="/target" id="navigate-button">Proceed to Target</a>
            </body>
            </html>
            """
            self.wfile.write(html.encode("utf-8"))

        elif path == "/form_page":
            html = """
            <!DOCTYPE html>
            <html>
            <head><title>User Profile Form</title></head>
            <body>
                <h1>Profile Editor</h1>
                <form action="/target" method="get">
                    <label>Username: <input type="text" id="username" name="username" value="" /></label>
                    <label>Email: <input type="text" id="email" name="email" value="" /></label>
                    <button type="submit" id="save-btn">Save Profile</button>
                </form>
            </body>
            </html>
            """
            self.wfile.write(html.encode("utf-8"))

        elif path == "/delayed_page":
            html = """
            <!DOCTYPE html>
            <html>
            <head><title>Delayed Content Page</title></head>
            <body>
                <h1>Loading Page</h1>
                <div id="container">Waiting...</div>
                <script>
                    setTimeout(() => {
                        const el = document.createElement('div');
                        el.id = 'delayed-content';
                        el.innerText = 'Delayed Content Rendered';
                        document.getElementById('container').appendChild(el);
                    }, 400);
                </script>
            </body>
            </html>
            """
            self.wfile.write(html.encode("utf-8"))

    def log_message(self, format, *args):
        pass  # Quiet logging during tests


@pytest.fixture(scope="module")
def local_web_server():
    """Spin up lightweight local HTTP test server on an ephemeral port."""
    server = socketserver.TCPServer(("127.0.0.1", 0), MockWebHandler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{port}"
    server.shutdown()
    server.server_close()


# =============================================================================
# 1. Open a page and verify its title and URL
# =============================================================================

def test_scenario_1_open_page_verify_title_and_url(local_web_server):
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")
    session_id = f"test-sc1-{int(time.time()*1000)}"
    backend.start_session({"session_id": session_id, "headless": True, "initial_url": local_web_server})

    try:
        res = backend.open_url(session_id, f"{local_web_server}/target")
        assert res.success is True
        assert res.verified is True

        obs = backend.inspect_page(session_id)
        assert "/target" in obs.url
        assert "Fern Official Channel" in obs.title
    finally:
        backend.close_session(session_id)


# =============================================================================
# 2. Search for a known phrase on a local test page
# =============================================================================

def test_scenario_2_search_known_phrase(local_web_server):
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")
    session_id = f"test-sc2-{int(time.time()*1000)}"
    backend.start_session({"session_id": session_id, "headless": True, "initial_url": local_web_server})

    try:
        # Fill search box and submit
        res = backend.fill_and_submit(session_id, "#search-box", "agentic intelligence", press_enter=True)
        assert res.success is True

        # Wait for results page
        obs = backend.inspect_page(session_id)
        assert "/search" in obs.url
        assert "Search Results for agentic intelligence" in obs.title
    finally:
        backend.close_session(session_id)


# =============================================================================
# 3. Click a button and verify the page changes
# =============================================================================

def test_scenario_3_click_button_verify_page_changes(local_web_server):
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")
    session_id = f"test-sc3-{int(time.time()*1000)}"
    backend.start_session({"session_id": session_id, "headless": True, "initial_url": f"{local_web_server}/button_page"})

    try:
        # Click button that updates the DOM header
        res = backend.click_element(session_id, "#action-button")
        assert res.success is True

        obs = backend.inspect_page(session_id)
        assert "Button Clicked Successfully" in obs.text_content
    finally:
        backend.close_session(session_id)


# =============================================================================
# 4. Fill a form and verify the field values
# =============================================================================

def test_scenario_4_fill_form_verify_field_values(local_web_server):
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")
    session_id = f"test-sc4-{int(time.time()*1000)}"
    backend.start_session({"session_id": session_id, "headless": True, "initial_url": f"{local_web_server}/form_page"})

    try:
        # Type into username and email fields
        res1 = backend.type_text(session_id, "saisankeerth", target="#username")
        res2 = backend.type_text(session_id, "sai@example.com", target="#email")
        assert res1.success is True
        assert res2.success is True

        # Read back values safely on dedicated worker thread
        def _read_values():
            p = backend._pages.get(session_id)
            return p.locator("#username").input_value(), p.locator("#email").input_value()

        val1, val2 = backend._run_worker(_read_values)
        assert val1 == "saisankeerth"
        assert val2 == "sai@example.com"
    finally:
        backend.close_session(session_id)


# =============================================================================
# 5. Handle a delayed element
# =============================================================================

def test_scenario_5_handle_delayed_element(local_web_server):
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")
    session_id = f"test-sc5-{int(time.time()*1000)}"
    backend.start_session({"session_id": session_id, "headless": True, "initial_url": f"{local_web_server}/delayed_page"})

    try:
        # Element #delayed-content appears after 400ms. wait_for handles it deterministically.
        res = backend.wait_for(session_id, "#delayed-content", timeout_ms=3000)
        assert res.success is True
        assert res.verified is True

        obs = backend.inspect_page(session_id)
        assert "Delayed Content Rendered" in obs.text_content
    finally:
        backend.close_session(session_id)


# =============================================================================
# 6. Recover from a navigation timeout / unreachable host
# =============================================================================

def test_scenario_6_recover_from_navigation_timeout():
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")
    session_id = f"test-sc6-{int(time.time()*1000)}"
    backend.start_session({"session_id": session_id, "headless": True, "initial_url": "about:blank"})

    try:
        # Navigate to a non-existent port that fails to connect
        res = backend.open_url(session_id, "http://127.0.0.1:59999/unreachable")
        # Agent backend handles error cleanly without crashing
        assert res.success is False
        assert "Navigation failed" in res.observed_outcome
    finally:
        backend.close_session(session_id)


# =============================================================================
# 7. Reject malformed model tool calls
# =============================================================================

def test_scenario_7_reject_malformed_model_tool_calls():
    # 1. Unknown tool
    valid, err = BrowserToolRegistry.validate_tool_call("destroy_database", {})
    assert valid is False
    assert "Unknown browser tool" in err

    # 2. Missing required target
    valid, err = BrowserToolRegistry.validate_tool_call("click_element", {})
    assert valid is False
    assert "Missing required parameter 'target'" in err

    # 3. Missing required URL
    valid, err = BrowserToolRegistry.validate_tool_call("navigate", {"url": ""})
    assert valid is False
    assert "Missing required parameter 'url'" in err


# =============================================================================
# 8. Handle missing model or unavailable browser
# =============================================================================

def test_scenario_8_missing_model_or_unavailable_browser():
    import asyncio
    # 1. Missing / offline model
    class OfflineLLMClient(LLMClient):
        name = "offline_client"
        async def health(self): return False
        async def chat_stream(self, messages, **kwargs):
            if False: yield ChatChunk("")

    planner = LLMBrowserPlanner(OfflineLLMClient())
    is_available = asyncio.run(planner.is_available())
    assert is_available is False

    obs = ObservationResult(session_id="s1", backend="browser_harness", url="https://example.com")
    action = asyncio.run(planner.plan_step("search for docs", obs, []))
    # Safely returns None, letting engine use deterministic semantic fallback
    assert action is None

    # 2. Unavailable / closed browser session
    backend = BrowserHarnessBackend()
    with pytest.raises(SessionNotFoundError):
        backend.open_url("non_existent_session_id", "https://example.com")


# =============================================================================
# 9. Pause immediately when the human takes control
# =============================================================================

def test_scenario_9_pause_immediately_when_human_takes_control():
    session_id = f"test-sc9-{int(time.time()*1000)}"
    arbiter = get_arbiter_registry().get_or_create(session_id)
    arbiter.assign_task("task-sc9", "Autonomous research")
    arbiter.start_task("task-sc9")
    assert arbiter.state == ControlState.AI_WORKING

    # Human moves mouse or presses a key
    paused, reason = arbiter.on_human_interaction("mouse")
    assert paused is True
    assert arbiter.state == ControlState.AI_PAUSED
    assert "Human mouse interaction detected" in reason


# =============================================================================
# 10. Resume only through the permitted handoff
# =============================================================================

def test_scenario_10_resume_only_through_permitted_handoff():
    session_id = f"test-sc10-{int(time.time()*1000)}"
    arbiter = get_arbiter_registry().get_or_create(session_id)
    arbiter.assign_task("task-sc10", "Autonomous research")
    arbiter.start_task("task-sc10")
    arbiter.pause_ai("User paused")
    assert arbiter.state == ControlState.AI_PAUSED

    # Explicit handoff resume
    resumed = arbiter.resume_ai()
    assert resumed is True
    assert arbiter.state == ControlState.AI_WORKING
    assert arbiter.active_task.status == "running"


# =============================================================================
# 11. Prevent unapproved external writes
# =============================================================================

def test_scenario_11_prevent_unapproved_external_writes():
    safety = get_computer_safety_guard()
    session_id = "test-sc11"

    # Action targeting sensitive keyword 'delete' or 'purchase' must trigger gate
    with pytest.raises(SafetyGateTriggeredError) as exc_info:
        safety.validate_action(
            session_id=session_id,
            backend="browser_harness",
            action="click_element",
            target="button#delete-account",
            payload={"action": "delete"},
        )
    ticket_id = exc_info.value.details.get("ticket_id")
    assert ticket_id is not None

    # Verify action remains blocked until ticket resolution
    pending = safety.get_pending_approvals()
    assert any(t.ticket_id == ticket_id for t in pending)


# =============================================================================
# 12. Mark a task incomplete when its success criteria are not met
# =============================================================================

def test_scenario_12_mark_task_incomplete_when_criteria_unmet():
    dec = GoalDecomposition(
        goal="find deep learning papers on arxiv",
        intent="search",
        start_url="https://arxiv.org",
        assertions=[
            AssertionCriterion("url_contains", "arxiv.org/abs", "Paper abstract page reached"),
            AssertionCriterion("text_present", "Transformers", "Contains Transformers"),
        ],
    )

    # Observation that fails criteria (still on home page, no abstract)
    unmet_obs = ObservationResult(
        session_id="s1",
        backend="browser_harness",
        url="https://arxiv.org/",
        title="arXiv.org e-Print archive",
        text_content="Welcome to arXiv.",
    )

    satisfied, reason = dec.is_satisfied(unmet_obs)
    assert satisfied is False
    assert "Missing criteria" in reason


# =============================================================================
# 13. Preserve task progress across UI refresh
# =============================================================================

def test_scenario_13_preserve_task_progress_across_ui_refresh():
    store = TaskCheckpointStore()
    task_id = f"ctask-persist-{int(time.time()*1000)}"

    plan = TaskPlan(
        task_id=task_id,
        goal="Scrape research metrics",
        backend_name="browser_harness",
        session_id="sess-persisted",
        status="running",
        current_step_index=1,
        steps=[
            TaskStep(step_id="step-1", description="Open URL", action="navigate", status="completed", verified=True, outcome="Navigated"),
            TaskStep(step_id="step-2", description="Inspect DOM", action="inspect_page", status="running"),
        ],
    )
    store.save(plan)

    # Simulate UI refresh: re-load from SQLite database
    reloaded = store.load(task_id)
    assert reloaded is not None
    assert reloaded.task_id == task_id
    assert reloaded.status == "running"
    assert reloaded.current_step_index == 1
    assert len(reloaded.steps) == 2
    assert reloaded.steps[0].status == "completed"
    assert reloaded.steps[0].verified is True


# =============================================================================
# 14. Verify that visible browser and agent controller use the same session
# =============================================================================

def test_scenario_14_visible_browser_and_agent_share_session(local_web_server):
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")

    # Start the visible browser session
    shared_session_id = f"shared-sess-{int(time.time()*1000)}"
    backend.start_session({"session_id": shared_session_id, "headless": True, "initial_url": local_web_server})

    try:
        # Initialize engine bound to the EXACT same session ID
        engine = BrowserAgentEngine(
            session_id=shared_session_id,
            goal="Test session identity",
            backend_name="browser_harness",
        )
        plan = engine.initialize_plan()

        # Check arbiter, plan, and backend all reference the same session ID
        assert engine.session_id == shared_session_id
        assert plan.session_id == shared_session_id
        assert engine.arbiter.session_id == shared_session_id

        # Verify executing an action through engine modifies the page in that exact session
        BrowserToolRegistry.execute_tool(
            tool_name="navigate",
            args={"url": f"{local_web_server}/target"},
            backend=backend,
            session_id=shared_session_id,
            safety_guard=engine.safety,
        )

        obs = backend.inspect_page(shared_session_id)
        assert "/target" in obs.url
    finally:
        backend.close_session(shared_session_id)


# =============================================================================
# Full End-to-End Search & Verification Loop Test
# =============================================================================

def test_browser_agent_live_e2e_search_and_verify(local_web_server):
    """E2E verification of autonomous loop from instruction to verified completion."""
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")

    session_id = f"e2e-agent-{int(time.time()*1000)}"
    backend.start_session({"session_id": session_id, "headless": True, "initial_url": local_web_server})

    try:
        goal = f"open {local_web_server} and search for fern"
        engine = BrowserAgentEngine(
            session_id=session_id,
            goal=goal,
            backend_name="browser_harness",
            max_steps=8,
        )

        engine.decomposition.start_url = local_web_server
        engine.decomposition.search_query = "fern"
        engine.decomposition.target_keywords = ["fern"]
        engine.decomposition.assertions = [
            AssertionCriterion("url_contains", "/target", "Target page reached"),
            AssertionCriterion("title_contains", "Fern", "Fern in page title"),
        ]

        # Run agent loop synchronously
        result = engine.run_sync()

        # Verify outcome
        assert result["status"] == "completed"
        assert engine.plan.status == "completed"
        assert len(engine.plan.steps) >= 2

        # Verify final page in real browser
        obs_final = backend.inspect_page(session_id)
        assert "/target" in obs_final.url
        assert "Fern" in obs_final.title
        assert "Fern Official Channel" in obs_final.text_content

        # Verify SQLite checkpoint persisted
        checkpoint = engine.checkpoints.load(engine.plan.task_id)
        assert checkpoint is not None
        assert checkpoint.status == "completed"

        # Verify Arbiter transitioned back to human control
        arbiter = get_arbiter_registry().get_or_create(session_id)
        assert arbiter.state == ControlState.HUMAN_CONTROL
        assert arbiter.ai_cursor.visible is False

    finally:
        backend.close_session(session_id)
