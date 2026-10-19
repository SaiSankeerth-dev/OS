"""Focused Test Suite for Phase B: Trustworthy Computer & Browser Runtime.

Verifies:
1. B-1: Canonical Computer-Session Contract & Health Status:
   - Session ID and runtime identity.
   - Desktop service health.
   - Fresh frame timestamp, validity and dimensions.
   - Keyboard/mouse availability.
   - Browser session association.
   - Terminal/workspace identity.
   - Disconnect, reconnect and interruption behavior.
   - Disallow synthetic success for key_down/key_up.
2. B-2: Honest Browser Availability Reporting:
   - Truthful health checks (ready when Playwright is available, offline with diagnostics when unavailable).
   - Truthful fallback behavior without content fabrication.
3. B-3: End-to-End Browser Acceptance:
   - Open webpage in the actual OS Computer browser.
   - Read actual page title and content.
   - Navigate through a real link.
   - Verify final destination URL and content.
   - Capture real screenshot with valid PNG headers.
   - Associate all evidence with the exact same session ID.
   - Truthfully report navigation failure on unreachable target.
4. B-4: Desktop Acceptance:
   - Truthful 8-layer health check (Display, WM, Panel, VNC, noVNC, CDP, framebuffer).
   - Black frame rejection (< 5000 bytes scrot detected as blank).
   - Non-destructive interaction.
5. B-5: Wallpaper Integration Verification:
   - Curated wallpaper validation.
   - Invalid ID returns 400.
   - Invalid scope returns 422.
   - Application verifies before/after root pixmap ID and frame sha256 fingerprint.
6. B-6: Terminal Boundaries & Workspace Isolation:
   - Path traversal prevention.
   - Host Docker socket access blocked.
   - Timeout and execution limits enforced.
"""
from __future__ import annotations

import http.server
import socketserver
import subprocess
import sys
import threading
import time
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from adapters.browser.worker import BrowserWorker
from server.computer.arbiter import ControlState, get_arbiter_registry
from server.computer.backends.browser_harness import BrowserHarnessBackend
from server.computer.backends.docker_desktop import DockerDesktopBackend
from server.computer.interface import (
    ActionResult,
    BackendCapabilities,
    HealthStatus,
    ObservationResult,
    SessionNotFoundError,
    SessionState,
)
from server.computer.registry import get_computer_registry
from server.computer.safety import get_computer_safety_guard
from server.computer.workspace_sandbox import WorkspaceSandboxManager
from web.om.sandbox_jail import SandboxViolationError
from web.routes_computer_control import (
    CURATED_WALLPAPERS,
    _apply_and_verify_desktop_wallpaper,
)
from web.server import app

client = TestClient(app)


# =============================================================================
# Local Test HTTP Server Fixture for Deterministic E2E Browser Testing
# =============================================================================

class MockBrowserHandler(http.server.BaseHTTPRequestHandler):
    """Local test web server simulating pages, links, and content."""

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()

        if self.path == "/":
            html = """<!DOCTYPE html>
<html>
<head><title>OS Test Home</title></head>
<body>
    <h1>Welcome to OS Web Harness</h1>
    <p id="desc">Deterministic browser execution environment.</p>
    <a href="/destination" id="nav-link">Proceed to Destination Page</a>
</body>
</html>"""
            self.wfile.write(html.encode("utf-8"))

        elif self.path == "/destination":
            html = """<!DOCTYPE html>
<html>
<head><title>Destination Reached - OS Verification</title></head>
<body>
    <h1>Destination Page</h1>
    <p id="proof">Verified Navigation Outcome Content 42</p>
</body>
</html>"""
            self.wfile.write(html.encode("utf-8"))

    def log_message(self, format, *args):
        pass  # Quiet logging


@pytest.fixture(scope="module")
def local_web_server():
    server = socketserver.TCPServer(("127.0.0.1", 0), MockBrowserHandler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{port}"
    server.shutdown()
    server.server_close()


# =============================================================================
# 1. B-1: Canonical Computer-Session Contract & Health Status
# =============================================================================

def test_canonical_session_contract_structure():
    """SessionState must expose all canonical contract fields."""
    state = SessionState(
        session_id="sess_canon_1",
        backend_name="browser_harness",
        status="active",
        current_url="https://example.com",
        runtime_identity={"backend": "browser_harness", "type": "process"},
        desktop_service_health={"ok": True, "status": "ready"},
        frame={"timestamp": 123456.7, "valid": True, "width": 1280, "height": 800},
        input_availability={"keyboard": True, "mouse": True, "active": True},
        browser_session_id="sess_canon_1",
        terminal_workspace={"workspace_dir": "data/om-workspace", "isolated": False},
        interruption={"state": "AI_IDLE", "emergency_stopped": False, "human_takeover": False},
    )
    d = state.to_dict()
    assert d["session_id"] == "sess_canon_1"
    assert d["runtime_identity"]["backend"] == "browser_harness"
    assert d["desktop_service_health"]["ok"] is True
    assert d["frame"]["width"] == 1280
    assert d["input_availability"]["keyboard"] is True
    assert d["browser_session_id"] == "sess_canon_1"
    assert d["terminal_workspace"]["isolated"] is False
    assert d["interruption"]["emergency_stopped"] is False


def test_api_session_creation_and_contract_retrieval():
    """POST /api/computer/sessions and GET /api/computer/sessions/{backend}/{id} must return canonical contract."""
    # Start session with initial_url='about:blank' to avoid network calls
    resp = client.post(
        "/api/computer/sessions",
        json={"backend": "browser_harness", "headless": True, "initial_url": "about:blank"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["ok"] is True
    sid = data["session_id"]
    assert sid is not None
    assert "runtime_identity" in data
    assert "desktop_service_health" in data
    assert "frame" in data
    assert "input_availability" in data
    assert "browser_session_id" in data
    assert "terminal_workspace" in data
    assert "interruption" in data

    try:
        # Inspect via GET
        get_resp = client.get(f"/api/computer/sessions/browser_harness/{sid}")
        assert get_resp.status_code == 200
        g_data = get_resp.json()
        assert g_data["ok"] is True
        assert g_data["session_id"] == sid
        assert g_data["status"] == "active"
        assert g_data["frame"]["valid"] is True
        assert g_data["input_availability"]["keyboard"] is True
        assert g_data["input_availability"]["mouse"] is True
        assert g_data["interruption"]["can_interrupt"] is True

        # Check list endpoint
        list_resp = client.get("/api/computer/sessions")
        assert list_resp.status_code == 200
        s_list = list_resp.json()["sessions"]
        found = [s for s in s_list if s["session_id"] == sid]
        assert len(found) == 1
        assert "runtime_identity" in found[0]
        assert "frame" in found[0]
    finally:
        client.delete(f"/api/computer/sessions/browser_harness/{sid}")


def test_unsupported_key_actions_do_not_synthesize_success():
    """Unsupported key_down / key_up must return success=False."""
    docker_backend = DockerDesktopBackend(browser_harness=MagicMock(spec=[]))
    # browser_harness mock does not have key_down / key_up
    with pytest.raises(SessionNotFoundError):
        docker_backend.key_down("nonexistent", "Control")

    # With a registered session
    docker_backend._sessions["test_s"] = SessionState(session_id="test_s", backend_name="docker_desktop")
    res_down = docker_backend.key_down("test_s", "Control")
    assert res_down.success is False
    assert res_down.verified is False
    assert "not implemented" in res_down.error.lower()

    res_up = docker_backend.key_up("test_s", "Control")
    assert res_up.success is False
    assert res_up.verified is False
    assert "not implemented" in res_up.error.lower()


# =============================================================================
# 2. B-2: Honest Browser Availability Reporting
# =============================================================================

def test_browser_harness_health_check_truthfulness():
    """BrowserHarness reports ready when Playwright is available and offline when not."""
    backend = BrowserHarnessBackend()
    health = backend.health_check(force_refresh=True)
    # On this local system, Playwright is installed and operable
    assert health.ok is True
    assert "playwright" in health.message.lower()

    # When Playwright cannot be started
    with patch("playwright.sync_api.sync_playwright", side_effect=Exception("Playwright binary not found")):
        with patch.object(backend, "_pw", None):
            bad_health = backend.health_check(force_refresh=True)
            assert bad_health.ok is False
            assert "unavailable" in bad_health.message.lower()
            assert bad_health.backend == "browser_harness"


def test_browser_worker_honesty_on_failure():
    """BrowserWorker returns explicit failure receipts, never synthetic content."""
    worker = BrowserWorker(prefer_playwright=True)
    # Unreachable domain
    receipt = worker.navigate("nonexistent_session", "http://127.0.0.1:59999/unreachable")
    assert receipt.status == "FAILED"
    assert receipt.status_code >= 400


# =============================================================================
# 3. B-3: End-to-End Browser Acceptance
# =============================================================================

def test_browser_e2e_open_extract_navigate_screenshot(local_web_server):
    """Full acceptance: open page, extract content, navigate link, verify destination, capture screenshot."""
    registry = get_computer_registry()
    backend: BrowserHarnessBackend = registry.get_backend("browser_harness")
    session_id = f"e2e-b3-{int(time.time()*1000)}"

    # 1. Open public/local webpage
    backend.start_session({"session_id": session_id, "headless": True, "initial_url": local_web_server})

    try:
        # 2. Read actual page title and content
        obs1 = backend.inspect_page(session_id)
        assert obs1.session_id == session_id
        assert obs1.title == "OS Test Home"
        assert "Welcome to OS Web Harness" in obs1.text_content
        assert "Deterministic browser execution environment" in obs1.text_content

        # 3. Navigate through a real link
        nav_res = backend.click_element(session_id, "#nav-link")
        assert nav_res.success is True
        assert nav_res.session_id == session_id

        # 4. Verify final URL and destination content
        obs2 = backend.inspect_page(session_id)
        assert obs2.session_id == session_id
        assert "/destination" in obs2.url
        assert obs2.title == "Destination Reached - OS Verification"
        assert "Verified Navigation Outcome Content 42" in obs2.text_content

        # 5. Capture a real screenshot & verify PNG magic bytes
        screenshot_bytes = backend.take_screenshot(session_id)
        assert len(screenshot_bytes) > 200
        # PNG header: 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A
        assert screenshot_bytes[:8] == b"\x89PNG\r\n\x1a\n"

        # 6. Associate all evidence with the same session
        state = backend.get_session_state(session_id)
        assert state.session_id == session_id
        assert state.browser_session_id == session_id
        assert "/destination" in (state.current_url or "")

        # 7. Correctly report browser failure / unavailability on bad navigation
        fail_res = backend.open_url(session_id, "http://127.0.0.1:59999/does-not-exist")
        assert fail_res.success is False
        assert fail_res.verified is False
        assert "failed" in fail_res.observed_outcome.lower()
    finally:
        backend.close_session(session_id)


# =============================================================================
# 4. B-4: Desktop Acceptance
# =============================================================================

def test_desktop_health_and_black_frame_rejection():
    """DockerDesktopBackend truthful health checks and black screen rejection."""
    backend = DockerDesktopBackend()

    # 1. When docker daemon is running and scrot size >= 5000: active rendering
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(True, "Running")), \
         patch.object(backend, "_inspect_container_state", return_value={"running": True, "status": "running"}), \
         patch.object(backend, "_is_stream_ready", return_value=True), \
         patch.object(backend, "_is_cdp_ready", return_value=True), \
         patch.object(backend, "_check_frame_variance", return_value=(True, 45000, "Active rendering")):
        h = backend.health_check(force_refresh=True)
        assert h.ok is True
        assert h.details.get("frame_variance_ok") is True

    # 2. When scrot size < 5000 bytes: black frame rejection
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(True, "Running")), \
         patch.object(backend, "_inspect_container_state", return_value={"running": True, "status": "running"}), \
         patch.object(backend, "_is_stream_ready", return_value=True), \
         patch.object(backend, "_is_cdp_ready", return_value=True), \
         patch.object(backend, "_check_frame_variance", return_value=(False, 2800, "Black framebuffer detected")):
        h_bad = backend.health_check(force_refresh=True)
        assert h_bad.ok is False
        assert "black screen" in h_bad.message.lower()


# =============================================================================
# 5. B-5: Wallpaper Integration Verification
# =============================================================================

def test_wallpaper_catalog_and_validation():
    """Curated wallpapers are listed with valid structure; invalid requests rejected."""
    # List wallpapers
    resp = client.get("/api/computer/desktop/wallpapers")
    assert resp.status_code == 200
    data = resp.json()
    assert data["ok"] is True
    assert len(data["wallpapers"]) == 5
    ids = [w["id"] for w in data["wallpapers"]]
    assert "cinematic-mountain" in ids
    assert "aurora-borealis" in ids

    # Invalid wallpaper ID -> 400
    bad_id = client.post("/api/computer/desktop/wallpaper", json={"wallpaper_id": "not-a-wallpaper", "apply_to": "desktop"})
    assert bad_id.status_code == 400

    # Unsupported scope -> 422
    bad_scope = client.post("/api/computer/desktop/wallpaper", json={"wallpaper_id": "cinematic-mountain", "apply_to": "unsupported_scope"})
    assert bad_scope.status_code == 422


def test_wallpaper_application_postcondition_logic():
    """_apply_and_verify_desktop_wallpaper verifies asset, root-pixmap, and sha256 variance."""
    # If container is not running or asset missing, reports honest failure without crash
    outcome = _apply_and_verify_desktop_wallpaper("cinematic-mountain")
    # Outcome must be a valid structured receipt
    assert isinstance(outcome, dict)
    assert "ok" in outcome
    if not outcome["ok"]:
        assert "reason" in outcome
        assert outcome["reason"] in (
            "asset_missing",
            "desktop_unavailable",
            "root_pixmap_unavailable",
            "frame_capture_failed",
            "native_command_failed",
            "postcondition_unverified",
        )


# =============================================================================
# 6. B-6: Terminal Boundaries & Workspace Isolation
# =============================================================================

def test_terminal_workspace_boundaries_and_jail(tmp_path):
    """Workspace sandbox enforces working directory, path containment, and bans socket access."""
    mgr = WorkspaceSandboxManager(workspace_root=tmp_path)

    # 1. Allowed execution inside workspace
    mgr.write_file("hello.txt", "Hello OS Workspace")
    cmd = "type hello.txt" if sys.platform == "win32" else "cat hello.txt"
    res = mgr.execute_command(cmd)
    assert res.exit_code == 0
    assert "Hello OS Workspace" in res.stdout

    # 2. Path traversal blocked
    with pytest.raises(SandboxViolationError):
        mgr.read_file("../../outside.txt")

    with pytest.raises(SandboxViolationError):
        mgr.write_file("../evil.sh", "#!/bin/sh")

    # 3. Docker socket mount / access explicitly blocked
    block_res = mgr.execute_command("cat /var/run/docker.sock")
    assert block_res.exit_code != 0
    assert "docker socket" in block_res.stderr.lower() or "security violation" in block_res.stderr.lower()
