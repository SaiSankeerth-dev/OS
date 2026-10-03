"""Completion Verification Engine for OS.

Enforces Section 38 of the PRD/TRD:
When the user or an agent says "Done", OS does not blindly mark the task completed.
Flow:
    OPEN / IN_PROGRESS -> COMPLETION_CANDIDATE -> VERIFY -> COMPLETED
"""
from __future__ import annotations

import logging
from typing import Any, Optional

from server.domain.entities import Activity, Task
from server.domain.enums import ActorType, TaskStatus
from server.domain.services.task_service import TaskService
from server.db.repositories.core import ActivityRepository, TaskRepository
from server.db.database import get_db

log = logging.getLogger("os.execution.completion")


class CompletionEngine:
    def __init__(
        self,
        task_service: Optional[TaskService] = None,
        task_repo: Optional[TaskRepository] = None,
        activity_repo: Optional[ActivityRepository] = None,
    ) -> None:
        db = get_db()
        self.task_repo = task_repo or TaskRepository(db)
        self.task_service = task_service or TaskService(self.task_repo)
        self.activity_repo = activity_repo or ActivityRepository(db)

    def request_completion(
        self,
        task_id: str,
        user_id: str = "default_user",
        evidence_receipt: Optional[dict[str, Any]] = None,
    ) -> tuple[Task, bool, str]:
        """Processes a completion claim through the verification gate.

        Returns (task, is_verified, message).
        """
        task = self.task_repo.get(task_id, user_id)
        if not task:
            raise ValueError(f"Task '{task_id}' not found")

        # Step 1: Move to COMPLETION_CANDIDATE
        task = self.task_service.transition_state(
            task_id=task.id,
            new_status=TaskStatus.COMPLETION_CANDIDATE,
            user_id=user_id,
            reason="Completion claimed; verifying external postconditions",
        )

        # Step 2: Verification of evidence receipt
        verified = False
        message = ""

        if evidence_receipt and (
            evidence_receipt.get("verified") is True
            or evidence_receipt.get("message_id")
            or evidence_receipt.get("pr_number")
            or evidence_receipt.get("file_exists")
            or evidence_receipt.get("tests_passed") is True
        ):
            verified = True
            message = "Postcondition verified: external deliverable confirmed."
        else:
            message = "Completion uncertain: external outcome could not be independently verified."

        # Step 3: Transition to COMPLETED if verified
        if verified:
            task = self.task_service.transition_state(
                task_id=task.id,
                new_status=TaskStatus.COMPLETED,
                user_id=user_id,
                reason=message,
                verified=True,
            )
            self.activity_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.OS,
                    event_type="task.completed_verified",
                    entity_type="task",
                    entity_id=task.id,
                    summary=f"Task '{task.title}' verified and marked COMPLETED",
                    metadata={"evidence": evidence_receipt},
                )
            )
        else:
            self.activity_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.OS,
                    event_type="task.completion_uncertain",
                    entity_type="task",
                    entity_id=task.id,
                    summary=f"Task '{task.title}' held in COMPLETION_CANDIDATE: verification uncertain",
                    metadata={"evidence": evidence_receipt},
                )
            )

        return task, verified, message
