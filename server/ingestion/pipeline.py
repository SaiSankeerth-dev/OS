"""Universal Ingestion Pipeline for OS.

Implements the master architecture defined in Section 9 & 59 of the PRD/TRD:
SOURCE -> SOURCE EVENT -> OBSERVER -> EXTRACTOR -> CONTEXT -> VERIFIER -> LINKER -> COMMITMENT -> TASK -> PLAN

Every incoming event (Gmail, Calendar, GitHub, Slack, Files, Browser) converges
into this single deterministic pipeline.
"""
from __future__ import annotations

import hashlib
import logging
from dataclasses import dataclass
from typing import Any, Optional

from server.domain.entities import Commitment, SourceEvent, Task
from server.domain.enums import ProcessingStatus
from server.domain.services.commitment_service import CommitmentService
from server.domain.services.task_service import TaskService
from server.db.repositories.core import SourceEventRepository
from server.db.database import get_db

from .context import ContextRetriever
from .extractor import ExtractorService
from .linker import EntityLinker
from .observer import ObserverService
from .verifier import IngestionVerifier

log = logging.getLogger("os.ingestion.pipeline")


@dataclass
class IngestionResult:
    processed: bool
    status: str  # ignored, duplicate, created, rejected, uncertain
    commitment: Optional[Commitment] = None
    task: Optional[Task] = None
    reason: str = ""


class IngestionPipeline:
    def __init__(
        self,
        event_repo: Optional[SourceEventRepository] = None,
        observer: Optional[ObserverService] = None,
        extractor: Optional[ExtractorService] = None,
        context_retriever: Optional[ContextRetriever] = None,
        verifier: Optional[IngestionVerifier] = None,
        linker: Optional[EntityLinker] = None,
        commitment_service: Optional[CommitmentService] = None,
        task_service: Optional[TaskService] = None,
    ) -> None:
        db = get_db()
        self.event_repo = event_repo or SourceEventRepository(db)
        self.observer = observer or ObserverService()
        self.extractor = extractor or ExtractorService()
        self.context = context_retriever or ContextRetriever()
        self.verifier = verifier or IngestionVerifier()
        self.linker = linker or EntityLinker()
        self.commitment_service = commitment_service or CommitmentService()
        self.task_service = task_service or TaskService()

    def process_event(self, event: SourceEvent) -> IngestionResult:
        # Step 1: Idempotent persistence check
        persisted_event, is_new = self.event_repo.save_event(event)
        if not is_new and persisted_event.processing_status in (
            ProcessingStatus.PROCESSED,
            ProcessingStatus.IGNORED,
        ):
            log.info("Source event %s already processed; skipping", event.external_event_id)
            return IngestionResult(
                processed=False,
                status="duplicate",
                reason=f"Event '{event.external_event_id}' already processed",
            )

        # Step 2: Observer
        decision = self.observer.observe(persisted_event)
        if not decision.relevant:
            self.event_repo.mark_status(persisted_event.id, ProcessingStatus.IGNORED)
            return IngestionResult(
                processed=True,
                status="ignored",
                reason=f"Observer classified as non-relevant: {decision.reason}",
            )

        self.event_repo.mark_status(persisted_event.id, ProcessingStatus.PROCESSING)

        # Step 3: Extractor
        text = ""
        if isinstance(persisted_event.payload, dict):
            text = f"{persisted_event.payload.get('subject', '')} {persisted_event.payload.get('body', '')} {persisted_event.payload.get('content', '')}".strip()
        elif isinstance(persisted_event.payload, str):
            text = persisted_event.payload.strip()

        proposal = self.extractor.extract(text, reference_date=persisted_event.received_at)

        # Step 4: Context Retrieval
        ctx = self.context.retrieve_context(
            user_id=persisted_event.user_id,
            project_name=proposal.project_name,
            person_name=proposal.person_name,
            title_query=proposal.title,
        )

        # Step 5: Verification
        verification = self.verifier.verify(proposal, ctx)
        if verification.status == "REJECTED":
            self.event_repo.mark_status(persisted_event.id, ProcessingStatus.PROCESSED)
            return IngestionResult(
                processed=True,
                status="rejected",
                reason=verification.reason,
            )

        # Step 6: Linker
        linked = self.linker.link(
            user_id=persisted_event.user_id,
            proposal=proposal,
            event=persisted_event,
            context=ctx,
        )

        # Step 7: Create Commitment
        commitment = self.commitment_service.create_commitment(
            user_id=persisted_event.user_id,
            title=proposal.title,
            description=f"Extracted from {persisted_event.event_type} ({persisted_event.external_event_id})",
            deadline=proposal.deadline,
            priority=80 if proposal.deadline else 50,
            estimated_duration_minutes=120,
            project_id=linked.project_id,
            person_id=linked.person_id,
            source_event_id=persisted_event.id,
            confidence=proposal.confidence,
            evidence=linked.evidence,
        )

        # Step 8: Create Executable Task
        task = self.task_service.create_task(
            user_id=persisted_event.user_id,
            commitment_id=commitment.id,
            project_id=linked.project_id,
            title=f"Execute: {commitment.title}",
            description=f"Action item for commitment '{commitment.title}'",
            priority=commitment.priority,
            estimated_duration_minutes=120,
            deadline=commitment.deadline,
        )

        self.event_repo.mark_status(persisted_event.id, ProcessingStatus.PROCESSED)
        log.info("Successfully ingested event -> Commitment '%s' (Task '%s')", commitment.title, task.title)

        return IngestionResult(
            processed=True,
            status="created",
            commitment=commitment,
            task=task,
            reason=verification.reason,
        )
