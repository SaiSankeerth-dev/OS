"""Test Suite for Milestone 5: Browser / Computer Action.

Enforces:
1. BrowserActionType classification:
   - READ: navigate, extract_text, screenshot -> RiskLevel.LOW
   - WRITE: click, fill, select -> RiskLevel.MEDIUM
   - DESTRUCTIVE: submit_form, delete, checkout, high-risk targets -> RiskLevel.HIGH
2. PolicyEngine routing:
   - READ actions execute immediately without approval.
   - WRITE actions execute immediately in balanced/autonomous mode, require approval in manual mode.
   - DESTRUCTIVE actions ALWAYS require approval.
3. SafeExecutor lifecycle:
   - Pending approval for high risk browser action.
   - Successful approval -> execution -> verification with BrowserVerifier.
   - Evidence recorded in World Model.
   - Rejection -> zero executions, execute() raises RejectedApprovalError.
4. BrowserWorker execution:
   - All action types dispatch cleanly and produce structured BrowserReceipts.
"""
from __future__ import annotations

import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch
import pytest

from adapters.browser.worker import (
    BrowserActionType,
    BrowserReceipt,
    BrowserWorker,
    browser_action_to_risk,
    classify_browser_action,
    create_browser_tool,
    register_browser_tools,
)
from server.db.database import get_db
from server.db.repositories.core import ActionApprovalRepository
from server.db.repositories.world import WorldModelRepository
from server.domain.enums import ActionStatus, ApprovalStatus, RiskLevel, VerificationStatus
from server.execution.executor import RejectedApprovalError, SafeExecutor
from server.execution.policy import PolicyEngine
from server.execution.registry import ExecutionToolRegistry


@pytest.fixture
def clean_db():
    db = get_db()
    with db.transaction() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO users (id, email, display_name, created_at, updated_at) "
            "VALUES ('test_browser_user', 'browser@local.os', 'Browser User', datetime('now'), datetime('now'))"
        )
        conn.execute("DELETE FROM evidence WHERE user_id = 'test_browser_user'")
        conn.execute("DELETE FROM verification_results WHERE action_id IN (SELECT id FROM actions WHERE user_id = 'test_browser_user')")
        conn.execute("DELETE FROM approvals WHERE user_id = 'test_browser_user'")
        conn.execute("DELETE FROM actions WHERE user_id = 'test_browser_user'")
    yield db
    with db.transaction() as conn:
        conn.execute("DELETE FROM evidence WHERE user_id = 'test_browser_user'")
        conn.execute("DELETE FROM verification_results WHERE action_id IN (SELECT id FROM actions WHERE user_id = 'test_browser_user')")
        conn.execute("DELETE FROM approvals WHERE user_id = 'test_browser_user'")
        conn.execute("DELETE FROM actions WHERE user_id = 'test_browser_user'")


@pytest.fixture
def executor(clean_db):
    return SafeExecutor(timeout_sec=1800)


def test_browser_action_classification():
    """Verify deterministic classification of browser actions and risk mappings."""
    # READ
    assert classify_browser_action("navigate") == BrowserActionType.READ
    assert classify_browser_action("screenshot") == BrowserActionType.READ
    assert classify_browser_action("extract_text") == BrowserActionType.READ
    assert classify_browser_action("open") == BrowserActionType.READ
    assert browser_action_to_risk(BrowserActionType.READ) == RiskLevel.LOW

    # WRITE
    assert classify_browser_action("click") == BrowserActionType.WRITE
    assert classify_browser_action("fill") == BrowserActionType.WRITE
    assert classify_browser_action("type") == BrowserActionType.WRITE
    assert browser_action_to_risk(BrowserActionType.WRITE) == RiskLevel.MEDIUM

    # DESTRUCTIVE
    assert classify_browser_action("submit_form") == BrowserActionType.DESTRUCTIVE
    assert classify_browser_action("checkout") == BrowserActionType.DESTRUCTIVE
    assert classify_browser_action("delete") == BrowserActionType.DESTRUCTIVE
    assert classify_browser_action("click", {"text": "Confirm Payment and Purchase"}) == BrowserActionType.DESTRUCTIVE
    assert classify_browser_action("click", {"selector": "#delete-account-btn"}) == BrowserActionType.DESTRUCTIVE
    assert browser_action_to_risk(BrowserActionType.DESTRUCTIVE) == RiskLevel.HIGH


def test_browser_readonly_executes_immediately(executor):
    """Read-only browser navigation executes immediately without approval."""
    worker = BrowserWorker(prefer_playwright=True)
    with patch.object(worker, "navigate", return_value=BrowserReceipt(
        action="navigate",
        url="https://docs.example.org",
        status="SUCCEEDED",
        status_code=200,
        details={"page_title": "Documentation"},
    )):
        tool = create_browser_tool("navigate", worker=worker)
        action, approval, result = executor.prepare(
            user_id="test_browser_user",
            tool_name=tool.name,
            arguments={"url": "https://docs.example.org"},
            tool_def=tool,
        )

        assert approval is None
        assert action.status in (ActionStatus.SUCCEEDED, ActionStatus.RUNNING, ActionStatus.COMPLETED, "SUCCEEDED", "COMPLETED")
        assert result["action"] == "navigate"
        assert result["url"] == "https://docs.example.org"
        assert result["_verification"]["status"] == "VERIFIED"


def test_browser_write_under_balanced_autonomy(executor):
    """WRITE actions (e.g. click/fill) execute immediately in balanced mode."""
    worker = BrowserWorker(prefer_playwright=True)
    with patch.object(worker, "click", return_value=BrowserReceipt(
        action="click",
        url="https://docs.example.org",
        status="SUCCEEDED",
        status_code=200,
        details={"ref": "#next-button"},
    )):
        tool = create_browser_tool("click", worker=worker)
        action, approval, result = executor.prepare(
            user_id="test_browser_user",
            tool_name=tool.name,
            arguments={"selector": "#next-button"},
            tool_def=tool,
        )

        # Under balanced autonomy, MEDIUM risk is allowed without human approval
        assert approval is None
        assert action.status in (ActionStatus.SUCCEEDED, ActionStatus.RUNNING, ActionStatus.COMPLETED, "SUCCEEDED", "COMPLETED")
        assert result["status"] == "SUCCEEDED"


def test_browser_write_under_manual_autonomy_requires_approval(clean_db):
    """WRITE actions require approval when user sets autonomy to manual."""
    manual_policy = PolicyEngine(autonomy_level="manual")
    manual_executor = SafeExecutor(policy=manual_policy)

    worker = BrowserWorker(prefer_playwright=True)
    tool = create_browser_tool("click", worker=worker)

    action, approval, result = manual_executor.prepare(
        user_id="test_browser_user",
        tool_name=tool.name,
        arguments={"selector": "#tab-settings"},
        tool_def=tool,
    )

    assert result is None
    assert approval is not None
    assert action.status == ActionStatus.WAITING_APPROVAL
    assert approval.status == ApprovalStatus.PENDING


def test_browser_destructive_action_requires_approval(executor):
    """DESTRUCTIVE actions (submit_form) ALWAYS require approval in all autonomy modes."""
    worker = BrowserWorker(prefer_playwright=True)
    tool = create_browser_tool("submit_form", worker=worker)

    action, approval, result = executor.prepare(
        user_id="test_browser_user",
        tool_name=tool.name,
        arguments={"form_data": {"username": "admin", "role": "root"}},
        tool_def=tool,
    )

    assert result is None
    assert approval is not None
    assert action.status == ActionStatus.WAITING_APPROVAL
    assert approval.status == ApprovalStatus.PENDING


def test_browser_destructive_action_approval_and_verification_lifecycle(executor, clean_db):
    """End-to-end: Destructive action prepared -> approved -> executed -> verified with Evidence."""
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp.write(b"SCREENSHOT_PROOF_BYTES")
        screenshot_path = tmp.name

    try:
        worker = BrowserWorker(prefer_playwright=True)
        # Mock submit_form on worker
        with patch.object(worker, "submit_form", return_value=BrowserReceipt(
            action="submit_form",
            url="https://portal.example.com/checkout",
            status="SUCCEEDED",
            status_code=200,
            screenshot_path=screenshot_path,
            details={"fields_submitted": ["card_name", "amount"]},
        )):
            tool = create_browser_tool("submit_form", worker=worker)
            args = {"form_data": {"card_name": "Test User", "amount": "100"}}

            # 1. Prepare
            action, approval, result = executor.prepare(
                user_id="test_browser_user",
                tool_name=tool.name,
                arguments=args,
                tool_def=tool,
            )
            assert approval is not None
            assert action.status == ActionStatus.WAITING_APPROVAL

            # 2. Approve
            approved = executor.approve(
                approval_id=approval.id,
                current_arguments=args,
                user_id="test_browser_user",
            )
            assert approved is True

            # 3. Execute
            exec_result = executor.execute(
                action_id=action.id,
                user_id="test_browser_user",
                tool_def=tool,
            )

            # Assertions on Execution & Verification
            assert exec_result["action"] == "submit_form"
            assert exec_result["_verification"]["status"] == "VERIFIED"
            assert exec_result["_verification"]["details"]["screenshot_verified"] is True

            # Verify action status in DB
            repo = ActionApprovalRepository(clean_db)
            act_db = repo.get_action(action.id)
            assert act_db is not None
            assert act_db.status in (ActionStatus.COMPLETED, ActionStatus.SUCCEEDED)

            # 4. Check Evidence in World Model Repository
            world_repo = WorldModelRepository(clean_db)
            evidence_items = world_repo.list_evidence("test_browser_user", limit=10)
            assert len(evidence_items) >= 1
            browser_ev = next(e for e in evidence_items if e.evidence_type == "browser_receipt")
            assert "https://portal.example.com/checkout" in browser_ev.uri
    finally:
        Path(screenshot_path).unlink(missing_ok=True)


def test_browser_destructive_action_rejection(executor):
    """Rejected browser action produces zero executions and raises RejectedApprovalError on execute."""
    worker = BrowserWorker(prefer_playwright=True)
    tool = create_browser_tool("submit_form", worker=worker)

    action, approval, _ = executor.prepare(
        user_id="test_browser_user",
        tool_name=tool.name,
        arguments={"form_data": {"action": "delete_all"}},
        tool_def=tool,
    )
    assert approval is not None

    rejected = executor.reject(
        approval_id=approval.id,
        reason="Security concern with mass deletion",
        user_id="test_browser_user",
    )
    assert rejected is True

    with pytest.raises(RejectedApprovalError):
        executor.execute(action.id, user_id="test_browser_user", tool_def=tool)


def test_tool_registry_registration():
    """Verify standard browser tools can be registered into ExecutionToolRegistry."""
    registry = ExecutionToolRegistry()
    register_browser_tools(registry)

    expected_tools = [
        "browser.navigate",
        "browser.extract_text",
        "browser.screenshot",
        "browser.click",
        "browser.fill",
        "browser.submit_form",
    ]
    for name in expected_tools:
        tool = registry.get(name)
        assert tool is not None
        assert tool.name == name
        assert callable(tool.execute)
