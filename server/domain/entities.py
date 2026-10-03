"""Core domain entities for OS.

Represents the user's digital world model: commitments, tasks, dependencies,
goals, projects, people, evidence, plans, actions, approvals, verification,
and activity provenance.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Optional
from pydantic import BaseModel, Field

from .enums import (
    ActionStatus,
    ActorType,
    AgentRunStatus,
    ApprovalStatus,
    CommitmentStatus,
    DependencyStatus,
    DependencyType,
    PlanItemStatus,
    PlanStatus,
    ProcessingStatus,
    RiskLevel,
    SourceStatus,
    TaskStatus,
    VerificationStatus,
    WorkflowStatus,
)


def _new_id() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class BaseEntity(BaseModel):
    id: str = Field(default_factory=_new_id)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class User(BaseEntity):
    email: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    timezone: str = "UTC"
    is_active: bool = True


class Profile(BaseModel):
    user_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    language: str = "en"
    preferred_fast_model: Optional[str] = None
    preferred_reasoning_model: Optional[str] = None
    preferred_local_model: Optional[str] = None
    local_only_mode: bool = False
    autonomy_level: str = "balanced"  # manual, balanced, autonomous
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class Source(BaseEntity):
    user_id: str
    type: str  # gmail, google_calendar, github, slack, files, browser, etc.
    name: str
    status: SourceStatus = SourceStatus.CONNECTED
    permissions: dict[str, Any] = Field(default_factory=dict)
    external_account_id: Optional[str] = None
    last_sync_at: Optional[datetime] = None
    last_error: Optional[str] = None


class SourceEvent(BaseModel):
    id: str = Field(default_factory=_new_id)
    source_id: str
    user_id: str
    event_type: str
    external_event_id: str
    payload: dict[str, Any] = Field(default_factory=dict)
    content_hash: Optional[str] = None
    occurred_at: Optional[datetime] = None
    received_at: datetime = Field(default_factory=_now)
    processing_status: ProcessingStatus = ProcessingStatus.RECEIVED
    processing_attempts: int = 0
    created_at: datetime = Field(default_factory=_now)


class Person(BaseEntity):
    user_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class Project(BaseEntity):
    user_id: str
    name: str
    description: Optional[str] = None
    status: str = "ACTIVE"  # PLANNED, ACTIVE, PAUSED, COMPLETED, CANCELLED
    deadline: Optional[datetime] = None


class Goal(BaseEntity):
    user_id: str
    title: str
    description: Optional[str] = None
    status: str = "ACTIVE"  # ACTIVE, PAUSED, COMPLETED, CANCELLED
    target_date: Optional[datetime] = None


class Commitment(BaseEntity):
    """The central object in OS.

    Represents an obligation, promise, or expectation.
    CRITICAL RULE: 'deadline' is the true external deadline.
    The planner may NEVER silently mutate 'deadline'.
    """
    user_id: str
    title: str
    description: Optional[str] = None
    status: CommitmentStatus = CommitmentStatus.OPEN
    priority: int = 50  # 0 to 100
    deadline: Optional[datetime] = None  # Real external deadline
    estimated_duration_minutes: Optional[int] = None
    project_id: Optional[str] = None
    goal_id: Optional[str] = None
    person_id: Optional[str] = None
    source_event_id: Optional[str] = None
    confidence: float = 1.0
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None


class Task(BaseEntity):
    """Concrete executable action required to satisfy a commitment.

    Scheduled start/end are planner-controlled and distinct from the deadline.
    """
    user_id: str
    commitment_id: Optional[str] = None
    project_id: Optional[str] = None
    parent_task_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.OPEN
    priority: int = 50
    estimated_duration_minutes: Optional[int] = 60
    deadline: Optional[datetime] = None  # Immutable external deadline
    scheduled_start: Optional[datetime] = None  # Planner scheduled start
    scheduled_end: Optional[datetime] = None  # Planner scheduled end
    assigned_agent_id: Optional[str] = None
    completed_at: Optional[datetime] = None


class Dependency(BaseEntity):
    user_id: str
    task_id: str
    depends_on_task_id: Optional[str] = None
    person_id: Optional[str] = None
    dependency_type: DependencyType = DependencyType.TASK
    status: DependencyStatus = DependencyStatus.PENDING
    description: Optional[str] = None


class Plan(BaseEntity):
    user_id: str
    plan_date: str  # YYYY-MM-DD
    status: PlanStatus = PlanStatus.ACTIVE
    reason: Optional[str] = None
    planner_version: str = "1.0.0"


class PlanItem(BaseModel):
    id: str = Field(default_factory=_new_id)
    plan_id: str
    task_id: str
    commitment_id: Optional[str] = None
    scheduled_start: datetime
    scheduled_end: datetime
    priority_rank: int = 1
    why_now: dict[str, Any] = Field(default_factory=dict)
    status: PlanItemStatus = PlanItemStatus.PLANNED
    created_at: datetime = Field(default_factory=_now)


class Evidence(BaseModel):
    id: str = Field(default_factory=_new_id)
    user_id: str
    source_id: Optional[str] = None
    source_event_id: Optional[str] = None
    evidence_type: str  # email, calendar_event, file, github_pr, execution_receipt
    external_id: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    uri: Optional[str] = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    occurred_at: Optional[datetime] = None
    content_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=_now)


class Action(BaseModel):
    id: str = Field(default_factory=_new_id)
    user_id: str
    agent_run_id: Optional[str] = None
    task_id: Optional[str] = None
    tool_name: str
    risk_level: RiskLevel = RiskLevel.LOW
    arguments: dict[str, Any] = Field(default_factory=dict)
    arguments_hash: str
    status: ActionStatus = ActionStatus.QUEUED
    idempotency_key: str
    result: Optional[dict[str, Any]] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=_now)


class Approval(BaseModel):
    id: str = Field(default_factory=_new_id)
    action_id: str
    user_id: str
    arguments_hash: str
    status: ApprovalStatus = ApprovalStatus.PENDING
    requested_at: datetime = Field(default_factory=_now)
    decided_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None


class VerificationResult(BaseModel):
    id: str = Field(default_factory=_new_id)
    action_id: str
    verification_type: str
    status: VerificationStatus
    evidence_id: Optional[str] = None
    details: dict[str, Any] = Field(default_factory=dict)
    verified_at: datetime = Field(default_factory=_now)


class Activity(BaseModel):
    id: str = Field(default_factory=_new_id)
    user_id: str
    actor_type: ActorType
    event_type: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    summary: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=_now)


class Memory(BaseEntity):
    user_id: str
    memory_type: str  # EPISODIC, SEMANTIC, RELATIONAL, COMMITMENT
    content: str
    confidence: float = 1.0
    importance: float = 0.5
    source_type: Optional[str] = None
    source_id: Optional[str] = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    expires_at: Optional[datetime] = None


class Automation(BaseEntity):
    user_id: str
    name: str
    description: Optional[str] = None
    trigger_type: str
    trigger_config: dict[str, Any] = Field(default_factory=dict)
    conditions: dict[str, Any] = Field(default_factory=dict)
    workflow_config: dict[str, Any] = Field(default_factory=dict)
    status: str = "ACTIVE"
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None


class Notification(BaseModel):
    id: str = Field(default_factory=_new_id)
    user_id: str
    type: str  # INFO, REMINDER, WARNING, APPROVAL, BLOCKED, FAILED, COMPLETED, REPLAN
    title: str
    message: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    priority: int = 50
    read_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=_now)


class AgentRun(BaseModel):
    id: str = Field(default_factory=_new_id)
    user_id: str
    agent_type: str  # opencode, browser, research, extractor, planner, verifier
    workflow_type: Optional[str] = None
    model_provider: Optional[str] = None
    model_name: Optional[str] = None
    model_version: Optional[str] = None
    parent_run_id: Optional[str] = None
    source_event_id: Optional[str] = None
    task_id: Optional[str] = None
    status: AgentRunStatus = AgentRunStatus.QUEUED
    input_reference: Optional[dict[str, Any]] = None
    output_reference: Optional[dict[str, Any]] = None
    error: Optional[dict[str, Any]] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    latency_ms: Optional[int] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    retry_count: int = 0
    created_at: datetime = Field(default_factory=_now)


class WorkflowRun(BaseModel):
    id: str = Field(default_factory=_new_id)
    user_id: str
    workflow_type: str
    status: WorkflowStatus = WorkflowStatus.QUEUED
    current_step: Optional[str] = None
    checkpoint: dict[str, Any] = Field(default_factory=dict)
    retry_count: int = 0
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)
