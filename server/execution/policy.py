"""Policy Engine for OS.

Enforces:
1. Deterministic evaluation of proposed actions:
   LOW -> ALLOW
   MEDIUM -> ALLOW (if balanced/autonomous) or REQUIRE_APPROVAL
   HIGH -> ALWAYS REQUIRE_APPROVAL
2. Non-override rule: LLMs cannot override or bypass policy verdicts.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from server.domain.enums import RiskLevel
from server.execution.registry import ToolDefinition


@dataclass
class PolicyDecision:
    verdict: str  # ALLOW, DENY, REQUIRE_APPROVAL
    risk_level: RiskLevel
    reason: str


class PolicyEngine:
    def __init__(self, autonomy_level: str = "balanced") -> None:
        self.autonomy_level = autonomy_level  # manual, balanced, autonomous

    def evaluate(
        self,
        tool: ToolDefinition,
        arguments: dict[str, Any],
        user_autonomy: str = "balanced",
    ) -> PolicyDecision:
        autonomy = user_autonomy or self.autonomy_level
        tool_name = getattr(tool, "tool_name", None) or getattr(tool, "name", "unknown")
        req_approval = getattr(tool, "requires_approval", False)

        # HIGH risk actions always require human approval
        if tool.risk_level == RiskLevel.HIGH or req_approval:
            return PolicyDecision(
                verdict="REQUIRE_APPROVAL",
                risk_level=RiskLevel.HIGH,
                reason=f"Action '{tool_name}' is classified as HIGH RISK and requires explicit user approval",
            )

        # MEDIUM risk actions
        if tool.risk_level == RiskLevel.MEDIUM:
            if autonomy == "manual":
                return PolicyDecision(
                    verdict="REQUIRE_APPROVAL",
                    risk_level=RiskLevel.MEDIUM,
                    reason=f"Action '{tool_name}' is MEDIUM RISK and manual autonomy is active",
                )
            return PolicyDecision(
                verdict="ALLOW",
                risk_level=RiskLevel.MEDIUM,
                reason=f"Action '{tool_name}' allowed under {autonomy} autonomy",
            )

        # LOW risk actions (reads, local inspection, formatting)
        return PolicyDecision(
            verdict="ALLOW",
            risk_level=RiskLevel.LOW,
            reason=f"Action '{tool_name}' is LOW RISK read-only action",
        )
