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
    "memory_forget": ToolPolicy.ALLOW,
    "calc": ToolPolicy.ALLOW,
    # Real internet, read-only: search and page reads have no external
    # effect, so they run straight through like the other read tools.
    "web_search": ToolPolicy.ALLOW,
    "web_read": ToolPolicy.ALLOW,
    # Batch B: browser. Reading pages/screenshotting is read-only (ALLOW);
    # every state-changing interaction is draft-only until approved.
    "browser_open": ToolPolicy.ALLOW,
    "browser_read": ToolPolicy.ALLOW,
    "browser_elements": ToolPolicy.ALLOW,
    "browser_screenshot": ToolPolicy.ALLOW,
    "browser_console": ToolPolicy.ALLOW,
    "browser_wait": ToolPolicy.ALLOW,
    "browser_click": ToolPolicy.NEEDS_APPROVAL,
    "browser_fill": ToolPolicy.NEEDS_APPROVAL,
    "browser_type": ToolPolicy.NEEDS_APPROVAL,
    "browser_press": ToolPolicy.NEEDS_APPROVAL,
    "browser_select": ToolPolicy.NEEDS_APPROVAL,
    # Agentic browser: natural-language tasks run the full agent, so they
    # always need approval before the browser is touched.
    "browser_task": ToolPolicy.NEEDS_APPROVAL,
    # Agentic computer: same - always needs approval before touching the desktop.
    "computer_task": ToolPolicy.NEEDS_APPROVAL,
    # Scheduler: reminders are harmless and explicitly requested.
    "schedule_reminder": ToolPolicy.ALLOW,
    "list_reminders": ToolPolicy.ALLOW,
    "cancel_reminder": ToolPolicy.ALLOW,
    # GitHub: reads are safe; creating issues needs approval.
    "github_repos": ToolPolicy.ALLOW,
    "github_issues": ToolPolicy.ALLOW,
    "github_prs": ToolPolicy.ALLOW,
    "github_create_issue": ToolPolicy.NEEDS_APPROVAL,
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
