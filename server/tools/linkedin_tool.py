"""LinkedIn drafting tool: Milestone 0's one real skill.

This module only ever produces a draft. It has no ability to post
anything - publishing (currently a stub) happens in
ConversationManager, and only after the user approves the exact
draft text this tool returned. See server/approvals/gate.py.
"""
from __future__ import annotations

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec

VOICE_RULES = """\
Voice: "sai the builder" - first-year CS student, technical, honest, no hype.
No fake achievements, no fake metrics, no exaggerated claims, no motivational
fluff. Short sentences. State what was built and what was hard about it.
"""


def generate_linkedin_draft(idea: str = "", **kwargs) -> ToolResult:
    """Turn a rough idea into a draft LinkedIn post.

    This is the one function to touch when swapping in a real model
    (Ollama, a local model, or the router already in server/llm/) -
    everything downstream (show, approve, publish-stub, log) is
    unaffected by that choice.
    """
    idea = (idea or "").strip()
    if not idea:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error="no idea given to draft from",
        )

    # Template fallback: zero cost, zero API key needed, matches the
    # project's ₹0/$0 requirement. Replace with a real model call here.
    draft = (
        f"{idea.rstrip('.')}.\n\n"
        "The hard part wasn't the happy path, it was deciding what counts "
        "as a failure worth surfacing versus one worth handling silently.\n\n"
        "Still figuring out where that line should sit."
    )
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={"draft": draft, "idea": idea},
    )


def format_linkedin_draft(result: ToolResult) -> str:
    if result.status != "success":
        return "Couldn't draft that - try rephrasing the idea."
    draft = result.data["draft"]
    return f"Here's the draft:\n\n{draft}\n\nApprove and post this exact text? (yes/no)"


LINKEDIN_DRAFT_SPEC = ToolSpec(
    name="linkedin_draft",
    description="Draft a LinkedIn post from a rough idea. Never publishes on its own.",
    execution_mode=ExecutionMode.DIRECT,
)
