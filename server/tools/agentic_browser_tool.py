"""Agentic browser tool: natural-language browser tasks.

`browser_task(task)` runs a multi-step browser task from plain language,
e.g. "play lofi on youtube" or "search github for browser-use".

Execution mode is NEEDS_APPROVAL: the chat shows an approval card describing
the task before the agent touches the browser. Step-by-step progress is
reported back to the chat.
"""
from __future__ import annotations

from server.browser.agentic import AgentStep, AgenticBrowser, expand_task
from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


def browser_task(task: str = "", **kwargs) -> ToolResult:
    """Draft-only: describes the planned agentic task. Execution happens
    after approval via run_agentic_task()."""
    if not task or not task.strip():
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="No task given. Try 'play lofi' or 'youtube lofi hip hop'.")
    expanded = expand_task(task.strip())
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={
            "task": task.strip(),
            "expanded": expanded,
            "description": (
                f"Agentic browser task: \"{task.strip()}\"\n"
                f"Plan: {expanded}\n"
                f"The agent will control a real browser (up to 25 steps), "
                f"showing progress. Clicks and form fills inside the task "
                f"will ask again before acting."
            ),
        },
    )


def format_browser_task(result: ToolResult) -> str:
    d = result.data
    return d.get("description", d.get("task", "browser task"))


BROWSER_TASK_SPEC = ToolSpec(
    name="browser_task",
    description=(
        "Run a multi-step browser task from natural language. "
        "Examples: 'play lofi on youtube', 'youtube lofi hip hop', "
        "'search github for browser-use'. "
        "The agent opens a real browser and acts like a human. "
        "Needs approval; describes the plan first."
    ),
    execution_mode=ExecutionMode.DIRECT,
)


def run_agentic_task(
    task: str,
    model: str = "qwen3:8b",
    on_step=None,
    on_approval_needed=None,
    max_steps: int = 25,
):
    """Execute an approved agentic browser task. Called from the
    approval-completion path, not directly from chat."""
    agent = AgenticBrowser(
        model=model, on_step=on_step, on_approval_needed=on_approval_needed)
    return agent.run(task, max_steps=max_steps)


def format_agentic_result(result) -> str:
    """Format an AgentResult for chat display."""
    lines = []
    if result.success:
        lines.append(f"Done in {len(result.steps)} steps.")
        if result.final_url:
            lines.append(f"Final page: {result.final_url}")
        if result.summary:
            lines.append(result.summary)
    else:
        lines.append(f"Stopped: {result.summary}")
        if result.error and result.error != "approval_denied":
            lines.append(f"Error: {result.error}")
    if result.steps:
        lines.append("\nSteps:")
        for s in result.steps[-10:]:  # last 10 to avoid spam
            lines.append(f"  {s.n}. {s.action}" + (f" — {s.detail}" if s.detail else ""))
    return "\n".join(lines)


AGENTIC_BROWSER_TOOLS = {
    "browser_task": (BROWSER_TASK_SPEC, browser_task, format_browser_task),
}
