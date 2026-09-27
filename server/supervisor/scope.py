"""Scope guard: Skill -> Scope Guard step of the safety pipeline.

Each tool belongs to a skill, and each skill declares the scopes it may
touch. A tool call is rejected when:
  - its skill is disabled            -> SKILL_DISABLED
  - the tool is unknown, or its scopes are not granted -> OUT_OF_SCOPE

Fail closed: anything not explicitly granted is out of scope.
"""
from __future__ import annotations


SKILL_DISABLED = "SKILL_DISABLED"
OUT_OF_SCOPE = "OUT_OF_SCOPE"

# tool name -> (skill name, scopes the skill grants for this tool)
TOOL_SKILLS: dict[str, tuple[str, tuple[str, ...]]] = {
    "linkedin_draft": ("linkedin", ("linkedin:draft",)),
    "get_current_datetime": ("system", ("system:read",)),
    "get_system_info": ("system", ("system:read",)),
    "memory_save": ("memory", ("memory:write",)),
    "memory_recall": ("memory", ("memory:read",)),
    "calc": ("calc", ("calc:eval",)),
}


class ScopeGuard:
    def __init__(
        self,
        disabled_skills: tuple[str, ...] = (),
        tool_skills: dict[str, tuple[str, tuple[str, ...]]] | None = None,
    ) -> None:
        self._disabled = set(disabled_skills)
        self._tool_skills = dict(tool_skills) if tool_skills else dict(TOOL_SKILLS)

    def disable_skill(self, skill: str) -> None:
        self._disabled.add(skill)

    def enable_skill(self, skill: str) -> None:
        self._disabled.discard(skill)

    def register_tool(
        self, tool_name: str, skill: str, scopes: tuple[str, ...]
    ) -> None:
        """Register a tool's skill mapping (Phase 8: MCP-bridged tools).
        Each MCP server becomes its own skill, so disabling the skill
        disables all of that server's tools."""
        self._tool_skills[tool_name] = (skill, scopes)

    @property
    def disabled_skills(self) -> list[str]:
        return sorted(self._disabled)

    def check(self, tool_name: str) -> str | None:
        """Returns an error code, or None when the tool is in scope."""
        entry = self._tool_skills.get(tool_name)
        if entry is None:
            return OUT_OF_SCOPE
        skill, _scopes = entry
        if skill in self._disabled:
            return SKILL_DISABLED
        return None

    def skill_for(self, tool_name: str) -> str | None:
        entry = self._tool_skills.get(tool_name)
        return entry[0] if entry else None

    def skill_tools(self) -> dict[str, list[str]]:
        """skill name -> sorted tool names (Phase 9: permission manager)."""
        out: dict[str, list[str]] = {}
        for tool, (skill, _scopes) in self._tool_skills.items():
            out.setdefault(skill, []).append(tool)
        return {skill: sorted(tools) for skill, tools in out.items()}
