"""FastAPI routes for OS V3 Proactive GitHub Intelligence, Research Skill, and Virtual Lab."""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, Request, Response
from pydantic import BaseModel

from server.intelligence.github_service import get_discovery_service
from server.intelligence.lab import get_lab_manager
from server.intelligence.learning_store import get_learning_store
from server.intelligence.models import CandidateRepo, DiscoverySettings, RepoStatus
from server.intelligence.notifier import get_notifier
from server.intelligence.research_skill import GitHubResearchEngine
from server.intelligence.scoring import ScoringEngine

log = logging.getLogger("os.routes.discovery")

router = APIRouter(prefix="/api/discovery", tags=["Discovery & Intelligence"])


class SettingsPayload(BaseModel):
    topics: Optional[List[str]] = None
    excluded_topics: Optional[List[str]] = None
    min_high_priority_score: Optional[float] = None
    min_worthwhile_score: Optional[float] = None
    quiet_hours_start: Optional[int] = None
    quiet_hours_end: Optional[int] = None
    scan_interval_hours: Optional[int] = None
    notifications_enabled: Optional[bool] = None


class ActionDecisionPayload(BaseModel):
    decision: str  # accept, reject, dismiss, evaluate, integrate
    reason: Optional[str] = None
    rating: Optional[int] = None


@router.get("/feed")
async def get_discovery_feed(
    status: Optional[str] = Query(None),
    tier: Optional[str] = Query(None),
    include_dismissed: bool = Query(False),
    limit: int = Query(50),
) -> Dict[str, Any]:
    """Retrieve discovered candidate repositories, scores, and status."""
    svc = get_discovery_service()
    candidates = svc.list_candidates(
        status=status,
        tier=tier,
        include_dismissed=include_dismissed,
        limit=limit,
    )
    return {
        "ok": True,
        "count": len(candidates),
        "candidates": [c.to_dict() for c in candidates],
        "last_scan_at": svc.last_scan_at.isoformat() if svc.last_scan_at else None,
    }


@router.get("/repos/{owner}/{repo}")
async def get_repo_details(owner: str, repo: str) -> Dict[str, Any]:
    """Retrieve complete research report, scores, and trajectory for a repository."""
    repo_id = f"{owner}/{repo}"
    svc = get_discovery_service()
    candidate = svc.get_candidate(repo_id)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Repository '{repo_id}' not found in discovery catalog")

    observations = svc.get_observations(repo_id)

    return {
        "ok": True,
        "candidate": candidate.to_dict(),
        "observations": [o.to_dict() for o in observations],
    }


@router.post("/repos/{owner}/{repo}/research")
async def run_repo_research(owner: str, repo: str) -> Dict[str, Any]:
    """Execute the verified 7-step research skill on a candidate repository."""
    repo_id = f"{owner}/{repo}"
    svc = get_discovery_service()
    candidate = svc.get_candidate(repo_id)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Repository '{repo_id}' not found")

    candidate.status = RepoStatus.RESEARCHING
    svc.save_candidate(candidate)

    engine = GitHubResearchEngine()
    try:
        report = engine.execute_research(candidate)
        candidate.research = report

        # Re-score with research evidence
        candidate.score = ScoringEngine.score_repository(
            candidate, research=report, trajectory=candidate.trajectory
        )

        if candidate.score.is_disqualified:
            candidate.status = RepoStatus.BLOCKED
        elif candidate.score.total_score >= svc.get_settings().min_high_priority_score:
            candidate.status = RepoStatus.QUALIFIED
        else:
            candidate.status = RepoStatus.DISCOVERED

        svc.save_candidate(candidate)

        # Process proactive notification if qualified
        notif = get_notifier().process_candidate_for_notification(candidate)

        # Record learning entry
        get_learning_store().record_decision(
            repo_id=repo_id,
            decision="research_completed",
            reason=f"Action: {report.recommended_action}",
            score=candidate.score.total_score,
        )

        return {
            "ok": True,
            "candidate": candidate.to_dict(),
            "notification": notif,
        }
    except Exception as e:
        log.exception("Error executing research on %s", repo_id)
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")


@router.post("/repos/{owner}/{repo}/evaluate")
async def evaluate_repo_in_lab(owner: str, repo: str) -> Dict[str, Any]:
    """Prepare isolated workspace and run virtual lab evaluation."""
    repo_id = f"{owner}/{repo}"
    svc = get_discovery_service()
    candidate = svc.get_candidate(repo_id)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Repository '{repo_id}' not found")

    lab = get_lab_manager()
    start_t = time.perf_counter()

    outcome = lab.evaluate_repository(candidate)
    duration_s = time.perf_counter() - start_t

    svc.save_candidate(candidate)

    # Record evaluation outcome
    get_learning_store().record_evaluation_outcome(
        repo_id=repo_id,
        status=outcome.get("status", "EVALUATED"),
        duration_s=duration_s,
        outcome_summary=json.dumps(outcome.get("manifest_info", {})),
    )

    return {
        "ok": outcome.get("ok", True),
        "outcome": outcome,
        "candidate": candidate.to_dict(),
    }


@router.post("/repos/{owner}/{repo}/dismiss")
async def dismiss_repo(owner: str, repo: str, payload: Optional[ActionDecisionPayload] = None) -> Dict[str, Any]:
    """Dismiss candidate from active feed."""
    repo_id = f"{owner}/{repo}"
    svc = get_discovery_service()
    dismissed = svc.dismiss_candidate(repo_id)

    if payload:
        get_learning_store().record_decision(
            repo_id=repo_id,
            decision="dismiss",
            reason=payload.reason,
            rating=payload.rating,
        )

    return {"ok": dismissed, "repo_id": repo_id}


@router.get("/settings")
async def get_settings() -> Dict[str, Any]:
    """Get active discovery configuration."""
    cfg = get_discovery_service().get_settings()
    return {"ok": True, "settings": cfg.to_dict()}


@router.post("/settings")
async def update_settings(payload: SettingsPayload) -> Dict[str, Any]:
    """Update discovery configuration."""
    svc = get_discovery_service()
    cfg = svc.get_settings()

    if payload.topics is not None:
        cfg.topics = payload.topics
    if payload.excluded_topics is not None:
        cfg.excluded_topics = payload.excluded_topics
    if payload.min_high_priority_score is not None:
        cfg.min_high_priority_score = payload.min_high_priority_score
    if payload.min_worthwhile_score is not None:
        cfg.min_worthwhile_score = payload.min_worthwhile_score
    if payload.quiet_hours_start is not None:
        cfg.quiet_hours_start = payload.quiet_hours_start
    if payload.quiet_hours_end is not None:
        cfg.quiet_hours_end = payload.quiet_hours_end
    if payload.scan_interval_hours is not None:
        cfg.scan_interval_hours = payload.scan_interval_hours
    if payload.notifications_enabled is not None:
        cfg.notifications_enabled = payload.notifications_enabled

    svc.update_settings(cfg)
    return {"ok": True, "settings": cfg.to_dict()}


@router.get("/notifications")
async def get_notifications(unread_only: bool = Query(False), limit: int = Query(30)) -> Dict[str, Any]:
    """List proactive notifications."""
    notifs = get_notifier().list_notifications(unread_only=unread_only, limit=limit)
    return {"ok": True, "count": len(notifs), "notifications": notifs}


@router.post("/notifications/{notif_id}/action")
async def resolve_notification(notif_id: str, action: str = Query("read")) -> Dict[str, Any]:
    """Acknowledge or dismiss notification."""
    updated = get_notifier().mark_action(notif_id, action)
    return {"ok": updated, "id": notif_id}


@router.get("/lab/workspaces")
async def list_lab_workspaces() -> Dict[str, Any]:
    """List virtual lab workspaces and their files."""
    workspaces = get_lab_manager().list_workspaces()
    return {"ok": True, "count": len(workspaces), "workspaces": workspaces}


@router.post("/scan")
async def trigger_scan() -> Dict[str, Any]:
    """Trigger an on-demand GitHub discovery scan."""
    svc = get_discovery_service()
    try:
        candidates = svc.scan_all()
        return {
            "ok": True,
            "count": len(candidates),
            "candidates": [c.to_dict() for c in candidates],
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/learning/stats")
async def get_learning_stats() -> Dict[str, Any]:
    """Retrieve learning outcomes and user feedback metrics."""
    store = get_learning_store()
    history = store.get_decision_history(limit=20)
    stats = store.get_stats()
    return {
        "ok": True,
        "stats": stats,
        "history": history,
    }
