"""Safety Gate and Human-in-the-Loop (HITL) approval engine for OS.

Enforces server-side command safety inspection, destructive action blocking,
cryptographic argument binding, and scoped approval resolution.
"""
from __future__ import annotations

import hashlib
import json
import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set, Tuple


class SafetyGate:
    DESTRUCTIVE_PATTERNS = [
        r"rm\s+-rf\s+/",
        r"mkfs\.",
        r"dd\s+if=",
        r":\(\)\{\s*:\|:&\s*\};:",
        r"curl\s+.*\|\s*(ba)?sh",
        r"wget\s+.*\|\s*(ba)?sh",
        r"powershell.*-enc",
        r"format\s+[a-zA-Z]:",
        r"del\s+/s\s+/q\s+c:\\",
        r"drop\s+database",
    ]

    RISKY_ACTIONS: Set[str] = {
        "shell_exec",
        "file_write",
        "file_delete",
        "git_push",
        "network_tunnel",
    }

    def __init__(self) -> None:
        self.always_allowed_rules: Set[str] = set()
        self.tool_guard_rules: Dict[str, str] = {
            "shell_exec": "ASK_USER_HITL",
            "file_write": "ASK_USER_HITL",
            "file_delete": "ASK_USER_HITL",
            "git_push": "ASK_USER_HITL",
            "network_tunnel": "DENY",
        }
        self.pending_approvals: Dict[str, Dict[str, Any]] = {}
        self.audit_log: List[Dict[str, Any]] = []

    def inspect_command(self, command: str) -> Tuple[bool, str]:
        """Hard security gate: block destructive and unconstrained shell patterns."""
        for pattern in self.DESTRUCTIVE_PATTERNS:
            if re.search(pattern, command, re.IGNORECASE):
                self._log("BLOCKED_DESTRUCTIVE", command, f"Matched pattern: {pattern}")
                return False, f"Blocked by OS Safety Gate (matched unsafe pattern: {pattern})"
        return True, "Safe"

    @staticmethod
    def compute_arguments_hash(payload: Any) -> str:
        """Cryptographically bind the approval to the exact payload."""
        data = json.dumps(payload, sort_keys=True) if not isinstance(payload, str) else payload
        return hashlib.sha256(data.encode("utf-8")).hexdigest()

    def request_approval(
        self,
        dot_name: str,
        action_type: str,
        payload: str,
        reason: str = "Requested high-impact action",
    ) -> Dict[str, Any]:
        """Server-side approval check. Returns 'approved', 'waiting_approval', or 'blocked'."""
        if action_type == "shell_exec":
            is_safe, check_reason = self.inspect_command(payload)
            if not is_safe:
                return {
                    "status": "blocked",
                    "reason": check_reason,
                    "approval_id": None,
                }

        # Check ToolGuard DENY rules
        guard_policy = self.tool_guard_rules.get(action_type, "ALLOW")
        if guard_policy == "DENY":
            self._log("BLOCKED_BY_TOOLGUARD", payload, f"ToolGuard rule for {action_type} is DENY")
            return {
                "status": "blocked",
                "reason": f"Action '{action_type}' is blocked by ToolGuard policy.",
                "approval_id": None,
            }

        rule_key = f"{dot_name}:{action_type}"
        if (action_type not in self.RISKY_ACTIONS and guard_policy != "ASK_USER_HITL") or rule_key in self.always_allowed_rules:
            self._log("AUTO_APPROVED", payload, f"Rule {rule_key}")
            return {
                "status": "approved",
                "reason": "Permitted by policy",
                "approval_id": None,
            }

        approval_id = f"apr_{uuid.uuid4().hex[:8]}"
        arg_hash = self.compute_arguments_hash(payload)
        card = {
            "approval_id": approval_id,
            "dot_name": dot_name,
            "action_type": action_type,
            "payload": payload,
            "arguments_hash": arg_hash,
            "reason": reason,
            "status": "waiting_approval",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "options": ["allow_once", "always_allow", "deny"],
        }
        self.pending_approvals[approval_id] = card
        self._log("WAITING_APPROVAL", payload, f"Approval ID: {approval_id}")

        # Sync with SafeExecutor World Model action repository if database is available
        try:
            from server.execution.approval import compute_arguments_hash as safe_arg_hash
            from server.db.database import get_db
            from server.db.repositories.core import ActionApprovalRepository
            from server.domain.entities import Action, Approval
            from server.domain.enums import ActionStatus, ApprovalStatus, RiskLevel

            db = get_db()
            repo = ActionApprovalRepository(db)
            action_obj = Action(
                id=approval_id,
                user_id="default_user",
                tool_name=f"hud.{action_type}",
                arguments={"payload": payload},
                risk_level=RiskLevel.HIGH,
                status=ActionStatus.WAITING_APPROVAL,
            )
            approval_obj = Approval(
                id=approval_id,
                action_id=approval_id,
                user_id="default_user",
                arguments_hash=arg_hash,
                status=ApprovalStatus.PENDING,
            )
            repo.save_action_and_approval(action_obj, approval_obj)
        except Exception:
            pass

        return card

    def resolve_approval(self, approval_id: str, decision: str, current_payload: Optional[str] = None) -> Dict[str, Any]:
        """Resolve a pending approval card with 'allow_once', 'always_allow', or 'deny'."""
        if approval_id not in self.pending_approvals:
            return {"error": f"Approval ID {approval_id} not found"}

        card = self.pending_approvals.get(approval_id)
        if not card:
            return {"error": f"Approval ID {approval_id} not found"}

        # Enforce SHA-256 arguments_hash binding to prevent payload substitution
        if current_payload is not None:
            check_hash = self.compute_arguments_hash(current_payload)
            if check_hash != card.get("arguments_hash"):
                self._log("TAMPER_DETECTED", current_payload, f"Hash mismatch for {approval_id}")
                return {"error": "Tampering detected: arguments hash does not match original approval card"}

        card = self.pending_approvals.pop(approval_id)
        if decision == "always_allow":
            rule_key = f"{card['dot_name']}:{card['action_type']}"
            self.always_allowed_rules.add(rule_key)
            card["status"] = "approved"
        elif decision == "allow_once":
            card["status"] = "approved"
        else:
            card["status"] = "denied"

        card["resolved_at"] = datetime.now(timezone.utc).isoformat()
        card["decision"] = decision
        self._log(f"RESOLVED_{decision.upper()}", card["payload"], f"Approval ID: {approval_id}")

        # Update World Model repository if present
        try:
            from server.db.database import get_db
            from server.db.repositories.core import ActionApprovalRepository
            from server.domain.enums import ActionStatus, ApprovalStatus

            db = get_db()
            repo = ActionApprovalRepository(db)
            new_app_status = ApprovalStatus.APPROVED if card["status"] == "approved" else ApprovalStatus.REJECTED
            repo.update_approval_status(approval_id, new_app_status, f"Resolved via Cyber-HUD: {decision}")
        except Exception:
            pass

        return card

    def _log(self, event: str, target: str, detail: str) -> None:
        self.audit_log.append({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event": event,
            "target": str(target)[:120],
            "detail": detail,
        })
