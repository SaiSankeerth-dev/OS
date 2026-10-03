"""SafeExecutor — Unified prepare → approve → execute → verify boundary.

This is the single orchestrator that enforces OS's safety contract:

    User Request
    ↓
    OS Decision
    ↓
    Risk Classification (PolicyEngine)
    ↓
    Prepare Action (ToolDefinition.prepare)
    ↓
    Approval Required?
    ↙          ↘
   NO           YES
    ↓            ↓
  Execute      WAIT
    ↓            ↓
    ↓       User Approves
    ↓            ↓
    ↓         Execute (exactly once)
    ↓            ↓
    ↓←←←←←←←←←←←
    ↓
    Verify (PostconditionVerifier)
    ↓
    Evidence → World Model

Hard rules:
  - Read-only → execute immediately
  - Low-risk write → policy decides
  - High-risk write → approval mandatory
  - Changed args → old approval invalid (ApprovalTamperedError)
  - Expired → cannot execute (0 executions)
  - Rejected → zero handler calls
  - Double approval → max 1 execution (idempotency via action status)
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Callable, Optional

from server.domain.entities import Action, Activity, Approval
from server.domain.enums import ActionStatus, ActorType, ApprovalStatus, RiskLevel
from server.execution.approval import (
    ApprovalEngine,
    ApprovalTamperedError,
    compute_arguments_hash,
)
from server.execution.policy import PolicyDecision, PolicyEngine
from server.execution.registry import ToolDefinition, get_tool_registry
from server.execution.verifier import PostconditionVerifier
from server.db.repositories.core import (
    ActionApprovalRepository,
    ActivityRepository,
)
from server.db.database import get_db

log = logging.getLogger("os.execution.safe")


class ExecutionError(RuntimeError):
    """Raised when execution is blocked by safety policy."""
    pass


class ExpiredApprovalError(ExecutionError):
    """Raised when trying to execute with an expired approval."""
    pass


class AlreadyExecutedError(ExecutionError):
    """Raised when trying to execute an action that was already executed."""
    pass


class RejectedApprovalError(ExecutionError):
    """Raised when trying to execute a rejected action."""
    pass


class SafeExecutor:
    """Enforces the full safety boundary for every OS action.

    Usage:
        executor = SafeExecutor()

        # Step 1: Prepare
        action, approval = executor.prepare(user_id, tool_name, arguments)

        # If approval is None, action was auto-executed (read-only / low-risk)
        if approval:
            # Step 2: User reviews and approves/rejects
            executor.approve(approval.id, arguments, user_id)
            # Step 3: Execute
            result = executor.execute(action.id, user_id)
        else:
            result = action  # Already executed

        # Step 4: Verification happens automatically inside execute()
    """

    def __init__(
        self,
        *,
        policy: Optional[PolicyEngine] = None,
        approval_engine: Optional[ApprovalEngine] = None,
        verifier: Optional[PostconditionVerifier] = None,
        approval_repo: Optional[ActionApprovalRepository] = None,
        activity_repo: Optional[ActivityRepository] = None,
        timeout_sec: int = 1800,
    ) -> None:
        db = get_db()
        self.policy = policy or PolicyEngine()
        self.approval_engine = approval_engine or ApprovalEngine(timeout_sec=timeout_sec)
        self.verifier = verifier or PostconditionVerifier()
        self.repo = approval_repo or ActionApprovalRepository(db)
        self.activity_repo = activity_repo or ActivityRepository(db)
        self.timeout_sec = timeout_sec

    # ------------------------------------------------------------------
    # Step 1: PREPARE
    # ------------------------------------------------------------------

    def prepare(
        self,
        user_id: str,
        tool_name: str,
        arguments: dict[str, Any],
        *,
        task_id: Optional[str] = None,
        tool_def: Optional[ToolDefinition] = None,
    ) -> tuple[Action, Optional[Approval], Optional[Any]]:
        """Prepare an action for execution.

        Returns (action, approval, immediate_result):
        - If approval is None and immediate_result is set: action was
          auto-executed (read-only or auto-approved).
        - If approval is not None: action requires user approval before
          execution.
        """
        # Resolve tool definition
        if tool_def is None:
            registry = get_tool_registry()
            tool_def = registry.get(tool_name)

        # Determine risk level
        if tool_def:
            risk_level = tool_def.risk_level
        else:
            # Unknown tools are HIGH risk by default
            risk_level = RiskLevel.HIGH

        # Run policy evaluation
        policy_decision = self.policy.evaluate(
            tool_def or _unknown_tool(tool_name),
            arguments,
        )

        log.info(
            "SafeExecutor.prepare: tool=%s risk=%s verdict=%s",
            tool_name, risk_level.value, policy_decision.verdict,
        )

        # Call prepare() hook if tool provides one
        prepared_args = arguments
        if tool_def and hasattr(tool_def, 'prepare') and tool_def.prepare:
            prepared_args = tool_def.prepare(arguments)

        if policy_decision.verdict == "ALLOW":
            # Auto-execute: no approval needed
            action, _ = self.approval_engine.request_approval(
                user_id, tool_name, prepared_args,
                task_id=task_id, risk_level=risk_level,
                timeout_sec=self.timeout_sec,
            )
            # Mark as auto-approved
            action.status = ActionStatus.RUNNING
            with self.repo.db.transaction() as conn:
                conn.execute(
                    "UPDATE actions SET status = ? WHERE id = ?",
                    (ActionStatus.RUNNING.value, action.id),
                )

            # Execute immediately
            result = self._run_handler(action.id, tool_name, prepared_args, tool_def, user_id)
            action.status = ActionStatus.SUCCEEDED
            return action, None, result

        elif policy_decision.verdict == "REQUIRE_APPROVAL":
            # Create action + approval, wait for user
            action, approval = self.approval_engine.request_approval(
                user_id, tool_name, prepared_args,
                task_id=task_id, risk_level=risk_level,
                timeout_sec=self.timeout_sec,
            )
            return action, approval, None

        else:
            # DENY
            raise ExecutionError(
                f"Action '{tool_name}' denied by policy: {policy_decision.reason}"
            )

    # ------------------------------------------------------------------
    # Step 2: APPROVE (user-initiated)
    # ------------------------------------------------------------------

    def approve(
        self,
        approval_id: str,
        current_arguments: dict[str, Any],
        user_id: str = "default_user",
    ) -> bool:
        """User approves an action. Delegates to ApprovalEngine with
        tamper detection."""
        return self.approval_engine.approve(approval_id, current_arguments, user_id)

    def reject(
        self,
        approval_id: str,
        reason: str = "",
        user_id: str = "default_user",
    ) -> bool:
        """User rejects an action."""
        return self.approval_engine.reject(approval_id, reason, user_id)

    # ------------------------------------------------------------------
    # Step 3: EXECUTE (after approval)
    # ------------------------------------------------------------------

    def execute(
        self,
        action_id: str,
        user_id: str = "default_user",
        *,
        tool_def: Optional[ToolDefinition] = None,
    ) -> dict[str, Any]:
        """Execute an approved action exactly once.

        Safety checks:
        1. Action must be in WAITING_APPROVAL status with an APPROVED approval
        2. Approval must not be expired
        3. Action must not have been already executed (idempotency)
        4. Arguments hash must still match (tamper detection)

        After execution:
        - Runs PostconditionVerifier
        - Records evidence in World Model
        - Transitions action to COMPLETED or FAILED
        """
        with self.repo.db.transaction() as conn:
            action_row = conn.execute(
                "SELECT * FROM actions WHERE id = ?", (action_id,)
            ).fetchone()
            if not action_row:
                raise ValueError(f"Action '{action_id}' not found")

            # Guard: already executed?
            if action_row["status"] in (
                ActionStatus.COMPLETED.value,
                ActionStatus.FAILED.value,
                ActionStatus.EXECUTING.value,
            ):
                raise AlreadyExecutedError(
                    f"Action '{action_id}' already in state {action_row['status']}. "
                    f"Max 1 execution allowed."
                )

            # Find the approval
            approval_row = conn.execute(
                "SELECT * FROM approvals WHERE action_id = ? ORDER BY requested_at DESC LIMIT 1",
                (action_id,),
            ).fetchone()
            if not approval_row:
                raise ExecutionError(f"No approval found for action '{action_id}'")

            # Guard: approval status
            if approval_row["status"] == ApprovalStatus.REJECTED.value:
                raise RejectedApprovalError(
                    f"Action '{action_id}' was REJECTED. 0 executions allowed."
                )
            if approval_row["status"] == ApprovalStatus.EXPIRED.value:
                raise ExpiredApprovalError(
                    f"Action '{action_id}' approval EXPIRED. 0 executions allowed."
                )
            if approval_row["status"] != ApprovalStatus.APPROVED.value:
                raise ExecutionError(
                    f"Action '{action_id}' approval is {approval_row['status']}, "
                    f"not APPROVED."
                )

            # Guard: expiry check (time-based)
            expires_at_val = approval_row["expires_at"] if "expires_at" in approval_row.keys() else None
            is_expired = False
            if expires_at_val:
                exp = datetime.fromisoformat(expires_at_val)
                if exp.tzinfo is None:
                    exp = exp.replace(tzinfo=timezone.utc)
                if datetime.now(timezone.utc) > exp:
                    is_expired = True

            requested_at = datetime.fromisoformat(approval_row["requested_at"])
            if requested_at.tzinfo is None:
                requested_at = requested_at.replace(tzinfo=timezone.utc)
            elapsed = (datetime.now(timezone.utc) - requested_at).total_seconds()
            if elapsed > self.timeout_sec:
                is_expired = True

            if is_expired:
                # Mark as expired
                conn.execute(
                    "UPDATE approvals SET status = ? WHERE id = ?",
                    (ApprovalStatus.EXPIRED.value, approval_row["id"]),
                )
                raise ExpiredApprovalError(
                    f"Approval expired ({elapsed:.0f}s > {self.timeout_sec}s). "
                    f"0 executions allowed."
                )

            # Guard: tamper detection (re-check hash)
            import json
            stored_args = json.loads(action_row["arguments"])
            current_hash = compute_arguments_hash(stored_args)
            if current_hash != approval_row["arguments_hash"]:
                raise ApprovalTamperedError(
                    f"Arguments hash mismatch: stored={current_hash}, "
                    f"approved={approval_row['arguments_hash']}"
                )

            # Transition to EXECUTING (prevents double execution)
            conn.execute(
                "UPDATE actions SET status = ? WHERE id = ?",
                (ActionStatus.EXECUTING.value, action_id),
            )

        # --- Past this point, we hold the lock via EXECUTING status ---

        tool_name = action_row["tool_name"]
        import json
        arguments = json.loads(action_row["arguments"])

        # Resolve tool definition
        if tool_def is None:
            registry = get_tool_registry()
            tool_def = registry.get(tool_name)

        # Execute the handler
        result = self._run_handler(action_id, tool_name, arguments, tool_def, user_id)
        return result

    # ------------------------------------------------------------------
    # Internal: run handler + verify + record
    # ------------------------------------------------------------------

    def _run_handler(
        self,
        action_id: str,
        tool_name: str,
        arguments: dict[str, Any],
        tool_def: Optional[ToolDefinition],
        user_id: str,
    ) -> dict[str, Any]:
        """Run the tool handler, verify, and record results."""
        try:
            # Execute
            if tool_def and tool_def.handler:
                raw_result = tool_def.handler(arguments)
            else:
                raw_result = {"ok": False, "error": f"No handler for tool '{tool_name}'"}

            # Normalize result to dict
            if isinstance(raw_result, dict):
                execution_result = raw_result
            else:
                execution_result = {"ok": True, "result": raw_result}

            # Verify postconditions
            vr = self.verifier.verify_action(
                action_id, tool_name, execution_result, user_id, arguments=arguments
            )

            # Update action status
            final_status = (
                ActionStatus.COMPLETED
                if vr.status.value in ("VERIFIED", "PARTIAL")
                else ActionStatus.FAILED
            )
            with self.repo.db.transaction() as conn:
                conn.execute(
                    "UPDATE actions SET status = ? WHERE id = ?",
                    (final_status.value, action_id),
                )

            # Log activity
            self.activity_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.OS,
                    event_type="action.executed",
                    entity_type="action",
                    entity_id=action_id,
                    summary=f"Executed '{tool_name}': {final_status.value}",
                    metadata={
                        "tool": tool_name,
                        "verification": vr.status.value,
                        "details": vr.details,
                    },
                )
            )

            execution_result["_verification"] = {
                "status": vr.status.value,
                "details": vr.details,
            }
            return execution_result

        except Exception as exc:
            log.exception("Execution failed for action %s", action_id)
            with self.repo.db.transaction() as conn:
                conn.execute(
                    "UPDATE actions SET status = ? WHERE id = ?",
                    (ActionStatus.FAILED.value, action_id),
                )
            self.activity_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.OS,
                    event_type="action.failed",
                    entity_type="action",
                    entity_id=action_id,
                    summary=f"Execution failed for '{tool_name}': {exc}",
                    metadata={"error": str(exc)},
                )
            )
            raise


# Helper for unknown tools
def _unknown_tool(name: str) -> ToolDefinition:
    return ToolDefinition(
        name=name,
        description=f"Unknown tool: {name}",
        risk_level=RiskLevel.HIGH,
        handler=lambda args: {"ok": False, "error": "Unknown tool"},
        requires_approval=True,
    )
