"""Test Suite for Milestone 1: Approval / Safety System.

Enforces the Definition of Done:
1. Approval accepted -> exactly 1 execution
2. Approval rejected -> 0 executions
3. Approval expired -> 0 executions
4. Arguments modified -> 0 executions (ApprovalTamperedError)
5. Double approval / execution -> max 1 execution (AlreadyExecutedError)
6. Read-only actions -> execute immediately without approval
7. High-risk write -> approval mandatory
8. Explicit prepare() -> execute() -> verify() boundary
"""
import time
from typing import Any
import pytest

from server.domain.enums import RiskLevel, ActionStatus, ApprovalStatus
from server.execution import (
    SafeExecutor,
    ExecutionError,
    ExpiredApprovalError,
    AlreadyExecutedError,
    RejectedApprovalError,
    ApprovalTamperedError,
    ToolDefinition,
    PolicyEngine,
    ApprovalEngine,
    PostconditionVerifier,
)
from server.db.database import get_db
from server.db.repositories.core import ActionApprovalRepository, ActivityRepository


@pytest.fixture
def clean_db():
    db = get_db()
    # Clean up test rows and ensure test_user exists
    with db.transaction() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO users (id, email, display_name, created_at, updated_at) "
            "VALUES ('test_user', 'test@example.com', 'Test User', datetime('now'), datetime('now'))"
        )
        conn.execute("DELETE FROM actions WHERE user_id = 'test_user'")
        conn.execute("DELETE FROM approvals WHERE user_id = 'test_user'")
    yield db
    with db.transaction() as conn:
        conn.execute("DELETE FROM actions WHERE user_id = 'test_user'")
        conn.execute("DELETE FROM approvals WHERE user_id = 'test_user'")


@pytest.fixture
def executor(clean_db):
    return SafeExecutor(timeout_sec=2)


def test_readonly_executes_immediately(executor):
    """Read-only actions (LOW risk) execute immediately without waiting for approval."""
    executed = []

    tool = ToolDefinition(
        name="read_profile",
        description="Reads user profile",
        risk_level=RiskLevel.LOW,
        execute=lambda args: executed.append(args) or {"ok": True, "name": "Alice"},
    )

    action, approval, result = executor.prepare(
        user_id="test_user",
        tool_name="read_profile",
        arguments={"id": "123"},
        tool_def=tool,
    )

    assert approval is None
    assert action.status in (ActionStatus.SUCCEEDED, ActionStatus.RUNNING, "SUCCEEDED")
    assert len(executed) == 1
    assert result == {"ok": True, "name": "Alice", "_verification": {"details": {"receipt": "Execution receipt confirmed"}, "status": "VERIFIED"}}


def test_high_risk_requires_approval(executor):
    """High risk actions halt at WAITING_APPROVAL and do not call the handler."""
    executed = []

    tool = ToolDefinition(
        name="transfer_funds",
        description="Transfers funds externally",
        risk_level=RiskLevel.HIGH,
        execute=lambda args: executed.append(args) or {"ok": True, "tx": "abc"},
    )

    action, approval, result = executor.prepare(
        user_id="test_user",
        tool_name="transfer_funds",
        arguments={"amount": 500, "to": "bob"},
        tool_def=tool,
    )

    assert approval is not None
    assert approval.status == ApprovalStatus.PENDING
    assert action.status == ActionStatus.WAITING_APPROVAL
    assert result is None
    assert len(executed) == 0  # Zero handler calls!


def test_approval_accepted_exactly_one_execution(executor):
    """Criterion 1: approval accepted -> exactly 1 execution."""
    call_count = {"count": 0}

    def _execute_transfer(args):
        call_count["count"] += 1
        return {"ok": True, "sent": True, "amount": args["amount"]}

    tool = ToolDefinition(
        name="send_wire",
        description="Send wire transfer",
        risk_level=RiskLevel.HIGH,
        execute=_execute_transfer,
    )

    args = {"amount": 1000, "recipient": "charli"}
    user_id = "test_user"

    # Step 1: Prepare
    action, approval, _ = executor.prepare(user_id, "send_wire", args, tool_def=tool)
    assert len(call_count) == 1 and call_count["count"] == 0

    # Step 2: Approve
    approved = executor.approve(approval.id, args, user_id=user_id)
    assert approved is True
    assert call_count["count"] == 0  # Still zero executions prior to execute()

    # Step 3: Execute
    res = executor.execute(action.id, user_id=user_id, tool_def=tool)
    assert res["sent"] is True
    assert call_count["count"] == 1  # Exactly 1 execution!


def test_approval_rejected_zero_executions(executor):
    """Criterion 2: approval rejected -> 0 executions."""
    call_count = {"count": 0}

    tool = ToolDefinition(
        name="delete_database",
        description="Drops database",
        risk_level=RiskLevel.HIGH,
        execute=lambda args: call_count.__setitem__("count", call_count["count"] + 1) or {"ok": True},
    )

    args = {"db": "production"}
    user_id = "test_user"

    action, approval, _ = executor.prepare(user_id, "delete_database", args, tool_def=tool)
    assert call_count["count"] == 0

    # Reject approval
    rejected = executor.reject(approval.id, reason="User cancelled", user_id=user_id)
    assert rejected is True

    # Attempt to execute must fail
    with pytest.raises(RejectedApprovalError):
        executor.execute(action.id, user_id=user_id, tool_def=tool)

    assert call_count["count"] == 0  # Exactly 0 executions!


def test_approval_expired_zero_executions(clean_db):
    """Criterion 3: approval expired -> 0 executions."""
    call_count = {"count": 0}

    # Very short 1-second timeout
    fast_executor = SafeExecutor(timeout_sec=1)

    tool = ToolDefinition(
        name="deploy_prod",
        description="Deploys to production",
        risk_level=RiskLevel.HIGH,
        execute=lambda args: call_count.__setitem__("count", call_count["count"] + 1) or {"ok": True},
    )

    args = {"service": "api"}
    user_id = "test_user"

    action, approval, _ = fast_executor.prepare(user_id, "deploy_prod", args, tool_def=tool)
    assert call_count["count"] == 0

    # Sleep past the expiration timeout
    time.sleep(1.2)

    # Approve or execute after expiration must fail
    with pytest.raises(Exception) as exc_info:
        fast_executor.approve(approval.id, args, user_id=user_id)
    assert "expired" in str(exc_info.value).lower()

    # Attempting to execute also raises ExpiredApprovalError
    with pytest.raises(ExecutionError):
        fast_executor.execute(action.id, user_id=user_id, tool_def=tool)

    assert call_count["count"] == 0  # Exactly 0 executions!


def test_arguments_modified_zero_executions(executor):
    """Criterion 4: arguments modified -> 0 executions (ApprovalTamperedError)."""
    call_count = {"count": 0}

    tool = ToolDefinition(
        name="send_payment",
        description="Send payment",
        risk_level=RiskLevel.HIGH,
        execute=lambda args: call_count.__setitem__("count", call_count["count"] + 1) or {"ok": True},
    )

    original_args = {"recipient": "alice", "amount": 10}
    tampered_args = {"recipient": "attacker", "amount": 10000}
    user_id = "test_user"

    action, approval, _ = executor.prepare(user_id, "send_payment", original_args, tool_def=tool)
    assert call_count["count"] == 0

    # User attempts to approve tampered arguments
    with pytest.raises(ApprovalTamperedError):
        executor.approve(approval.id, tampered_args, user_id=user_id)

    # Attempt to execute without valid approval must fail
    with pytest.raises(ExecutionError):
        executor.execute(action.id, user_id=user_id, tool_def=tool)

    assert call_count["count"] == 0  # Exactly 0 executions!


def test_double_approval_max_one_execution(executor):
    """Criterion 5: double approval / execution -> max 1 execution."""
    call_count = {"count": 0}

    tool = ToolDefinition(
        name="purchase_shares",
        description="Buy shares",
        risk_level=RiskLevel.HIGH,
        execute=lambda args: call_count.__setitem__("count", call_count["count"] + 1) or {"ok": True, "shares": 10},
    )

    args = {"symbol": "GOOG", "shares": 10}
    user_id = "test_user"

    action, approval, _ = executor.prepare(user_id, "purchase_shares", args, tool_def=tool)
    assert call_count["count"] == 0

    # First approve
    approved = executor.approve(approval.id, args, user_id=user_id)
    assert approved is True

    # Second approve should raise ValueError (already approved)
    with pytest.raises(ValueError, match="already APPROVED"):
        executor.approve(approval.id, args, user_id=user_id)

    # First execution succeeds
    res1 = executor.execute(action.id, user_id=user_id, tool_def=tool)
    assert res1["shares"] == 10
    assert call_count["count"] == 1

    # Second execution attempt is blocked by idempotency / AlreadyExecutedError
    with pytest.raises(AlreadyExecutedError):
        executor.execute(action.id, user_id=user_id, tool_def=tool)

    # Crucial: count must remain strictly 1
    assert call_count["count"] == 1


def test_prepare_execute_verify_lifecycle(executor):
    """Verify tool's prepare() -> execute() -> verify() lifecycle."""
    stages = []

    def _prepare(args):
        stages.append("prepare")
        # Sanitize / normalize arguments
        return {**args, "normalized": True}

    def _execute(args):
        stages.append("execute")
        assert args.get("normalized") is True
        return {"ok": True, "processed": True}

    def _verify(args, result):
        stages.append("verify")
        return {"verified": True}

    tool = ToolDefinition(
        name="lifecycle_tool",
        description="Tests prepare/execute/verify",
        risk_level=RiskLevel.HIGH,
        prepare=_prepare,
        execute=_execute,
        verify=_verify,
    )

    user_id = "test_user"
    raw_args = {"data": "test"}

    # 1. Prepare stage
    action, approval, _ = executor.prepare(user_id, "lifecycle_tool", raw_args, tool_def=tool)
    assert "prepare" in stages
    assert "execute" not in stages

    # 2. Approve
    prepared_args = {"data": "test", "normalized": True}
    executor.approve(approval.id, prepared_args, user_id=user_id)
    assert "execute" not in stages

    # 3. Execute stage (triggers execute + postcondition verification)
    result = executor.execute(action.id, user_id=user_id, tool_def=tool)
    assert "execute" in stages
    assert result["processed"] is True
    assert result["_verification"]["status"] == "VERIFIED"
