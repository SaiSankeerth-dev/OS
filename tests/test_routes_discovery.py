"""Tests for OS V3 Discovery API Routes.

Verifies:
1. GET /api/discovery/feed
2. GET /api/discovery/settings & POST /api/discovery/settings
3. GET /api/discovery/notifications
4. GET /api/discovery/lab/workspaces
5. GET /api/discovery/learning/stats
6. POST /api/discovery/repos/{owner}/{repo}/research
7. POST /api/discovery/repos/{owner}/{repo}/dismiss
"""
from __future__ import annotations

import os
import pytest
from fastapi.testclient import TestClient

from server.intelligence.github_service import get_discovery_service
from server.intelligence.models import CandidateRepo, RepoStatus
from web.server import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def seed_test_candidate():
    svc = get_discovery_service()
    cand = CandidateRepo(
        repo_id="testorg/smart-agent",
        url="https://github.com/testorg/smart-agent",
        name="smart-agent",
        owner="testorg",
        description="Autonomous desktop agent with MCP support",
        stars=85,
        forks=12,
        language="Python",
        license_key="mit",
        status=RepoStatus.DISCOVERED,
    )
    svc.save_candidate(cand)
    yield cand


def test_get_discovery_feed():
    res = client.get("/api/discovery/feed")
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True
    assert "candidates" in data
    assert any(c["repo_id"] == "testorg/smart-agent" for c in data["candidates"])


def test_discovery_settings_crud():
    # Read settings
    get_res = client.get("/api/discovery/settings")
    assert get_res.status_code == 200
    assert get_res.json()["ok"] is True

    # Update settings
    post_res = client.post(
        "/api/discovery/settings",
        json={
            "topics": ["ai-agents", "mcp-servers", "browser-use"],
            "min_high_priority_score": 85.0,
            "quiet_hours_start": 22,
        },
    )
    assert post_res.status_code == 200
    updated = post_res.json()["settings"]
    assert "ai-agents" in updated["topics"]
    assert updated["min_high_priority_score"] == 85.0
    assert updated["quiet_hours_start"] == 22


def test_get_notifications():
    res = client.get("/api/discovery/notifications")
    assert res.status_code == 200
    assert res.json()["ok"] is True
    assert "notifications" in res.json()


def test_get_lab_workspaces():
    res = client.get("/api/discovery/lab/workspaces")
    assert res.status_code == 200
    assert res.json()["ok"] is True
    assert isinstance(res.json()["workspaces"], list)


def test_get_learning_stats():
    res = client.get("/api/discovery/learning/stats")
    assert res.status_code == 200
    assert res.json()["ok"] is True
    assert "stats" in res.json()


def test_run_repo_research_route():
    res = client.post("/api/discovery/repos/testorg/smart-agent/research")
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True
    assert data["candidate"]["research"] is not None
    assert data["candidate"]["score"] is not None
    assert data["candidate"]["status"] in ("QUALIFIED", "DISCOVERED")


def test_dismiss_repo_route():
    res = client.post(
        "/api/discovery/repos/testorg/smart-agent/dismiss",
        json={"decision": "dismiss", "reason": "Not relevant to current roadmap", "rating": 2},
    )
    assert res.status_code == 200
    assert res.json()["ok"] is True
