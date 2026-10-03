"""Test Suite for Milestone 2: Real-world Verification.

Enforces the Definition of Done:
Every important external write has:
    execution receipt + verification evidence + final verification state

Tests:
1. GmailVerifier: receipt + read-back confirmation -> VERIFIED + Evidence in World Model
2. GmailVerifier: read-back recipient mismatch -> FAILED
3. CalendarVerifier: receipt + read-back confirmation -> VERIFIED + Evidence in World Model
4. CalendarVerifier: read-back title mismatch -> FAILED
5. GitHubVerifier: PR URL + number confirmed -> VERIFIED + Evidence in World Model
6. BrowserVerifier: status + screenshot verified on disk -> VERIFIED + Evidence
7. FileVerifier: file existence + size check on disk -> VERIFIED + Evidence
8. Integration with SafeExecutor: full flow prepare -> approve -> execute -> external read-back -> evidence stored
"""
import tempfile
from pathlib import Path
import pytest

from server.domain.enums import VerificationStatus, RiskLevel
from server.execution import (
    PostconditionVerifier,
    GmailVerifier,
    CalendarVerifier,
    GitHubVerifier,
    BrowserVerifier,
    FileVerifier,
    SafeExecutor,
    ToolDefinition,
)
from server.db.database import get_db
from server.db.repositories.world import WorldModelRepository


@pytest.fixture
def clean_db():
    db = get_db()
    with db.transaction() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO users (id, email, display_name, created_at, updated_at) "
            "VALUES ('test_user', 'test@example.com', 'Test User', datetime('now'), datetime('now'))"
        )
        conn.execute("DELETE FROM actions WHERE user_id = 'test_user'")
        conn.execute("DELETE FROM approvals WHERE user_id = 'test_user'")
        conn.execute("DELETE FROM evidence WHERE user_id = 'test_user'")
    yield db
    with db.transaction() as conn:
        conn.execute("DELETE FROM actions WHERE user_id = 'test_user'")
        conn.execute("DELETE FROM approvals WHERE user_id = 'test_user'")
        conn.execute("DELETE FROM evidence WHERE user_id = 'test_user'")


def make_action(db, action_id: str, user_id: str = "test_user"):
    """Helper to insert action row required by verification_results foreign key."""
    with db.transaction() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO actions (id, user_id, tool_name, arguments_hash, idempotency_key, created_at) "
            "VALUES (?, ?, 'test_tool', 'hash', ?, datetime('now'))",
            (action_id, user_id, f"idem_{action_id}"),
        )


@pytest.fixture
def world_repo(clean_db):
    return WorldModelRepository(clean_db)


@pytest.fixture
def verifier(clean_db, world_repo):
    return PostconditionVerifier(world_repo=world_repo)


def test_gmail_verifier_with_read_back_success(clean_db, verifier, world_repo):
    """Test Gmail verification with real read-back matching recipient & subject."""
    action_id = "act_gmail_1"
    make_action(clean_db, action_id)

    def mock_fetch_sent(msg_id):
        assert msg_id == "msg_12345"
        return {
            "id": msg_id,
            "to": "investor@example.com",
            "subject": "Q3 Update",
            "snippet": "Here is the report...",
        }

    gmail_strat = GmailVerifier(read_back_fn=mock_fetch_sent)
    verifier.register_strategy(gmail_strat, index=0)

    args = {"to": "investor@example.com", "subject": "Q3 Update", "body": "Full body text"}
    receipt = {"ok": True, "id": "msg_12345"}

    vr = verifier.verify_action(action_id, "gmail.send_email", receipt, "test_user", arguments=args)

    assert vr.status == VerificationStatus.VERIFIED
    assert vr.details["read_back"] is True
    assert vr.details["message_id"] == "msg_12345"
    assert vr.evidence_id is not None

    # Verify evidence stored in World Model
    ev = world_repo.get_evidence(vr.evidence_id, "test_user")
    assert ev is not None
    assert ev.evidence_type == "email_sent"
    assert ev.external_id == "msg_12345"
    assert ev.metadata["read_back_verified"] is True


def test_gmail_verifier_read_back_recipient_mismatch_fails(clean_db, verifier):
    """If read-back shows recipient was different, verification must FAIL."""
    action_id = "act_gmail_fail"
    make_action(clean_db, action_id)

    def mock_fetch_sent(msg_id):
        return {
            "id": msg_id,
            "to": "wrong_person@example.com",
            "subject": "Q3 Update",
        }

    gmail_strat = GmailVerifier(read_back_fn=mock_fetch_sent)
    verifier.register_strategy(gmail_strat, index=0)

    args = {"to": "investor@example.com", "subject": "Q3 Update"}
    receipt = {"ok": True, "id": "msg_mismatch"}

    vr = verifier.verify_action(action_id, "gmail.send_email", receipt, "test_user", arguments=args)

    assert vr.status == VerificationStatus.FAILED
    assert "Recipient mismatch" in vr.details["error"]
    assert vr.evidence_id is None


def test_calendar_verifier_with_read_back_success(clean_db, verifier, world_repo):
    """Test Calendar verification with read-back confirming event existence and title."""
    action_id = "act_cal_1"
    make_action(clean_db, action_id)

    def mock_get_event(event_id):
        return {
            "id": event_id,
            "title": "Board Meeting",
            "start": "2026-10-10T14:00:00Z",
            "end": "2026-10-10T15:00:00Z",
        }

    cal_strat = CalendarVerifier(read_back_fn=mock_get_event)
    verifier.register_strategy(cal_strat, index=0)

    args = {"title": "Board Meeting", "start": "2026-10-10T14:00:00Z", "end": "2026-10-10T15:00:00Z"}
    receipt = {"ok": True, "id": "evt_999", "link": "https://calendar.google.com/event?id=evt_999"}

    vr = verifier.verify_action(action_id, "google_calendar.create_event", receipt, "test_user", arguments=args)

    assert vr.status == VerificationStatus.VERIFIED
    assert vr.details["read_back"] is True
    assert vr.details["event_id"] == "evt_999"
    assert vr.evidence_id is not None

    ev = world_repo.get_evidence(vr.evidence_id, "test_user")
    assert ev is not None
    assert ev.evidence_type == "calendar_event"
    assert ev.metadata["event_id"] == "evt_999"


def test_github_verifier_success(clean_db, verifier, world_repo):
    """GitHub PR creation verified with URL and PR number."""
    action_id = "act_gh_1"
    make_action(clean_db, action_id)

    args = {"repo": "SaiSankeerth-dev/OS", "title": "Feat: Safe Execution"}
    receipt = {"ok": True, "number": 42, "html_url": "https://github.com/SaiSankeerth-dev/OS/pull/42"}

    vr = verifier.verify_action(action_id, "github.create_pr", receipt, "test_user", arguments=args)

    assert vr.status == VerificationStatus.VERIFIED
    assert vr.details["pr_number"] == 42
    assert vr.evidence_id is not None

    ev = world_repo.get_evidence(vr.evidence_id, "test_user")
    assert ev is not None
    assert ev.evidence_type == "github_pr"
    assert ev.external_id == "42"


def test_file_verifier_success_and_failure(clean_db, verifier, world_repo):
    """FileVerifier verifies disk existence and size."""
    action_id_1 = "act_file_1"
    action_id_2 = "act_file_2"
    make_action(clean_db, action_id_1)
    make_action(clean_db, action_id_2)

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(b"Hello from OS verification engine")
        tmp_path = tmp.name

    try:
        # Existing file passes
        vr_ok = verifier.verify_action(
            action_id_1,
            "files.write",
            {"path": tmp_path},
            "test_user",
            arguments={"path": tmp_path},
        )
        assert vr_ok.status == VerificationStatus.VERIFIED
        assert vr_ok.details["file_exists"] is True
        assert vr_ok.details["size_bytes"] > 0
        assert vr_ok.evidence_id is not None

        # Non-existing file fails
        vr_fail = verifier.verify_action(
            action_id_2,
            "files.write",
            {"path": "/nonexistent/fake/file.txt"},
            "test_user",
            arguments={"path": "/nonexistent/fake/file.txt"},
        )
        assert vr_fail.status == VerificationStatus.FAILED
        assert "does not exist" in vr_fail.details["error"]
    finally:
        Path(tmp_path).unlink(missing_ok=True)


def test_browser_verifier_with_screenshot(clean_db, verifier, world_repo):
    """BrowserVerifier verifies screenshot path on disk."""
    action_id = "act_browser_1"
    make_action(clean_db, action_id)

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp.write(b"PNG_DATA_STUB")
        png_path = tmp.name

    try:
        receipt = {
            "action": "navigate",
            "url": "https://example.com",
            "status": "SUCCEEDED",
            "status_code": 200,
            "screenshot_path": png_path,
        }
        vr = verifier.verify_action(
            action_id,
            "browser.navigate",
            receipt,
            "test_user",
            arguments={"url": "https://example.com"},
        )
        assert vr.status == VerificationStatus.VERIFIED
        assert vr.details["screenshot_verified"] is True
        assert vr.evidence_id is not None
    finally:
        Path(png_path).unlink(missing_ok=True)


def test_safe_executor_end_to_end_with_postcondition_verification(clean_db, world_repo):
    """End-to-end integration: SafeExecutor prepare -> approve -> execute -> external read-back -> evidence stored."""
    # Wire Gmail read-back into verifier
    def read_back_sent(msg_id):
        return {
            "id": msg_id,
            "to": "partner@acme.com",
            "subject": "Contract Final",
        }

    post_verifier = PostconditionVerifier(world_repo=world_repo)
    post_verifier.register_strategy(GmailVerifier(read_back_fn=read_back_sent), index=0)

    executor = SafeExecutor(verifier=post_verifier)

    tool = ToolDefinition(
        name="gmail.send_email",
        description="Send real email",
        risk_level=RiskLevel.HIGH,
        execute=lambda args: {"ok": True, "id": "gmail_msg_888"},
    )

    user_id = "test_user"
    args = {"to": "partner@acme.com", "subject": "Contract Final", "body": "Please find attached..."}

    # 1. Prepare
    action, approval, _ = executor.prepare(user_id, "gmail.send_email", args, tool_def=tool)
    assert approval is not None

    # 2. Approve
    executor.approve(approval.id, args, user_id=user_id)

    # 3. Execute (executes tool + runs Gmail postcondition verifier + creates Evidence)
    result = executor.execute(action.id, user_id=user_id, tool_def=tool)

    assert result["id"] == "gmail_msg_888"
    assert result["_verification"]["status"] == "VERIFIED"
    assert result["_verification"]["details"]["read_back"] is True

    # 4. Prove Evidence exists in World Model
    with clean_db.connection() as conn:
        ev_row = conn.execute(
            "SELECT * FROM evidence WHERE external_id = 'gmail_msg_888' AND user_id = ?",
            (user_id,),
        ).fetchone()
        assert ev_row is not None
        assert ev_row["evidence_type"] == "email_sent"
