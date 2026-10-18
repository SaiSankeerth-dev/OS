"""Safety engine and approval gating for OS computer control.

Enforces:
1. URL sanitization and protocol whitelist (blocks javascript:, file:, data:).
2. Action risk classification (READ_ONLY, INTERACTIVE_LOW, HIGH_AUTH_OR_WRITE).
3. Human-in-the-loop (HITL) approval gates for sensitive operations.
4. Global emergency stop / kill-switch mechanism.
"""
from __future__ import annotations

import logging
import re
import threading
import time
import urllib.parse
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Set

from server.computer.interface import SafetyGateTriggeredError

log = logging.getLogger("os.computer.safety")


class ActionRiskLevel(str, Enum):
    READ_ONLY = "READ_ONLY"
    INTERACTIVE_LOW = "INTERACTIVE_LOW"
    HIGH_AUTH_OR_WRITE = "HIGH_AUTH_OR_WRITE"
    SYSTEM_RESTRICTED = "SYSTEM_RESTRICTED"


@dataclass
class ApprovalTicket:
    ticket_id: str
    session_id: str
    backend: str
    action_type: str
    target: str
    payload: Dict[str, Any]
    risk_level: ActionRiskLevel
    reason: str
    status: str = "pending"  # pending, approved, rejected, expired
    created_at: float = field(default_factory=time.time)
    resolved_at: Optional[float] = None
    resolved_by: Optional[str] = None


class ComputerSafetyGuard:
    """Security validator, URL sanitizer, and approval gate for computer actions."""

    ALLOWED_SCHEMES = {"http", "https", "about"}
    SENSITIVE_KEYWORDS = {
        "password", "passwd", "token", "secret", "cvv", "credit_card",
        "delete", "remove", "drop", "purge", "terminate", "purchase",
        "pay", "checkout", "transfer", "submit_order", "authorize",
        "2fa", "otp", "totp", "mfa"
    }

    def __init__(self, require_approval_for_write: bool = True) -> None:
        self.require_approval_for_write = require_approval_for_write
        self._emergency_stop = False
        self._pending_tickets: Dict[str, ApprovalTicket] = {}
        self._lock = threading.Lock()

    def trigger_emergency_stop(self) -> None:
        """Trip the global kill switch immediately halting all computer actions."""
        with self._lock:
            self._emergency_stop = True
            log.critical("EMERGENCY KILL SWITCH TRIPPED: All computer actions halted immediately.")

    def reset_emergency_stop(self) -> None:
        """Reset the emergency kill switch."""
        with self._lock:
            self._emergency_stop = False
            log.info("Emergency kill switch reset.")

    def is_emergency_stopped(self) -> bool:
        with self._lock:
            return self._emergency_stop

    def sanitize_url(self, url: str) -> str:
        """Validate and sanitize a navigation target URL."""
        if self._emergency_stop:
            raise SafetyGateTriggeredError("Emergency kill switch is active. Navigation blocked.")

        clean_url = url.strip()
        if not clean_url:
            raise SafetyGateTriggeredError("Navigation URL cannot be empty.")

        parsed = urllib.parse.urlparse(clean_url)
        scheme = parsed.scheme.lower()
        if scheme not in self.ALLOWED_SCHEMES:
            raise SafetyGateTriggeredError(
                f"URL scheme '{scheme}' is forbidden. Allowed schemes: {self.ALLOWED_SCHEMES}"
            )

        # Block loopback manipulation if trying to access sensitive internal management ports
        if parsed.hostname in ("127.0.0.1", "localhost"):
            port = parsed.port
            # Protect OS internal sensitive endpoints if necessary
            if port in (22, 23, 3389):
                raise SafetyGateTriggeredError(f"Access to internal port {port} is restricted.")

        return clean_url

    def classify_action_risk(
        self,
        action: str,
        target: Optional[str] = None,
        payload: Optional[Dict[str, Any]] = None,
    ) -> ActionRiskLevel:
        """Determine the risk tier of a planned computer-control action."""
        act = action.lower()
        tgt = (target or "").lower()
        payload = payload or {}

        # 1. Read-only actions
        if act in (
            "observe_screen",
            "inspect_page",
            "take_screenshot",
            "list_windows",
            "list_tabs",
            "scroll",
            "wait_for",
            "verify_completion",
            "navigate",
            "open_url",
            "observe_page",
            "inspect_elements",
        ):
            return ActionRiskLevel.READ_ONLY

        # 2. Check for sensitive keywords in target locator or payload
        for kw in self.SENSITIVE_KEYWORDS:
            if kw in tgt or any(kw in str(v).lower() for v in payload.values()):
                return ActionRiskLevel.HIGH_AUTH_OR_WRITE

        # 3. Downloads and file writes
        if act in ("download_file", "write_file", "delete_file"):
            return ActionRiskLevel.HIGH_AUTH_OR_WRITE

        # 4. Standard interactive actions
        if act in (
            "click_element",
            "type_text",
            "press_key",
            "press_shortcut",
            "key_down",
            "key_up",
            "release_all_keys",
            "fill_and_submit",
        ):
            return ActionRiskLevel.INTERACTIVE_LOW

        return ActionRiskLevel.HIGH_AUTH_OR_WRITE

    def request_approval(
        self,
        session_id: str,
        backend: str,
        action_type: str,
        target: str,
        payload: Dict[str, Any],
        reason: str,
    ) -> ApprovalTicket:
        """Create a pending human approval ticket for a high-risk operation."""
        ticket_id = f"appr-{int(time.time()*1000)}-{len(self._pending_tickets)+1}"
        ticket = ApprovalTicket(
            ticket_id=ticket_id,
            session_id=session_id,
            backend=backend,
            action_type=action_type,
            target=target,
            payload=payload,
            risk_level=ActionRiskLevel.HIGH_AUTH_OR_WRITE,
            reason=reason,
        )
        with self._lock:
            self._pending_tickets[ticket_id] = ticket
        log.warning(f"Created pending approval ticket '{ticket_id}': {action_type} on '{target}' - {reason}")
        return ticket

    def resolve_approval(self, ticket_id: str, decision: str, user: str = "human") -> ApprovalTicket:
        """Resolve a pending approval ticket (decision: 'approve' or 'reject')."""
        with self._lock:
            ticket = self._pending_tickets.get(ticket_id)
            if not ticket:
                raise KeyError(f"Approval ticket '{ticket_id}' not found.")
            if ticket.status != "pending":
                raise ValueError(f"Approval ticket '{ticket_id}' already {ticket.status}.")

            ticket.status = "approved" if decision in ("approve", "approved", "allow_once", "always_allow") else "rejected"
            ticket.resolved_at = time.time()
            ticket.resolved_by = user
            log.info(f"Approval ticket '{ticket_id}' resolved as '{ticket.status}' by {user}")
            return ticket

    def get_pending_approvals(self) -> List[ApprovalTicket]:
        with self._lock:
            return [t for t in self._pending_tickets.values() if t.status == "pending"]

    def validate_action(
        self,
        session_id: str,
        backend: str,
        action: str,
        target: Optional[str] = None,
        payload: Optional[Dict[str, Any]] = None,
        approval_ticket_id: Optional[str] = None,
    ) -> None:
        """Check if action is permitted to proceed immediately or if it requires gate approval."""
        if self._emergency_stop:
            raise SafetyGateTriggeredError("Action blocked: Emergency kill switch is active.")

        risk = self.classify_action_risk(action, target, payload)
        if risk == ActionRiskLevel.HIGH_AUTH_OR_WRITE and self.require_approval_for_write:
            if not approval_ticket_id:
                ticket = self.request_approval(
                    session_id=session_id,
                    backend=backend,
                    action_type=action,
                    target=target or "",
                    payload=payload or {},
                    reason=f"Action '{action}' on '{target}' classified as high risk.",
                )
                raise SafetyGateTriggeredError(
                    f"Action '{action}' requires human approval. Created ticket: {ticket.ticket_id}",
                    details={"ticket_id": ticket.ticket_id, "risk": risk.value},
                )
            # Verify provided ticket
            with self._lock:
                ticket = self._pending_tickets.get(approval_ticket_id)
                if not ticket or ticket.status != "approved":
                    raise SafetyGateTriggeredError(
                        f"Action '{action}' lacks valid approved ticket. Status: {ticket.status if ticket else 'not_found'}"
                    )


_GLOBAL_SAFETY_GUARD: Optional[ComputerSafetyGuard] = None


def get_computer_safety_guard() -> ComputerSafetyGuard:
    global _GLOBAL_SAFETY_GUARD
    if _GLOBAL_SAFETY_GUARD is None:
        _GLOBAL_SAFETY_GUARD = ComputerSafetyGuard()
    return _GLOBAL_SAFETY_GUARD
