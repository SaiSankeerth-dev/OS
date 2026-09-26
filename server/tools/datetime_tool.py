"""Date/time tool: deterministic system clock wrapped in a DIRECT tool."""
from __future__ import annotations

import datetime

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


def get_current_datetime(**kwargs) -> ToolResult:
    now = datetime.datetime.now().astimezone()
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={
            "date": now.strftime("%A, %B %d, %Y"),
            "time": now.strftime("%I:%M %p"),
            "timezone": str(now.tzinfo),
            "iso": now.isoformat(),
        },
    )


def format_datetime(result: ToolResult) -> str:
    d = result.data
    return f"It's {d['time']} on {d['date']} ({d['timezone']})."


DATETIME_SPEC = ToolSpec(
    name="get_current_datetime",
    description="Get the current local date and time.",
    execution_mode=ExecutionMode.DIRECT,
)