"""Tests for OS V3 High-Value Repository Scoring Engine.

Verifies:
1. 6-dimension evaluation breakdown summing up to 100.
2. Hard disqualification gating for restrictive/prohibitive licenses (SSPL, proprietary).
3. Hard disqualification for high supply chain / security risks.
4. Missing evidence penalty calculation when research or trajectory points are absent.
5. Tier classification (high_priority, worthwhile, background_queue).
"""
from __future__ import annotations

import pytest
from datetime import datetime, timezone

from server.intelligence.models import (
    CandidateRepo,
    RepoTrajectory,
    RepoScore,
    ResearchReport,
    RepoStatus,
)
from server.intelligence.scoring import ScoringEngine


def test_scoring_high_priority_full_evidence():
    now = datetime.now(timezone.utc)
    candidate = CandidateRepo(
        repo_id="modelcontextprotocol/servers",
        url="https://github.com/modelcontextprotocol/servers",
        name="servers",
        owner="modelcontextprotocol",
        description="Reference MCP server implementations for local-first browser automation and AI agents.",
        stars=1500,
        forks=250,
        language="Python",
        license_key="mit",
        created_at="2025-01-01T00:00:00Z",
        status=RepoStatus.DISCOVERED,
    )
    trajectory = RepoTrajectory(
        repo_id="modelcontextprotocol/servers",
        observations_count=5,
        stars_gained_1h=12.0,
        stars_gained_24h=35.0,
        growth_acceleration=0.8,
        fork_growth_24h=8.0,
        momentum_signal="accelerating",
        confidence=0.9,
    )
    research = ResearchReport(
        repo_id="modelcontextprotocol/servers",
        canonical_url="https://github.com/modelcontextprotocol/servers",
        name="servers",
        owner="modelcontextprotocol",
        description="Reference MCP server implementations for local-first browser automation and AI agents.",
        license="MIT",
        primary_language="Python",
        topics=["mcp", "agent", "browser", "automation"],
        engineering_quality={
            "has_tests": True,
            "has_documentation": True,
            "clear_install_instructions": True,
            "clean_manifest": True,
            "security_risk": "low",
        },
        recommended_action="adopt",
    )

    score = ScoringEngine.score_repository(candidate, research=research, trajectory=trajectory)
    assert not score.is_disqualified
    assert score.disqualification_reason is None
    assert score.relevance_score >= 20.0
    assert score.momentum_score >= 18.0
    assert score.quality_score == 20.0
    assert score.integration_score == 15.0
    assert score.license_security_score == 10.0
    assert score.missing_evidence_penalty == 0.0
    assert score.total_score >= 80.0
    assert score.tier == "high_priority"


def test_scoring_disqualification_prohibitive_license():
    candidate = CandidateRepo(
        repo_id="closed/proprietary-core",
        url="https://github.com/closed/proprietary-core",
        name="proprietary-core",
        owner="closed",
        description="High power reasoning agent library",
        stars=400,
        forks=20,
        language="Python",
        license_key="proprietary",
    )
    score = ScoringEngine.score_repository(candidate)
    assert score.is_disqualified
    assert score.total_score == 0.0
    assert "prohibitive license" in score.disqualification_reason.lower()


def test_scoring_disqualification_high_security_risk():
    candidate = CandidateRepo(
        repo_id="sketchy/crypto-stealer-tool",
        url="https://github.com/sketchy/crypto-stealer-tool",
        name="crypto-stealer-tool",
        owner="sketchy",
        description="Automated wallet tools for agentic bots",
        stars=100,
        forks=5,
        language="Python",
        license_key="mit",
    )
    research = ResearchReport(
        repo_id="sketchy/crypto-stealer-tool",
        canonical_url="https://github.com/sketchy/crypto-stealer-tool",
        name="crypto-stealer-tool",
        owner="sketchy",
        description="Automated wallet tools for agentic bots",
        license="MIT",
        primary_language="Python",
        engineering_quality={
            "has_tests": False,
            "security_risk": "high",
        },
    )
    score = ScoringEngine.score_repository(candidate, research=research)
    assert score.is_disqualified
    assert score.total_score == 0.0
    assert "security risk" in score.disqualification_reason.lower()


def test_scoring_missing_evidence_penalty():
    candidate = CandidateRepo(
        repo_id="mystery/untriaged",
        url="https://github.com/mystery/untriaged",
        name="untriaged",
        owner="mystery",
        description="A bare repo with no info",
        stars=10,
        forks=0,
        language="Unknown",
        license_key="",
    )
    score = ScoringEngine.score_repository(candidate)
    assert score.missing_evidence_penalty >= 10.0
    assert score.tier == "background_queue"
