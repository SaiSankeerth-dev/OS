"""Memory record types for OS."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class MemoryType(Enum):
    WORKING = "working"
    CONVERSATION = "conversation"
    LONG_TERM = "long_term"
    USER_PROFILE = "user_profile"
    PROJECT = "project"
    PREFERENCE = "preference"


@dataclass
class MemoryRecord:
    key: str
    value: str
    memory_type: MemoryType = MemoryType.WORKING
    importance: float = 0.5
    created_at: float = field(default_factory=lambda: __import__("time").time())
    updated_at: float = field(default_factory=lambda: __import__("time").time())
    expires_at: float | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


class MemoryManager:
    """Interface for memory operations.

    Phase 2: SQLite backend.
    Phase 3+: vector search, extraction, retrieval.
    """

    def store(self, record: MemoryRecord) -> None:
        raise NotImplementedError

    def retrieve(self, query: str, limit: int = 4) -> list[MemoryRecord]:
        raise NotImplementedError

    def extract(self, conversation_turns: list[str]) -> list[MemoryRecord]:
        raise NotImplementedError

    def prune(self, max_age_days: int | None = None) -> int:
        raise NotImplementedError