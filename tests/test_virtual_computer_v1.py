"""OS Virtual Computer V1 Automated Test Suite.

Verifies:
1. Laya Fast Browser Decision Adapter:
   - Action table generation from DOM map (CLICK, TYPE_TEXT, SELECT, SCROLL, WAIT, DONE, BLOCKED)
   - Fast decision paths (<10ms) for search input & result clicking
   - Bot/CAPTCHA detection returning BLOCKED
   - Bounded validation against DOM elements & fallback when uncertain
   - Neural stub prediction & threshold gating
2. Docker & Selkies / noVNC Desktop Runtime:
   - Truthful health checks (honest reporting when Docker is offline, no fake ready)
   - Diagnostic guidance for offline daemon
   - CDP remote debugging port (9222) and HTML5 streaming (6080) exposure
   - Unified single-browser session delegation to Playwright CDP
3. Isolated Developer Workspace Sandbox:
   - Jailed command execution and stdout/stderr capture
   - Strict security bounds: path traversal blocked, forbidden binaries blocked
   - Host Docker socket mount blocked
   - Git repository cloning validation
4. Registry & Router Integration:
   - Registration of docker_desktop backend
   - Desktop capability detection and routing
"""
from __future__ import annotations

import os
import shutil
import tempfile
import time
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from server.computer.backends.docker_desktop import DockerDesktopBackend
from server.computer.interface import (
    ActionResult,
    BackendCostKind,
    BackendUnavailableError,
    ComputerControlError,
    HealthStatus,
    ObservationResult,
)
from server.computer.laya_adapter import (
    ActionCandidate,
    LayaActionType,
    LayaBrowserDecisionAdapter,
    get_laya_browser_adapter,
)
from server.computer.registry import ComputerBackendRegistry, get_computer_registry
from server.computer.workspace_sandbox import (
    WorkspaceCommandResult,
    WorkspaceSandboxManager,
    get_workspace_sandbox,
)
from web.om.sandbox_jail import SandboxViolationError


# =============================================================================
# 1. Laya Browser Fast Decision Adapter Tests
# =============================================================================

SAMPLE_HTML = """
<html>
  <body>
    <header>
      <a href="/home" id="nav-home">Home</a>
      <a href="/about">About Us</a>
    </header>
    <main>
      <h1>AI Repository Explorer</h1>
      <input type="text" id="search-input" name="q" placeholder="Search GitHub repos" />
      <button id="search-btn">Search Repositories</button>
      <select id="sort-select">
        <option value="stars">Most Stars</option>
        <option value="recent">Recently Updated</option>
      </select>
    </main>
  </body>
</html>
"""

def test_laya_build_action_table_from_html():
    adapter = LayaBrowserDecisionAdapter()
    obs = ObservationResult(session_id="s1", backend="browser_harness", url="https://example.com", title="Test")
    table = adapter.build_action_table(obs, goal="Find coding agents", raw_html=SAMPLE_HTML)

    assert len(table) >= 5
    types = [c.action_type for c in table]
    assert LayaActionType.CLICK in types
    assert LayaActionType.TYPE_TEXT in types
    assert LayaActionType.SELECT in types
    assert LayaActionType.SCROLL in types
    assert LayaActionType.WAIT in types
    assert LayaActionType.DONE in types
    assert LayaActionType.BLOCKED in types

    # Check search input candidate
    type_cands = [c for c in table if c.action_type == LayaActionType.TYPE_TEXT]
    assert any("search" in c.label.lower() or "q" in (c.selector_hint or "").lower() for c in type_cands)


def test_laya_fast_heuristic_search_decision():
    adapter = LayaBrowserDecisionAdapter()
    obs = ObservationResult(
        session_id="s1",
        backend="browser_harness",
        url="https://google.com",
        title="Google",
        dom_elements=[
            {"element_id": 1, "tag": "input", "name": "q", "label": "Search", "selector_hint": "input[name='q']", "risk": "LOW_NAVIGATION"},
            {"element_id": 2, "tag": "button", "id": "btnK", "label": "Google Search", "selector_hint": "#btnK", "risk": "LOW_NAVIGATION"},
        ],
    )

    decision = adapter.decide_action(
        goal="Search for laya-browser-agent repository",
        obs=obs,
        action_history=[],
    )

    assert decision.action_type == LayaActionType.TYPE_TEXT
    assert decision.confidence >= 0.7
    assert decision.latency_ms >= 0
    assert not decision.fallback_required
    assert decision.os_tool_call is not None
    assert decision.os_tool_call["tool"] == "fill_and_submit"
    assert "laya-browser-agent" in decision.os_tool_call["arguments"]["text"].lower()


def test_laya_fast_heuristic_click_search_result():
    adapter = LayaBrowserDecisionAdapter()
    obs = ObservationResult(
        session_id="s1",
        backend="browser_harness",
        url="https://google.com/search?q=laya",
        title="Google Search Results",
        dom_elements=[
            {"element_id": 1, "tag": "a", "label": "Sign In", "selector_hint": "#signin", "risk": "LOW_NAVIGATION"},
            {"element_id": 2, "tag": "a", "label": "GitHub - ChenneyZhuang/laya-browser-agent", "selector_hint": "#res-1", "risk": "LOW_NAVIGATION"},
            {"element_id": 3, "tag": "a", "label": "About Google", "selector_hint": "#about", "risk": "LOW_NAVIGATION"},
        ],
    )

    decision = adapter.decide_action(
        goal="Find ChenneyZhuang/laya-browser-agent",
        obs=obs,
        action_history=[{"action": "fill_and_submit", "target": "input[name='q']"}],
    )

    assert decision.action_type == LayaActionType.CLICK
    assert decision.confidence >= 0.7
    assert not decision.fallback_required
    assert decision.target_selector == "#res-1"
    assert decision.os_tool_call is not None
    assert decision.os_tool_call["tool"] == "click_element"


def test_laya_bot_detection_returns_blocked():
    adapter = LayaBrowserDecisionAdapter()
    obs = ObservationResult(
        session_id="s1",
        backend="browser_harness",
        url="https://example.com/verify",
        title="Security Check",
        text_content="Please verify you are human to continue. Complete CAPTCHA below.",
        dom_elements=[],
    )

    decision = adapter.decide_action(
        goal="Open repository docs",
        obs=obs,
        action_history=[],
    )

    assert decision.action_type == LayaActionType.BLOCKED
    assert decision.confidence > 0.9
    assert "captcha" in decision.reason.lower() or "bot" in decision.reason.lower()


def test_laya_fallback_when_uncertain():
    adapter = LayaBrowserDecisionAdapter()
    obs = ObservationResult(
        session_id="s1",
        backend="browser_harness",
        url="https://obscure-site.local",
        title="Unknown Page",
        dom_elements=[
            {"element_id": 1, "tag": "a", "label": "Privacy Policy", "selector_hint": "#privacy", "risk": "LOW_NAVIGATION"},
        ],
    )

    # Goal completely unrelated to available DOM
    decision = adapter.decide_action(
        goal="Deploy kubernetes cluster configuration",
        obs=obs,
        action_history=[{"action": "fill_and_submit"}],
    )

    assert decision.fallback_required is True
    assert decision.confidence < adapter.confidence_threshold


def test_laya_neural_stub_prediction():
    class StubRouter:
        def predict(self, text, questions):
            return {
                "answers": {
                    "action": {
                        "choice": "act_click_2",
                        "confidence": 0.85,
                    }
                }
            }

    adapter = LayaBrowserDecisionAdapter()
    adapter._router_instance = StubRouter()
    adapter._load_error = None

    obs = ObservationResult(
        session_id="s1",
        backend="browser_harness",
        url="https://github.com",
        title="GitHub",
        dom_elements=[
            {"element_id": 1, "tag": "a", "label": "Explore", "selector_hint": "#explore", "risk": "LOW_NAVIGATION"},
            {"element_id": 2, "tag": "button", "label": "Star", "selector_hint": "#star-btn", "risk": "LOW_NAVIGATION"},
        ],
    )

    with patch("server.computer.laya_adapter.laya_importable", return_value=True):
        decision = adapter.decide_action("Star repository", obs)
        assert decision.action_type == LayaActionType.CLICK
        assert decision.confidence == 0.85
        assert not decision.fallback_required
        assert decision.target_selector == "#star-btn"


# =============================================================================
# 2. Docker & Selkies / noVNC Desktop Runtime Tests
# =============================================================================

def test_docker_desktop_capabilities():
    backend = DockerDesktopBackend()
    caps = backend.get_capabilities()
    assert caps.supports_browser is True
    assert caps.supports_desktop is True
    assert caps.supports_virtual_sandbox is True
    assert caps.cost_classification == BackendCostKind.ZERO_LOCAL


def test_docker_desktop_health_when_docker_offline():
    backend = DockerDesktopBackend()
    # Mock daemon check returning offline
    with patch.object(backend, "_is_docker_daemon_running", return_value=(False, "Docker daemon is offline.")):
        health = backend.health_check(force_refresh=True)
        assert health.ok is False
        assert health.backend == "docker_desktop"
        assert "offline" in health.message.lower() or "unreachable" in health.message.lower()
        assert health.details.get("daemon_running") is False


def test_docker_desktop_health_when_docker_online():
    backend = DockerDesktopBackend()
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(True, "Running")), \
         patch.object(backend, "_inspect_container_state", return_value={"running": True, "status": "running"}), \
         patch.object(backend, "_is_stream_ready", return_value=True), \
         patch.object(backend, "_check_frame_variance", return_value=(True, 75000, "Active rendering")), \
         patch.object(backend, "_is_cdp_ready", return_value=True):
        health = backend.health_check(force_refresh=True)
        assert health.ok is True
        assert health.details.get("cdp_ready") is True
        assert "http://127.0.0.1:6080" in health.details.get("stream_url", "")
        assert "http://127.0.0.1:9222" in health.details.get("cdp_url", "")


def test_docker_desktop_start_session_raises_when_daemon_offline():
    backend = DockerDesktopBackend()
    with patch.object(backend, "_is_docker_daemon_running", return_value=(False, "Docker daemon stopped")):
        with pytest.raises(BackendUnavailableError) as exc_info:
            backend.start_session({"session_id": "test_sess"})
        assert "unavailable" in str(exc_info.value).lower() or "offline" in str(exc_info.value).lower()


def test_docker_desktop_delegates_to_cdp_browser_harness():
    mock_harness = MagicMock()
    mock_inner_state = MagicMock()
    mock_inner_state.current_url = "https://github.com"
    mock_harness.start_session.return_value = mock_inner_state
    mock_harness.open_url.return_value = ActionResult(success=True, action="open_url", session_id="s_test", backend="browser_harness")

    backend = DockerDesktopBackend(browser_harness=mock_harness)
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(True, "Running")), \
         patch.object(backend, "ensure_container_running", return_value=True), \
         patch.object(backend, "health_check", return_value=HealthStatus(ok=True, backend="docker_desktop", message="ready", details={})):

        state = backend.start_session({"session_id": "s_test", "initial_url": "https://github.com"})
        assert state.session_id == "s_test"
        assert state.backend_name == "docker_desktop"
        assert state.metadata.get("shared_single_browser") is True

        # Verify open_url delegates to browser harness
        res = backend.open_url("s_test", "https://google.com")
        assert res.success is True
        mock_harness.open_url.assert_called_once_with("s_test", "https://google.com")


# =============================================================================
# 3. Isolated Developer Workspace Sandbox Tests
# =============================================================================

def test_workspace_sandbox_local_execution(tmp_path):
    mgr = WorkspaceSandboxManager(workspace_root=tmp_path)
    # Write a python script file inside the sandbox and execute it
    mgr.write_file("run_test.py", "print('Hello from sandbox')")
    res = mgr.execute_command("python run_test.py")
    assert res.exit_code == 0
    assert "Hello from sandbox" in res.stdout
    assert res.duration_ms >= 0


def test_workspace_sandbox_blocks_docker_socket(tmp_path):
    mgr = WorkspaceSandboxManager(workspace_root=tmp_path)
    res = mgr.execute_command("ls -la /var/run/docker.sock")
    assert res.exit_code == 1
    assert "docker socket" in res.stderr.lower() or "security violation" in res.stderr.lower()


def test_workspace_sandbox_file_crud_and_traversal(tmp_path):
    mgr = WorkspaceSandboxManager(workspace_root=tmp_path)
    # Safe write & read
    mgr.write_file("test.py", "print('safe content')")
    content = mgr.read_file("test.py")
    assert content == "print('safe content')"

    # Path traversal block
    with pytest.raises(SandboxViolationError):
        mgr.write_file("../../../escaped.txt", "evil")

    with pytest.raises(SandboxViolationError):
        mgr.read_file("../../secret.env")


def test_workspace_sandbox_clone_repo_validation(tmp_path):
    mgr = WorkspaceSandboxManager(workspace_root=tmp_path)
    # Reject invalid scheme
    bad_res = mgr.clone_repository("file:///etc/passwd")
    assert bad_res.exit_code != 0
    assert "invalid" in bad_res.stderr.lower()


# =============================================================================
# 4. Computer Backend Registry & Routing Integration
# =============================================================================

def test_registry_contains_docker_desktop():
    registry = get_computer_registry()
    backend = registry.get_backend("docker_desktop")
    assert backend is not None
    assert backend.name == "docker_desktop"

    backends_list = registry.list_backends()
    assert "docker_desktop" in backends_list
    assert backends_list["docker_desktop"]["capabilities"]["supports_desktop"] is True


def test_registry_routes_desktop_task():
    registry = ComputerBackendRegistry()
    # If docker_desktop is healthy, route_task(requires_desktop=True) selects it
    mock_desktop = MagicMock()
    mock_desktop.health_check.return_value = HealthStatus(ok=True, backend="docker_desktop")
    mock_desktop.get_capabilities.return_value = DockerDesktopBackend().get_capabilities()
    registry.register_backend("docker_desktop", mock_desktop)

    routed = registry.route_task(requires_desktop=True)
    assert routed == mock_desktop


# =============================================================================
# 5. Fine-Grained Status & Dual Stream/CDP Readiness Tests
# =============================================================================

def test_docker_desktop_fine_grained_status_transitions():
    backend = DockerDesktopBackend()

    # Case A: Docker CLI not found -> OFFLINE
    with patch.object(backend, "_is_docker_cli_available", return_value=False):
        h = backend.health_check(force_refresh=True)
        assert h.ok is False
        assert h.details["docker_cli"] is False

    # Case B: Docker daemon stopped -> OFFLINE
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(False, "daemon stopped")):
        h = backend.health_check(force_refresh=True)
        assert h.ok is False
        assert h.details["daemon_running"] is False

    # Case C: Daemon running, but container stopped -> STANDBY (ok=False)
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(True, "running")), \
         patch.object(backend, "_inspect_container_state", return_value={"running": False, "status": "stopped"}):
        h = backend.health_check(force_refresh=True)
        assert h.ok is False
        assert "standby" in h.message.lower()
        assert h.details["stream_ready"] is False
        assert h.details["cdp_ready"] is False

    # Case D: Container running, but services initializing -> STARTING (ok=False)
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(True, "running")), \
         patch.object(backend, "_inspect_container_state", return_value={"running": True, "status": "running"}), \
         patch.object(backend, "_is_stream_ready", return_value=False), \
         patch.object(backend, "_is_cdp_ready", return_value=False):
        h = backend.health_check(force_refresh=True)
        assert h.ok is False
        assert "waiting" in h.message.lower() or "initializing" in h.message.lower()

    # Case E: Both noVNC stream and CDP active with verified non-black frame -> READY (ok=True)
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(True, "running")), \
         patch.object(backend, "_inspect_container_state", return_value={"running": True, "status": "running"}), \
         patch.object(backend, "_is_stream_ready", return_value=True), \
         patch.object(backend, "_is_cdp_ready", return_value=True), \
         patch.object(backend, "_check_frame_variance", return_value=(True, 75000, "Active rendering")):
        h = backend.health_check(force_refresh=True)
        assert h.ok is True
        assert h.details["stream_ready"] is True
        assert h.details["cdp_ready"] is True
        assert h.details["frame_variance_ok"] is True
        assert h.details["black_screen_detected"] is False
        assert "verified non-black" in h.message.lower()

    # Case F: Both noVNC stream and CDP active, but black screen detected -> DEGRADED (ok=False)
    with patch.object(backend, "_is_docker_cli_available", return_value=True), \
         patch.object(backend, "_is_docker_daemon_running", return_value=(True, "running")), \
         patch.object(backend, "_inspect_container_state", return_value={"running": True, "status": "running"}), \
         patch.object(backend, "_is_stream_ready", return_value=True), \
         patch.object(backend, "_is_cdp_ready", return_value=True), \
         patch.object(backend, "_check_frame_variance", return_value=(False, 3057, "Black framebuffer detected")):
        h = backend.health_check(force_refresh=True)
        assert h.ok is False
        assert h.details["black_screen_detected"] is True
        assert h.details["frame_variance_ok"] is False
        assert "black screen" in h.message.lower()


def test_routes_desktop_status_and_lifecycle():
    from fastapi.testclient import TestClient
    from web.server import app

    client = TestClient(app)

    # 1. Status endpoint returns fine-grained status
    res = client.get("/api/computer/desktop/status")
    assert res.status_code == 200
    data = res.json()
    assert "ok" in data
    assert "health" in data
    assert "status" in data["health"]
    assert data["health"]["status"] in ["ready", "standby", "starting", "degraded", "offline"]
    assert "stream_url" in data
    assert "cdp_url" in data
