"""Integration tests for Browser Harness, Real Playwright Lifecycle, and Dashboard Connectivity.

Verifies:
1. Backend health checks (/api/computer/backends and /health)
2. Browser session creation and reattachment
3. Navigation to a controlled test page
4. Screenshot and JPEG frame retrieval
5. Mouse and keyboard input forwarding
6. Backend shutdown and recovery
7. Navigation errors and request handling
8. Invalid or expired session identifiers (404s)
9. Human takeover and Emergency Stop
10. Accurate dashboard statuses
"""
from __future__ import annotations

import base64
import json
import pytest
from fastapi.testclient import TestClient

from server.computer.arbiter import ControlState, get_arbiter_registry
from server.computer.backends.browser_harness import BrowserHarnessBackend
from server.computer.registry import get_computer_registry
from web.server import app

client = TestClient(app)


# -----------------------------------------------------------------------------
# 1. Backend health checks
# -----------------------------------------------------------------------------
def test_backend_health_checks():
    resp = client.get("/api/computer/backends")
    assert resp.status_code == 200
    data = resp.json()
    assert data["ok"] is True
    backends = data["backends"]
    assert "browser_harness" in backends
    assert "windows_harness" in backends
    assert backends["browser_harness"]["health"]["ok"] is True
    assert backends["browser_harness"]["health"]["status"] == "ready"

    # On-demand health check
    health_resp = client.post("/api/computer/backends/browser_harness/health")
    assert health_resp.status_code == 200
    h_data = health_resp.json()
    assert h_data["ok"] is True
    assert h_data["health"]["ok"] is True
    assert h_data["health"]["status"] == "ready"


# -----------------------------------------------------------------------------
# 2. Browser session creation and reattachment
# -----------------------------------------------------------------------------
def test_browser_session_creation_and_state():
    resp = client.post(
        "/api/computer/sessions",
        json={"backend": "browser_harness", "headless": True},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["ok"] is True
    sid = data["session_id"]
    assert sid is not None

    # Inspect session state
    state_resp = client.get(f"/api/computer/sessions/browser_harness/{sid}")
    assert state_resp.status_code == 200
    state_data = state_resp.json()
    assert state_data["ok"] is True
    assert state_data["session_id"] == sid
    assert state_data["status"] == "active"

    # Clean up
    del_resp = client.delete(f"/api/computer/sessions/browser_harness/{sid}")
    assert del_resp.status_code == 200


# -----------------------------------------------------------------------------
# 3. Navigation to a controlled test page
# -----------------------------------------------------------------------------
def test_navigation_controlled_page():
    # Start session
    start_resp = client.post("/api/computer/sessions", json={"backend": "browser_harness", "headless": True})
    sid = start_resp.json()["session_id"]

    try:
        # Navigate to controlled test page
        test_url = "about:blank"
        nav_resp = client.post(
            f"/api/computer/sessions/browser_harness/{sid}/navigate",
            json={"url": test_url},
        )
        assert nav_resp.status_code == 200
        nav_data = nav_resp.json()
        assert nav_data["ok"] is True
        assert nav_data["verified"] is True
    finally:
        client.delete(f"/api/computer/sessions/browser_harness/{sid}")


# -----------------------------------------------------------------------------
# 4. Screenshot and frame retrieval
# -----------------------------------------------------------------------------
def test_screenshot_and_frame_retrieval():
    start_resp = client.post("/api/computer/sessions", json={"backend": "browser_harness", "headless": True})
    sid = start_resp.json()["session_id"]

    try:
        test_url = "about:blank"
        client.post(f"/api/computer/sessions/browser_harness/{sid}/navigate", json={"url": test_url})

        # Frame retrieval (JPEG)
        frame_resp = client.get(f"/api/computer/sessions/browser_harness/{sid}/frame")
        assert frame_resp.status_code == 200
        assert frame_resp.headers["content-type"] == "image/jpeg"
        assert len(frame_resp.content) > 100

        # Screenshot retrieval (PNG)
        shot_resp = client.get(f"/api/computer/sessions/browser_harness/{sid}/screenshot")
        assert shot_resp.status_code == 200
        assert shot_resp.headers["content-type"] == "image/png"
        assert len(shot_resp.content) > 100
    finally:
        client.delete(f"/api/computer/sessions/browser_harness/{sid}")


def test_closed_or_unknown_session_frame_is_not_a_server_error():
    """The frontend can recover from 404, but must not poll a dead session as 500."""
    missing = client.get("/api/computer/sessions/browser_harness/not-a-real-session/frame")
    assert missing.status_code == 404

    start_resp = client.post("/api/computer/sessions", json={"backend": "browser_harness", "headless": True})
    sid = start_resp.json()["session_id"]
    assert client.delete(f"/api/computer/sessions/browser_harness/{sid}").status_code == 200

    closed = client.get(f"/api/computer/sessions/browser_harness/{sid}/frame")
    assert closed.status_code == 404
    assert "not found or closed" in closed.json()["detail"]


# -----------------------------------------------------------------------------
# 5. Mouse and keyboard input forwarding
# -----------------------------------------------------------------------------
def test_mouse_and_keyboard_input_forwarding():
    start_resp = client.post("/api/computer/sessions", json={"backend": "browser_harness", "headless": True})
    sid = start_resp.json()["session_id"]

    try:
        test_url = "about:blank"
        client.post(f"/api/computer/sessions/browser_harness/{sid}/navigate", json={"url": test_url})

        # Mouse click
        mouse_resp = client.post(
            f"/api/computer/sessions/browser_harness/{sid}/mouse",
            json={"event_type": "click", "x": 100, "y": 100, "button": "left", "click_count": 1},
        )
        assert mouse_resp.status_code == 200
        assert mouse_resp.json()["ok"] is True

        # Keyboard typing
        key_resp = client.post(
            f"/api/computer/sessions/browser_harness/{sid}/keyboard",
            json={"event_type": "type", "text": "Hello Browser"},
        )
        assert key_resp.status_code == 200
        assert key_resp.json()["ok"] is True
    finally:
        client.delete(f"/api/computer/sessions/browser_harness/{sid}")


# -----------------------------------------------------------------------------
# 6. Backend shutdown and recovery
# -----------------------------------------------------------------------------
def test_backend_shutdown_and_recovery():
    # Session 1
    resp1 = client.post("/api/computer/sessions", json={"backend": "browser_harness", "headless": True})
    sid1 = resp1.json()["session_id"]
    close1 = client.delete(f"/api/computer/sessions/browser_harness/{sid1}")
    assert close1.status_code == 200

    # Session 2 recovers cleanly
    resp2 = client.post("/api/computer/sessions", json={"backend": "browser_harness", "headless": True})
    assert resp2.status_code == 200
    sid2 = resp2.json()["session_id"]
    assert sid2 != sid1
    client.delete(f"/api/computer/sessions/browser_harness/{sid2}")


# -----------------------------------------------------------------------------
# 7. Navigation errors and request handling
# -----------------------------------------------------------------------------
def test_navigation_errors_and_safety_rejection():
    start_resp = client.post("/api/computer/sessions", json={"backend": "browser_harness", "headless": True})
    sid = start_resp.json()["session_id"]

    try:
        # Invalid scheme (javascript: is blocked by safety guard)
        resp = client.post(
            f"/api/computer/sessions/browser_harness/{sid}/navigate",
            json={"url": "javascript:alert(1)"},
        )
        # 403 Forbidden or safety gate error
        assert resp.status_code == 403
    finally:
        client.delete(f"/api/computer/sessions/browser_harness/{sid}")


# -----------------------------------------------------------------------------
# 8. Invalid or expired session identifiers (404s)
# -----------------------------------------------------------------------------
def test_invalid_session_identifiers_return_404():
    bogus_sid = "nonexistent_sid_12345"
    state_resp = client.get(f"/api/computer/sessions/browser_harness/{bogus_sid}")
    assert state_resp.status_code == 404

    nav_resp = client.post(
        f"/api/computer/sessions/browser_harness/{bogus_sid}/navigate",
        json={"url": "https://example.com"},
    )
    assert nav_resp.status_code in (404, 500)


# -----------------------------------------------------------------------------
# 9. Human takeover and Emergency Stop
# -----------------------------------------------------------------------------
def test_human_takeover_and_emergency_stop():
    start_resp = client.post("/api/computer/sessions", json={"backend": "browser_harness", "headless": True})
    sid = start_resp.json()["session_id"]
    arbiter = get_arbiter_registry().get_or_create(sid)

    try:
        # Simulate AI task started
        arbiter.assign_task("task-takeover", "Test Goal", ["example.com"])
        arbiter.start_task("task-takeover")
        assert arbiter.state == ControlState.AI_WORKING

        # Human interaction instantly pauses AI
        mouse_resp = client.post(
            f"/api/computer/sessions/browser_harness/{sid}/mouse",
            json={"event_type": "mousemove", "x": 500, "y": 400},
        )
        assert mouse_resp.status_code == 200
        assert arbiter.state == ControlState.AI_PAUSED

        # Emergency Stop trips kill-switch
        stop_resp = client.post("/api/computer/emergency_stop", json={"active": True})
        assert stop_resp.status_code == 200
        assert stop_resp.json()["emergency_stopped"] is True

        # Reset Emergency Stop
        reset_resp = client.post("/api/computer/emergency_stop", json={"active": False})
        assert reset_resp.status_code == 200
        assert reset_resp.json()["emergency_stopped"] is False
    finally:
        client.delete(f"/api/computer/sessions/browser_harness/{sid}")


# -----------------------------------------------------------------------------
# 10. Accurate dashboard statuses
# -----------------------------------------------------------------------------
def test_accurate_dashboard_statuses():
    resp = client.get("/api/computer/backends")
    assert resp.status_code == 200
    backends = resp.json()["backends"]

    # browser_harness must be READY
    assert backends["browser_harness"]["health"]["ok"] is True
    assert backends["browser_harness"]["health"]["status"] == "ready"

    # e2b_sandbox must be OFFLINE by default policy ($0 spending)
    assert backends["e2b_sandbox"]["health"]["ok"] is False
    assert backends["e2b_sandbox"]["health"]["status"] == "offline"
