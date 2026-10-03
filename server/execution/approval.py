"""Approval Engine for OS.

Enforces cryptographic / deterministic binding of user approval:
1. Approval is attached to the exact intended action and arguments hash.
2. If any parameter, recipient, or text changes, previous approval is invalid.
3. Rejected or expired approvals guarantee zero handler executions.
"""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from server.domain.entities import Action, Activity, Approval
from server.domain.enums import ActionStatus, ActorType, ApprovalStatus, RiskLevel
from server.db.repositories.core import ActionApprovalRepository, ActivityRepository
from server.db.database import get_db


def compute_arguments_hash(args: dict[str, Any]) -> str:
    """Stable deterministic hash of tool arguments."""
    serialized = json.dumps(args, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()[:16]


class ApprovalTamperedError(ValueError):
    pass


class ApprovalExpiredError(ValueError):
    pass


class ApprovalEngine:
    def __init__(
        self,
        approval_repo: Optional[ActionApprovalRepository] = None,
        activity_repo: Optional[ActivityRepository] = None,
        timeout_sec: int = 1800,
    ) -> None:
        db = get_db()
        self.repo = approval_repo or ActionApprovalRepository(db)
        self.activity_repo = activity_repo or ActivityRepository(db)
        self.timeout_sec = timeout_sec

    def request_approval(
        self,
        user_id: str,
        tool_name: str,
        arguments: dict[str, Any],
        task_id: Optional[str] = None,
        risk_level: RiskLevel = RiskLevel.HIGH,
        timeout_sec: Optional[int] = None,
    ) -> tuple[Action, Approval]:
        arg_hash = compute_arguments_hash(arguments)
        idempotency_key = f"{user_id}_{tool_name}_{arg_hash}_{int(datetime.now(timezone.utc).timestamp())}"
        effective_timeout = timeout_sec if timeout_sec is not None else self.timeout_sec
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=effective_timeout)

        action = Action(
            user_id=user_id,
            task_id=task_id,
            tool_name=tool_name,
            risk_level=risk_level,
            arguments=arguments,
            arguments_hash=arg_hash,
            status=ActionStatus.WAITING_APPROVAL,
            idempotency_key=idempotency_key,
        )
        self.repo.create_action(action)

        approval = Approval(
            action_id=action.id,
            user_id=user_id,
            arguments_hash=arg_hash,
            status=ApprovalStatus.PENDING,
            expires_at=expires_at,
        )
        self.repo.create_approval(approval)

        self.activity_repo.log(
            Activity(
                user_id=user_id,
                actor_type=ActorType.OS,
                event_type="approval.requested",
                entity_type="action",
                entity_id=action.id,
                summary=f"Approval requested for {tool_name} (risk: {risk_level.value})",
                metadata={"arguments_hash": arg_hash, "tool": tool_name},
            )
        )
        return action, approval

    def approve(
        self,
        approval_id: str,
        current_arguments: dict[str, Any],
        user_id: str = "default_user",
    ) -> bool:
        current_hash = compute_arguments_hash(current_arguments)

        # Retrieve approval record
        with self.repo.db.connection() as conn:
            row = conn.execute(
                "SELECT * FROM approvals WHERE id = ? AND user_id = ?",
                (approval_id, user_id),
            ).fetchone()
            if not row:
                raise ValueError(f"Approval '{approval_id}' not found")

            if row["status"] != "PENDING":
                raise ValueError(f"Approval '{approval_id}' is already {row['status']}")

            # Check expiration
            expires_at_val = row["expires_at"] if "expires_at" in row.keys() else None
            if expires_at_val:
                try:
                    exp = datetime.fromisoformat(expires_at_val)
                    if exp.tzinfo is None:
                        exp = exp.replace(tzinfo=timezone.utc)
                    if datetime.now(timezone.utc) > exp:
                        self.repo.decide_approval(approval_id, ApprovalStatus.EXPIRED, user_id)
                        raise ApprovalExpiredError(
                            f"Approval '{approval_id}' expired at {exp.isoformat()} and cannot be approved"
                        )
                except (ValueError, TypeError) as e:
                    if isinstance(e, ApprovalExpiredError):
                        raise

            # Bound arguments check
            if row["arguments_hash"] != current_hash:
                raise ApprovalTamperedError(
                    f"Arguments were altered after approval was presented! Expected hash {row['arguments_hash']}, got {current_hash}"
                )

        success = self.repo.decide_approval(approval_id, ApprovalStatus.APPROVED, user_id)
        if success:
            self.activity_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.USER,
                    event_type="approval.granted",
                    entity_type="approval",
                    entity_id=approval_id,
                    summary=f"User approved action with arguments hash {current_hash}",
                    metadata={"approval_id": approval_id, "arguments_hash": current_hash},
                )
            )
        return success

    def reject(
        self,
        approval_id: str,
        reason: str = "",
        user_id: str = "default_user",
    ) -> bool:
        success = self.repo.decide_approval(approval_id, ApprovalStatus.REJECTED, user_id)
        if success:
            self.activity_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.USER,
                    event_type="approval.rejected",
                    entity_type="approval",
                    entity_id=approval_id,
                    summary=f"User rejected approval: {reason or 'Denied by user'}",
                    metadata={"approval_id": approval_id, "reason": reason},
                )
            )
        return success
