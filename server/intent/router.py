"""Rule-based intent router.

Classifies user text into one of:
- TOOL_CALL: needs a deterministic tool (clock, system info, etc.)
- LLM_CHAT: regular conversational reply
- TASK: deferred; reserved for the planner (not used in Phase 1)

Patterns are ordered; first match wins.
"""
from __future__ import annotations

import enum
import re
from dataclasses import dataclass


class Intent(str, enum.Enum):
    TOOL_CALL = "tool_call"
    LLM_CHAT = "llm_chat"
    TASK = "task"


@dataclass
class RouteDecision:
    intent: Intent
    tool_name: str | None = None
    confidence: float = 1.0


# Order matters: first match wins.
DEFAULT_PATTERNS: list[tuple[re.Pattern[str], Intent, str | None]] = [
    (
        re.compile(
            r"^\s*("
            # "what time is it?" / "what time is it"
            r"what\s+time(?:\s+is\s+it)?"
            # "what's the time" / "what's the current time"
            r"|what(?:'s|\s+is)\s+(?:the\s+)?(?:current\s+)?time"
            # "what's the date" / "what is the date"
            r"|what(?:'s|\s+is)\s+(?:the\s+)?(?:today'?s?\s+)?date"
            # "what day is it" / "what day is today"
            r"|what\s+day\s+is\s+(?:it|today)"
            # bare "today?"
            r"|today(?:'s)?\s+date"
            # bare "today"
            r"|today"
            # "when is it"
            r"|when\s+is\s+it"
            # "current date" / "current time" / "current day"
            r"|current\s+(?:date|time|day)"
            # "what date is it" / "what date is today"
            r"|what\s+date(?:\s+is(?:\s+it|\s+today))?"
            # "the date" / "the time"
            r"|the\s+(?:date|time|day)"
            r")\s*\??\s*$",
            re.IGNORECASE,
        ),
        Intent.TOOL_CALL,
        "get_current_datetime",
    ),
    (
        re.compile(
            r"^\s*("
            r"battery(?:\s+level)?"
            r"|cpu(?:\s+usage)?"
            r"|memory(?:\s+usage)?"
            r"|ram(?:\s+usage)?"
            r"|disk(?:\s+usage)?"
            r"|system\s+info"
            r")\s*\??\s*$",
            re.IGNORECASE,
        ),
        Intent.TOOL_CALL,
        "get_system_info",
    ),
]


class IntentRouter:
    def __init__(
        self,
        patterns: list[tuple[re.Pattern[str], Intent, str | None]] | None = None,
    ) -> None:
        self._patterns = patterns if patterns is not None else DEFAULT_PATTERNS

    def classify(self, text: str) -> RouteDecision:
        for pattern, intent, tool in self._patterns:
            if pattern.match(text):
                return RouteDecision(intent=intent, tool_name=tool)
        return RouteDecision(intent=Intent.LLM_CHAT)