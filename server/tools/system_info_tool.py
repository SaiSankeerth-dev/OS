"""System info tool: real psutil queries.

Phase 1 & F: Wired up with real measured telemetry. Real queries via psutil;
zero fabricated numbers, zero cloud telemetry leaks.
"""
from __future__ import annotations

import os
import platform
import psutil

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


def get_system_info(**kwargs) -> ToolResult:
    vm = psutil.virtual_memory()
    disk = psutil.disk_usage(os.getcwd())
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={
            "cpu_percent": psutil.cpu_percent(),
            "cpu_count": psutil.cpu_count(logical=True),
            "memory_percent": vm.percent,
            "memory_used_gb": round(vm.used / (1024**3), 2),
            "memory_total_gb": round(vm.total / (1024**3), 2),
            "disk_percent": disk.percent,
            "disk_used_gb": round(disk.used / (1024**3), 2),
            "disk_total_gb": round(disk.total / (1024**3), 2),
            "platform": platform.system(),
            "architecture": platform.machine(),
        },
    )


def format_system_info(result: ToolResult) -> str:
    d = result.data or {}
    return (
        f"CPU: {d.get('cpu_percent', 0)}% ({d.get('cpu_count', 1)} cores), "
        f"Memory: {d.get('memory_percent', 0)}% ({d.get('memory_used_gb', 0)}/{d.get('memory_total_gb', 0)} GB), "
        f"Disk: {d.get('disk_percent', 0)}% ({d.get('disk_used_gb', 0)}/{d.get('disk_total_gb', 0)} GB)."
    )


SYSTEM_INFO_SPEC = ToolSpec(
    name="get_system_info",
    description="Get current system information (CPU, memory, disk, platform).",
    execution_mode=ExecutionMode.DIRECT,
)