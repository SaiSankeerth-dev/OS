"""Domain enums for OS.

All states, risk levels, and lifecycles defined in the OS TRD & PRD.
Deterministic code enforces these enums and transitions; LLMs may never
directly mutate state.
"""
from __future__ import annotations

from enum import Enum


class CommitmentStatus(str, Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    WAITING = "WAITING"
    BLOCKED = "BLOCKED"
    COMPLETION_CANDIDATE = "COMPLETION_CANDIDATE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class TaskStatus(str, Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    WAITING = "WAITING"
    BLOCKED = "BLOCKED"
    COMPLETION_CANDIDATE = "COMPLETION_CANDIDATE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class DependencyType(str, Enum):
    TASK = "TASK"
    PERSON = "PERSON"
    APPROVAL = "APPROVAL"
    RESOURCE = "RESOURCE"
    EXTERNAL_EVENT = "EXTERNAL_EVENT"


class DependencyStatus(str, Enum):
    PENDING = "PENDING"
    SATISFIED = "SATISFIED"
    BLOCKED = "BLOCKED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class PlanStatus(str, Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    SUPERSEDED = "SUPERSEDED"
    COMPLETED = "COMPLETED"


class PlanItemStatus(str, Enum):
    PLANNED = "PLANNED"
    STARTED = "STARTED"
    COMPLETED = "COMPLETED"
    SKIPPED = "SKIPPED"
    REPLACED = "REPLACED"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class ActionStatus(str, Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    TIMED_OUT = "TIMED_OUT"
    EXECUTING = "RUNNING"
    COMPLETED = "SUCCEEDED"


class ApprovalStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


class VerificationStatus(str, Enum):
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    UNKNOWN = "UNKNOWN"
    PARTIAL = "PARTIAL"


class ActorType(str, Enum):
    USER = "USER"
    OS = "OS"
    AGENT = "AGENT"
    SYSTEM = "SYSTEM"
    CONNECTOR = "CONNECTOR"


class SourceStatus(str, Enum):
    CONNECTED = "CONNECTED"
    SYNCING = "SYNCING"
    DISCONNECTED = "DISCONNECTED"
    REAUTH_REQUIRED = "REAUTH_REQUIRED"
    ERROR = "ERROR"


class ProcessingStatus(str, Enum):
    RECEIVED = "RECEIVED"
    PROCESSING = "PROCESSING"
    PROCESSED = "PROCESSED"
    IGNORED = "IGNORED"
    FAILED = "FAILED"


class AgentRunStatus(str, Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    WAITING_USER = "WAITING_USER"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    TIMED_OUT = "TIMED_OUT"


class WorkflowStatus(str, Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    WAITING_USER = "WAITING_USER"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    PAUSED = "PAUSED"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
