"""End-to-End API tests for OS Cyber-HUD endpoints."""
from fastapi.testclient import TestClient
from web.server import app

client = TestClient(app)


def test_hud_state_endpoint():
    res = client.get("/api/hud/state")
    assert res.status_code == 200
    data = res.json()
    assert "hardware" in data
    assert "dots" in data
    assert "forge" in data["dots"]
    assert "scout" in data["dots"]
    assert "computer" in data["dots"]["forge"]["permissions"] or "shell" in data["dots"]["forge"]["permissions"]
    assert "telemetry" in data
    assert "runtime_state" in data


def test_hud_command_math():
    res = client.post("/api/hud/command", json={"query": "calculate (128 * 2) + 16", "dot": "forge"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "completed"
    assert "272" in data["response"]
    assert data["telemetry"]["latency_ms"] > 0


def test_hud_command_blocked_pattern():
    res = client.post(
        "/api/hud/command",
        json={"query": "rm -rf /", "dot": "forge", "action_type": "shell_exec", "action_payload": "rm -rf /"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "blocked"
    assert "Blocked by OS Safety Gate" in data["reason"]


def test_hud_approval_flow():
    # Trigger approval
    res = client.post(
        "/api/hud/command",
        json={
            "query": "deploy openmuse container",
            "dot": "forge",
            "action_type": "shell_exec",
            "action_payload": "docker run -d openmuse:latest",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "waiting_approval"
    apr_id = data["approval_card"]["approval_id"]

    # Resolve approval
    res2 = client.post("/api/hud/approval", json={"approval_id": apr_id, "decision": "always_allow"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["status"] == "approved"
    assert data2["decision"] == "always_allow"


def test_hud_computer_takeover():
    res1 = client.post("/api/hud/computer/takeover", json={"take_control": True})
    assert res1.status_code == 200
    assert res1.json()["computer_mode"] == "HUMAN_CONTROL"

    res2 = client.post("/api/hud/computer/takeover", json={"take_control": False})
    assert res2.status_code == 200
    assert res2.json()["computer_mode"] == "AGENT_AUTONOMOUS"


def test_hud_spaces_revision_control():
    # Save page at initial revision
    res1 = client.post(
        "/api/hud/spaces/save",
        json={
            "space_id": "engineering-hq",
            "page_id": "test-doc-hud",
            "title": "HUD Architecture",
            "markdown": "# Revision 1 Content",
            "author": "Sai",
        },
    )
    assert res1.status_code == 200
    assert res1.json()["revision"] == 1

    # Valid update expecting revision 1 -> becomes revision 2
    res2 = client.post(
        "/api/hud/spaces/save",
        json={
            "space_id": "engineering-hq",
            "page_id": "test-doc-hud",
            "title": "HUD Architecture v2",
            "markdown": "# Revision 2 Content",
            "author": "Scribe",
            "expected_revision": 1,
        },
    )
    assert res2.status_code == 200
    assert res2.json()["revision"] == 2

    # Stale update expecting revision 1 -> 409 Conflict
    res3 = client.post(
        "/api/hud/spaces/save",
        json={
            "space_id": "engineering-hq",
            "page_id": "test-doc-hud",
            "title": "Stale Conflict",
            "markdown": "# Conflict content",
            "author": "Scout",
            "expected_revision": 1,
        },
    )
    assert res3.status_code == 409


def test_hud_optimize_learning():
    res = client.post("/api/hud/optimize")
    assert res.status_code == 200
    data = res.json()
    assert "learned_skills" in data


def test_hud_social_connectors():
    # LinkedIn draft
    li_res = client.post(
        "/api/hud/social/linkedin/draft",
        json={"topic": "OS Architecture", "highlights": ["Local-First", "5 Primitives"]},
    )
    assert li_res.status_code == 200
    assert "content" in li_res.json()

    # LinkedIn publish without token reports unauthorized honestly
    pub_res = client.post(
        "/api/hud/social/linkedin/publish",
        json={"post_text": "Draft text"},
    )
    assert pub_res.status_code == 200
    assert pub_res.json()["published"] is False
    assert "not configured" in pub_res.json()["error"]

    # YouTube summarize
    yt_res = client.post(
        "/api/hud/social/youtube/summarize",
        json={"video_url": "https://youtube.com/watch?v=openmuse-demo", "title": "OpenMuse Demo"},
    )
    assert yt_res.status_code == 200
    assert yt_res.json()["platform"] == "YouTube"


def test_hud_html_serves():
    res = client.get("/hud")
    assert res.status_code == 200
    assert "OS // CYBER-HUD" in res.text
