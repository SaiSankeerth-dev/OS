"""AI website adapters for OS computer control."""
from __future__ import annotations

from .base import AISiteResponse, BaseAISiteAdapter
from .chatgpt import ChatGPTAdapter
from .claude import ClaudeAdapter
from .gemini import GeminiAdapter

__all__ = [
    "AISiteResponse",
    "BaseAISiteAdapter",
    "ChatGPTAdapter",
    "ClaudeAdapter",
    "GeminiAdapter",
]
