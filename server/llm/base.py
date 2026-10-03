"""LLM client abstractions.

All providers (Ollama, later providers) implement the same minimal interface so
the Conversation Manager never coupled to one backend (Section 8, Section 30).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import AsyncIterator, Literal, Protocol, runtime_checkable

Role = Literal["system", "user", "assistant"]


@dataclass
class Message:
    role: Role
    content: str
    # Stored at insert time so the manager can prune old messages without losing order.
    ts: float = 0.0


@dataclass
class ChatChunk:
    """One streamed token (or token group) from the model."""

    delta: str
    done: bool = False
    # First-token-latency is captured here when available.
    first_token_ms: float | None = None


@runtime_checkable
class LLMClient(Protocol):
    name: str

    async def health(self) -> bool: ...

    def chat_stream(
        self,
        messages: list[Message],
        *,
        temperature: float = 0.6,
        max_tokens: int = 256,
        stop: list[str] | None = None,
    ) -> AsyncIterator[ChatChunk]: ...
