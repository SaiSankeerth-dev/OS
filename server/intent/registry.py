"""Tool registry: stores ToolSpec + handler + formatter, runs tools."""
from __future__ import annotations

import asyncio
import enum
import logging
from dataclasses import dataclass, field
from typing import Any, Callable, Literal

log = logging.getLogger("os.tools.registry")


class ExecutionMode(str, enum.Enum):
    DIRECT = "DIRECT"
    RESULT_THEN_LLM = "RESULT_THEN_LLM"


@dataclass
class ToolSpec:
    name: str
    description: str
    execution_mode: ExecutionMode
    requires_memory: bool = False
    requires_llm_interpretation: bool = False


@dataclass
class ToolResult:
    status: Literal["success", "failure"]
    mode: ExecutionMode
    data: dict[str, Any] = field(default_factory=dict)
    error: str | None = None


Handler = Callable[..., Any]
Formatter = Callable[[ToolResult], str]


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[
            str, tuple[ToolSpec, Handler, Formatter | None]
        ] = {}

    def register(
        self,
        spec: ToolSpec,
        handler: Handler,
        formatter: Formatter | None = None,
    ) -> None:
        if spec.execution_mode == ExecutionMode.DIRECT and formatter is None:
            raise ValueError(
                f"DIRECT tool '{spec.name}' requires a user-facing formatter"
            )
        self._tools[spec.name] = (spec, handler, formatter)

    def get(self, name: str) -> tuple[ToolSpec, Handler, Formatter | None]:
        if name not in self._tools:
            raise KeyError(f"unknown tool: {name}")
        return self._tools[name]

    def specs(self) -> list[ToolSpec]:
        """All registered tool specs (for dashboards / introspection)."""
        return [spec for spec, _, _ in self._tools.values()]

    def execute(self, name: str, **kwargs: Any) -> ToolResult:
        if name not in self._tools:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error=f"unknown tool: {name}",
            )
        spec, handler, _ = self._tools[name]
        try:
            result = handler(**kwargs)
            if asyncio.iscoroutine(result):
                result = asyncio.run(result)
            if not isinstance(result, ToolResult):
                return ToolResult(
                    status="failure",
                    mode=spec.execution_mode,
                    error=f"tool '{name}' did not return ToolResult",
                )
            return result
        except Exception as e:  # noqa: BLE001
            log.exception("tool '%s' raised", name)
            return ToolResult(
                status="failure",
                mode=spec.execution_mode,
                error=f"{type(e).__name__}: {e}",
            )

    def names(self) -> list[str]:
        return sorted(self._tools.keys())