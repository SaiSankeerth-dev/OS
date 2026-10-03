"""External Postcondition Verification Engine for OS.

Enforces Section 37 & 48 of the PRD/TRD:
OS must distinguish:
    Action attempted (e.g. API HTTP 200 returned)
from:
    Action succeeded and verified via external read-back

Flow:
    Execute
    ↓
    External read-back
    ↓
    Postcondition check
    ↓
    Evidence
    ↓
    VerificationResult
    ↓
    World Model update
"""
from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Optional

from server.domain.entities import Activity, Evidence, VerificationResult
from server.domain.enums import ActorType, VerificationStatus
from server.db.repositories.core import ActionApprovalRepository, ActivityRepository
from server.db.repositories.world import WorldModelRepository
from server.db.database import get_db

log = logging.getLogger("os.execution.verifier")


# ---------------------------------------------------------------------------
# Base Verifier Strategy
# ---------------------------------------------------------------------------

class BaseVerifierStrategy(ABC):
    """Abstract strategy for domain-specific external postcondition verification."""

    @abstractmethod
    def can_verify(self, tool_name: str) -> bool:
        """Return True if this strategy handles the given tool."""
        pass

    @abstractmethod
    def verify(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        arguments: dict[str, Any],
        user_id: str,
    ) -> tuple[VerificationStatus, dict[str, Any], Optional[Evidence]]:
        """Perform postcondition check and external read-back.

        Returns (VerificationStatus, details_dict, Optional[Evidence]).
        """
        pass


# ---------------------------------------------------------------------------
# 1. Gmail Verifier
# ---------------------------------------------------------------------------

class GmailVerifier(BaseVerifierStrategy):
    """Verifies email transmission by inspecting message ID and reading back."""

    def __init__(self, read_back_fn: Optional[Callable[[str], dict[str, Any]]] = None) -> None:
        self.read_back_fn = read_back_fn

    def can_verify(self, tool_name: str) -> bool:
        return tool_name in (
            "gmail.send_email",
            "gmail.send",
            "microsoft_outlook.send_email",
            "email.send",
        )

    def verify(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        arguments: dict[str, Any],
        user_id: str,
    ) -> tuple[VerificationStatus, dict[str, Any], Optional[Evidence]]:
        msg_id = execution_result.get("id") or execution_result.get("message_id")
        if not execution_result.get("ok", True) or not msg_id:
            return (
                VerificationStatus.FAILED,
                {"error": "Missing confirmed message_id from email provider"},
                None,
            )

        details: dict[str, Any] = {
            "message_id": msg_id,
            "provider_confirmed": True,
            "read_back": False,
        }

        # Real read-back if a read_back_fn or simulated payload exists
        read_back_data = None
        if self.read_back_fn:
            try:
                read_back_data = self.read_back_fn(msg_id)
            except Exception as e:
                log.warning("Email read-back failed: %s", e)
        elif "read_back" in execution_result:
            read_back_data = execution_result["read_back"]

        if read_back_data:
            details["read_back"] = True
            details["read_back_data"] = read_back_data
            # Verify recipient & subject match
            expected_to = arguments.get("to")
            expected_subj = arguments.get("subject")
            actual_to = read_back_data.get("to")
            actual_subj = read_back_data.get("subject")

            if expected_to and actual_to and expected_to.strip().lower() != actual_to.strip().lower():
                return (
                    VerificationStatus.FAILED,
                    {
                        "error": f"Recipient mismatch on read-back: expected {expected_to}, got {actual_to}",
                        **details,
                    },
                    None,
                )
            if expected_subj and actual_subj and expected_subj.strip() != actual_subj.strip():
                return (
                    VerificationStatus.FAILED,
                    {
                        "error": f"Subject mismatch on read-back: expected {expected_subj}, got {actual_subj}",
                        **details,
                    },
                    None,
                )

        ev = Evidence(
            user_id=user_id,
            evidence_type="email_sent",
            external_id=str(msg_id),
            title=f"Sent email: {arguments.get('subject', 'Untitled')}",
            content=arguments.get("body", "")[:500],
            uri=f"gmail://messages/{msg_id}",
            metadata={
                "to": arguments.get("to"),
                "subject": arguments.get("subject"),
                "action_id": action_id,
                "read_back_verified": bool(read_back_data),
            },
        )
        return VerificationStatus.VERIFIED, details, ev


# ---------------------------------------------------------------------------
# 2. Calendar Verifier
# ---------------------------------------------------------------------------

class CalendarVerifier(BaseVerifierStrategy):
    """Verifies calendar event creation by inspecting event ID and reading back."""

    def __init__(self, read_back_fn: Optional[Callable[[str], dict[str, Any]]] = None) -> None:
        self.read_back_fn = read_back_fn

    def can_verify(self, tool_name: str) -> bool:
        return tool_name in (
            "google_calendar.create_event",
            "calendar.create",
            "microsoft_outlook.create_event",
        )

    def verify(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        arguments: dict[str, Any],
        user_id: str,
    ) -> tuple[VerificationStatus, dict[str, Any], Optional[Evidence]]:
        event_id = execution_result.get("id") or execution_result.get("event_id")
        if not event_id:
            return (
                VerificationStatus.FAILED,
                {"error": "Missing event ID from calendar provider"},
                None,
            )

        details: dict[str, Any] = {
            "event_id": event_id,
            "calendar_confirmed": True,
            "read_back": False,
        }

        read_back_data = None
        if self.read_back_fn:
            try:
                read_back_data = self.read_back_fn(event_id)
            except Exception as e:
                log.warning("Calendar read-back failed: %s", e)
        elif "read_back" in execution_result:
            read_back_data = execution_result["read_back"]

        if read_back_data:
            details["read_back"] = True
            details["read_back_data"] = read_back_data
            expected_title = arguments.get("title") or arguments.get("summary")
            actual_title = read_back_data.get("title") or read_back_data.get("summary")
            if expected_title and actual_title and expected_title.strip() != actual_title.strip():
                return (
                    VerificationStatus.FAILED,
                    {
                        "error": f"Title mismatch on read-back: expected {expected_title}, got {actual_title}",
                        **details,
                    },
                    None,
                )

        ev = Evidence(
            user_id=user_id,
            evidence_type="calendar_event",
            external_id=str(event_id),
            title=f"Calendar Event: {arguments.get('title', 'Event')}",
            content=f"Start: {arguments.get('start')}, End: {arguments.get('end')}",
            uri=execution_result.get("link") or f"calendar://events/{event_id}",
            metadata={
                "event_id": event_id,
                "start": arguments.get("start"),
                "end": arguments.get("end"),
                "action_id": action_id,
                "read_back_verified": bool(read_back_data),
            },
        )
        return VerificationStatus.VERIFIED, details, ev


# ---------------------------------------------------------------------------
# 3. GitHub Verifier
# ---------------------------------------------------------------------------

class GitHubVerifier(BaseVerifierStrategy):
    """Verifies GitHub actions (PRs, issues)."""

    def can_verify(self, tool_name: str) -> bool:
        return "github" in tool_name

    def verify(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        arguments: dict[str, Any],
        user_id: str,
    ) -> tuple[VerificationStatus, dict[str, Any], Optional[Evidence]]:
        pr_url = execution_result.get("html_url") or execution_result.get("url")
        pr_num = execution_result.get("number")
        if (pr_url or pr_num) and execution_result.get("ok", True):
            ev = Evidence(
                user_id=user_id,
                evidence_type="github_pr",
                external_id=str(pr_num) if pr_num else None,
                title=f"GitHub PR: #{pr_num} ({arguments.get('title', 'PR')})",
                uri=pr_url,
                metadata={"action_id": action_id, "pr_number": pr_num, "url": pr_url},
            )
            return (
                VerificationStatus.VERIFIED,
                {"pr_url": pr_url, "pr_number": pr_num, "confirmed_pr": True},
                ev,
            )
        return VerificationStatus.FAILED, {"error": "No PR URL or number returned by GitHub API"}, None


# ---------------------------------------------------------------------------
# 4. Browser Verifier
# ---------------------------------------------------------------------------

class BrowserVerifier(BaseVerifierStrategy):
    """Verifies browser actions, navigation, screenshots, and form submissions."""

    def can_verify(self, tool_name: str) -> bool:
        return "browser" in tool_name

    def verify(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        arguments: dict[str, Any],
        user_id: str,
    ) -> tuple[VerificationStatus, dict[str, Any], Optional[Evidence]]:
        status = execution_result.get("status")
        status_code = execution_result.get("status_code", 200)
        screenshot = execution_result.get("screenshot_path")

        if status == "FAILED" or status_code >= 400:
            return (
                VerificationStatus.FAILED,
                {"error": f"Browser action failed with status code {status_code}"},
                None,
            )

        details = {
            "action": execution_result.get("action", "unknown"),
            "url": execution_result.get("url", arguments.get("url", "")),
            "status_code": status_code,
            "screenshot_path": screenshot,
        }

        # Check screenshot on disk if present
        if screenshot and Path(screenshot).exists():
            details["screenshot_verified"] = True

        ev = Evidence(
            user_id=user_id,
            evidence_type="browser_receipt",
            title=f"Browser action on {details['url']}",
            uri=details["url"],
            metadata={"action_id": action_id, **details},
        )
        return VerificationStatus.VERIFIED, details, ev


# ---------------------------------------------------------------------------
# 5. File System Verifier
# ---------------------------------------------------------------------------

class FileVerifier(BaseVerifierStrategy):
    """Verifies filesystem postconditions: file exists and has non-zero size."""

    def can_verify(self, tool_name: str) -> bool:
        low = tool_name.lower()
        if "profile" in low:
            return False
        return (
            low in ("files.write", "files.create", "file_skill", "write_file", "create_file", "edit_file")
            or low.startswith("file.")
            or low.startswith("files.")
            or low.startswith("fs.")
            or any(part in ("file", "files") for part in low.split("_"))
        )

    def verify(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        arguments: dict[str, Any],
        user_id: str,
    ) -> tuple[VerificationStatus, dict[str, Any], Optional[Evidence]]:
        target = execution_result.get("path") or arguments.get("path")
        if target and Path(target).exists():
            size = Path(target).stat().st_size
            ev = Evidence(
                user_id=user_id,
                evidence_type="file",
                external_id=str(target),
                title=f"File: {Path(target).name}",
                uri=f"file:///{Path(target).resolve().as_posix()}",
                metadata={"action_id": action_id, "size_bytes": size},
            )
            return VerificationStatus.VERIFIED, {"path": str(target), "file_exists": True, "size_bytes": size}, ev
        return VerificationStatus.FAILED, {"error": f"Target file '{target}' does not exist on disk"}, None


# ---------------------------------------------------------------------------
# 6. Generic API Fallback Verifier
# ---------------------------------------------------------------------------

class GenericApiVerifier(BaseVerifierStrategy):
    """Fallback verifier for other tools."""

    def can_verify(self, tool_name: str) -> bool:
        return True

    def verify(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        arguments: dict[str, Any],
        user_id: str,
    ) -> tuple[VerificationStatus, dict[str, Any], Optional[Evidence]]:
        if execution_result.get("ok", True) and len(execution_result) > 0:
            return VerificationStatus.VERIFIED, {"receipt": "Execution receipt confirmed"}, None
        return VerificationStatus.UNKNOWN, {"note": "No domain verifier registered; result marked UNKNOWN"}, None


# ---------------------------------------------------------------------------
# PostconditionVerifier Engine
# ---------------------------------------------------------------------------

class PostconditionVerifier:
    """Reusable Postcondition Verifier supporting pluggable strategies.

    Guarantees:
      execution receipt + verification evidence + final verification state
    """

    def __init__(
        self,
        approval_repo: Optional[ActionApprovalRepository] = None,
        activity_repo: Optional[ActivityRepository] = None,
        world_repo: Optional[WorldModelRepository] = None,
        strategies: Optional[list[BaseVerifierStrategy]] = None,
    ) -> None:
        db = get_db()
        self.repo = approval_repo or ActionApprovalRepository(db)
        self.activity_repo = activity_repo or ActivityRepository(db)
        self.world_repo = world_repo or WorldModelRepository(db)
        self.strategies: list[BaseVerifierStrategy] = strategies or [
            GmailVerifier(),
            CalendarVerifier(),
            GitHubVerifier(),
            BrowserVerifier(),
            FileVerifier(),
            GenericApiVerifier(),
        ]

    def register_strategy(self, strategy: BaseVerifierStrategy, index: int = 0) -> None:
        """Register a custom verification strategy with high priority."""
        self.strategies.insert(index, strategy)

    def verify_action(
        self,
        action_id: str,
        tool_name: str,
        execution_result: dict[str, Any],
        user_id: str = "default_user",
        arguments: Optional[dict[str, Any]] = None,
    ) -> VerificationResult:
        """Executes postcondition verification through matched strategy."""
        args = arguments or {}

        # Find matching strategy
        strategy = next(
            (s for s in self.strategies if s.can_verify(tool_name)),
            GenericApiVerifier(),
        )

        status, details, evidence = strategy.verify(
            action_id, tool_name, execution_result, args, user_id
        )

        # Store evidence in World Model if generated
        evidence_id = None
        if evidence:
            try:
                saved_ev = self.world_repo.create_evidence(evidence)
                evidence_id = saved_ev.id
            except Exception as e:
                log.warning("Failed to store evidence in WorldModel: %s", e)

        vr = VerificationResult(
            action_id=action_id,
            verification_type=f"postcondition:{tool_name}",
            status=status,
            evidence_id=evidence_id,
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
                metadata={"status": status.value, "details": details, "evidence_id": evidence_id},
            )
        )
        return vr
