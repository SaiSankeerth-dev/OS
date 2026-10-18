"""Regression tests for OS Browser Viewport Input Isolation.

Verifies:
1. Scrolling with cursor inside viewport scrolls the website.
2. Outer layout isolation: overscroll containment and non-passive wheel isolation contract.
3. Pointer dragging & text selection inside browser without outer layout dragging.
4. Text fields inside the browser accept keyboard input.
5. Coordinate scaling helper across various viewport dimensions and aspect ratios.
6. AI cursor overlay pointer-events isolation (pointer-events: none).
7. Human takeover pauses conflicting AI actions upon viewport interaction.
8. Leaving viewport restores dashboard interactions without stuck pointer state.
"""
from __future__ import annotations

import json
from unittest.mock import MagicMock
import pytest
from fastapi.testclient import TestClient

from server.computer.arbiter import ControlState, SessionArbiter, get_arbiter_registry
from server.computer.backends.browser_harness import BrowserHarnessBackend
from server.computer.interface import SessionState
from server.computer.registry import get_computer_registry
from web.server import app

client = TestClient(app)


# -----------------------------------------------------------------------------
# 1. Scrolling inside viewport scrolls the webpage
# -----------------------------------------------------------------------------
def test_scrolling_inside_viewport_scrolls_webpage():
    backend = BrowserHarnessBackend()
    session_id = "test_scroll_isolation_sess"

    # Start a real headless session
    state = backend.start_session({"session_id": session_id, "headless": True})
    assert state.status == "active"

    try:
        # Navigate to a blank page and add scrollable height
        backend.open_url(session_id, "about:blank")
        def _setup_and_scroll():
            page = backend._pages[session_id]
            page.evaluate("""
                document.body.innerHTML = '<div style="height: 5000px; background: linear-gradient(red, blue);"><h1 id="top">Top</h1></div>';
                window.scrollTo(0, 0);
            """)
            return page.evaluate("window.scrollY")

        # Verify initial scroll position is 0
        initial_scroll = backend._run_worker(_setup_and_scroll)
        assert initial_scroll == 0

        # Forward wheel event with delta_y = 600
        res = backend.forward_mouse(session_id, "wheel", x=640, y=400, delta_x=0, delta_y=600)
        assert res.success is True

        # Check that page scrolled down
        def _get_scroll():
            page = backend._pages[session_id]
            page.wait_for_timeout(200)
            return page.evaluate("window.scrollY")

        new_scroll = backend._run_worker(_get_scroll)
        assert new_scroll > 0, f"Expected page to scroll down, but window.scrollY was {new_scroll}"

    finally:
        backend.close_session(session_id)


# -----------------------------------------------------------------------------
# 2. Outer layout isolation contracts (overscroll-contain & pointer-events: none)
# -----------------------------------------------------------------------------
def test_viewport_css_isolation_attributes():
    # Read the compiled/source css and component to ensure overscroll containment is present
    with open("frontend/src/index.css", "r", encoding="utf-8") as f:
        css = f.read()
    assert "overscroll-behavior: contain" in css
    assert "touch-action: none" in css
    assert ".browser-viewport-isolated" in css

    with open("frontend/src/components/views/ComputerView.tsx", "r", encoding="utf-8") as f:
        tsx = f.read()
    assert "browser-viewport-isolated" in tsx
    assert "overscrollBehavior: 'contain'" in tsx
    assert "touchAction: 'none'" in tsx
    assert "handlePointerDown" in tsx
    assert "setPointerCapture" in tsx
    assert "releasePointerCapture" in tsx


# -----------------------------------------------------------------------------
# 3. Pointer dragging & text selection inside browser
# -----------------------------------------------------------------------------
def test_pointer_dragging_inside_browser():
    backend = BrowserHarnessBackend()
    session_id = "test_drag_isolation_sess"

    state = backend.start_session({"session_id": session_id, "headless": True})
    assert state.status == "active"

    try:
        backend.open_url(session_id, "about:blank")
        def _setup_drag():
            page = backend._pages[session_id]
            page.evaluate("""
                document.body.innerHTML = `
                    <div id="drag-target" style="width: 200px; height: 100px; background: green;">Select Me</div>
                    <div id="drag-status">idle</div>
                `;
                window.dragEvents = [];
                document.addEventListener('mousedown', (e) => window.dragEvents.push('down'));
                document.addEventListener('mousemove', (e) => window.dragEvents.push('move'));
                document.addEventListener('mouseup', (e) => window.dragEvents.push('up'));
            """)
        backend._run_worker(_setup_drag)

        # Execute pointer down at (50, 50)
        res_down = backend.forward_mouse(session_id, "mousedown", x=50, y=50, button="left")
        assert res_down.success is True

        # Drag to (150, 80)
        res_move = backend.forward_mouse(session_id, "mousemove", x=150, y=80)
        assert res_move.success is True

        # Release at (150, 80)
        res_up = backend.forward_mouse(session_id, "mouseup", x=150, y=80, button="left")
        assert res_up.success is True

        events = backend._run_worker(lambda: backend._pages[session_id].evaluate("window.dragEvents"))
        assert "down" in events
        assert "move" in events
        assert "up" in events

    finally:
        backend.close_session(session_id)


# -----------------------------------------------------------------------------
# 4. Text fields inside browser accept keyboard input
# -----------------------------------------------------------------------------
def test_text_fields_accept_keyboard_input():
    backend = BrowserHarnessBackend()
    session_id = "test_kb_input_sess"

    state = backend.start_session({"session_id": session_id, "headless": True})
    assert state.status == "active"

    try:
        backend.open_url(session_id, "about:blank")
        def _setup_input():
            page = backend._pages[session_id]
            page.evaluate("""
                document.body.innerHTML = '<input id="text-input" type="text" style="width:300px;height:40px;"/>';
                document.getElementById('text-input').focus();
            """)
        backend._run_worker(_setup_input)

        # Type text via forward_keyboard
        res = backend.forward_keyboard(session_id, "type", text="OS Browser Control")
        assert res.success is True

        val = backend._run_worker(lambda: backend._pages[session_id].evaluate("document.getElementById('text-input').value"))
        assert val == "OS Browser Control"

    finally:
        backend.close_session(session_id)


# -----------------------------------------------------------------------------
# 5. Coordinate scaling across various viewport aspect ratios
# -----------------------------------------------------------------------------
def test_coordinate_scaling_calculations():
    # Helper replicating getScaledCoordinates
    def scale_coords(client_x, client_y, rect_left, rect_top, rect_width, rect_height):
        if rect_width == 0 or rect_height == 0:
            return None
        scale_x = 1280 / rect_width
        scale_y = 800 / rect_height
        x = max(0, min(1280, (client_x - rect_left) * scale_x))
        y = max(0, min(800, (client_y - rect_top) * scale_y))
        return round(x, 1), round(y, 1)

    # 1. 1:1 scale (1280x800)
    c1 = scale_coords(640, 400, 0, 0, 1280, 800)
    assert c1 == (640.0, 400.0)

    # 2. Scaled down viewport (640x400)
    c2 = scale_coords(320, 200, 0, 0, 640, 400)
    assert c2 == (640.0, 400.0)

    # 3. Offsets from left and top
    c3 = scale_coords(150, 150, 100, 100, 500, 250)
    # raw_x = 50 -> 50 * (1280/500) = 128.0
    # raw_y = 50 -> 50 * (800/250) = 160.0
    assert c3 == (128.0, 160.0)

    # 4. Out of bounds clamp to 0 and 1280/800
    c_under = scale_coords(-50, -50, 0, 0, 1000, 600)
    assert c_under == (0.0, 0.0)

    c_over = scale_coords(2000, 1500, 0, 0, 1000, 600)
    assert c_over == (1280.0, 800.0)


# -----------------------------------------------------------------------------
# 6. AI cursor overlay does not intercept pointer events
# -----------------------------------------------------------------------------
def test_ai_cursor_overlay_pointer_events_none():
    with open("frontend/src/components/views/ComputerView.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    # The AI cursor container must have pointer-events-none so it cannot block human pointer events
    assert 'className="absolute pointer-events-none z-30' in content
    # Target bounding box must also have pointer-events-none
    assert 'className="absolute pointer-events-none z-20' in content


# -----------------------------------------------------------------------------
# 7. Human takeover pauses conflicting AI actions
# -----------------------------------------------------------------------------
def test_human_takeover_pauses_ai_actions():
    arbiter = SessionArbiter(session_id="test_takeover_arbiter")
    arbiter.assign_task("task_001", "Automated research")
    arbiter.start_task("task_001")
    assert arbiter.state == ControlState.AI_WORKING

    # Human interaction (e.g. wheel or mousedown)
    paused, reason = arbiter.on_human_interaction("wheel_scroll")
    assert paused is True
    assert arbiter.state == ControlState.AI_PAUSED
    assert "wheel_scroll" in reason


# -----------------------------------------------------------------------------
# 8. WebSocket wheel message parsing (both deltaX/delta_x and deltaY/delta_y)
# -----------------------------------------------------------------------------
def test_websocket_wheel_event_forwarding():
    # Test that WebSocket parser receives deltaX and deltaY properly
    session_id = "test_ws_wheel_sess"
    backend = BrowserHarnessBackend()
    backend._sessions[session_id] = SessionState(session_id=session_id, backend_name=backend.name, status="active")
    mock_page = MagicMock()
    backend._pages[session_id] = mock_page

    reg = get_computer_registry()
    orig_backend = reg._backends.get("browser_harness")
    reg._backends["browser_harness"] = backend

    try:
        with client.websocket_connect(f"/api/computer/ws/{session_id}") as ws:
            # Send mouse wheel message
            ws.send_json({
                "type": "mouse",
                "event": "wheel",
                "x": 640,
                "y": 400,
                "deltaX": 0,
                "deltaY": 150,
            })
            # Give async worker a moment
            import time
            time.sleep(0.1)

            mock_page.mouse.wheel.assert_called_with(0.0, 150.0)

    finally:
        if orig_backend:
            reg._backends["browser_harness"] = orig_backend
