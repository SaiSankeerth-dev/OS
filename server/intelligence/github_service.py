"""Proactive GitHub Discovery Service for OS V3.

Fetches trending and emerging repositories via public GitHub API and public feeds,
tracks chronological observations in SQLite, calculates growth trajectories,
and respects rate-limits/quota backoff.
"""
from __future__ import annotations

import json
import logging
import os
import sqlite3
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from .models import (
    CandidateRepo,
    DiscoverySettings,
    RepoObservation,
    RepoScore,
    RepoStatus,
    RepoTrajectory,
)
from .scoring import ScoringEngine, TrajectoryEngine

log = logging.getLogger("os.intelligence.github")


class GitHubQuotaExhaustedError(Exception):
    """Raised when GitHub API rate-limit is exhausted, preserving the reset timestamp."""
    def __init__(self, reset_timestamp: int):
        self.reset_timestamp = reset_timestamp
        reset_dt = datetime.fromtimestamp(reset_timestamp, tz=timezone.utc).isoformat()
        super().__init__(f"GitHub API rate limit exhausted. Resets at {reset_dt}")


class GitHubDiscoveryService:
    def __init__(self, db_path: str | Path = "data/discovery.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.github_token = os.environ.get("GITHUB_TOKEN", "").strip()
        self.rate_limit_remaining: Optional[int] = None
        self.rate_limit_reset: Optional[int] = None
        self.last_scan_at: Optional[datetime] = None
        self._init_db()

    def _init_db(self) -> None:
        """Initialize SQLite database for discovery candidate tracking and observations."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS observations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    repo_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    stars INTEGER NOT NULL,
                    forks INTEGER NOT NULL,
                    open_issues INTEGER NOT NULL,
                    watchers INTEGER NOT NULL DEFAULT 0,
                    latest_commit_date TEXT,
                    latest_release_tag TEXT,
                    latest_release_date TEXT
                )
                """
            )
            conn.execute("CREATE INDEX IF NOT EXISTS idx_obs_repo_ts ON observations(repo_id, timestamp)")

            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS candidates (
                    repo_id TEXT PRIMARY KEY,
                    url TEXT NOT NULL,
                    name TEXT NOT NULL,
                    owner TEXT NOT NULL,
                    description TEXT,
                    stars INTEGER NOT NULL,
                    forks INTEGER NOT NULL,
                    language TEXT,
                    license_key TEXT,
                    status TEXT NOT NULL,
                    score_json TEXT,
                    trajectory_json TEXT,
                    research_json TEXT,
                    dismissed INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT,
                    last_discovered_at TEXT NOT NULL
                )
                """
            )

            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS discovery_settings (
                    key TEXT PRIMARY KEY,
                    value_json TEXT NOT NULL
                )
                """
            )
            conn.commit()

    def get_settings(self) -> DiscoverySettings:
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute("SELECT value_json FROM discovery_settings WHERE key = 'config'").fetchone()
            if row:
                try:
                    data = json.loads(row[0])
                    return DiscoverySettings(
                        topics=data.get("topics", DiscoverySettings().topics),
                        excluded_topics=data.get("excluded_topics", DiscoverySettings().excluded_topics),
                        min_high_priority_score=float(data.get("min_high_priority_score", 80.0)),
                        min_worthwhile_score=float(data.get("min_worthwhile_score", 65.0)),
                        quiet_hours_start=int(data.get("quiet_hours_start", 23)),
                        quiet_hours_end=int(data.get("quiet_hours_end", 7)),
                        scan_interval_hours=int(data.get("scan_interval_hours", 2)),
                        notifications_enabled=bool(data.get("notifications_enabled", True)),
                    )
                except Exception as e:
                    log.warning("Corrupt settings, returning defaults: %s", e)
        return DiscoverySettings()

    def update_settings(self, settings: DiscoverySettings) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO discovery_settings (key, value_json) VALUES ('config', ?)",
                (json.dumps(settings.to_dict()),),
            )
            conn.commit()

    def record_observation(self, obs: RepoObservation) -> None:
        """Store timestamped observation."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                INSERT INTO observations (
                    repo_id, timestamp, stars, forks, open_issues, watchers,
                    latest_commit_date, latest_release_tag, latest_release_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    obs.repo_id,
                    obs.timestamp.isoformat(),
                    obs.stars,
                    obs.forks,
                    obs.open_issues,
                    obs.watchers,
                    obs.latest_commit_date,
                    obs.latest_release_tag,
                    obs.latest_release_date,
                ),
            )
            conn.commit()

    def get_observations(self, repo_id: str) -> List[RepoObservation]:
        """Fetch all historical observations for a repository."""
        with sqlite3.connect(self.db_path) as conn:
            rows = conn.execute(
                """
                SELECT repo_id, timestamp, stars, forks, open_issues, watchers,
                       latest_commit_date, latest_release_tag, latest_release_date
                FROM observations
                WHERE repo_id = ?
                ORDER BY timestamp ASC
                """,
                (repo_id,),
            ).fetchall()

            return [
                RepoObservation(
                    repo_id=r[0],
                    timestamp=datetime.fromisoformat(r[1]),
                    stars=r[2],
                    forks=r[3],
                    open_issues=r[4],
                    watchers=r[5],
                    latest_commit_date=r[6],
                    latest_release_tag=r[7],
                    latest_release_date=r[8],
                )
                for r in rows
            ]

    def _make_github_request(self, url: str) -> Dict[str, Any]:
        """Perform authenticated or unauthenticated HTTP request to GitHub API with rate-limit tracking."""
        # Check quota backoff
        if self.rate_limit_remaining is not None and self.rate_limit_remaining <= 0:
            if self.rate_limit_reset and time.time() < self.rate_limit_reset:
                raise GitHubQuotaExhaustedError(self.rate_limit_reset)

        req = urllib.request.Request(url)
        req.add_header("User-Agent", "OS-AI-Assistant/3.0 (+https://github.com/OS)")
        req.add_header("Accept", "application/vnd.github.v3+json")
        if self.github_token:
            req.add_header("Authorization", f"Bearer {self.github_token}")

        try:
            with urllib.request.urlopen(req, timeout=12) as response:
                # Capture rate limit headers
                rem = response.headers.get("X-RateLimit-Remaining")
                rst = response.headers.get("X-RateLimit-Reset")
                if rem is not None:
                    self.rate_limit_remaining = int(rem)
                if rst is not None:
                    self.rate_limit_reset = int(rst)

                raw = response.read().decode("utf-8")
                return json.loads(raw)
        except urllib.error.HTTPError as e:
            rem = e.headers.get("X-RateLimit-Remaining")
            rst = e.headers.get("X-RateLimit-Reset")
            if rem is not None:
                self.rate_limit_remaining = int(rem)
            if rst is not None:
                self.rate_limit_reset = int(rst)

            if e.code == 403 and self.rate_limit_remaining == 0:
                raise GitHubQuotaExhaustedError(self.rate_limit_reset or int(time.time() + 3600))
            raise

    def scan_topic(self, topic: str, limit: int = 15) -> List[Dict[str, Any]]:
        """Search GitHub for recent repositories in a specific topic."""
        # Discover repos created or updated recently with traction
        seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=14)).strftime("%Y-%m-%d")
        query = f"topic:{topic}+stars:>5+pushed:>{seven_days_ago}"
        url = f"https://api.github.com/search/repositories?q={urllib.parse.quote(query)}&sort=stars&order=desc&per_page={limit}"

        try:
            data = self._make_github_request(url)
            return data.get("items", [])
        except GitHubQuotaExhaustedError:
            log.warning("GitHub quota exhausted while scanning topic %s", topic)
            raise
        except Exception as e:
            log.warning("Failed scanning topic %s: %s", topic, e)
            return []

    def scan_all(self, custom_candidates: Optional[List[Dict[str, Any]]] = None) -> List[CandidateRepo]:
        """Perform discovery scan over configured topics and process candidates.

        If custom_candidates fixture is passed (for unit testing), uses it deterministically.
        """
        self.last_scan_at = datetime.now(timezone.utc)
        settings = self.get_settings()
        items: List[Dict[str, Any]] = []

        if custom_candidates is not None:
            items = custom_candidates
        else:
            for topic in settings.topics[:5]:  # scan top 5 active topics
                try:
                    topic_items = self.scan_topic(topic, limit=10)
                    items.extend(topic_items)
                except GitHubQuotaExhaustedError as qe:
                    log.warning("Scan paused due to GitHub rate limit. Reset at: %s", qe.reset_timestamp)
                    break
                except Exception as e:
                    log.warning("Error scanning topic %s: %s", topic, e)

        # Deduplicate items by full_name
        unique_items = {}
        for item in items:
            repo_id = item.get("full_name") or f"{item.get('owner', {}).get('login', 'unknown')}/{item.get('name', 'repo')}"
            if repo_id not in unique_items:
                unique_items[repo_id] = item

        discovered: List[CandidateRepo] = []
        now = datetime.now(timezone.utc)

        for repo_id, data in unique_items.items():
            name = data.get("name", repo_id.split("/")[-1])
            owner = data.get("owner", {}).get("login", repo_id.split("/")[0]) if isinstance(data.get("owner"), dict) else repo_id.split("/")[0]
            url = data.get("html_url", f"https://github.com/{repo_id}")
            description = data.get("description") or ""
            stars = int(data.get("stargazers_count", data.get("stars", 0)))
            forks = int(data.get("forks_count", data.get("forks", 0)))
            issues = int(data.get("open_issues_count", data.get("open_issues", 0)))
            language = data.get("language") or "Python"
            lic_data = data.get("license") or {}
            lic_key = lic_data.get("key", "other") if isinstance(lic_data, dict) else str(lic_data)
            created_at = data.get("created_at")

            # 1. Record current observation
            obs = RepoObservation(
                repo_id=repo_id,
                timestamp=now,
                stars=stars,
                forks=forks,
                open_issues=issues,
                latest_commit_date=data.get("pushed_at"),
            )
            self.record_observation(obs)

            # 2. Compute Trajectory
            all_obs = self.get_observations(repo_id)
            trajectory = TrajectoryEngine.calculate_trajectory(all_obs)

            # 3. Create candidate
            candidate = CandidateRepo(
                repo_id=repo_id,
                url=url,
                name=name,
                owner=owner,
                description=description,
                stars=stars,
                forks=forks,
                language=language,
                license_key=lic_key,
                status=RepoStatus.DISCOVERED,
                trajectory=trajectory,
                created_at=created_at,
                last_discovered_at=now,
            )

            # 4. Score Candidate
            score = ScoringEngine.score_repository(candidate, trajectory=trajectory)
            candidate.score = score

            if score.is_disqualified:
                candidate.status = RepoStatus.BLOCKED
            elif score.total_score >= settings.min_high_priority_score:
                candidate.status = RepoStatus.QUALIFIED
            else:
                candidate.status = RepoStatus.DISCOVERED

            # 5. Persist Candidate
            self.save_candidate(candidate)
            discovered.append(candidate)

        return discovered

    def save_candidate(self, candidate: CandidateRepo) -> None:
        """Persist or update candidate in SQLite."""
        with sqlite3.connect(self.db_path) as conn:
            score_json = json.dumps(candidate.score.to_dict()) if candidate.score else None
            traj_json = json.dumps(candidate.trajectory.to_dict()) if candidate.trajectory else None
            res_json = json.dumps(candidate.research.to_dict()) if candidate.research else None

            conn.execute(
                """
                INSERT INTO candidates (
                    repo_id, url, name, owner, description, stars, forks,
                    language, license_key, status, score_json, trajectory_json,
                    research_json, dismissed, created_at, last_discovered_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(repo_id) DO UPDATE SET
                    stars=excluded.stars,
                    forks=excluded.forks,
                    status=excluded.status,
                    score_json=excluded.score_json,
                    trajectory_json=excluded.trajectory_json,
                    research_json=COALESCE(excluded.research_json, candidates.research_json),
                    dismissed=excluded.dismissed,
                    last_discovered_at=excluded.last_discovered_at
                """,
                (
                    candidate.repo_id,
                    candidate.url,
                    candidate.name,
                    candidate.owner,
                    candidate.description,
                    candidate.stars,
                    candidate.forks,
                    candidate.language,
                    candidate.license_key,
                    candidate.status.value,
                    score_json,
                    traj_json,
                    res_json,
                    1 if candidate.dismissed else 0,
                    candidate.created_at,
                    candidate.last_discovered_at.isoformat(),
                ),
            )
            conn.commit()

    def get_candidate(self, repo_id: str) -> Optional[CandidateRepo]:
        """Fetch candidate from database by repo_id."""
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                """
                SELECT repo_id, url, name, owner, description, stars, forks,
                       language, license_key, status, score_json, trajectory_json,
                       research_json, dismissed, created_at, last_discovered_at
                FROM candidates
                WHERE repo_id = ?
                """,
                (repo_id,),
            ).fetchone()

            if not row:
                return None

            return self._row_to_candidate(row)

    def list_candidates(
        self,
        status: Optional[str] = None,
        tier: Optional[str] = None,
        include_dismissed: bool = False,
        limit: int = 50,
    ) -> List[CandidateRepo]:
        """List candidates with optional filtering."""
        query = "SELECT repo_id, url, name, owner, description, stars, forks, language, license_key, status, score_json, trajectory_json, research_json, dismissed, created_at, last_discovered_at FROM candidates WHERE 1=1"
        params: list[Any] = []

        if not include_dismissed:
            query += " AND dismissed = 0"
        if status:
            query += " AND status = ?"
            params.append(status)

        query += " ORDER BY stars DESC LIMIT ?"
        params.append(limit)

        with sqlite3.connect(self.db_path) as conn:
            rows = conn.execute(query, params).fetchall()
            candidates = [self._row_to_candidate(r) for r in rows]

            if tier:
                candidates = [c for c in candidates if c.score and c.score.tier == tier]

            return candidates

    def dismiss_candidate(self, repo_id: str) -> bool:
        """Mark candidate as dismissed so it does not appear in active feeds."""
        with sqlite3.connect(self.db_path) as conn:
            cur = conn.execute("UPDATE candidates SET dismissed = 1 WHERE repo_id = ?", (repo_id,))
            conn.commit()
            return cur.rowcount > 0

    def _row_to_candidate(self, row: tuple) -> CandidateRepo:
        status_val = row[9]
        try:
            status_enum = RepoStatus(status_val)
        except ValueError:
            status_enum = RepoStatus.DISCOVERED

        score = None
        if row[10]:
            try:
                s_data = json.loads(row[10])
                b = s_data.get("breakdown", {})
                score = RepoScore(
                    repo_id=row[0],
                    total_score=float(s_data.get("total_score", 0.0)),
                    relevance_score=float(b.get("relevance", 0.0)),
                    momentum_score=float(b.get("momentum", 0.0)),
                    quality_score=float(b.get("quality", 0.0)),
                    integration_score=float(b.get("integration", 0.0)),
                    maintenance_score=float(b.get("maintenance", 0.0)),
                    license_security_score=float(b.get("license_security", 0.0)),
                    is_disqualified=bool(s_data.get("is_disqualified", False)),
                    disqualification_reason=s_data.get("disqualification_reason"),
                    tier=s_data.get("tier", "background_queue"),
                )
            except Exception:
                pass

        trajectory = None
        if row[11]:
            try:
                t_data = json.loads(row[11])
                trajectory = RepoTrajectory(
                    repo_id=row[0],
                    observations_count=int(t_data.get("observations_count", 1)),
                    first_observed_at=datetime.fromisoformat(t_data.get("first_observed_at", datetime.now(timezone.utc).isoformat())),
                    last_observed_at=datetime.fromisoformat(t_data.get("last_observed_at", datetime.now(timezone.utc).isoformat())),
                    stars_gained_1h=float(t_data.get("stars_gained_1h", 0.0)),
                    stars_gained_24h=float(t_data.get("stars_gained_24h", 0.0)),
                    growth_acceleration=float(t_data.get("growth_acceleration", 0.0)),
                    fork_growth_24h=float(t_data.get("fork_growth_24h", 0.0)),
                    momentum_signal=t_data.get("momentum_signal", "emerging"),
                    confidence=float(t_data.get("confidence", 0.8)),
                )
            except Exception:
                pass

        research = None
        if row[12]:
            try:
                r_data = json.loads(row[12])
                research = ResearchReport(
                    repo_id=row[0],
                    canonical_url=r_data.get("canonical_url", row[1]),
                    name=r_data.get("name", row[2]),
                    owner=r_data.get("owner", row[3]),
                    description=r_data.get("description", row[4] or ""),
                    license=r_data.get("license", row[8] or ""),
                    primary_language=r_data.get("primary_language", row[7] or ""),
                    topics=r_data.get("topics", []),
                    created_at=r_data.get("created_at"),
                    updated_at=r_data.get("updated_at"),
                    executive_summary=r_data.get("executive_summary", ""),
                    why_it_matters_now=r_data.get("why_it_matters_now", ""),
                    technical_capabilities=r_data.get("technical_capabilities", []),
                    architecture_relevance=r_data.get("architecture_relevance", ""),
                    engineering_quality=r_data.get("engineering_quality", {}),
                    limitations=r_data.get("limitations", []),
                    os_gap_addressed=r_data.get("os_gap_addressed", ""),
                    recommended_action=r_data.get("recommended_action", "monitor"),
                    confidence_score=float(r_data.get("confidence_score", 0.8)),
                    independent_review=r_data.get("independent_review", {}),
                    tested_in_lab=bool(r_data.get("tested_in_lab", False)),
                    lab_test_outcome=r_data.get("lab_test_outcome"),
                )
            except Exception:
                pass

        return CandidateRepo(
            repo_id=row[0],
            url=row[1],
            name=row[2],
            owner=row[3],
            description=row[4] or "",
            stars=row[5],
            forks=row[6],
            language=row[7] or "Python",
            license_key=row[8] or "unknown",
            status=status_enum,
            score=score,
            trajectory=trajectory,
            research=research,
            dismissed=bool(row[13]),
            created_at=row[14],
            last_discovered_at=datetime.fromisoformat(row[15]),
        )


_DISCOVERY_SERVICE: Optional[GitHubDiscoveryService] = None


def get_discovery_service() -> GitHubDiscoveryService:
    global _DISCOVERY_SERVICE
    if _DISCOVERY_SERVICE is None:
        _DISCOVERY_SERVICE = GitHubDiscoveryService()
    return _DISCOVERY_SERVICE


async def scheduled_discovery_job() -> Dict[str, Any]:
    """Background scheduler job entrypoint."""
    svc = get_discovery_service()
    try:
        candidates = svc.scan_all()
        return {"ok": True, "discovered_count": len(candidates)}
    except GitHubQuotaExhaustedError as qe:
        return {"ok": False, "quota_exhausted": True, "reset_timestamp": qe.reset_timestamp}
    except Exception as e:
        return {"ok": False, "error": str(e)}
