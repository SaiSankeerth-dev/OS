"""Intent routing: classify user text into a tool call, chat, or task."""
from .router import Intent, IntentRouter, RouteDecision

__all__ = ["Intent", "IntentRouter", "RouteDecision"]