"""Proactive alert tools.

`check alerts` — run all checks, show what needs attention.
"""
from __future__ import annotations

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.proactive.checks import check_all


def check_alerts(**kwargs) -> ToolResult:
    """Check for things needing attention."""
    alerts = check_all()
    if not alerts:
        return ToolResult(
            status="success", mode=ExecutionMode.DIRECT,
            data={"display": "All clear. Nothing needs your attention."},
        )
    lines = [f"{len(alerts)} thing(s) need attention:\n"]
    icons = {"urgent": "🔴", "warning": "🟡", "info": "🔵"}
    for a in alerts:
        icon = icons.get(a.severity, "○")
        lines.append(f"{icon} [{a.source}] {a.title}")
        if a.detail:
            lines.append(f"   {a.detail}")
        if a.action:
            lines.append(f"   → Say '{a.action}'")
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"display": "\n".join(lines), "count": len(alerts)},
    )


def format_check_alerts(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't check alerts."
    return result.data["display"]


CHECK_ALERTS_SPEC = ToolSpec(
    name="check_alerts",
    description="Check for proactive alerts. Usage: check alerts",
    execution_mode=ExecutionMode.DIRECT,
)


PROACTIVE_TOOLS = [
    (CHECK_ALERTS_SPEC, check_alerts, format_check_alerts),
]
