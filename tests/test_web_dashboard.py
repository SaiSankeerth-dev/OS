"""Dashboard API tests: every view's backend works.

Uses the real engine (same as the terminal). Connector tests clean up
after themselves; task tests cancel what they create.
"""
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient  # noqa: E402

from web.server import app  # noqa: E402


@pytest.fixture(scope="module")
def client():
    # Hermetic connector grants for this test module.
    Path("data/dashboard.db").unlink(missing_ok=True)
    with TestClient(app) as c:
        yield c
    Path("data/dashboard.db").unlink(missing_ok=True)


def test_index_serves(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "OS — Your Personal AI Assistant" in r.text
    assert "/static/app.js" in r.text


def test_me(client):
    r = client.get("/api/me")
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "sai"
    assert "greeting" in body


def test_chat_draft_flow(client):
    # Draft needs no language model: router -> tool -> approval.
    with client.stream(
        "POST", "/api/chat", json={"message": "draft a linkedin post about shipping early"}
    ) as r:
        assert r.status_code == 200
        text = r.read().decode()
    assert '"t": "done"' in text or '"t":"done"' in text
    # An approval must now be waiting.
    pend = client.get("/api/approvals").json()["pending"]
    assert pend, "draft should create a pending approval"
    pid = pend[-1]["id"]
    assert "shipping early" in pend[-1]["draft"].lower()

    # Edit creates a new version (old rejected, new pending).
    r = client.post(f"/api/approvals/{pid}/edit", json={"draft": "Edited draft text here."})
    assert r.status_code == 200
    pend2 = client.get("/api/approvals").json()["pending"]
    assert len(pend2) == len(pend), "edit = reject old + draft new"
    new_id = pend2[-1]["id"]
    assert "Edited draft text" in pend2[-1]["draft"]

    # Reject discards it.
    r = client.post(f"/api/approvals/{new_id}/reject")
    assert r.status_code == 200
    assert "reject" in r.json()["text"].lower() or "discard" in r.json()["text"].lower()
    assert all(p["id"] != new_id for p in client.get("/api/approvals").json()["pending"])


def test_chat_approve_flow(client):
    client.post("/api/chat", json={"message": "draft a linkedin post about testing"})
    pend = client.get("/api/approvals").json()["pending"]
    assert pend
    pid = pend[-1]["id"]
    r = client.post(f"/api/approvals/{pid}/approve")
    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert all(p["id"] != pid for p in client.get("/api/approvals").json()["pending"])


def test_tasks_crud(client):
    r = client.post("/api/tasks", json={"title": "dashboard test task"})
    tid = r.json()["task"]["id"]
    assert any(t["id"] == tid for t in client.get("/api/tasks").json()["tasks"])
    r = client.patch(f"/api/tasks/{tid}", json={"status": "DONE"})
    assert r.json()["task"]["status"] == "DONE"
    r = client.delete(f"/api/tasks/{tid}")
    assert r.json()["ok"] is True


def test_memory_endpoints(client):
    r = client.get("/api/memory")
    assert r.status_code == 200
    assert "memories" in r.json()


def test_watchers_endpoints(client):
    r = client.get("/api/watchers")
    assert r.status_code == 200
    assert "suggestions" in r.json()


def test_skills_lists_real_tools(client):
    skills = client.get("/api/skills").json()["skills"]
    names = {s["name"] for s in skills}
    assert "linkedin_draft" in names
    assert "memory_remember" in names or "memory_recall" in names or len(names) >= 5


def test_files_lists_workspace(client):
    body = client.get("/api/files").json()
    assert body["files"], "workspace should not be empty"
    assert all(not f["path"].startswith(".") for f in body["files"])


def test_projects_lists_goals(client):
    body = client.get("/api/projects").json()
    assert isinstance(body["projects"], list)


def test_analytics(client):
    body = client.get("/api/analytics").json()
    for k in ("memories", "tasks_open", "approvals_approved"):
        assert k in body


def test_connectors_permission_flow(client, monkeypatch):
    from web.connectors import adapters as _adapters

    monkeypatch.setattr(
        _adapters.ADAPTERS["gmail"], "health_check", lambda creds: (True, "ok"))
    conns = client.get("/api/connectors").json()["connectors"]
    assert len(conns) >= 10
    gmail = next(c for c in conns if c["id"] == "gmail")
    assert gmail["state"] == "available"

    # Grant = the permission ask, recorded.
    r = client.post(
        "/api/connectors/gmail/grant", json={"scopes": ["Read your emails"]}
    )
    assert r.json()["status"]["state"] == "granted"

    # A finished Google sign-in (app keys + OAuth tokens) moves it to connected.
    r = client.post(
        "/api/connectors/gmail/credentials",
        json={"label": "test", "fields": {"client_id": "x", "client_secret": "y",
                                          "refresh_token": "fake-refresh-token"}},
    )
    assert r.json()["status"]["state"] == "connected"

    # Revoke wipes grants AND credentials.
    client.post("/api/connectors/gmail/revoke")
    conns = client.get("/api/connectors").json()["connectors"]
    assert next(c for c in conns if c["id"] == "gmail")["state"] == "available"


def test_credentials_need_grant_first(client):
    r = client.post(
        "/api/connectors/slack/credentials",
        json={"label": "x", "fields": {"bot_token": "y"}},
    )
    assert r.status_code == 403


def test_calendar_gated(client):
    body = client.get("/api/calendar").json()
    assert body["connected"] is False
    assert body["events"] == []
