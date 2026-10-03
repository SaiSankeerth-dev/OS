"""Planner - breaks goals into steps, tracks execution."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class PlanStatus(Enum):
    IDLE = "idle"
    PLANNING = "planning"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class PlanStep:
    id: str
    description: str
    tool: str | None = None
    args: dict[str, Any] | None = None
    done: bool = False


@dataclass
class Plan:
    goal: str
    steps: list[PlanStep] = field(default_factory=list)
    status: PlanStatus = PlanStatus.IDLE
    current_step_index: int = -1


class Planner:
    """Breaks a user goal into executable steps.

    Phase 10: given a goal like 'fix this error' or 'organize my files',
    produce a Plan with ordered steps that can be executed by the Task Manager.
    """

    def create_plan(self, goal: str) -> Plan:
        """Create a plan plan for the given goal."""
        return Plan(goal=goal)

    def add_step(self, plan: Plan, description: str, tool: str | None = None, args: dict | None = None) -> PlanStep:
        """Add a step to a plan."""
        step = PlanStep(id=f"step_{len(plan.steps)}", description=description, tool=tool, args=args)
        plan.steps.append(step)
        return step

    def mark_step_done(self, plan: Plan, step_id: str) -> Plan:
        """Mark a step as done and move to the next."""
        for step in plan.steps:
            if step.id == step_id:
                step.done = True
                break
        return plan