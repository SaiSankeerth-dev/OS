"""Unit and Regression Test Suite for DockerVirtualComputer & HUD Computer Endpoints.

Tests:
1. DockerVirtualComputer initialization and container detection.
2. CLI exec_shell command receipt generation and exit codes.
3. GUI action commands (click, type, key, open_url).
4. Human Takeover Mode: strict agent action suspension.
5. Screenshot capture via scrot base64 stream.
6. HUD API route integration (/api/hud/computer/status, exec, gui, screenshot, takeover).
"""
from __future__ import annotations

import base64
import subprocess
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from web.om.virtual_computer import DockerVirtualComputer, VirtualComputerError
from web.server import app


# -----------------------------------------------------------------------------
# 1. DockerVirtualComputer Unit Tests
# -----------------------------------------------------------------------------
def test_virtual_computer_initialization(tmp_path):
    vc = DockerVirtualComputer(
        workspace_host_dir=tmp_path,
        container_name="test-os-desktop",
        novnc_url="http://localhost:6080/vnc.html",
    )
    assert vc.container_name == "test-os-desktop"
    assert vc.novnc_url == "http://localhost:6080/vnc.html"
    assert vc.human_takeover is False
    assert len(vc.command_receipts) == 0


def test_virtual_computer_mock_exec_shell(tmp_path):
    def mock_runner(cmd, timeout=30.0):
        if "id" in cmd and "-u" in cmd:
            return subprocess.CompletedProcess(cmd, returncode=1, stdout="", stderr="no such user")
        if "printenv" in cmd:
            return subprocess.CompletedProcess(cmd, returncode=0, stdout=":1\n", stderr="")
        if "echo" in cmd[-1]:
            return subprocess.CompletedProcess(cmd, returncode=0, stdout="Mock output\n", stderr="")
        return subprocess.CompletedProcess(cmd, returncode=0, stdout="", stderr="")

    vc = DockerVirtualComputer(workspace_host_dir=tmp_path, runner=mock_runner)
    receipt = vc.exec_shell("echo Mock output")

    assert receipt["type"] == "shell"
    assert receipt["exit_code"] == 0
    assert "Mock output" in receipt["stdout"]
    assert len(vc.command_receipts) == 1


def test_virtual_computer_takeover_lock(tmp_path):
    vc = DockerVirtualComputer(workspace_host_dir=tmp_path)
    vc.set_take_control(True)
    assert vc.human_takeover is True

    # Autonomous command should be rejected
    with pytest.raises(VirtualComputerError) as exc_info:
        vc.exec_shell("echo autonomous task")
    assert "HUMAN_OVERRIDE" in str(exc_info.value)

    # Bypass takeover is allowed (e.g. for screenshot/diagnostics)
    def mock_runner(cmd, timeout=30.0):
        return subprocess.CompletedProcess(cmd, returncode=0, stdout="bypassed", stderr="")

    vc._runner = mock_runner
    receipt = vc.exec_shell("echo diagnostic", bypass_takeover=True)
    assert receipt["stdout"] == "bypassed"

    # Return control to agent
    vc.set_take_control(False)
    assert vc.human_takeover is False


def test_virtual_computer_gui_actions(tmp_path):
    recorded_commands = []

    def mock_runner(cmd, timeout=30.0):
        recorded_commands.append(cmd)
        return subprocess.CompletedProcess(cmd, returncode=0, stdout="", stderr="")

    vc = DockerVirtualComputer(workspace_host_dir=tmp_path, runner=mock_runner)

    # Test click
    vc.gui_action("click", x=500, y=300)
    assert any("xdotool mousemove 500 300 click 1" in " ".join(c) for c in recorded_commands)

    # Test type
    vc.gui_action("type", text="Hello OS")
    assert any("xdotool type" in " ".join(c) and "Hello OS" in " ".join(c) for c in recorded_commands)

    # Test key
    vc.gui_action("key", key="Return")
    assert any("xdotool key" in " ".join(c) and "Return" in " ".join(c) for c in recorded_commands)

    # Test open_url
    vc.gui_action("open_url", text="https://example.com")
    assert any("chromium" in " ".join(c) and "https://example.com" in " ".join(c) for c in recorded_commands)


def test_virtual_computer_screenshot_capture(tmp_path):
    fake_png_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="

    def mock_runner(cmd, timeout=30.0):
        # cmd contains scrot pipeline
        return subprocess.CompletedProcess(cmd, returncode=0, stdout=fake_png_b64, stderr="")

    vc = DockerVirtualComputer(workspace_host_dir=tmp_path, runner=mock_runner)
    shot = vc.capture_screenshot()

    assert shot["ok"] is True
    assert fake_png_b64 in shot["data_uri"]
    assert shot["width"] == 1280
    assert shot["height"] == 800


# -----------------------------------------------------------------------------
# 2. FastAPI HUD Endpoints Integration Tests
# -----------------------------------------------------------------------------
@pytest.fixture
def client():
    return TestClient(app)


def test_hud_computer_status_endpoint(client):
    res = client.get("/api/hud/computer/status")
    assert res.status_code == 200
    data = res.json()
    assert "container_name" in data
    assert "mode" in data
    assert "novnc_url" in data
    assert "human_takeover" in data


def test_hud_computer_takeover_and_exec_endpoints(client):
    # 1. Take control
    res_take = client.post("/api/hud/computer/takeover", json={"take_control": True})
    assert res_take.status_code == 200
    assert res_take.json()["user_took_control"] is True

    # 2. Execution during human control should be rejected with 409
    res_exec_blocked = client.post(
        "/api/hud/computer/exec",
        json={"command": "echo blocked during human control"},
    )
    assert res_exec_blocked.status_code == 409
    assert "HUMAN_OVERRIDE" in res_exec_blocked.json()["detail"]

    # 3. Release control back to agent
    res_release = client.post("/api/hud/computer/takeover", json={"take_control": False})
    assert res_release.status_code == 200
    assert res_release.json()["user_took_control"] is False

    # 4. Check status reflects autonomous mode
    status = client.get("/api/hud/computer/status").json()
    assert status["human_takeover"] is False
    assert status["mode"] == "AGENT_AUTONOMOUS"


def test_hud_computer_screenshot_endpoint(client):
    res = client.get("/api/hud/computer/screenshot")
    assert res.status_code == 200
    data = res.json()
    assert "ok" in data
