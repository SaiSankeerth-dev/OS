"""Context awareness subsystem.

Phase 8: screen, application, window awareness.
Phase 9+: tools integration, screen content extraction.
"""
from .awareness import ContextAwareness
from .builder import build_context_message

__all__ = ["ContextAwareness", "build_context_message"]