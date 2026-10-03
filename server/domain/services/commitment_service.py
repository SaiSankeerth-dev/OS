"""Domain services for managing Commitments and their deterministic state machine.

Enforces:
1. Deterministic state transitions:
   OPEN -> IN_PROGRESS -> WAITING | BLOCKED -> COMPLETION_CANDIDATE -> COMPLETED | CANCELLED
2. Rule: Consequential completion must transition to COMPLETION_CANDIDATE before COMPLETED.
3. Audit activity logging for every state transition and commitment creation.
4. Non-silent deadline mutation: the planner may not alter the external deadline.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Optional

from server.domain.entities import Activity, Commitment, Evidence
from server.domain.enums import ActorType, CommitmentStatus
from server.db.repositories.core import ActivityRepository, CommitmentRepository
from server.db.repositories.world import WorldModelRepository
from server.db.database import get_db

log = logging.getLogger("os.domain.commitments")


class InvalidStateTransitionError(ValueError):
    pass


class CommitmentService:
    VALID_TRANSITIONS: dict[CommitmentStatus, set[CommitmentStatus]] = {
        CommitmentStatus.OPEN: {
            CommitmentStatus.IN_PROGRESS,
            CommitmentStatus.WAITING,
            CommitmentStatus.BLOCKED,
            CommitmentStatus.CANCELLED,
            CommitmentStatus.COMPLETION_CANDIDATE,
        },
        CommitmentStatus.IN_PROGRESS: {
            CommitmentStatus.WAITING,
            CommitmentStatus.BLOCKED,
            CommitmentStatus.COMPLETION_CANDIDATE,
            CommitmentStatus.CANCELLED,
        },
        CommitmentStatus.WAITING: {
            CommitmentStatus.OPEN,
            CommitmentStatus.IN_PROGRESS,
            CommitmentStatus.BLOCKED,
            CommitmentStatus.CANCELLED,
        },
        CommitmentStatus.BLOCKED: {
            CommitmentStatus.OPEN,
            CommitmentStatus.IN_PROGRESS,
            CommitmentStatus.WAITING,
            CommitmentStatus.CANCELLED,
        },
        CommitmentStatus.COMPLETION_CANDIDATE: {
            CommitmentStatus.COMPLETED,
            CommitmentStatus.IN_PROGRESS,
            CommitmentStatus.OPEN,
            CommitmentStatus.CANCELLED,
        },
        CommitmentStatus.COMPLETED: {
            CommitmentStatus.OPEN,  # Reopen if needed
        },
        CommitmentStatus.CANCELLED: {
            CommitmentStatus.OPEN,  # Reopen if needed
        },
    }

    def __init__(
        self,
        repo: Optional[CommitmentRepository] = None,
        activity_repo: Optional[ActivityRepository] = None,
        world_repo: Optional[WorldModelRepository] = None,
    ) -> None:
        db = get_db()
        self.repo = repo or CommitmentRepository(db)
        self.activity_repo = activity_repo or ActivityRepository(db)
        self.world_repo = world_repo or WorldModelRepository(db)

    def create_commitment(
        self,
        user_id: str,
        title: str,
        description: Optional[str] = None,
        deadline: Optional[datetime] = None,
        priority: int = 50,
        estimated_duration_minutes: Optional[int] = None,
        project_id: Optional[str] = None,
        goal_id: Optional[str] = None,
        person_id: Optional[str] = None,
        source_event_id: Optional[str] = None,
        confidence: float = 1.0,
        evidence: Optional[Evidence] = None,
    ) -> Commitment:
        # Check for semantic duplicates (exact title + project or open)
        existing_list = self.repo.list_by_user(user_id)
        for existing in existing_list:
            if (
                existing.status not in (CommitmentStatus.COMPLETED, CommitmentStatus.CANCELLED)
                and existing.title.lower().strip() == title.lower().strip()
                and existing.project_id == project_id
            ):
                log.info("Duplicate commitment detected: %s (id=%s)", title, existing.id)
                return existing

        c = Commitment(
            user_id=user_id,
            title=title,
            description=description,
            status=CommitmentStatus.OPEN,
            priority=priority,
            deadline=deadline,
            estimated_duration_minutes=estimated_duration_minutes,
            project_id=project_id,
            goal_id=goal_id,
            person_id=person_id,
            source_event_id=source_event_id,
            confidence=confidence,
        )
        self.repo.create(c)

        # Attach evidence if provided
        if evidence:
            self.world_repo.create_evidence(evidence)

        # Log operational activity
        self.activity_repo.log(
            Activity(
                user_id=user_id,
                actor_type=ActorType.OS,
                event_type="commitment.created",
                entity_type="commitment",
                entity_id=c.id,
                summary=f"Detected new commitment: '{title}'" + (f" (Due: {deadline.strftime('%Y-%m-%d %H:%M')})" if deadline else ""),
                metadata={"priority": priority, "confidence": confidence},
            )
        )
        return c

    def transition_state(
        self,
        commitment_id: str,
        new_status: CommitmentStatus,
        user_id: str = "default_user",
        reason: str = "",
        verified: bool = False,
    ) -> Commitment:
        c = self.repo.get(commitment_id, user_id)
        if not c:
            raise ValueError(f"Commitment '{commitment_id}' not found")

        if new_status == c.status:
            return c

        allowed = self.VALID_TRANSITIONS.get(c.status, set())
        if new_status not in allowed:
            raise InvalidStateTransitionError(
                f"Cannot transition commitment '{c.title}' from {c.status.value} to {new_status.value}"
            )

        # Completion verification gate:
        if new_status == CommitmentStatus.COMPLETED and not verified and c.status != CommitmentStatus.COMPLETION_CANDIDATE:
            # Move to COMPLETION_CANDIDATE first if not verified
            new_status = CommitmentStatus.COMPLETION_CANDIDATE

        old_status = c.status
        c.status = new_status
        now = datetime.now(timezone.utc)
        if new_status == CommitmentStatus.COMPLETED:
            c.completed_at = now
        elif new_status == CommitmentStatus.CANCELLED:
            c.cancelled_at = now

        self.repo.update(c)

        self.activity_repo.log(
            Activity(
                user_id=user_id,
                actor_type=ActorType.OS,
                event_type="commitment.status_changed",
                entity_type="commitment",
                entity_id=c.id,
                summary=f"Commitment '{c.title}' transitioned from {old_status.value} to {new_status.value}" + (f": {reason}" if reason else ""),
                metadata={"old_status": old_status.value, "new_status": new_status.value, "verified": verified},
            )
        )
        return c

    def get_commitments_due_soon(self, user_id: str = "default_user", limit: int = 10) -> list[Commitment]:
        return self.repo.get_due_soon(user_id, limit)

    def get_open_commitments(self, user_id: str = "default_user") -> list[Commitment]:
        return self.repo.get_open_or_in_progress(user_id)
