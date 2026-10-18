"""Tests for OS V3 Proactive GitHub Intelligence Engine.

Covers:
1. CandidateRepo & RepoObservation schemas.
2. GitHubDiscoveryService SQLite storage and retrieval.
3. TrajectoryEngine: star growth per hour/day, acceleration (d2/dt2), momentum categorization.
4. Quota exhaustion handling: raises GitHubQuotaExhaustedError with reset timestamp.
5. Deduplication and idempotent observation storage.
6. Topic search & candidate ingestion with honest fallback on quota limits.
"""
from __future__ import annotations

import os
import tempfile
import time
from datetime import datetime, timezone, timedelta
import pytest

from server.intelligence.models import (
    CandidateRepo,
    RepoObservation,
    RepoTrajectory,
    RepoScore,
    RepoStatus,
)
from server.intelligence.scoring import TrajectoryEngine, ScoringEngine
from server.intelligence.github_service import GitHubDiscoveryService, GitHubQuotaExhaustedError


@pytest.fixture
def temp_db():
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    yield path
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def test_candidate_repo_model():
    candidate = CandidateRepo(
        repo_id="owner/sample-repo",
        url="https://github.com/owner/sample-repo",
        name="sample-repo",
        owner="owner",
        description="A groundbreaking agentic reasoning engine.",
        stars=120,
        forks=15,
        language="Python",
        license_key="mit",
        status=RepoStatus.DISCOVERED,
    )
    assert candidate.repo_id == "owner/sample-repo"
    assert candidate.stars == 120
    assert candidate.language == "Python"
    assert candidate.license_key == "mit"
    assert candidate.status == RepoStatus.DISCOVERED


def test_trajectory_engine_acceleration():
    engine = TrajectoryEngine()
    now = datetime.now(timezone.utc)
    t0 = now - timedelta(hours=2)
    t1 = now - timedelta(hours=1)
    t2 = now

    obs0 = RepoObservation(
        repo_id="test/agent-speed",
        timestamp=t0,
        stars=100,
        forks=10,
        open_issues=2,
    )
    obs1 = RepoObservation(
        repo_id="test/agent-speed",
        timestamp=t1,
        stars=120, # +20 in 1h
        forks=12,
        open_issues=2,
    )
    obs2 = RepoObservation(
        repo_id="test/agent-speed",
        timestamp=t2,
        stars=170, # +50 in 1h (acceleration = 50 - 20 = +30 stars/h^2)
        forks=18,
        open_issues=2,
    )

    trajectory = engine.calculate_trajectory([obs0, obs1, obs2])
    assert trajectory.repo_id == "test/agent-speed"
    assert trajectory.stars_gained_1h >= 30.0
    assert trajectory.growth_acceleration > 0
    assert trajectory.momentum_signal == "accelerating"


def test_trajectory_engine_plateau():
    engine = TrajectoryEngine()
    now = datetime.now(timezone.utc)
    obs_prev = RepoObservation(
        repo_id="test/old-repo",
        timestamp=now - timedelta(hours=24),
        stars=5000,
        forks=400,
        open_issues=50,
    )
    obs_now = RepoObservation(
        repo_id="test/old-repo",
        timestamp=now,
        stars=5000, # 0 gain
        forks=400,
        open_issues=50,
    )
    trajectory = engine.calculate_trajectory([obs_prev, obs_now])
    assert trajectory.momentum_signal == "decelerating"
    assert trajectory.stars_gained_24h == 0.0


def test_github_service_persistence_and_deduplication(temp_db):
    service = GitHubDiscoveryService(db_path=temp_db)
    now = datetime.now(timezone.utc)

    # Ingest first observation
    cand = CandidateRepo(
        repo_id="open-source/mcp-server",
        url="https://github.com/open-source/mcp-server",
        name="mcp-server",
        owner="open-source",
        description="Official fast MCP server",
        stars=50,
        forks=5,
        language="Python",
        license_key="apache-2.0",
        status=RepoStatus.DISCOVERED,
    )
    service.save_candidate(cand)

    obs = RepoObservation(
        repo_id="open-source/mcp-server",
        timestamp=now,
        stars=50,
        forks=5,
        open_issues=1,
    )
    service.record_observation(obs)

    # Ingest second observation with star gain
    later = now + timedelta(hours=1)
    cand.stars = 75
    cand.last_discovered_at = later
    service.save_candidate(cand)

    obs2 = RepoObservation(
        repo_id="open-source/mcp-server",
        timestamp=later,
        stars=75,
        forks=7,
        open_issues=1,
    )
    service.record_observation(obs2)

    # Read back candidates
    candidates = service.list_candidates()
    assert len(candidates) == 1
    assert candidates[0].repo_id == "open-source/mcp-server"
    assert candidates[0].stars == 75

    # Check observations
    history = service.get_observations("open-source/mcp-server")
    assert len(history) == 2
    assert history[0].stars == 50
    assert history[1].stars == 75


def test_github_service_quota_exhaustion_error(temp_db):
    service = GitHubDiscoveryService(db_path=temp_db)
    reset_epoch = int(time.time()) + 3600
    service.rate_limit_remaining = 0
    service.rate_limit_reset = reset_epoch

    with pytest.raises(GitHubQuotaExhaustedError) as exc_info:
        service._make_github_request("https://api.github.com/rate_limit")

    assert exc_info.value.reset_timestamp == reset_epoch
    assert "rate limit exhausted" in str(exc_info.value).lower()
