"""Unified Tool Registry with Risk Tiers and Schemas for OS.

Every tool in OS must declare:
- Name and version
- Input and output schemas
- Deterministic Risk Level (LOW, MEDIUM, HIGH)
- Handler function
- Verification policy
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable, Optional

from server.domain.enums import RiskLevel


@dataclass
class ToolDefinition:
    name: str
    description: str
    risk_level: RiskLevel
    handler: Callable[[dict[str, Any]], Any]
    input_schema: dict[str, Any] = field(default_factory=dict)
    output_schema: dict[str, Any] = field(default_factory=dict)
    requires_approval: bool = False
    verifier_name: Optional[str] = None


class ExecutionToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, ToolDefinition] = {}

    def register(self, tool: ToolDefinition) -> None:
        self._tools[tool.name] = tool

    def get(self, name: str) -> Optional[ToolDefinition]:
        return self._tools.get(name)

    def list_tools(self) -> list[ToolDefinition]:
        return list(self._tools.values())


# Global execution tool registry
_registry = ExecutionToolRegistry()


def get_tool_registry() -> ExecutionToolRegistry:
    return _registry
