"""System info tool: real psutil queries.

Phase 1: wired up and working. Real queries via psutil; deferred
enhancements (battery, sensors) can follow.
"""
from __future__ import annotations

import psutil

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


def get_system_info(**kwargs) -> ToolResult:
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
        },
    )


def format_system_info(result: ToolResult) -> str:
    d = result.data
    return f"CPU: {d['cpu_percent']}%, memory: {d['memory_percent']}%."


SYSTEM_INFO_SPEC = ToolSpec(
    name="get_system_info",
    description="Get current system information (CPU, memory, battery).",
    execution_mode=ExecutionMode.DIRECT,
)