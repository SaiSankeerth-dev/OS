"""Rule-based intent router.

Classifies user text into one of:
- TOOL_CALL: needs a deterministic tool (clock, system info, etc.)
- LLM_CHAT: regular conversational reply
- TASK: deferred; reserved for the planner (not used in Phase 1)
- TASK: multi-step requests, handled by a dynamic agent team (Phase 5)
- PERSONA: personality switching, handled by the manager (Phase 7)

Patterns are ordered; first match wins.
"""
from __future__ import annotations

import enum
import re
from dataclasses import dataclass, field


class Intent(str, enum.Enum):
    TOOL_CALL = "tool_call"
    LLM_CHAT = "llm_chat"
    TASK = "task"
    PERSONA = "persona"
    PERMISSION = "permission"


@dataclass
class RouteDecision:
    intent: Intent
    tool_name: str | None = None
    confidence: float = 1.0
    args: dict[str, str] = field(default_factory=dict)


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
    (
        re.compile(
            r"^\s*(?:draft|write)\s+(?:a\s+|an\s+)?linkedin\s+post\s+"
            r"(?:about|on|for)\s+(.+?)\s*[.!]?\s*$",
            re.IGNORECASE,
        ),
        Intent.TOOL_CALL,
        "linkedin_draft",
    ),
    (
        # Phase 5: multi-step requests go to a dynamic agent team.
        # "research X and then summarize it", "plan my trip: ..."
        re.compile(
            r"^\s*(?:please\s+)?(?:research|plan|prepare|organize|compare|"
            r"investigate|analyze|analyse)\b.{0,200}?\b(?:and then|then|"
            r"also|and also)\b",
            re.IGNORECASE,
        ),
        Intent.TASK,
        None,
    ),
    (
        # Phase 6: memory skill.
        re.compile(
            r"^\s*(?:remember|note\s+down|save\s+to\s+memory)\s+"
            r"(?:that\s+)?(.+?)\s*[.!]?\s*$",
            re.IGNORECASE,
        ),
        Intent.TOOL_CALL,
        "memory_save",
    ),
    (
        re.compile(
            r"^\s*(?:recall|what\s+do\s+you\s+remember|do\s+you\s+remember)"
            r"\b\s*(.*?)\s*\??\s*$",
            re.IGNORECASE,
        ),
        Intent.TOOL_CALL,
        "memory_recall",
    ),
    (
        # Phase 6: calculator skill.
        re.compile(
            r"^\s*(?:calculate|calc|compute)\s+(.+?)\s*$",
            re.IGNORECASE,
        ),
        Intent.TOOL_CALL,
        "calc",
    ),
    (
        # Phase 9: user-facing permissions. "allow the calculator",
        # "ask me before linkedin", "deny the echo server".
        # Order: before PERSONA; no overlap with existing patterns.
        re.compile(
            r"^\s*(?:always\s+)?allow\s+(?:the\s+)?(.+?)\s*[.!]?\s*$",
            re.IGNORECASE,
        ),
        Intent.PERMISSION,
        "allow",
    ),
    (
        re.compile(
            r"^\s*(?:ask(?:\s+me)?\s+before|require\s+approval\s+for)\s+"
            r"(?:the\s+)?(.+?)\s*[.!]?\s*$",
            re.IGNORECASE,
        ),
        Intent.PERMISSION,
        "ask",
    ),
    (
        re.compile(
            r"^\s*(?:deny|block)\s+(?:the\s+)?(.+?)\s*[.!]?\s*$",
            re.IGNORECASE,
        ),
        Intent.PERMISSION,
        "deny",
    ),
    (
        re.compile(
            r"^\s*(?:show(?:\s+me)?|what\s+are)(?:\s+my)?\s+permissions\s*\??\s*$",
            re.IGNORECASE,
        ),
        Intent.PERMISSION,
        "show",
    ),
    (
        re.compile(
            r"^\s*reset\s+permissions\s*[.!]?\s*$",
            re.IGNORECASE,
        ),
        Intent.PERMISSION,
        "reset",
    ),
    (
        # Phase 7: personality switching. Tone only - never a tool call,
        # never through the supervisor pipeline.
        re.compile(
            r"^\s*(?:switch\s+to|use|activate|be)\s+"
            r"(jarvis|nova|sage|coach)"
            r"(?:\s+(?:mode|personality))?\s*[.!]?\s*$",
            re.IGNORECASE,
        ),
        Intent.PERSONA,
        None,
    ),
]


# Maps a tool name to the intent-pattern capture group holding its arg.
_TOOL_ARG = {
    "linkedin_draft": "idea",
    "memory_save": "note",
    "memory_recall": "query",
    "calc": "expression",
}


class IntentRouter:
    def __init__(
        self,
        patterns: list[tuple[re.Pattern[str], Intent, str | None]] | None = None,
    ) -> None:
        self._patterns = patterns if patterns is not None else DEFAULT_PATTERNS

    def classify(self, text: str) -> RouteDecision:
        for pattern, intent, tool in self._patterns:
            m = pattern.match(text)
            if m:
                args: dict[str, str] = {}
                if tool in _TOOL_ARG and m.groups():
                    args[_TOOL_ARG[tool]] = m.group(1).strip()
                elif intent == Intent.PERSONA and m.groups():
                    args["persona"] = m.group(1).strip().lower()
                elif intent == Intent.PERMISSION:
                    # tool_name carries the action ("allow"/"ask"/...);
                    # group(1) carries the skill target when present.
                    args["action"] = tool or ""
                    if m.groups():
                        args["target"] = m.group(1).strip()
                return RouteDecision(intent=intent, tool_name=tool, args=args)
        return RouteDecision(intent=Intent.LLM_CHAT)