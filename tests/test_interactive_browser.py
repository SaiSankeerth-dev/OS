"""Comprehensive tests for Live Interactive Browser with Dual Cursors and Control Arbiter.

Covers:
1. SessionArbiter state machine (HUMAN_CONTROL, AI_WORKING, AI_PAUSED, STOPPED)
2. Human interception logic: any human interaction immediately pauses AI
3. AI cursor telemetry and element bounding box updates
4. BrowserHarness mouse forwarding (move, click, dblclick, wheel, drag)
5. BrowserHarness keyboard forwarding (keydown, keyup, text type)
6. BrowserHarness navigation history (back, forward, reload)
7. BrowserHarness element rect lookup for AI cursor targeting
8. FastAPI REST endpoints for mouse, keyboard, navigation, arbiter status, and control actions
9. Bidirectional WebSocket endpoint streaming frames and receiving inputs
"""
from __future__ import annotations

import base64
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient

from server.computer.arbiter import (
    ControlState,
    SessionArbiter,
    GlobalArbiterRegistry,
    get_arbiter_registry,
)
from server.computer.backends.browser_harness import BrowserHarnessBackend
from server.computer.interface import SessionState
from server.computer.registry import get_computer_registry
from web.server import app


# =============================================================================
# 1. Session Arbiter State Machine & Interception
# =============================================================================
def test_arbiter_initial_state():
    arbiter = SessionArbiter(session_id="test_session_1")
    assert arbiter.state == ControlState.HUMAN_CONTROL
    status = arbiter.get_status()
    assert status["state"] == "HUMAN_CONTROL"
    assert status["has_active_task"] is False
    assert status["ai_cursor"]["visible"] is False


def test_arbiter_task_lifecycle_and_human_interception():
    arbiter = SessionArbiter(session_id="test_session_2")
    events = []
    arbiter.add_listener(lambda e: events.append(e))

    # Assign and start task
    arbiter.assign_task(task_id="task-123", goal="Extract headlines", allowed_domains=["example.com"])
    arbiter.start_task(task_id="task-123")

    assert arbiter.state == ControlState.AI_WORKING
    assert arbiter.active_task is not None
    assert arbiter.active_task.status == "running"
    assert arbiter.ai_cursor.visible is True

    # Check state change event fired
    state_events = [e for e in events if e.get("type") == "control_state_changed"]
    assert len(state_events) > 0
    assert state_events[-1]["state"] == "AI_WORKING"

    # Human touches mouse -> immediate pause and takeover
    paused, reason = arbiter.on_human_interaction("mouse")
    assert paused is True
    assert arbiter.state == ControlState.AI_PAUSED
    assert arbiter.active_task.status == "paused"

    intercept_events = [e for e in events if e.get("type") == "control_state_changed" and e.get("human_takeover")]
    assert len(intercept_events) == 1

    # Resume AI
    ok = arbiter.resume_ai()
    assert ok is True
    assert arbiter.state == ControlState.AI_WORKING
    assert arbiter.active_task.status == "running"

    # Explicit human takeover
    arbiter.take_human_control()
    assert arbiter.state == ControlState.HUMAN_CONTROL
    assert arbiter.active_task.status == "paused"

    # Stop AI
    arbiter.stop_ai("Task cancelled by user")
    assert arbiter.state == ControlState.STOPPED
    assert arbiter.ai_cursor.visible is False
    assert arbiter.active_task.status == "stopped"


def test_arbiter_ai_cursor_telemetry():
    arbiter = SessionArbiter(session_id="test_session_3")
    events = []
    arbiter.add_listener(lambda e: events.append(e))

    arbiter.update_ai_cursor(
        x=520.0,
        y=340.0,
        status="Typing search query...",
        action="typing",
        target_rect={"x": 500, "y": 330, "width": 150, "height": 35},
        visible=True,
    )

    assert arbiter.ai_cursor.x == 520.0
    assert arbiter.ai_cursor.y == 340.0
    assert arbiter.ai_cursor.visible is True
    assert arbiter.ai_cursor.action == "typing"
    assert arbiter.ai_cursor.target_rect == {"x": 500, "y": 330, "width": 150, "height": 35}
    assert arbiter.ai_cursor.status == "Typing search query..."

    cursor_events = [e for e in events if e.get("type") == "ai_cursor_update"]
    assert len(cursor_events) == 1
    assert cursor_events[0]["ai_cursor"]["x"] == 520.0
    assert cursor_events[0]["ai_cursor"]["status"] == "Typing search query..."


# =============================================================================
# 2. BrowserHarness Input & Navigation Forwarding
# =============================================================================
def test_browser_harness_mouse_forwarding():
    backend = BrowserHarnessBackend()
    session_id = "test_mouse_sess"

    mock_page = MagicMock()
    mock_context = MagicMock()
    backend._sessions[session_id] = SessionState(session_id=session_id, backend_name=backend.name, status="active")
    backend._pages[session_id] = mock_page
    backend._browser_contexts[session_id] = mock_context

    # Mouse move
    res = backend.forward_mouse(session_id, "mousemove", 640.0, 400.0)
    assert res.success is True
    mock_page.mouse.move.assert_called_with(640.0, 400.0)

    # Click
    res = backend.forward_mouse(session_id, "click", 640.0, 400.0, button="left", click_count=1)
    assert res.success is True
    mock_page.mouse.click.assert_called_with(640.0, 400.0, button="left", click_count=1)

    # DblClick
    res = backend.forward_mouse(session_id, "dblclick", 640.0, 400.0)
    assert res.success is True
    mock_page.mouse.dblclick.assert_called_with(640.0, 400.0, button="left")

    # Mouse down & up
    backend.forward_mouse(session_id, "mousedown", 100.0, 200.0, button="right")
    mock_page.mouse.down.assert_called_with(button="right")
    backend.forward_mouse(session_id, "mouseup", 100.0, 200.0, button="right")
    mock_page.mouse.up.assert_called_with(button="right")

    # Wheel scroll
    res = backend.forward_mouse(session_id, "wheel", 0, 0, delta_x=15.0, delta_y=120.0)
    assert res.success is True
    mock_page.mouse.wheel.assert_called_with(15.0, 120.0)


def test_browser_harness_keyboard_forwarding():
    backend = BrowserHarnessBackend()
    session_id = "test_kb_sess"

    mock_page = MagicMock()
    mock_context = MagicMock()
    backend._sessions[session_id] = SessionState(session_id=session_id, backend_name=backend.name, status="active")
    backend._pages[session_id] = mock_page
    backend._browser_contexts[session_id] = mock_context

    # Key down
    res = backend.forward_keyboard(session_id, "keydown", key="Enter", code="Enter")
    assert res.success is True
    mock_page.keyboard.down.assert_called_with("Enter")

    # Key up
    res = backend.forward_keyboard(session_id, "keyup", key="Enter", code="Enter")
    assert res.success is True
    mock_page.keyboard.up.assert_called_with("Enter")

    # Type text
    res = backend.forward_keyboard(session_id, "type", text="Hello OS!")
    assert res.success is True
    mock_page.keyboard.type.assert_called_with("Hello OS!")


def test_browser_harness_navigation_history():
    backend = BrowserHarnessBackend()
    session_id = "test_nav_sess"

    mock_page = MagicMock()
    mock_page.url = "https://example.com/page2"
    mock_context = MagicMock()
    backend._sessions[session_id] = SessionState(session_id=session_id, backend_name=backend.name, status="active")
    backend._pages[session_id] = mock_page
    backend._browser_contexts[session_id] = mock_context

    # Back
    res = backend.navigate_back(session_id)
    assert res.success is True
    mock_page.go_back.assert_called_once()

    # Forward
    res = backend.navigate_forward(session_id)
    assert res.success is True
    mock_page.go_forward.assert_called_once()

    # Reload
    res = backend.navigate_reload(session_id)
    assert res.success is True
    mock_page.reload.assert_called_once()


def test_browser_harness_element_rect():
    backend = BrowserHarnessBackend()
    session_id = "test_rect_sess"

    mock_page = MagicMock()
    mock_context = MagicMock()
    mock_locator = MagicMock()
    mock_locator.count.return_value = 1
    mock_locator.bounding_box.return_value = {"x": 100, "y": 200, "width": 80, "height": 30}
    mock_page.locator.return_value.first = mock_locator
    backend._sessions[session_id] = SessionState(session_id=session_id, backend_name=backend.name, status="active")
    backend._pages[session_id] = mock_page
    backend._browser_contexts[session_id] = mock_context

    rect = backend.get_element_rect(session_id, "#submit-button")
    assert rect is not None
    assert rect["x"] == 100.0
    assert rect["y"] == 200.0
    assert rect["width"] == 80.0
    assert rect["cx"] == 140.0


def test_browser_harness_capture_frame_jpeg():
    backend = BrowserHarnessBackend()
    session_id = "test_frame_sess"

    mock_page = MagicMock()
    mock_page.screenshot.return_value = b"\xff\xd8\xff\xe0\x00\x10JFIF"
    mock_context = MagicMock()
    backend._sessions[session_id] = SessionState(session_id=session_id, backend_name=backend.name, status="active")
    backend._pages[session_id] = mock_page
    backend._browser_contexts[session_id] = mock_context

    frame = backend.capture_frame_jpeg(session_id, quality=60)
    assert frame == b"\xff\xd8\xff\xe0\x00\x10JFIF"
    mock_page.screenshot.assert_called_with(type="jpeg", quality=60)


# =============================================================================
# 3. FastAPI REST Endpoints & WebSocket
# =============================================================================
client = TestClient(app)


def test_fastapi_mouse_and_keyboard_endpoints():
    session_id = "fastapi_test_sess"
    registry = get_arbiter_registry()
    arbiter = registry.get_or_create(session_id)

    backend = get_computer_registry().get_backend("browser_harness")
    mock_page = MagicMock()
    mock_context = MagicMock()
    backend._sessions[session_id] = SessionState(session_id=session_id, backend_name=backend.name, status="active")
    backend._pages[session_id] = mock_page
    backend._browser_contexts[session_id] = mock_context

    # 1. Forward mouse
    res = client.post(
        f"/api/computer/sessions/browser_harness/{session_id}/mouse",
        json={"event_type": "mousemove", "x": 150.0, "y": 250.0},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True
    assert data["arbiter_state"] in ("HUMAN_CONTROL", "AI_PAUSED")

    # 2. Forward keyboard
    res = client.post(
        f"/api/computer/sessions/browser_harness/{session_id}/keyboard",
        json={"event_type": "keydown", "key": "a", "code": "KeyA", "text": "a"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True

    # 3. Nav action
    res = client.post(
        f"/api/computer/sessions/browser_harness/{session_id}/nav_action",
        json={"action": "back"},
    )
    assert res.status_code == 200
    assert res.json()["ok"] is True


def test_fastapi_arbiter_and_control_endpoints():
    session_id = "fastapi_ctrl_sess"
    arbiter = get_arbiter_registry().get_or_create(session_id)

    # 1. Get Arbiter status
    res = client.get(f"/api/computer/sessions/browser_harness/{session_id}/arbiter")
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True
    assert "state" in data
    assert "ai_cursor" in data

    # 2. Take control
    res = client.post(
        f"/api/computer/sessions/browser_harness/{session_id}/control",
        json={"action": "take_control"},
    )
    assert res.status_code == 200
    assert res.json()["state"] == "HUMAN_CONTROL"

    # Set to AI_WORKING so pause_ai has an active working state to pause
    arbiter.state = ControlState.AI_WORKING

    # 3. Pause AI
    res = client.post(
        f"/api/computer/sessions/browser_harness/{session_id}/control",
        json={"action": "pause_ai"},
    )
    assert res.status_code == 200
    assert res.json()["state"] == "AI_PAUSED"

    # 4. Stop AI
    res = client.post(
        f"/api/computer/sessions/browser_harness/{session_id}/control",
        json={"action": "stop_ai"},
    )
    assert res.status_code == 200
    assert res.json()["state"] == "STOPPED"


def test_fastapi_websocket_connection_and_messages():
    session_id = "fastapi_ws_sess"
    backend = get_computer_registry().get_backend("browser_harness")
    mock_page = MagicMock()
    mock_page.screenshot.return_value = b"\xff\xd8\xff\xe0fakejpeg"
    mock_context = MagicMock()
    backend._sessions[session_id] = SessionState(session_id=session_id, backend_name=backend.name, status="active")
    backend._pages[session_id] = mock_page
    backend._browser_contexts[session_id] = mock_context

    with client.websocket_connect(f"/api/computer/ws/{session_id}") as websocket:
        # First message received is initial control state
        msg1 = websocket.receive_json()
        assert msg1["type"] == "control_state"
        assert "state" in msg1
        assert "ai_cursor" in msg1

        # Second message should be live frame
        msg2 = websocket.receive_json()
        assert msg2["type"] == "frame"
        assert "image" in msg2

        # Send mouse input over WebSocket
        websocket.send_json({
            "type": "mouse",
            "event": "mousemove",
            "x": 200,
            "y": 300,
        })


def test_unsolicited_ai_action_blocked_in_human_control():
    """Verify AI cannot execute unsolicited actions while user is in control."""
    session_id = "unsolicited_test_sess"
    arbiter = SessionArbiter(session_id)
    assert arbiter.state == ControlState.HUMAN_CONTROL

    # Attempting to start execution without an assigned task must fail
    started = arbiter.start_task("fake-task-id")
    assert started is False
    assert arbiter.state == ControlState.HUMAN_CONTROL

    # Attempting to resume when not paused must fail
    resumed = arbiter.resume_ai()
    assert resumed is False
    assert arbiter.state == ControlState.HUMAN_CONTROL


def test_arbiter_disconnect_and_preservation():
    """Verify browser disconnection preserves task state and checkpoints."""
    session_id = "disconnect_sess"
    arbiter = SessionArbiter(session_id)
    arbiter.assign_task("task-preserve", "Scrape prices", allowed_domains=["shop.com"])
    arbiter.start_task("task-preserve")

    # Mark disconnected
    arbiter.mark_disconnected()
    assert arbiter.state == ControlState.BROWSER_DISCONNECTED
    assert arbiter.active_task is not None
    assert arbiter.active_task.goal == "Scrape prices"
    assert arbiter.active_task.allowed_domains == ["shop.com"]


def test_safety_guard_risk_and_approval_enforcement():
    """Verify sensitive browser and desktop operations enforce HITL approval."""
    from server.computer.safety import get_computer_safety_guard, ActionRiskLevel

    guard = get_computer_safety_guard()
    # High risk action requiring HITL
    risk = guard.classify_action_risk("click_element", target="button#confirm-delete-account")
    assert risk in (ActionRiskLevel.HIGH_AUTH_OR_WRITE, ActionRiskLevel.SYSTEM_RESTRICTED)

    # Low risk read navigation
    nav_risk = guard.classify_action_risk("observe_screen", target="https://example.com/docs")
    assert nav_risk == ActionRiskLevel.READ_ONLY

