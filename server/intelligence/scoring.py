"""High-Value Repository Scoring and Early-Signal Trajectory Engine for OS V3.

Implements the 0-100 scoring model across 6 distinct dimensions:
1. Relevance to OS Active Goals (25 pts)
2. Observed Adoption Momentum (20 pts)
3. Technical Quality & Reproducibility (20 pts)
4. Practical Integration Benefit (15 pts)
5. Maintenance & Project Health (10 pts)
6. License & Security Assessment (10 pts)

Includes strict disqualification gating for licensing/security blockers
and missing-evidence penalty calculation.
"""
from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional, Tuple

from .models import RepoObservation, RepoTrajectory, RepoScore, ResearchReport, CandidateRepo


# Known OS Architecture Keywords & Problem Domains
OS_GOAL_KEYWORDS = {
    "agent": 3.0,
    "mcp": 4.0,
    "browser": 4.0,
    "automation": 3.0,
    "local-first": 4.0,
    "ollama": 3.5,
    "playwright": 4.0,
    "computer-use": 4.5,
    "desktop": 3.0,
    "scheduler": 2.5,
    "memory": 3.0,
    "fastapi": 2.5,
    "react": 2.5,
    "sqlite": 2.5,
    "skills": 3.5,
    "tools": 3.0,
    "research": 3.5,
    "voice": 3.0,
    "tts": 2.5,
    "stt": 2.5,
}

# Permissive open-source licenses compatible with OS MIT/Apache2 core
PERMISSIVE_LICENSES = {"mit", "apache-2.0", "bsd-2-clause", "bsd-3-clause", "isc", "unlicense", "0bsd"}
RESTRICTIVE_LICENSES = {"gpl-3.0", "agpl-3.0", "sspl", "proprietary", "cc-by-nc-4.0"}


class TrajectoryEngine:
    @staticmethod
    def calculate_trajectory(observations: List[RepoObservation]) -> RepoTrajectory:
        """Calculate momentum, star acceleration, and fork growth from chronological observations."""
        if not observations:
            return RepoTrajectory(repo_id="unknown")

        # Sort by timestamp ascending
        sorted_obs = sorted(observations, key=lambda o: o.timestamp)
        first = sorted_obs[0]
        latest = sorted_obs[-1]
        repo_id = latest.repo_id
        count = len(sorted_obs)

        if count == 1:
            return RepoTrajectory(
                repo_id=repo_id,
                observations_count=1,
                first_observed_at=first.timestamp,
                last_observed_at=latest.timestamp,
                stars_gained_1h=0.0,
                stars_gained_24h=0.0,
                growth_acceleration=0.0,
                fork_growth_24h=0.0,
                momentum_signal="emerging",
                confidence=0.5,
            )

        # Time delta in seconds
        total_delta_s = max(1.0, (latest.timestamp - first.timestamp).total_seconds())
        total_star_gain = latest.stars - first.stars
        total_fork_gain = latest.forks - first.forks

        # Normalized rates
        stars_per_hour = (total_star_gain / total_delta_s) * 3600.0
        stars_per_day = stars_per_hour * 24.0
        forks_per_day = (total_fork_gain / total_delta_s) * 86400.0

        # Acceleration: compare the second half of time vs first half
        growth_accel = 0.0
        if count >= 3:
            mid_idx = count // 2
            first_half = sorted_obs[:mid_idx + 1]
            second_half = sorted_obs[mid_idx:]

            dt1 = max(1.0, (first_half[-1].timestamp - first_half[0].timestamp).total_seconds())
            ds1 = (first_half[-1].stars - first_half[0].stars) / dt1

            dt2 = max(1.0, (second_half[-1].timestamp - second_half[0].timestamp).total_seconds())
            ds2 = (second_half[-1].stars - second_half[0].stars) / dt2

            if ds1 > 0:
                growth_accel = (ds2 - ds1) / ds1
            else:
                growth_accel = 1.0 if ds2 > 0 else 0.0

        # Momentum classification
        if growth_accel > 0.3 or stars_per_day > 15.0:
            signal = "accelerating"
        elif stars_per_day > 5.0 or (latest.stars > 50 and count <= 2 and stars_per_day > 0.5):
            signal = "emerging"
        elif stars_per_day >= 1.0:
            signal = "steady"
        else:
            signal = "decelerating"

        confidence = min(0.95, 0.4 + (count * 0.1))

        return RepoTrajectory(
            repo_id=repo_id,
            observations_count=count,
            first_observed_at=first.timestamp,
            last_observed_at=latest.timestamp,
            stars_gained_1h=stars_per_hour,
            stars_gained_24h=stars_per_day,
            growth_acceleration=growth_accel,
            fork_growth_24h=forks_per_day,
            momentum_signal=signal,
            confidence=confidence,
        )


class ScoringEngine:
    @staticmethod
    def score_repository(
        candidate: CandidateRepo,
        research: Optional[ResearchReport] = None,
        trajectory: Optional[RepoTrajectory] = None,
    ) -> RepoScore:
        """Evaluate repository score across the 6 weighted dimensions."""
        repo_id = candidate.repo_id

        # 1. License & Security Assessment (10 pts) + Disqualification Check
        lic = (candidate.license_key or "").lower().strip()
        is_disqualified = False
        disqual_reason = None
        lic_sec_score = 0.0

        if not lic or lic in ("none", "unknown", "other"):
            lic_sec_score = 2.0  # unknown license penalty
        elif lic in RESTRICTIVE_LICENSES:
            # Check if restrictive license creates copyleft issue for OS core
            lic_sec_score = 1.0
            if lic in ("sspl", "proprietary"):
                is_disqualified = True
                disqual_reason = f"Prohibitive license detected ({lic}). Not suitable for open adoption."
        elif lic in PERMISSIVE_LICENSES:
            lic_sec_score = 10.0
        else:
            lic_sec_score = 6.0

        # Supply chain / security check from research if present
        if research and research.engineering_quality:
            sec_risk = research.engineering_quality.get("security_risk", "low")
            if sec_risk == "high":
                is_disqualified = True
                disqual_reason = "High supply-chain or execution security risk identified during inspection."
                lic_sec_score = 0.0
            elif sec_risk == "medium":
                lic_sec_score = max(0.0, lic_sec_score - 4.0)

        # 2. Relevance to OS Active Goals (25 pts)
        relevance_score = 0.0
        text_corpus = f"{candidate.name} {candidate.description} {' '.join(getattr(research, 'topics', []))}".lower()

        matched_weights = 0.0
        for kw, weight in OS_GOAL_KEYWORDS.items():
            if kw in text_corpus:
                matched_weights += weight

        # Scale matched keywords to max 25
        relevance_score = min(25.0, matched_weights * 2.5)

        # 3. Observed Adoption Momentum (20 pts)
        momentum_score = 0.0
        traj = trajectory or candidate.trajectory
        if traj:
            if traj.momentum_signal == "accelerating":
                momentum_score += 10.0
            elif traj.momentum_signal == "emerging":
                momentum_score += 8.0
            elif traj.momentum_signal == "steady":
                momentum_score += 4.0

            # Stars per day bonus
            daily_gain = traj.stars_gained_24h
            if daily_gain >= 25.0:
                momentum_score += 10.0
            elif daily_gain >= 10.0:
                momentum_score += 7.0
            elif daily_gain >= 3.0:
                momentum_score += 4.0
            elif daily_gain > 0:
                momentum_score += 2.0

            # Acceleration bonus
            if traj.growth_acceleration > 0.5:
                momentum_score = min(20.0, momentum_score + 3.0)
        else:
            # Fallback based on raw star / fork ratio if no historical trajectory
            if candidate.stars > 500:
                momentum_score = 10.0
            elif candidate.stars > 100:
                momentum_score = 8.0
            elif candidate.stars > 20:
                momentum_score = 5.0
            else:
                momentum_score = 2.0

        momentum_score = min(20.0, momentum_score)

        # 4. Technical Quality & Reproducibility (20 pts)
        quality_score = 0.0
        if research and research.engineering_quality:
            eq = research.engineering_quality
            quality_score += 5.0 if eq.get("has_tests") else 1.0
            quality_score += 5.0 if eq.get("has_documentation") else 1.0
            quality_score += 5.0 if eq.get("clear_install_instructions") else 1.0
            quality_score += 5.0 if eq.get("clean_manifest") else 2.0
        else:
            # Base estimate from candidate info
            if candidate.description and len(candidate.description) > 30:
                quality_score += 6.0
            if candidate.language in ("Python", "TypeScript", "JavaScript"):
                quality_score += 6.0

        quality_score = min(20.0, quality_score)

        # 5. Practical Integration Benefit (15 pts)
        integration_score = 0.0
        if research:
            action = research.recommended_action
            if action in ("adopt", "integrate_part"):
                integration_score = 15.0
            elif action == "learn_from":
                integration_score = 10.0
            elif action == "monitor":
                integration_score = 6.0
            else:
                integration_score = 2.0
        else:
            # Estimate from domain overlap
            if relevance_score >= 15.0:
                integration_score = 12.0
            elif relevance_score >= 8.0:
                integration_score = 7.0
            else:
                integration_score = 3.0

        # 6. Maintenance & Project Health (10 pts)
        maintenance_score = 0.0
        if candidate.forks > 50:
            maintenance_score += 4.0
        elif candidate.forks > 10:
            maintenance_score += 3.0
        elif candidate.forks > 0:
            maintenance_score += 1.5

        if candidate.created_at:
            maintenance_score += 3.0
        if research and research.updated_at:
            maintenance_score += 3.0
        else:
            maintenance_score += 2.0

        maintenance_score = min(10.0, maintenance_score)

        # 7. Missing Evidence Penalty
        missing_evidence_penalty = 0.0
        if not research:
            missing_evidence_penalty += 8.0
        if not trajectory or trajectory.observations_count < 2:
            missing_evidence_penalty += 4.0
        if not candidate.license_key:
            missing_evidence_penalty += 3.0

        # Calculate Total Score
        if is_disqualified:
            total = 0.0
            tier = "background_queue"
        else:
            raw_total = (
                relevance_score
                + momentum_score
                + quality_score
                + integration_score
                + maintenance_score
                + lic_sec_score
            )
            total = max(0.0, min(100.0, raw_total - missing_evidence_penalty))

            if total >= 80.0:
                tier = "high_priority"
            elif total >= 65.0:
                tier = "worthwhile"
            else:
                tier = "background_queue"

        return RepoScore(
            repo_id=repo_id,
            total_score=total,
            relevance_score=relevance_score,
            momentum_score=momentum_score,
            quality_score=quality_score,
            integration_score=integration_score,
            maintenance_score=maintenance_score,
            license_security_score=lic_sec_score,
            is_disqualified=is_disqualified,
            disqualification_reason=disqual_reason,
            missing_evidence_penalty=missing_evidence_penalty,
            tier=tier,
        )
