"""Task manager - executes plan steps, coordinates tools and verification."""

from __future__ import annotations

import asyncio
from .planner import Plan, PlanStep, PlanStatus


class TaskManager:
    """Executes a Plan step-by-step, coordinating tools and verification."""

    def __init__(self, planner: Planner, tools: Any) -> None:
        self.planner = planner
        self.tools = tools
        self._plan: Plan | None = None
        self._current_step_index: int = -1

    async def execute(self, goal: str) -> dict:
        """Given a goal, create a plan and execute it step by step."""
        self._plan = self.planner.create_plan(goal)
        self._plan.status = PlanStatus.PLANNING
        self._current_step_index = 0
        result: dict[str, object] = {"goal": goal, "steps_completed": 0, "errors": []}

        while self._current_step_index < len(self._plan.steps) and self._plan.status != PlanStatus.FAILED:
            step = self._plan.steps[self._current_step_index]
            result[f"step_{step.id}"] = {"description": step.description, "status": "running"}

            try:
                # Execute tool if step has one
                if step.tool and step.tool in self.tools._tools:
                    spec, handler = self.tools._tools[step.tool]
                    kwargs = step.args or {}
                    tool_result = await self.tools.execute(step.tool, **kwargs)
                    result[f"step_{step.id}"] = {
                        "description": step.description,
                        "status": "completed" if tool_result.success else "failed",
                        "output": tool_result.output,
                        "error": tool_result.error,
                    }
                else:
                    # No tool, just mark as done (e.g., wait, think)
                    result[f"step_{step.id}"] = {
                        "description": step.description,
                        "status": "completed",
                    }

                step.done = True
                self._current_step_index += 1
                result["steps_completed"] += 1

            except Exception as e:
                result[f"step_{step.id}"] = {
                    "description": step.description,
                    "status": "failed",
                    "error": str(e),
                }
                self._plan.status = PlanStatus.FAILED
                result["errors"].append({"step": step.id, "error": str(e)})
                break

        if self._current_step_index >= len(self._plan.steps):
            self._plan.status = PlanStatus.COMPLETED
        elif self._plan.status != PlanStatus.COMPLETED:
            self._plan.status = PlanStatus.FAILED

        result["status"] = self._plan.status.value
        return result