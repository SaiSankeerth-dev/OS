"""Tools interface for OS deterministic operations."""
from __future__ import annotations

import asyncio

from dataclasses import dataclass
from typing import Any


@dataclass
class ToolResult:
    """Result of a tool execution."""
    success: bool
    output: str | None = None
    error: str | None = None
    raw: Any | None = None


@dataclass
class ToolSpec:
    """Metadata about a available tool."""
    name: str
    description: str
    category: str  # "files", "apps", "browser", "git", "system"


class ToolsManager:
    """Manages deterministic tools OS can execute."""

    def __init__(self) -> None:
        self._tools: dict[str, Any] = {}

    def register(self, spec: ToolSpec, handler) -> None:
        self._tools[spec.name] = (spec, handler)

    async def execute(self, name: str, **kwargs: object) -> ToolResult:
        """Execute a named tool with kwargs, return ToolResult."""
        if name not in self._tools:
            return ToolResult(success=False, error=f"Unknown tool: {name}")
        _, handler = self._tools[name]
        try:
            result = handler(**kwargs)
            if asyncio.iscoroutine(result):
                result = await result
            return ToolResult(success=True, output=str(result) if result else "")
        except Exception as e:
            return ToolResult(success=False, error=str(e))