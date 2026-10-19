"""Plan executor: runs plan steps through the tool pipeline.

Each step either calls a tool directly or routes through the intent
system (for __route__ steps). Results are collected; failures halt
the plan with a clear report (never pretend success).
"""
from __future__ import annotations

import logging
from typing import Callable

from .models import Plan, PlanStatus, Step, StepStatus

log = logging.getLogger(__name__)


class PlanExecutor:
    """Executes plans step by step.

    tool_runner: async callable(tool_name, args) -> str
        Runs a single tool and returns its display string.
    intent_router: callable(text) -> tuple[tool_name, args] | None
        Routes natural language to a tool (for __route__ steps).
    """

    def __init__(
        self,
        tool_runner: Callable,
        intent_router: Callable | None = None,
    ):
        self.tool_runner = tool_runner
        self.intent_router = intent_router

    async def execute_step(self, plan: Plan, step: Step) -> bool:
        """Execute one step. Returns True if plan should continue."""
        step.status = StepStatus.RUNNING
        try:
            if step.tool == "__route__" and self.intent_router:
                # Route the natural language through intent system
                text = step.args.get("text", "")
                routed = self.intent_router(text)
                if not routed:
                    step.status = StepStatus.FAILED
                    step.error = f"Couldn't understand: '{text}'"
                    return False
                tool_name, tool_args = routed
                step.tool = tool_name  # record what it resolved to
                step.args.update(tool_args)
                result = await self.tool_runner(tool_name, step.args)
            else:
                result = await self.tool_runner(step.tool, step.args)

            step.result = result[:2000]  # cap stored output
            step.status = StepStatus.DONE

            # Share context with next steps
            if step.provides_context:
                plan.context[step.tool] = result

            return True

        except Exception as e:
            step.status = StepStatus.FAILED
            step.error = f"{type(e).__name__}: {e}"
            log.warning("Plan step failed: %s — %s", step.description, e)
            return False

    async def execute_plan(self, plan: Plan,
                           on_step: Callable | None = None) -> Plan:
        """Execute all steps in order. Halts on first failure."""
        plan.status = PlanStatus.RUNNING
        for i, step in enumerate(plan.steps):
            plan.current_step = i
            if on_step:
                on_step(i, step, "start")
            should_continue = await self.execute_step(plan, step)
            if on_step:
                on_step(i, step, "end")
            if not should_continue:
                plan.status = PlanStatus.FAILED
                return plan
        plan.status = PlanStatus.DONE
        return plan

    def report(self, plan: Plan) -> str:
        """JARVIS-style completion report."""
        if plan.status == PlanStatus.DONE:
            lines = [f"Done. {plan.title} — all {plan.total_steps} steps complete."]
        elif plan.status == PlanStatus.FAILED:
            failed = next(
                (s for s in plan.steps if s.status == StepStatus.FAILED), None)
            lines = [
                f"{plan.title} — stopped at step {plan.current_step + 1} "
                f"of {plan.total_steps}.",
            ]
            if failed:
                lines.append(f"Failed: {failed.description}")
                lines.append(f"Reason: {failed.error}")
            done = plan.done_steps
            if done:
                lines.append(f"{done} step(s) completed before the failure.")
        else:
            lines = [f"{plan.title} — status: {plan.status.value}"]
        return "\n".join(lines)
