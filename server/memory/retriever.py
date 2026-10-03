"""MemoryRetriever: cheap relevance gate + delegate to MemoryManager."""
from __future__ import annotations

import re

from config import ConversationConfig
from .base import MemoryManager


_TRIVIAL_PATTERNS = [
    r"^\s*(hi|hello|hey|yo|hiya)\s*[.!?]?\s*$",
    r"^\s*(how\s+are\s+you|how'?s\s+it\s+going)\s*[.!?]?\s*$",
    r"^\s*(thanks|thank\s+you|thx|ty)\s*[.!?]?\s*$",
    r"^\s*tell\s+me\s+a\s+joke\s*[.!?]?\s*$",
    r"^\s*(good\s+morning|good\s+night|good\s+evening)\s*[.!?]?\s*$",
]

_TRIVIAL_RE = re.compile("|".join(_TRIVIAL_PATTERNS), re.IGNORECASE)


class MemoryRetriever:
    def __init__(self, memory: MemoryManager, cfg: ConversationConfig) -> None:
        self._memory = memory
        self._cfg = cfg

    def retrieve_relevant(
        self, user_text: str, needs_memory: bool = False
    ) -> list[str]:
        if not needs_memory and _TRIVIAL_RE.match(user_text):
            return []
        records = self._memory.retrieve(
            user_text, limit=self._cfg.max_relevant_memories
        )
        return [r.value for r in records]