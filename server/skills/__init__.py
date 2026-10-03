"""Phase 6: the SKILL.md skill system.

Every skill is a directory under skills/ with:
- SKILL.md: human-readable contract with YAML frontmatter
  (name, description, version, status: active|planned)
- tools.py: exposes TOOLS = [(ToolSpec, handler[, formatter]), ...]
  Only present for active skills.

The SkillLoader reads the contracts, imports active implementations,
and registers their tools into the ToolRegistry the supervisor
protects. Planned skills (browser, files) are listed but never loaded -
browser/computer autonomy stays deferred per the locked plan.
"""
from .loader import SkillInfo, SkillLoader

__all__ = ["SkillInfo", "SkillLoader"]
