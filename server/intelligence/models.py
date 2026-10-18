"""Data models for OS Proactive GitHub Intelligence and Research Subsystem."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional


class RepoStatus(str, Enum):
    DISCOVERED = "DISCOVERED"
    RESEARCHING = "RESEARCHING"
    QUALIFIED = "QUALIFIED"
    QUEUED_FOR_EVALUATION = "QUEUED_FOR_EVALUATION"
    TESTING = "TESTING"
    EVALUATED = "EVALUATED"
    RECOMMENDED = "RECOMMENDED"
    REJECTED = "REJECTED"
    BLOCKED = "BLOCKED"


@dataclass
class RepoObservation:
    repo_id: str
    timestamp: datetime
    stars: int
    forks: int
    open_issues: int
    watchers: int = 0
    latest_commit_date: Optional[str] = None
    latest_release_tag: Optional[str] = None
    latest_release_date: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "repo_id": self.repo_id,
            "timestamp": self.timestamp.isoformat(),
            "stars": self.stars,
            "forks": self.forks,
            "open_issues": self.open_issues,
            "watchers": self.watchers,
            "latest_commit_date": self.latest_commit_date,
            "latest_release_tag": self.latest_release_tag,
            "latest_release_date": self.latest_release_date,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> RepoObservation:
        ts = data.get("timestamp")
        if isinstance(ts, str):
            ts = datetime.fromisoformat(ts)
        elif not isinstance(ts, datetime):
            ts = datetime.now(timezone.utc)
        return cls(
            repo_id=data["repo_id"],
            timestamp=ts,
            stars=int(data.get("stars", 0)),
            forks=int(data.get("forks", 0)),
            open_issues=int(data.get("open_issues", 0)),
            watchers=int(data.get("watchers", 0)),
            latest_commit_date=data.get("latest_commit_date"),
            latest_release_tag=data.get("latest_release_tag"),
            latest_release_date=data.get("latest_release_date"),
        )


@dataclass
class RepoTrajectory:
    repo_id: str
    observations_count: int = 1
    first_observed_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    last_observed_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    stars_gained_1h: float = 0.0
    stars_gained_24h: float = 0.0
    growth_acceleration: float = 0.0  # rate of star gain change
    fork_growth_24h: float = 0.0
    momentum_signal: str = "emerging"  # emerging, accelerating, steady, decelerating
    confidence: float = 0.8

    def to_dict(self) -> Dict[str, Any]:
        return {
            "repo_id": self.repo_id,
            "observations_count": self.observations_count,
            "first_observed_at": self.first_observed_at.isoformat(),
            "last_observed_at": self.last_observed_at.isoformat(),
            "stars_gained_1h": round(self.stars_gained_1h, 2),
            "stars_gained_24h": round(self.stars_gained_24h, 2),
            "growth_acceleration": round(self.growth_acceleration, 3),
            "fork_growth_24h": round(self.fork_growth_24h, 2),
            "momentum_signal": self.momentum_signal,
            "confidence": round(self.confidence, 2),
        }


@dataclass
class RepoScore:
    repo_id: str
    total_score: float = 0.0
    relevance_score: float = 0.0      # max 25
    momentum_score: float = 0.0       # max 20
    quality_score: float = 0.0        # max 20
    integration_score: float = 0.0    # max 15
    maintenance_score: float = 0.0    # max 10
    license_security_score: float = 0.0 # max 10
    is_disqualified: bool = False
    disqualification_reason: Optional[str] = None
    missing_evidence_penalty: float = 0.0
    tier: str = "background_queue"   # high_priority, worthwhile, background_queue

    def to_dict(self) -> Dict[str, Any]:
        return {
            "repo_id": self.repo_id,
            "total_score": round(self.total_score, 1),
            "breakdown": {
                "relevance": round(self.relevance_score, 1),
                "momentum": round(self.momentum_score, 1),
                "quality": round(self.quality_score, 1),
                "integration": round(self.integration_score, 1),
                "maintenance": round(self.maintenance_score, 1),
                "license_security": round(self.license_security_score, 1),
                "missing_evidence_penalty": round(self.missing_evidence_penalty, 1),
            },
            "is_disqualified": self.is_disqualified,
            "disqualification_reason": self.disqualification_reason,
            "tier": self.tier,
        }


@dataclass
class ResearchReport:
    repo_id: str
    canonical_url: str
    name: str
    owner: str
    description: str
    license: str
    primary_language: str
    topics: List[str] = field(default_factory=list)
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    executive_summary: str = ""
    why_it_matters_now: str = ""
    technical_capabilities: List[str] = field(default_factory=list)
    architecture_relevance: str = ""
    engineering_quality: Dict[str, Any] = field(default_factory=dict)
    limitations: List[str] = field(default_factory=list)
    os_gap_addressed: str = ""
    recommended_action: str = "monitor"  # adopt, integrate_part, learn_from, monitor, reject
    confidence_score: float = 0.8
    independent_review: Dict[str, Any] = field(default_factory=dict)
    tested_in_lab: bool = False
    lab_test_outcome: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "repo_id": self.repo_id,
            "canonical_url": self.canonical_url,
            "name": self.name,
            "owner": self.owner,
            "description": self.description,
            "license": self.license,
            "primary_language": self.primary_language,
            "topics": self.topics,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "executive_summary": self.executive_summary,
            "why_it_matters_now": self.why_it_matters_now,
            "technical_capabilities": self.technical_capabilities,
            "architecture_relevance": self.architecture_relevance,
            "engineering_quality": self.engineering_quality,
            "limitations": self.limitations,
            "os_gap_addressed": self.os_gap_addressed,
            "recommended_action": self.recommended_action,
            "confidence_score": self.confidence_score,
            "independent_review": self.independent_review,
            "tested_in_lab": self.tested_in_lab,
            "lab_test_outcome": self.lab_test_outcome,
        }


@dataclass
class CandidateRepo:
    repo_id: str
    url: str
    name: str
    owner: str
    description: str
    stars: int
    forks: int
    language: str
    license_key: str
    status: RepoStatus = RepoStatus.DISCOVERED
    trajectory: Optional[RepoTrajectory] = None
    score: Optional[RepoScore] = None
    research: Optional[ResearchReport] = None
    created_at: Optional[str] = None
    last_discovered_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    dismissed: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "repo_id": self.repo_id,
            "url": self.url,
            "name": self.name,
            "owner": self.owner,
            "description": self.description,
            "stars": self.stars,
            "forks": self.forks,
            "language": self.language,
            "license_key": self.license_key,
            "status": self.status.value,
            "trajectory": self.trajectory.to_dict() if self.trajectory else None,
            "score": self.score.to_dict() if self.score else None,
            "research": self.research.to_dict() if self.research else None,
            "created_at": self.created_at,
            "last_discovered_at": self.last_discovered_at.isoformat(),
            "dismissed": self.dismissed,
        }


@dataclass
class DiscoverySettings:
    topics: List[str] = field(
        default_factory=lambda: [
            "ai-agents",
            "coding-agents",
            "agent-skills",
            "research",
            "mcp",
            "browser-automation",
            "developer-productivity",
            "local-ai",
            "computer-use",
            "software-engineering",
        ]
    )
    excluded_topics: List[List[str]] = field(
        default_factory=lambda: [
            "cryptocurrency",
            "blockchain",
            "gambling",
            "dating",
        ]
    )
    min_high_priority_score: float = 80.0
    min_worthwhile_score: float = 65.0
    quiet_hours_start: int = 23
    quiet_hours_end: int = 7
    scan_interval_hours: int = 2
    notifications_enabled: bool = True

    def to_dict(self) -> Dict[str, Any]:
        return {
            "topics": self.topics,
            "excluded_topics": self.excluded_topics,
            "min_high_priority_score": self.min_high_priority_score,
            "min_worthwhile_score": self.min_worthwhile_score,
            "quiet_hours_start": self.quiet_hours_start,
            "quiet_hours_end": self.quiet_hours_end,
            "scan_interval_hours": self.scan_interval_hours,
            "notifications_enabled": self.notifications_enabled,
        }
