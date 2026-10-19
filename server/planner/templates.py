"""Plan templates: pre-built multi-step plans for common tasks.

Each template is a function that takes parsed params and returns
a list of Steps. This is the deterministic planner — no LLM needed.
When the LLM brain arrives, it will generate custom plans; these
templates remain as fast paths.
"""
from __future__ import annotations

import re
from .models import Step


def _parse_then_chain(text: str) -> list[str] | None:
    """Parse 'do X then Y then Z' into [X, Y, Z]."""
    # Split on " then " (case-insensitive)
    parts = re.split(r"\s+then\s+", text, flags=re.IGNORECASE)
    if len(parts) < 2:
        return None
    # Strip leading "do" / "please" from first part
    parts[0] = re.sub(r"^\s*(please\s+)?do\s+", "", parts[0],
                      flags=re.IGNORECASE)
    return [p.strip() for p in parts if p.strip()]


def plan_then_chain(text: str) -> tuple[str, list[Step]] | None:
    """Build a plan from 'do X then Y then Z'.

    Each part is routed through the normal intent system at execution
    time, so any single-step command works as a plan step.
    """
    parts = _parse_then_chain(text)
    if not parts:
        return None
    steps = [
        Step(
            description=part,
            tool="__route__",  # special: route through intent at runtime
            args={"text": part},
        )
        for part in parts
    ]
    return f"Chain: {' → '.join(p[:30] for p in parts)}", steps


def plan_trip(destination: str, when: str = "") -> tuple[str, list[Step]]:
    """Plan a trip: check calendar → set reminder → search info."""
    steps = [
        Step(
            description=f"Check my reminders for {when or 'trip dates'}",
            tool="list_reminders",
            args={},
        ),
        Step(
            description=f"Set a reminder to book {destination} trip",
            tool="schedule_reminder",
            args={"task": f"remind me to book {destination} trip"},
            needs_approval=False,
        ),
        Step(
            description=f"Save {destination} as a trip destination in memory",
            tool="__route__",
            args={"text": f"remember my next trip destination is {destination}"},
        ),
    ]
    title = f"Trip to {destination}" + (f" ({when})" if when else "")
    return title, steps


def plan_morning_routine() -> tuple[str, list[Step]]:
    """Morning briefing: reminders → repos → date."""
    steps = [
        Step(description="Check today's reminders", tool="list_reminders",
             args={}),
        Step(description="Check GitHub PRs", tool="github_prs", args={}),
        Step(description="Show today's date", tool="__route__",
             args={"text": "what is today"}),
    ]
    return "Morning briefing", steps


# Registry of named templates
TEMPLATES = {
    "trip": plan_trip,
    "morning": plan_morning_routine,
    "briefing": plan_morning_routine,
}


def match_template(text: str) -> tuple[str, list[Step]] | None:
    """Try to match text to a plan template."""
    lowered = text.lower().strip()

    # "plan my trip to Goa" / "plan a trip to Delhi next month"
    m = re.match(
        r"^\s*plan\s+(?:my\s+)?trip\s+to\s+(.+?)\s*$",
        text, re.IGNORECASE,
    )
    if m:
        dest = m.group(1).strip()
        return plan_trip(dest)

    # "morning briefing" / "start my day"
    if re.match(r"^\s*(morning\s+briefing|start\s+my\s+day|daily\s+briefing)\s*$",
                lowered):
        return plan_morning_routine()

    # "do X then Y then Z"
    chain = plan_then_chain(text)
    if chain:
        return chain

    return None
