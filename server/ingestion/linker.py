"""Entity Linker Service.

Connects newly discovered information to existing OS entities:
SOURCE -> SOURCE EVENT -> OBSERVER -> EXTRACTOR -> CONTEXT -> VERIFIER -> LINKER -> COMMITMENT

Responsibilities:
- Links or creates Person
- Links or creates Project
- Creates Evidence record linking to the SourceEvent
- Minimizes duplicate entities
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from server.domain.entities import Evidence, Person, Project, SourceEvent
from server.ingestion.context import RetrievedContext
from server.ingestion.extractor import ExtractedProposal
from server.db.repositories.world import WorldModelRepository
from server.db.database import get_db


@dataclass
class LinkedEntities:
    project_id: Optional[str] = None
    person_id: Optional[str] = None
    evidence: Optional[Evidence] = None


class EntityLinker:
    def __init__(self, world_repo: Optional[WorldModelRepository] = None) -> None:
        db = get_db()
        self.world_repo = world_repo or WorldModelRepository(db)

    def link(
        self,
        user_id: str,
        proposal: ExtractedProposal,
        event: SourceEvent,
        context: RetrievedContext,
    ) -> LinkedEntities:
        result = LinkedEntities()

        # 1. Resolve or create project
        if context.project:
            result.project_id = context.project.id
        elif proposal.project_name:
            new_project = Project(
                user_id=user_id,
                name=proposal.project_name,
                description=f"Auto-created from source event: {proposal.title}",
            )
            self.world_repo.create_project(new_project)
            result.project_id = new_project.id

        # 2. Resolve or create person
        if context.person:
            result.person_id = context.person.id
        elif proposal.person_name:
            new_person = Person(
                user_id=user_id,
                name=proposal.person_name,
            )
            self.world_repo.create_person(new_person)
            result.person_id = new_person.id

        # 3. Create Evidence record
        evidence_content = proposal.raw_text[:1000]
        ev = Evidence(
            user_id=user_id,
            source_id=event.source_id,
            source_event_id=event.id,
            evidence_type=f"source_event:{event.event_type}",
            external_id=event.external_event_id,
            title=f"Source Event: {proposal.title}",
            content=evidence_content,
            metadata={"deliverable": proposal.deliverable, "confidence": proposal.confidence},
            occurred_at=event.occurred_at,
            content_hash=event.content_hash,
        )
        self.world_repo.create_evidence(ev)
        result.evidence = ev

        return result
