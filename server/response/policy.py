"""ResponsePolicy: converts raw tool / LLM output into a FinalResponse.

Responsibilities:
- Use the tool's user-facing formatter for DIRECT success.
- Return an explicit failure message for tool failures (never fabricate).
- Strip only known filler prefixes from LLM output. Never rewrite content.
- Return a controlled fallback when the LLM produces empty output.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Literal

from server.intent.registry import ToolResult


@dataclass
class FinalResponse:
    text: str
    source: Literal[
        "direct_tool", "tool_then_llm", "llm_chat", "fallback", "policy"
    ]


DEFAULT_FORBIDDEN_PREFIXES: list[str] = [
    "Sure,",
    "Certainly.",
    "Certainly,",
    "Understood.",
    "Understood,",
    "Your request has been received.",
    "Processing...",
]


# Shown when the language model is unreachable or returns nothing.
# Lists what genuinely works without it instead of dead-ending.
_NO_LLM_HELP = """\
I can't reach my language model right now, so free-form chat is limited — \
but everything below works without it:

- **Connectors** — try "what's on my calendar today" or "send a message on telegram"
- **Tasks** — "add buy milk to my tasks"
- **Drafts** — "draft a linkedin post about shipping early"

To unlock full chat, run a local model: install Ollama (https://ollama.com), \
then `ollama pull qwen3:8b`, and restart."""


class ResponsePolicy:
    def __init__(self, forbidden_prefixes: list[str] | None = None) -> None:
        self._forbidden = (
            forbidden_prefixes
            if forbidden_prefixes is not None
            else DEFAULT_FORBIDDEN_PREFIXES
        )

    def apply_direct(
        self,
        spec_name: str,
        result: ToolResult,
        formatter: Callable[[ToolResult], str],
    ) -> FinalResponse:
        if result.status == "failure":
            return FinalResponse(
                text=f"I couldn't run {spec_name}. {result.error or 'Unknown error.'}",
                source="policy",
            )
        try:
            text = formatter(result).strip()
        except Exception:  # noqa: BLE001
            return FinalResponse(
                text=f"I couldn't format the {spec_name} result.",
                source="policy",
            )
        if not text:
            return FinalResponse(
                text=f"I couldn't produce a response from {spec_name}.",
                source="policy",
            )
        return FinalResponse(text=text, source="direct_tool")

    def apply_tool_then_llm(
        self, spec_name: str, result: ToolResult
    ) -> FinalResponse:
        if result.status == "failure":
            return FinalResponse(
                text=f"I couldn't run {spec_name}. {result.error or 'Unknown error.'}",
                source="policy",
            )
        return FinalResponse(text="", source="tool_then_llm")

    def apply_llm_chat(self, raw_text: str) -> FinalResponse:
        text = (raw_text or "").strip()
        if not text:
            # The language model is unreachable or returned nothing. Don't
            # dead-end: say what actually works without it.
            return FinalResponse(text=_NO_LLM_HELP, source="fallback")
        for prefix in self._forbidden:
            stripped = text.lstrip()
            if stripped.startswith(prefix):
                text = stripped[len(prefix):].lstrip(" ,.")
                if text:
                    text = text[0].upper() + text[1:]
                break
        return FinalResponse(text=text, source="llm_chat")