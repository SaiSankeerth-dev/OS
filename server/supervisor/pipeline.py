"""Supervisor: orchestrates every tool action through the safety pipeline.

    Skill -> Scope Guard -> Tool Permission -> Approval
    -> Shared Executor -> Independent Verifier

along the lifecycle:

    NOTICE -> SUGGEST -> [DRAFT|EXECUTE] -> VERIFY -> [SHOW/WAIT]
    -> APPROVE -> EXECUTE -> VERIFY -> REMEMBER

The supervisor never executes tools directly: the shared executor is
the existing ToolRegistry, approval is the existing ApprovalStore
flow, and the Pydantic AI agent only refines args and verifies
outcomes (best-effort). Fail closed with explicit codes.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable

from ..intent.registry import ExecutionMode, ToolRegistry, ToolResult
from .agent import SupervisorAgent
from .lifecycle import LifecycleStage, LifecycleTracker
from .permissions import APPROVAL_REQUIRED, ToolPermission, ToolPolicy
from .scope import ScopeGuard


log = logging.getLogger("os.supervisor")


@dataclass
class SupervisedResult:
    status: str  # "ok" | "rejected" | "waiting_approval" | "failed"
    tool_result: ToolResult | None = None
    code: str | None = None
    message: str = ""
    run_id: str = ""
    verifier_note: str = ""
    needs_approval: bool = False
    refined_args: dict[str, Any] = field(default_factory=dict)


class Supervisor:
    """Runs tool calls through the safety pipeline + lifecycle."""

    def __init__(
        self,
        tool_registry: ToolRegistry,
        approval_store=None,
        state_store=None,
        scope_guard: ScopeGuard | None = None,
        permissions: ToolPermission | None = None,
        agent: SupervisorAgent | None = None,
    ) -> None:
        self.tool_registry = tool_registry
        self.approval_store = approval_store
        self.tracker = LifecycleTracker(state_store)
        self.scope_guard = scope_guard or ScopeGuard()
        self.permissions = permissions or ToolPermission()
        self.agent = agent or SupervisorAgent()

    # ---------- main entry: a routed tool call ---------------------------

    async def run_tool(
        self, tool_name: str, args: dict[str, Any], user_text: str = ""
    ) -> SupervisedResult:
        run_id = self.tracker.new_run()
        t = lambda s, d="": self.tracker.transition(run_id, s, d)  # noqa: E731
        t(LifecycleStage.NOTICE, f"tool={tool_name}")

        # Skill -> Scope Guard
        code = self.scope_guard.check(tool_name)
        if code:
            t(LifecycleStage.REMEMBER, f"rejected code={code}")
            return SupervisedResult(
                status="rejected", code=code, run_id=run_id,
                message=self._reject_message(code, tool_name),
            )

        # Tool Permission
        policy, code = self.permissions.check(tool_name)
        if code:
            t(LifecycleStage.REMEMBER, f"rejected code={code}")
            return SupervisedResult(
                status="rejected", code=code, run_id=run_id,
                message=self._reject_message(code, tool_name),
            )

        # Suggest: best-effort arg refinement via the Pydantic AI agent.
        refined = await self.agent.refine_args(tool_name, user_text, args)
        t(LifecycleStage.SUGGEST, f"args={refined}")

        # Shared Executor (the existing ToolRegistry).
        stage = (
            LifecycleStage.DRAFT
            if policy == ToolPolicy.NEEDS_APPROVAL
            else LifecycleStage.EXECUTE
        )
        result = self.tool_registry.execute(tool_name, **refined)
        t(stage, f"tool_status={result.status}")

        if result.status == "failure":
            t(LifecycleStage.REMEMBER, f"tool failed: {result.error}")
            return SupervisedResult(
                status="failed", tool_result=result, run_id=run_id,
                message=result.error or "tool failed",
                refined_args=refined,
            )

        # Independent Verifier.
        summary = self._summarize(tool_name, result)
        verdict = await self.agent.verify(tool_name, refined, summary)
        t(LifecycleStage.VERIFY,
          f"passed={verdict.passed} note={verdict.note}")

        if policy == ToolPolicy.NEEDS_APPROVAL:
            # Local part done; the external effect waits for the user.
            t(LifecycleStage.SHOW, "result shown, awaiting approval")
            t(LifecycleStage.WAIT, f"code={APPROVAL_REQUIRED}")
            t(LifecycleStage.REMEMBER, "waiting_approval")
            return SupervisedResult(
                status="waiting_approval",
                tool_result=result,
                code=APPROVAL_REQUIRED,
                run_id=run_id,
                verifier_note=verdict.note,
                needs_approval=True,
                refined_args=refined,
            )

        t(LifecycleStage.REMEMBER, "ok")
        return SupervisedResult(
            status="ok",
            tool_result=result,
            run_id=run_id,
            verifier_note=verdict.note,
            refined_args=refined,
        )

    # ---------- second entry: user approved a waiting run ----------------

    async def complete_approved(
        self,
        run_id: str,
        tool_name: str,
        publish: Callable[[], str],
    ) -> SupervisedResult:
        """APPROVE -> EXECUTE -> VERIFY -> REMEMBER for an approved run."""
        t = lambda s, d="": self.tracker.transition(run_id, s, d)  # noqa: E731
        t(LifecycleStage.APPROVE, f"tool={tool_name}")
        try:
            outcome = publish()
        except Exception as e:  # noqa: BLE001
            t(LifecycleStage.REMEMBER, f"publish failed: {e}")
            return SupervisedResult(
                status="failed", run_id=run_id,
                message=f"{type(e).__name__}: {e}",
            )
        t(LifecycleStage.EXECUTE, "external effect ran")
        verdict = await self.agent.verify(tool_name, {}, outcome)
        t(LifecycleStage.VERIFY,
          f"passed={verdict.passed} note={verdict.note}")
        t(LifecycleStage.REMEMBER, "approved run completed")
        return SupervisedResult(
            status="ok", run_id=run_id, verifier_note=verdict.note,
            message=outcome,
        )

    def reject_approved_run(self, run_id: str, tool_name: str) -> None:
        t = lambda s, d="": self.tracker.transition(run_id, s, d)  # noqa: E731
        t(LifecycleStage.APPROVE, "rejected by user")
        t(LifecycleStage.REMEMBER, "discarded, nothing executed")

    # ---------- helpers --------------------------------------------------

    @staticmethod
    def _reject_message(code: str, tool_name: str) -> str:
        if code == "SKILL_DISABLED":
            return f"The {tool_name} skill is disabled, so I can't do that."
        if code == "OUT_OF_SCOPE":
            return f"{tool_name} is outside what I'm allowed to touch."
        if code == "TOOL_NOT_ALLOWED":
            return f"I'm not permitted to run {tool_name}."
        return f"Blocked ({code})."

    @staticmethod
    def _summarize(tool_name: str, result: ToolResult) -> str:
        data = result.data
        if tool_name == "linkedin_draft":
            return f"draft: {data.get('draft', '')[:300]}"
        return str(data)[:300]

    def status(self) -> dict:
        return {
            "agent_model": self.agent.model_name,
            "disabled_skills": self.scope_guard.disabled_skills,
            "tools": self.tool_registry.names(),
            "lifecycle_stages": [s.value for s in LifecycleStage],
        }
