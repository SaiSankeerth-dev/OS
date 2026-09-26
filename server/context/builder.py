"""Build context message from awareness state for LLM prompt injection."""
from __future__ import annotations

from .awareness import ContextAwareness, UserContext


def build_context_message(awareness: ContextAwareness) -> str:
    """Create a concise system-prompt hint from current awareness."""
    ctx = awareness.get_context_for_llm()
    if not ctx:
        return ""
    return f"Current context: {ctx}. Use this when the user refers to 'this', 'that', 'here', or continuing from where we left off."