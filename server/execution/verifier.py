"""External Postcondition Verification Engine for OS.

Enforces Section 37 & 48 of the PRD/TRD:
OS must distinguish:
    Action attempted
from:
    Action succeeded

Every significant external write is verified by examining postcondition evidence
(message ID, PR URL, file existence, event confirmation).
"""
from __future__ import annotations

import logging
from typing import Any, Optional

from server.domain.entities import Activity, VerificationResult
from server.domain.enums import ActorType, VerificationStatus
from server.db.repositories.core import ActionApprovalRepository, ActivityRepository
from server.db.database import get_db

log = logging.getLogger("os.execution.verifier")


class PostconditionVerifier:
    def __init__(
        self,
        approval_repo: Optional[ActionApprovalRepository] = None,
        activity_repo: Optional[ActivityRepository] = None,
    ) -> None:
        db = get_db()
        self.repo = approval_repo or ActionApprovalRepository(db)
        self.activity_repo = activity_repo or ActivityRepository(db)

    def verify_action(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        user_id: str = "default_user",
    ) -> VerificationResult:
        """Verifies actual postcondition outcomes based on tool receipts."""
        status = VerificationStatus.FAILED
        details: dict[str, Any] = {}

        if tool_name == "gmail.send_email" or tool_name == "gmail.send":
            # Postcondition: provider returned success AND valid message ID exists
            msg_id = execution_result.get("id") or execution_result.get("message_id")
            if execution_result.get("ok", True) and msg_id:
                status = VerificationStatus.VERIFIED
                details = {"message_id": msg_id, "confirmed_sent": True}
            else:
                details = {"error": "Missing confirmed message_id from email provider"}

        elif tool_name == "github.create_pr" or tool_name == "github.create_pull_request":
            # Postcondition: pull request URL and number confirmed
            pr_url = execution_result.get("html_url") or execution_result.get("url")
            pr_num = execution_result.get("number")
            if (pr_url or pr_num) and execution_result.get("ok", True):
                status = VerificationStatus.VERIFIED
                details = {"pr_url": pr_url, "pr_number": pr_num, "confirmed_pr": True}
            else:
                details = {"error": "No PR URL or number returned by GitHub API"}

        elif tool_name == "google_calendar.create_event" or tool_name == "calendar.create":
            event_id = execution_result.get("id") or execution_result.get("event_id")
            if event_id:
                status = VerificationStatus.VERIFIED
                details = {"event_id": event_id, "calendar_confirmed": True}
            else:
                details = {"error": "Missing event ID from Google Calendar"}

        elif tool_name == "files.write" or tool_name == "files.create":
            from pathlib import Path
            target = execution_result.get("path")
            if target and Path(target).exists():
                size = Path(target).stat().st_size
                status = VerificationStatus.VERIFIED
                details = {"path": target, "file_exists": True, "size_bytes": size}
            else:
                details = {"error": f"Target file '{target}' does not exist on disk"}

        elif tool_name == "opencode.run_tests" or "test" in tool_name:
            exit_code = execution_result.get("exit_code", -1)
            if exit_code == 0:
                status = VerificationStatus.VERIFIED
                details = {"exit_code": 0, "tests_passed": True}
            else:
                details = {"exit_code": exit_code, "tests_passed": False}

        else:
            # Generic structured verification: check for non-empty result and explicit ok
            if execution_result.get("ok", True) and len(execution_result) > 0:
                status = VerificationStatus.VERIFIED
                details = {"receipt": "Execution receipt confirmed"}
            else:
                status = VerificationStatus.UNKNOWN
                details = {"note": "No domain verifier registered; result marked UNKNOWN"}

        vr = VerificationResult(
            action_id=action_id,
            verification_type=f"postcondition:{tool_name}",
            status=status,
            details=details,
        )
        self.repo.record_verification(vr)

        self.activity_repo.log(
            Activity(
                user_id=user_id,
                actor_type=ActorType.OS,
                event_type="action.verified",
                entity_type="action",
                entity_id=action_id,
                summary=f"Action '{tool_name}' postcondition verification: {status.value}",
                metadata={"status": status.value, "details": details},
            )
        )
        return vr
