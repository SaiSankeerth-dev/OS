"""Planner tools: multi-step task execution.

`plan(text)` — propose a plan from natural language (shows the plan,
asks for confirmation before running).
`plan_run(plan_id)` — execute an approved plan.
`plan_list()` — show recent plans.
`plan_cancel(plan_id)` — cancel a running plan.

Plans are proposed first (DIRECT), then executed after approval
(NEEDS_APPROVAL via plan_run).
"""
from __future__ import annotations

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.planner.models import Plan, PlanStatus
from server.planner.templates import match_template

# In-memory plan store (plans are ephemeral; persist if needed later)
_plans: dict[str, Plan] = {}


def plan(text: str = "", task: str = "", **kwargs) -> ToolResult:
    """Propose a multi-step plan from natural language."""
    text = (task or text or "").strip()
    if not text:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="What should I plan? Try 'plan my trip to Goa' "
                                "or 'do X then Y then Z'.")
    matched = match_template(text)
    if not matched:
        return ToolResult(
            status="failure", mode=ExecutionMode.DIRECT,
            error="I couldn't build a plan from that. Try:\n"
                  "- 'plan my trip to <place>'\n"
                  "- 'morning briefing'\n"
                  "- 'do <task> then <task> then <task>'",
        )
    title, steps = matched
    p = Plan(title=title, description=text, steps=steps)
    _plans[p.id] = p
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={
            "plan_id": p.id,
            "title": title,
            "draft": f"Proposed plan: {title}\n\n{p.summary()}\n\n"
                     f"Say 'run plan {p.id}' to execute, or 'cancel plan {p.id}'.",
            "action_args": {
                "kind": "plan_run",
                "plan_action": {"plan_id": p.id},
            },
        },
    )


def format_plan(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't create plan."
    return result.data["draft"]


PLAN_SPEC = ToolSpec(
    name="plan",
    description="Propose a multi-step plan. Usage: plan my trip to Goa | do X then Y",
    execution_mode=ExecutionMode.DIRECT,
)


def plan_run(plan_id: str = "", task: str = "", **kwargs) -> ToolResult:
    """Draft execution of a plan (needs approval)."""
    # Parse from "run plan <id>"
    pid = (plan_id or "").strip()
    if task and not pid:
        import re
        m = re.match(r"^\s*run\s+plan\s+(\w+)\s*$", task, re.IGNORECASE)
        if m:
            pid = m.group(1)
    p = _plans.get(pid)
    if not p:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error=f"No plan with id '{pid}'. Say 'plan list' to see plans.")
    if p.status != PlanStatus.DRAFT:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error=f"Plan '{p.title}' is already {p.status.value}.")
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={
            "plan_id": pid,
            "draft": f"Execute plan: {p.title}\n\n{p.summary()}\n\n"
                     "This will run each step in order.",
            "action_args": {
                "kind": "plan_run",
                "plan_action": {"plan_id": pid},
            },
        },
    )


def format_plan_run(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't draft plan execution."
    return result.data["draft"]


PLAN_RUN_SPEC = ToolSpec(
    name="plan_run",
    description="Execute a plan (needs approval). Usage: run plan <id>",
    execution_mode=ExecutionMode.DIRECT,
)


async def execute_plan_action(plan_id: str, tool_runner,
                              intent_router=None) -> str:
    """Execute an approved plan. Called from the approval path."""
    from server.planner.executor import PlanExecutor
    p = _plans.get(plan_id)
    if not p:
        return f"Plan {plan_id} not found."
    executor = PlanExecutor(tool_runner=tool_runner,
                            intent_router=intent_router)
    await executor.execute_plan(p)
    return executor.report(p) + "\n\n" + p.summary()


def plan_list(**kwargs) -> ToolResult:
    """List recent plans."""
    if not _plans:
        return ToolResult(status="success", mode=ExecutionMode.DIRECT,
                          data={"display": "No plans yet. Say 'plan my trip to Goa' to create one."})
    lines = []
    for pid, p in _plans.items():
        lines.append(f"- {pid}: {p.title} ({p.status.value}, "
                     f"{p.done_steps}/{p.total_steps} done)")
    return ToolResult(status="success", mode=ExecutionMode.DIRECT,
                      data={"display": "Plans:\n" + "\n".join(lines)})


def format_plan_list(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't list plans."
    return result.data["display"]


PLAN_LIST_SPEC = ToolSpec(
    name="plan_list",
    description="List plans. Usage: plan list",
    execution_mode=ExecutionMode.DIRECT,
)


def get_plan(plan_id: str) -> Plan | None:
    return _plans.get(plan_id)


PLANNER_TOOLS = [
    (PLAN_SPEC, plan, format_plan),
    (PLAN_RUN_SPEC, plan_run, format_plan_run),
    (PLAN_LIST_SPEC, plan_list, format_plan_list),
]
