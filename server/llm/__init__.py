"""LLM subsystem.

Phase 1: Ollama streaming chat completions.
Later phases: model router (Section 30), more local providers.
"""
from .ollama import OllamaClient
from .base import LLMClient, Message, ChatChunk
from .router import ModelRouter

__all__ = ["OllamaClient", "LLMClient", "Message", "ChatChunk", "ModelRouter"]
