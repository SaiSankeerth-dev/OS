"""FastAPI router for OS V1 API.

Exposes the unified OS API:
- /api/v1/home (operational view: now, next, blocked, waiting)
- /api/v1/commitments
- /api/v1/tasks
- /api/v1/plan
- /api/v1/people, /projects, /goals
- /api/v1/agents (OpenCode, Browser, Research dispatch)
- /api/v1/approvals
- /api/v1/activity
- /api/v1/ingest (Universal Ingestion Pipeline trigger)
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from server.ai.agent_router import AgentRouter
from server.domain.entities import (
    Commitment,
    Goal,
    Person,
    Project,
    SourceEvent,
    Task,
)
from server.domain.enums import CommitmentStatus, TaskStatus
from server.domain.services.commitment_service import CommitmentService
from server.domain.services.task_service import TaskService
from server.execution import ApprovalEngine, CompletionEngine
from server.ingestion.pipeline import IngestionPipeline
from server.planner import PlannerEngine
from server.db.repositories.core import (
    ActionApprovalRepository,
    ActivityRepository,
    CommitmentRepository,
    PlanRepository,
    TaskRepository,
)
from server.db.repositories.world import WorldModelRepository
from server.db.database import get_db

from .home import HomeQueryService

router = APIRouter(prefix="/api/v1", tags=["os_v1"])

# Global dependencies
_db = get_db()
_home_service = HomeQueryService()
_commitment_service = CommitmentService()
_task_service = TaskService()
_planner = PlannerEngine()
_agent_router = AgentRouter()
_approval_engine = ApprovalEngine()
_completion_engine = CompletionEngine()
_ingestion_pipeline = IngestionPipeline()
_world_repo = WorldModelRepository(_db)
_activity_repo = ActivityRepository(_db)
_plan_repo = PlanRepository(_db)
_task_repo = TaskRepository(_db)
_commitment_repo = CommitmentRepository(_db)
_approval_repo = ActionApprovalRepository(_db)


# -----------------------------------------------------------------------------
# Home
# -----------------------------------------------------------------------------
@router.get("/home")
async def get_home():
    return _home_service.get_home_view("default_user")


# -----------------------------------------------------------------------------
# Commitments
# -----------------------------------------------------------------------------
class CreateCommitmentRequest(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[str] = None
    priority: int = 50
    project_id: Optional[str] = None
    goal_id: Optional[str] = None
    person_id: Optional[str] = None


@router.get("/commitments")
async def list_commitments(status: Optional[str] = None):
    st = CommitmentStatus(status) if status else None
    items = _commitment_repo.list_by_user("default_user", status=st)
    return {"commitments": [c.model_dump() for c in items]}


@router.post("/commitments")
async def create_commitment(req: CreateCommitmentRequest):
    dl = datetime.fromisoformat(req.deadline) if req.deadline else None
    c = _commitment_service.create_commitment(
        user_id="default_user",
        title=req.title,
        description=req.description,
        deadline=dl,
        priority=req.priority,
        project_id=req.project_id,
        goal_id=req.goal_id,
        person_id=req.person_id,
    )
    return {"ok": True, "commitment": c.model_dump()}


# -----------------------------------------------------------------------------
# Tasks
# -----------------------------------------------------------------------------
class CreateTaskRequest(BaseModel):
    title: str
    commitment_id: Optional[str] = None
    project_id: Optional[str] = None
    priority: int = 50
    estimated_duration_minutes: int = 60
    deadline: Optional[str] = None


@router.get("/tasks")
async def list_tasks(status: Optional[str] = None):
    st = TaskStatus(status) if status else None
    items = _task_repo.list_by_user("default_user", status=st)
    return {"tasks": [t.model_dump() for t in items]}


@router.post("/tasks")
async def create_task(req: CreateTaskRequest):
    dl = datetime.fromisoformat(req.deadline) if req.deadline else None
    t = _task_service.create_task(
        user_id="default_user",
        title=req.title,
        commitment_id=req.commitment_id,
        project_id=req.project_id,
        priority=req.priority,
        estimated_duration_minutes=req.estimated_duration_minutes,
        deadline=dl,
    )
    return {"ok": True, "task": t.model_dump()}


class CompleteTaskRequest(BaseModel):
    receipt: Optional[dict[str, Any]] = None


@router.post("/tasks/{task_id}/complete")
async def complete_task(task_id: str, req: CompleteTaskRequest):
    try:
        task, verified, msg = _completion_engine.request_completion(
            task_id=task_id,
            user_id="default_user",
            evidence_receipt=req.receipt,
        )
        return {"ok": True, "status": task.status.value, "verified": verified, "message": msg}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# -----------------------------------------------------------------------------
# Plan
# -----------------------------------------------------------------------------
@router.get("/plan")
async def get_plan(plan_date: Optional[str] = None):
    d_str = plan_date or datetime.now(timezone.utc).date().isoformat()
    active = _plan_repo.get_active_plan("default_user", d_str)
    if not active:
        return {"plan": None, "items": []}
    plan, items = active
    return {
        "plan": plan.model_dump(),
        "items": [it.model_dump() for it in items],
    }


@router.post("/plan/generate")
async def generate_plan(plan_date: Optional[str] = None):
    d = datetime.fromisoformat(plan_date).date() if plan_date else datetime.now(timezone.utc).date()
    plan, items = _planner.create_daily_plan("default_user", target_date=d)
    return {
        "ok": True,
        "plan": plan.model_dump(),
        "items": [it.model_dump() for it in items],
    }


# -----------------------------------------------------------------------------
# People, Projects, Goals
# -----------------------------------------------------------------------------
@router.get("/people")
async def list_people():
    items = _world_repo.list_people("default_user")
    return {"people": [p.model_dump() for p in items]}


@router.post("/people")
async def create_person(req: dict[str, Any]):
    p = Person(user_id="default_user", name=req.get("name", "Unknown"), email=req.get("email"))
    _world_repo.create_person(p)
    return {"ok": True, "person": p.model_dump()}


@router.get("/projects")
async def list_projects():
    items = _world_repo.list_projects("default_user")
    return {"projects": [prj.model_dump() for prj in items]}


@router.post("/projects")
async def create_project(req: dict[str, Any]):
    prj = Project(user_id="default_user", name=req.get("name", "New Project"), description=req.get("description"))
    _world_repo.create_project(prj)
    return {"ok": True, "project": prj.model_dump()}


@router.get("/goals")
async def list_goals():
    items = _world_repo.list_goals("default_user")
    return {"goals": [g.model_dump() for g in items]}


# -----------------------------------------------------------------------------
# Agents (OpenCode, Browser, Research)
# -----------------------------------------------------------------------------
class DispatchAgentRequest(BaseModel):
    agent_type: str  # coding, browser, research
    instruction: str
    task_id: Optional[str] = None
    parameters: dict[str, Any] = Field(default_factory=dict)


@router.get("/agents")
async def list_agents():
    runs = _world_repo.list_agent_runs("default_user")
    return {"agent_runs": [r.model_dump() for r in runs]}


@router.post("/agents/dispatch")
async def dispatch_agent(req: DispatchAgentRequest):
    try:
        result = _agent_router.route_task(
            task_type=req.agent_type,
            instruction=req.instruction,
            user_id="default_user",
            task_id=req.task_id,
            parameters=req.parameters,
        )
        return {"ok": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------------------------------------------------------
# Approvals
# -----------------------------------------------------------------------------
@router.get("/approvals")
async def list_approvals():
    items = _approval_repo.get_pending_approvals("default_user")
    out = []
    for ap, ac in items:
        out.append({
            "approval_id": ap.id,
            "action_id": ac.id,
            "tool_name": ac.tool_name,
            "risk_level": ac.risk_level.value,
            "arguments": ac.arguments,
            "arguments_hash": ap.arguments_hash,
            "requested_at": ap.requested_at.isoformat(),
        })
    return {"pending_approvals": out}


class DecideApprovalRequest(BaseModel):
    arguments: dict[str, Any]


@router.post("/approvals/{approval_id}/approve")
async def approve_action(approval_id: str, req: DecideApprovalRequest):
    try:
        success = _approval_engine.approve(approval_id, req.arguments, "default_user")
        return {"ok": success}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


class RejectApprovalRequest(BaseModel):
    reason: Optional[str] = ""


@router.post("/approvals/{approval_id}/reject")
async def reject_action(
    approval_id: str,
    req: Optional[RejectApprovalRequest] = None,
    reason: Optional[str] = None,
):
    r = (req.reason if req else None) or reason or ""
    success = _approval_engine.reject(approval_id, reason=r, user_id="default_user")
    return {"ok": success}


# -----------------------------------------------------------------------------
# Activity
# -----------------------------------------------------------------------------
@router.get("/activity")
async def list_activity(limit: int = 50):
    items = _activity_repo.list_recent("default_user", limit=limit)
    return {"activity": [a.model_dump() for a in items]}


# -----------------------------------------------------------------------------
# Universal Ingestion Trigger
# -----------------------------------------------------------------------------
class IngestEventRequest(BaseModel):
    source_type: str = "gmail"
    subject: str = ""
    body: str = ""
    external_event_id: Optional[str] = None


@router.post("/ingest")
async def ingest_event(req: IngestEventRequest):
    ext_id = req.external_event_id or f"evt_{int(datetime.now(timezone.utc).timestamp())}"
    event = SourceEvent(
        source_id=f"{req.source_type}_connector",
        user_id="default_user",
        event_type=f"{req.source_type}.received",
        external_event_id=ext_id,
        payload={"subject": req.subject, "body": req.body},
    )
    result = _ingestion_pipeline.process_event(event)
    return {
        "ok": True,
        "status": result.status,
        "reason": result.reason,
        "commitment": result.commitment.model_dump() if result.commitment else None,
        "task": result.task.model_dump() if result.task else None,
    }
