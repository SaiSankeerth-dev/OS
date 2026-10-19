"""Planner models: Task, Step, Plan."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import uuid


class StepStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"
    SKIPPED = "skipped"
    WAITING_APPROVAL = "waiting_approval"


class PlanStatus(Enum):
    DRAFT = "draft"           # proposed, not started
    RUNNING = "running"       # executing
    PAUSED = "paused"         # waiting for approval/input
    DONE = "done"             # all steps complete
    FAILED = "failed"         # a step failed, plan halted
    CANCELLED = "cancelled"


@dataclass
class Step:
    """One step in a plan."""
    description: str           # human-readable: "Check calendar for Friday"
    tool: str                  # tool to call: "list_reminders"
    args: dict = field(default_factory=dict)
    status: StepStatus = StepStatus.PENDING
    result: str = ""           # output from the tool
    error: str = ""
    needs_approval: bool = False
    # If True, this step's result is passed as context to the next step
    provides_context: bool = False

    @property
    def id(self) -> str:
        return f"{self.tool}:{self.description[:20]}"


@dataclass
class Plan:
    """A multi-step plan."""
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:8])
    title: str = ""
    description: str = ""      # original user request
    steps: list[Step] = field(default_factory=list)
    status: PlanStatus = PlanStatus.DRAFT
    created_at: str = field(
        default_factory=lambda: datetime.now().isoformat())
    current_step: int = 0
    context: dict = field(default_factory=dict)  # shared across steps

    @property
    def done_steps(self) -> int:
        return sum(1 for s in self.steps if s.status == StepStatus.DONE)

    @property
    def total_steps(self) -> int:
        return len(self.steps)

    def summary(self) -> str:
        lines = [f"Plan: {self.title} ({self.done_steps}/{self.total_steps} done)"]
        for i, step in enumerate(self.steps, 1):
            icon = {
                StepStatus.PENDING: "○",
                StepStatus.RUNNING: "◐",
                StepStatus.DONE: "●",
                StepStatus.FAILED: "✗",
                StepStatus.SKIPPED: "○",
                StepStatus.WAITING_APPROVAL: "◑",
            }[step.status]
            lines.append(f"  {icon} {i}. {step.description}")
            if step.status == StepStatus.FAILED and step.error:
                lines.append(f"     Error: {step.error[:100]}")
        return "\n".join(lines)
