"""SkillLoader: SKILL.md contracts -> registered tools.

Fail-closed: a skill whose contract is malformed, whose status is not
"active", or whose tools.py fails to import is skipped with a log line -
it never half-registers.
"""
from __future__ import annotations

import importlib.util
import logging
import re
from dataclasses import dataclass, field
from pathlib import Path


log = logging.getLogger("os.skills")


@dataclass
class SkillInfo:
    name: str
    description: str = ""
    version: str = "0.1.0"
    status: str = "planned"  # active | planned
    tools: list[str] = field(default_factory=list)
    path: str = ""


_FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def parse_skill_md(text: str, fallback_name: str) -> SkillInfo:
    """Parse a SKILL.md contract. Never raises."""
    info = SkillInfo(name=fallback_name)
    m = _FRONTMATTER_RE.match(text)
    if not m:
        return info
    for line in m.group(1).splitlines():
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key, value = key.strip().lower(), value.strip().strip("'\"")
        if key == "name" and value:
            info.name = value
        elif key == "description":
            info.description = value
        elif key == "version" and value:
            info.version = value
        elif key == "status" and value in ("active", "planned"):
            info.status = value
    return info


class SkillLoader:
    def __init__(self, skills_dir: str | Path | None = None) -> None:
        self.skills_dir = (
            Path(skills_dir)
            if skills_dir
            else Path(__file__).resolve().parent.parent.parent / "skills"
        )

    def discover(self) -> list[SkillInfo]:
        """List every skill contract found. Never raises."""
        infos: list[SkillInfo] = []
        if not self.skills_dir.is_dir():
            return infos
        for skill_dir in sorted(self.skills_dir.iterdir()):
            if not skill_dir.is_dir():
                continue
            md = skill_dir / "SKILL.md"
            if not md.exists():
                continue
            try:
                info = parse_skill_md(
                    md.read_text(encoding="utf-8"), skill_dir.name
                )
            except Exception as e:  # noqa: BLE001
                log.warning("skill %s: unreadable SKILL.md (%s)",
                            skill_dir.name, e)
                continue
            info.path = str(skill_dir)
            infos.append(info)
        return infos

    def load(self, registry, **tool_kwargs) -> list[SkillInfo]:
        """Import active skills and register their tools. Never raises.

        tool_kwargs are passed to a skill's ``make_tools(**kw)`` factory
        when it defines one (used to inject the StateStore into the
        memory skill); otherwise the module-level TOOLS list is used.
        """
        loaded: list[SkillInfo] = []
        for info in self.discover():
            if info.status != "active":
                continue
            tools_py = Path(info.path) / "tools.py"
            if not tools_py.exists():
                log.warning("skill %s: active but no tools.py", info.name)
                continue
            try:
                mod = self._import_tools(info.name, tools_py)
                entries = self._collect_tools(mod, tool_kwargs)
            except Exception as e:  # noqa: BLE001
                log.warning("skill %s: not loaded (%s)", info.name, e)
                continue
            for entry in entries:
                spec = entry[0]
                registry.register(*entry)
                info.tools.append(spec.name)
            loaded.append(info)
            log.info("skill %s: registered %s", info.name, info.tools)
        return loaded

    @staticmethod
    def _import_tools(name: str, path: Path):
        spec = importlib.util.spec_from_file_location(
            f"os_skill_{name}", path
        )
        mod = importlib.util.module_from_spec(spec)
        assert spec and spec.loader
        spec.loader.exec_module(mod)
        return mod

    @staticmethod
    def _collect_tools(mod, tool_kwargs: dict) -> list[tuple]:
        factory = getattr(mod, "make_tools", None)
        if callable(factory):
            return list(factory(**tool_kwargs))
        tools = getattr(mod, "TOOLS", None)
        if tools is None:
            raise ValueError("tools.py defines neither TOOLS nor make_tools")
        return list(tools)
