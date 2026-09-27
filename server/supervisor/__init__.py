"""Phase 4: Pydantic AI supervisor - the orchestration layer under Laya.

Stack (top to bottom):
    Laya fast router  ->  Supervisor (this package)  ->  tools/skills

Every tool action moves through the required lifecycle:

    WATCH -> NOTICE -> SUGGEST -> WAIT -> DRAFT -> SHOW
    -> REVISE -> APPROVE -> EXECUTE -> VERIFY -> REMEMBER

and every external action passes the safety pipeline:

    Skill -> Scope Guard -> Tool Permission -> Approval
    -> Shared Executor -> Independent Verifier

The supervisor never executes anything itself: it orchestrates the
existing ToolRegistry (shared executor), the existing ApprovalStore
(approval), and a Pydantic AI agent (argument refinement + independent
verification, best-effort on local Ollama). Fail closed: any check that
cannot be evaluated rejects the action with an explicit code
(SKILL_DISABLED, OUT_OF_SCOPE, TOOL_NOT_ALLOWED, APPROVAL_REQUIRED).
"""
from .agent import SupervisorAgent, build_model
from .lifecycle import LifecycleStage, LifecycleTracker
from .permissions import ToolPermission, ToolPolicy
from .pipeline import SupervisedResult, Supervisor
from .scope import ScopeGuard

__all__ = [
    "Supervisor",
    "SupervisedResult",
    "LifecycleStage",
    "LifecycleTracker",
    "ScopeGuard",
    "ToolPermission",
    "ToolPolicy",
    "SupervisorAgent",
    "build_model",
]
