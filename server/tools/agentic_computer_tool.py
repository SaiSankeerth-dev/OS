"""Agentic computer tool: natural-language desktop tasks.

`computer_task(task)` runs a desktop task from plain language,
e.g. "take a screenshot" or "open calculator and type hello".

Common tasks run deterministically (no LLM, instant, free).
Complex tasks use cua-agent + local Ollama (needs a display).

Execution mode is NEEDS_APPROVAL via ToolPolicy: the chat shows an
approval card describing the task before anything runs.
"""
from __future__ import annotations

from server.computer.agentic import (
    AgenticComputer, ComputerResult, ComputerStep,
    try_deterministic, has_display,
)
from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


def computer_task(task: str = "", **kwargs) -> ToolResult:
    """Draft-only: describes the planned computer task. Execution happens
    after approval via run_agentic_computer_task()."""
    if not task or not task.strip():
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="No task given. Try 'take a screenshot' or 'open calculator'.")
    t = task.strip()

    # Check if it's a deterministic instant action
    det = try_deterministic(t)
    instant = det is not None

    desc = f"Computer task: \"{t}\"\n"
    if instant:
        desc += "This is instant (no AI needed) - runs immediately on approval."
    elif not has_display():
        desc += ("Needs a display - works on your laptop, not here. "
                 "The agent will control the mouse and keyboard like a human.")
    else:
        desc += ("The agent will control the desktop (up to 20 steps), "
                 "showing progress. It sees the screen and clicks/types like a human.")

    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"task": t, "instant": instant, "description": desc},
    )


def format_computer_task(result: ToolResult) -> str:
    d = result.data
    return d.get("description", d.get("task", "computer task"))


COMPUTER_TASK_SPEC = ToolSpec(
    name="computer_task",
    description=(
        "Run a desktop computer task from natural language. "
        "Examples: 'take a screenshot', 'open calculator', "
        "'lock the screen', 'volume up'. "
        "Common tasks are instant; complex ones use an AI agent "
        "that sees the screen and controls mouse/keyboard. "
        "Needs approval; describes the plan first."
    ),
    execution_mode=ExecutionMode.DIRECT,
)


def run_agentic_computer_task(
    task: str,
    model: str = "qwen3:8b",
    on_step=None,
    max_steps: int = 20,
) -> ComputerResult:
    """Execute an approved computer task. Called from the
    approval-completion path, not directly from chat."""
    agent = AgenticComputer(model=model, on_step=on_step)
    return agent.run(task, max_steps=max_steps)


def format_computer_result(result: ComputerResult) -> str:
    """Format a ComputerResult for chat display."""
    lines = []
    if result.success:
        lines.append(result.summary)
        if result.steps and len(result.steps) > 1:
            lines.append(f"\n({len(result.steps)} steps)")
    else:
        lines.append(f"Couldn't do that: {result.summary}")
        if result.error and result.error not in ("no_display", "no_tool"):
            lines.append(f"Error: {result.error}")
    return "\n".join(lines)


AGENTIC_COMPUTER_TOOLS = {
    "computer_task": (COMPUTER_TASK_SPEC, computer_task, format_computer_task),
}
