"""Model router (Section 30).

Phase 1: trivially routes everything to the single Ollama client.
Later phases will select per-task (conversation / reasoning / coding) and
fallback across providers.
"""
from __future__ import annotations

from typing import Literal

from .base import LLMClient, Message, ChatChunk
from .ollama import OllamaClient

TaskKind = Literal["conversation", "reasoning", "coding"]


class ModelRouter:
    """Owns the configured LLM clients and chooses one per task."""

    def __init__(self, default: LLMClient) -> None:
        self._default = default
        # Phase 1: single client. Add reasoning/coding specializations in Phase 9+.
        self._routes: dict[str, LLMClient] = {"conversation": default}

    @classmethod
    def from_config(cls, base_url: str, model: str, timeout_sec: float) -> "ModelRouter":
        return cls(OllamaClient(base_url, model, timeout_sec))

    def client_for(self, task: TaskKind = "conversation") -> LLMClient:
        return self._routes.get(task, self._default)

    def set_model(self, model_name: str) -> None:
        if hasattr(self._default, "model"):
            self._default.model = model_name
        for client in self._routes.values():
            if hasattr(client, "model"):
                client.model = model_name

    def get_model(self) -> str:
        if hasattr(self._default, "model"):
            return getattr(self._default, "model", "")
        return ""

    async def health(self) -> bool:
        return await self._default.health()
