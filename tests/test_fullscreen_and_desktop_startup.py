"""Tests for Fullscreen Browser Mode, Non-Blank Desktop Startup, and Honest Sandbox Lab State."""
import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from web.server import app


@pytest.fixture
def client():
    return TestClient(app)


def test_session_starts_with_initial_url_and_generates_non_white_frame(client):
    """Verify that starting a session with initial_url navigates to real web content and avoids blank white screens."""
    res = client.post(
        "/api/computer/sessions",
        json={
            "backend": "browser_harness",
            "headless": True,
            "initial_url": "https://google.com",
        },
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["ok"] is True
    assert "session_id" in data
    sid = data["session_id"]
    assert "google.com" in data.get("current_url", "").lower()

    try:
        # Fetch live frame
        frame_res = client.get(f"/api/computer/sessions/browser_harness/{sid}/frame")
        assert frame_res.status_code == 200
        assert frame_res.headers["content-type"] == "image/jpeg"

        # Verify frame is valid image and has real non-white content
        img = Image.open(io.BytesIO(frame_res.content))
        assert img.size == (1280, 800)
        extrema = img.getextrema()
        # Non-blank: at least one channel has low < 250
        is_pure_white = all(low == 255 and high == 255 for (low, high) in extrema[:3])
        assert not is_pure_white, f"Frame must not be pure white about:blank! Extrema: {extrema}"

        # Test wheel input isolation endpoint
        wheel_res = client.post(
            f"/api/computer/sessions/browser_harness/{sid}/mouse",
            json={
                "event_type": "wheel",
                "x": 640,
                "y": 400,
                "delta_x": 0,
                "delta_y": 120,
            },
        )
        assert wheel_res.status_code == 200
        assert wheel_res.json()["ok"] is True

        # Test keyboard input endpoint
        key_res = client.post(
            f"/api/computer/sessions/browser_harness/{sid}/keyboard",
            json={
                "event_type": "keydown",
                "key": "Tab",
                "code": "Tab",
                "text": "",
            },
        )
        assert key_res.status_code == 200
        assert key_res.json()["ok"] is True

    finally:
        # Cleanup session
        del_res = client.delete(f"/api/computer/sessions/browser_harness/{sid}")
        assert del_res.status_code == 200


def test_sandbox_workspace_file_operations_and_honest_command_exit_codes(client):
    """Verify that workspace file write/read/list work cleanly and sandbox command execution returns real exit codes."""
    # 1. Write sample file
    write_res = client.post(
        "/api/om/computer/files/write",
        json={
            "path": "/workspace/test_sample.txt",
            "text": "Hello OS Virtual Lab\nTimestamp: 2026-10-17\n",
        },
    )
    assert write_res.status_code == 200
    assert write_res.json()["path"] == "/workspace/test_sample.txt"

    # 2. List files
    list_res = client.get("/api/om/computer/files?path=%2Fworkspace")
    assert list_res.status_code == 200
    entries = list_res.json().get("entries", [])
    names = [e["name"] for e in entries]
    assert "test_sample.txt" in names

    # 3. Read file back
    read_res = client.post(
        "/api/om/computer/files/read",
        json={"path": "/workspace/test_sample.txt"},
    )
    assert read_res.status_code == 200
    assert "Hello OS Virtual Lab" in read_res.json().get("text", "")

    # 4. Run command and verify honest exit code 0
    cmd_res = client.post(
        "/api/om/computer/commands",
        json={"command": "python --version", "cwd": "/workspace"},
    )
    assert cmd_res.status_code == 201
    cmd_data = cmd_res.json()
    assert cmd_data["exitCode"] == 0
    assert "Python" in cmd_data["stdout"]
    assert cmd_data["status"] == "succeeded"

    # 5. Write an error script and run it, verifying honest non-zero exit code (never false READY)
    client.post(
        "/api/om/computer/files/write",
        json={"path": "/workspace/exit42.py", "text": "import sys\nsys.exit(42)\n"},
    )
    fail_res = client.post(
        "/api/om/computer/commands",
        json={"command": "python exit42.py", "cwd": "/workspace"},
    )
    assert fail_res.status_code == 201
    fail_data = fail_res.json()
    assert fail_data["exitCode"] == 42
    assert fail_data["status"] == "failed"
