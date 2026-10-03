"""Context Engine for OS Ingestion Pipeline.

Responsibilities:
Retrieves selective context relevant to newly proposed commitments:
- Existing project match
- Existing person identity
- Existing commitments and tasks (to detect duplicate efforts)
- Calendar events around the target deadline

CRITICAL INVARIANT: Never blindly dumps the entire user database into prompts.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from server.domain.entities import Commitment, Person, Project, Task
from server.db.repositories.core import CommitmentRepository, TaskRepository
from server.db.repositories.world import WorldModelRepository
from server.db.database import get_db


@dataclass
class RetrievedContext:
    project: Optional[Project] = None
    person: Optional[Person] = None
    similar_commitments: list[Commitment] = None
    existing_tasks: list[Task] = None


class ContextRetriever:
    def __init__(
        self,
        world_repo: Optional[WorldModelRepository] = None,
        commitment_repo: Optional[CommitmentRepository] = None,
        task_repo: Optional[TaskRepository] = None,
    ) -> None:
        db = get_db()
        self.world_repo = world_repo or WorldModelRepository(db)
        self.commitment_repo = commitment_repo or CommitmentRepository(db)
        self.task_repo = task_repo or TaskRepository(db)

    def retrieve_context(
        self,
        user_id: str,
        project_name: Optional[str] = None,
        person_name: Optional[str] = None,
        title_query: Optional[str] = None,
    ) -> RetrievedContext:
        ctx = RetrievedContext(similar_commitments=[], existing_tasks=[])

        # 1. Project match
        if project_name:
            ctx.project = self.world_repo.find_project_by_name(project_name, user_id)

        # 2. Person match
        if person_name:
            ctx.person = self.world_repo.find_person_by_name_or_email(person_name, user_id)

        # 3. Check for similar existing commitments
        open_commitments = self.commitment_repo.get_open_or_in_progress(user_id)
        if title_query:
            query_tokens = set(title_query.lower().split())
            for c in open_commitments:
                c_tokens = set(c.title.lower().split())
                if query_tokens & c_tokens:
                    ctx.similar_commitments.append(c)

        # 4. If a matching project was found, retrieve its tasks
        if ctx.project:
            all_tasks = self.task_repo.list_by_user(user_id)
            ctx.existing_tasks = [t for t in all_tasks if t.project_id == ctx.project.id]

        return ctx
