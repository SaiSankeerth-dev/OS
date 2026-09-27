"""PermissionManager: the user-facing control surface for tool permissions.

Phase 9. The supervisor's ToolPermission table is the enforcement point;
this manager is the control surface on top of it:

- per-skill allow / ask / deny, changeable at runtime by voice or CLI
- overrides persisted in the StateStore (SQLite) - they survive restarts
- friendly names ("calculator", "linkedin") resolve to skills

Skill-level, not tool-level: "deny linkedin" denies every tool of the
linkedin skill. Fail closed: unknown skill names change nothing.
"""
from __future__ import annotations

import json
import logging

from server.state.store import StateStore
from server.supervisor.permissions import DEFAULT_POLICIES, ToolPermission, ToolPolicy
from server.supervisor.scope import ScopeGuard

log = logging.getLogger("os.permissions")

# Friendly names users actually say -> skill names.
FRIENDLY_SKILLS: dict[str, str] = {
    "calculator": "calc",
    "calc": "calc",
    "linkedin": "linkedin",
    "memory": "memory",
    "system": "system",
    "system info": "system",
    "clock": "system",
    "time": "system",
}

POLICY_WORDS: dict[ToolPolicy, str] = {
    ToolPolicy.ALLOW: "allow",
    ToolPolicy.NEEDS_APPROVAL: "ask",
    ToolPolicy.DENIED: "deny",
}

WORD_POLICIES: dict[str, ToolPolicy] = {
    "allow": ToolPolicy.ALLOW,
    "always allow": ToolPolicy.ALLOW,
    "ask": ToolPolicy.NEEDS_APPROVAL,
    "ask me": ToolPolicy.NEEDS_APPROVAL,
    "deny": ToolPolicy.DENIED,
    "block": ToolPolicy.DENIED,
}


class PermissionManager:
    def __init__(
        self,
        tool_permission: ToolPermission,
        scope_guard: ScopeGuard,
        state_store: StateStore | None = None,
    ) -> None:
        self._perms = tool_permission
        self._scope = scope_guard
        self._store = state_store or StateStore()
        self._load()

    # ---- persistence ----------------------------------------------------

    def _load(self) -> None:
        """Apply persisted per-tool overrides, latest event per tool wins."""
        try:
            events = self._store.get_events(kind="permission", limit=500)
        except Exception as e:  # noqa: BLE001
            log.debug("permission load failed: %s", e)
            return
        latest: dict[str, str | None] = {}
        for ev in events:
            try:
                data = json.loads(ev["data"])
            except Exception:  # noqa: BLE001
                continue
            tool = data.get("tool")
            if tool and tool not in latest:
                # get_events returns newest first - first sighting wins.
                latest[tool] = data.get("policy")
        for tool, policy_name in latest.items():
            if policy_name is None:
                continue  # reset marker: back to default, nothing to apply
            try:
                self._perms.set_policy(tool, ToolPolicy(policy_name))
            except ValueError:
                log.warning("ignoring stored policy %r for %s", policy_name, tool)

    def _persist(self, tool: str, policy: ToolPolicy | None) -> None:
        try:
            self._store.log_event(
                "permission",
                "permission_manager",
                json.dumps(
                    {
                        "tool": tool,
                        "policy": policy.value if policy else None,
                    }
                ),
            )
        except Exception as e:  # noqa: BLE001
            log.debug("permission persist failed: %s", e)

    # ---- skills ---------------------------------------------------------

    def skills(self) -> list[str]:
        return sorted(self._scope.skill_tools())

    def resolve_skill(self, name: str) -> str | None:
        """Map what the user said to a skill name. None = unknown."""
        key = (name or "").strip().lower()
        if key.startswith("the "):
            key = key[4:]
        key = key.removesuffix(" server").removesuffix(" skill").strip()
        if key in FRIENDLY_SKILLS:
            return FRIENDLY_SKILLS[key]
        known = self._scope.skill_tools()
        if key in known:
            return key
        if f"mcp_{key}" in known:
            return f"mcp_{key}"
        return None

    def tools_for_skill(self, skill: str) -> list[str]:
        return sorted(self._scope.skill_tools().get(skill, []))

    def policy_for_skill(self, skill: str) -> ToolPolicy | str:
        """Effective policy for a skill; 'mixed' if its tools disagree."""
        policies = {self._perms.check(t)[0] for t in self.tools_for_skill(skill)}
        if len(policies) == 1:
            return next(iter(policies))
        return "mixed"

    # ---- mutation --------------------------------------------------------

    def set_skill_policy(self, skill: str, policy: ToolPolicy) -> list[str]:
        """Set every tool of the skill to `policy`. Returns tools changed."""
        changed = []
        for tool in self.tools_for_skill(skill):
            self._perms.set_policy(tool, policy)
            self._persist(tool, policy)
            changed.append(tool)
        return changed

    def reset_skill(self, skill: str) -> list[str]:
        """Back to built-in defaults for every tool of the skill."""
        changed = []
        for tool in self.tools_for_skill(skill):
            default = DEFAULT_POLICIES.get(tool, ToolPolicy.DENIED)
            self._perms.set_policy(tool, default)
            self._persist(tool, None)  # tombstone: default again
            changed.append(tool)
        return changed

    def reset_all(self) -> list[str]:
        changed = []
        for skill in self.skills():
            changed.extend(self.reset_skill(skill))
        return changed

    # ---- read ------------------------------------------------------------

    def overrides(self) -> dict[str, ToolPolicy]:
        """Tools whose effective policy differs from the built-in default."""
        out = {}
        for skill in self.skills():
            for tool in self.tools_for_skill(skill):
                current = self._perms.check(tool)[0]
                default = DEFAULT_POLICIES.get(tool, ToolPolicy.DENIED)
                if current != default:
                    out[tool] = current
        return out

    def table(self) -> list[dict]:
        rows = []
        for skill in self.skills():
            tools = self.tools_for_skill(skill)
            policy = self.policy_for_skill(skill)
            policy_word = (
                POLICY_WORDS[policy] if isinstance(policy, ToolPolicy) else policy
            )
            rows.append(
                {
                    "skill": skill,
                    "tools": tools,
                    "policy": policy_word,
                    "custom": any(t in self.overrides() for t in tools),
                }
            )
        return rows
