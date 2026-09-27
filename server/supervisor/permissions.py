"""Tool permissions: Tool Permission step of the safety pipeline.

Policy per tool:
  ALLOW          - run straight through the shared executor
  NEEDS_APPROVAL - run the local part, then stop at WAITING_APPROVAL;
                   nothing with external effects executes without it
  DENIED         - reject with TOOL_NOT_ALLOWED

Unknown tools are denied. Fail closed.
"""
from __future__ import annotations

import enum


TOOL_NOT_ALLOWED = "TOOL_NOT_ALLOWED"
APPROVAL_REQUIRED = "APPROVAL_REQUIRED"


class ToolPolicy(str, enum.Enum):
    ALLOW = "allow"
    NEEDS_APPROVAL = "needs_approval"
    DENIED = "denied"


DEFAULT_POLICIES: dict[str, ToolPolicy] = {
    # Drafting is local; the *publish* is the external effect, and that
    # only happens after explicit approval.
    "linkedin_draft": ToolPolicy.NEEDS_APPROVAL,
    "get_current_datetime": ToolPolicy.ALLOW,
    "get_system_info": ToolPolicy.ALLOW,
    # Phase 6: local-only tools. Memory is SQLite on this machine, calc is
    # pure arithmetic - no external effect, so no approval needed.
    "memory_save": ToolPolicy.ALLOW,
    "memory_recall": ToolPolicy.ALLOW,
    "calc": ToolPolicy.ALLOW,
}


class ToolPermission:
    def __init__(
        self, policies: dict[str, ToolPolicy] | None = None
    ) -> None:
        self._policies = dict(policies) if policies else dict(DEFAULT_POLICIES)

    def set_policy(self, tool_name: str, policy: ToolPolicy) -> None:
        self._policies[tool_name] = policy

    def check(self, tool_name: str) -> tuple[ToolPolicy, str | None]:
        """Returns (policy, error_code). error_code is None unless denied."""
        policy = self._policies.get(tool_name, ToolPolicy.DENIED)
        if policy == ToolPolicy.DENIED:
            return policy, TOOL_NOT_ALLOWED
        return policy, None
