"""Tools manager - registers and executes deterministic tools."""

from __future__ import annotations

import asyncio
import json
import os
from pathlib import Path
from .base import ToolResult, ToolSpec


class ToolsManager:
    """Manages deterministic tools OS can execute.

    Phase 9: files, apps, browser, git, documents, system.
    Phase 10: planner/task manager integration.
    Skills are registered from SKILL.md files in the skills/ directory.
    """

    def __init__(self, skills_dir: str | None = None) -> None:
        self._tools: dict[str, tuple[ToolSpec, Any]] = {}
        self._skills_dir = Path(skills_dir) if skills_dir else Path(__file__).resolve().parent.parent.parent / "skills"
        self._register_skills()

    def _register_skills(self) -> None:
        """Register all skills found in the skills directory."""
        if not self._skills_dir.exists():
            return
        for skill_dir in self._skills_dir.iterdir():
            if not skill_dir.is_dir():
                continue
            skill_md = skill_dir / "SKILL.md"
            if not skill_md.exists():
                continue
            # Parse basic info from SKILL.md
            skill_name = skill_dir.name
            spec = ToolSpec(
                name=skill_name,
                description=f"Skill: {skill_dir.name}",
                category="skills",
            )

            # Dynamic import of skill handlers
            try:
                # Add skills dir to path
                skill_pkg = skill_dir / "__init__.py"
                if skill_pkg.exists():
                    import importlib
                    mod = importlib.import_module(f"skills.{skill_dir.name}")
                    # Register each public function as a tool
                    for attr_name in dir(mod):
                        if not attr_name.startswith("_"):
                            attr = getattr(mod, attr_name)
                            if callable(attr):
                                # Wrap async functions
                                handler = attr
                                if asyncio.iscoroutinefunction(handler):
                                    pass  # will be awaited
                                self._tools[skill_name] = (spec, handler)
            except Exception as e:
                pass  # Skip skills that fail to load

    def register(self, spec: ToolSpec, handler) -> None:
        self._tools[spec.name] = (spec, handler)

    async def execute(self, name: str, **kwargs: object) -> ToolResult:
        """Execute a named tool and return ToolResult."""
        if name not in self._tools:
            return ToolResult(success=False, error=f"Unknown tool: {name}")
        spec, handler = self._tools[name]
        try:
            result = handler(**kwargs)
            if asyncio.iscoroutine(result):
                result = await result
            return ToolResult(success=True, output=str(result) if result else "")
        except Exception as e:
            return ToolResult(success=False, error=str(e))