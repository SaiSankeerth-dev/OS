"""Conversation subsystem.

Phase 1: state machine + context window + streaming response.
Phase 2+: memory integration, retrieval, project/working memory.
"""
from .manager import ConversationManager, ConversationState
from .context import build_context_messages

__all__ = ["ConversationManager", "ConversationState", "build_context_messages"]
