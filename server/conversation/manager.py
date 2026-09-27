"""Conversation Manager — central orchestrator."""
from __future__ import annotations

import enum
import logging
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import AsyncIterator

from config import Config
from ..approvals.gate import ApprovalStore, PendingApproval, content_hash
from ..llm.base import ChatChunk, Message
from ..llm.router import ModelRouter
from ..memory.base import MemoryManager
from ..memory.retriever import MemoryRetriever
from ..tools.datetime_tool import (
    DATETIME_SPEC,
    format_datetime,
    get_current_datetime,
)
from ..tools.linkedin_tool import (
    LINKEDIN_DRAFT_SPEC,
    format_linkedin_draft,
    generate_linkedin_draft,
)
from ..tools.system_info_tool import (
    SYSTEM_INFO_SPEC,
    format_system_info,
    get_system_info,
)
from ..utils import PerfTrace
from ..intent.registry import ExecutionMode, ToolRegistry
from ..intent.router import Intent, IntentRouter, RouteDecision
from ..routing.laya_router import TOOL_MAP as _LAYA_TOOL_MAP
from ..routing.laya_router import LayaRouter
from ..supervisor import Supervisor
from ..supervisor.permissions import ToolPolicy
from ..permissions import POLICY_WORDS, WORD_POLICIES, PermissionManager
from ..personality import PersonalityManager
from ..response.policy import ResponsePolicy
from .context import build_context_messages
from .personality import build_system_prompt


log = logging.getLogger("os.conversation")

# Matched only while a PendingApproval exists on the manager - see
# _handle_pending_approval(). Deliberately narrow: an ambiguous reply
# should not be silently read as approval either way.
_APPROVE_RE = re.compile(
    r"^\s*(yes|y|approve|approved|post it|publish(?: it)?|send it|go ahead)\s*[.!]?\s*$",
    re.IGNORECASE,
)
_REJECT_RE = re.compile(
    r"^\s*(no|n|reject|cancel|discard|stop|don'?t)\s*[.!]?\s*$",
    re.IGNORECASE,
)
# Phase 10: batch decisions over the pending-approval queue.
_APPROVE_ALL_RE = re.compile(
    r"^\s*(approve\s+all|yes\s+to\s+all)\s*[.!]?\s*$",
    re.IGNORECASE,
)
_REJECT_ALL_RE = re.compile(
    r"^\s*(reject\s+all|no\s+to\s+all|discard\s+all)\s*[.!]?\s*$",
    re.IGNORECASE,
)


class ConversationState(str, enum.Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    SPEECH_DETECTED = "SPEECH_DETECTED"
    TRANSCRIBING = "TRANSCRIBING"
    USER_FINISHED = "USER_FINISHED"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"
    INTERRUPTED = "INTERRUPTED"
    READY = "READY"


@dataclass
class TurnResult:
    text: str
    state: ConversationState
    perf: PerfTrace


def _default_registry(state_store=None) -> ToolRegistry:
    """Phase 6: tools come from SKILL.md skill contracts via SkillLoader.

    Active skills register their tools; planned skills (browser, files)
    are listed but never loaded.
    """
    from server.skills import SkillLoader

    def _has(reg: ToolRegistry, name: str) -> bool:
        try:
            reg.get(name)
            return True
        except KeyError:
            return False

    reg = ToolRegistry()
    loader = SkillLoader()
    loader.load(reg, state_store=state_store)
    # Safety net: the three original tools must always exist. If a skill
    # failed to load, fall back to direct registration.
    if not _has(reg, "get_current_datetime"):
        reg.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    if not _has(reg, "get_system_info"):
        reg.register(SYSTEM_INFO_SPEC, get_system_info, format_system_info)
    if not _has(reg, "linkedin_draft"):
        reg.register(
            LINKEDIN_DRAFT_SPEC, generate_linkedin_draft, format_linkedin_draft
        )
    return reg


class ConversationManager:
    """The brain's conductor."""

    def __init__(
        self,
        cfg: Config,
        router: ModelRouter | None = None,
        *,
        intent_router: IntentRouter | None = None,
        tool_registry: ToolRegistry | None = None,
        memory_retriever: MemoryRetriever | None = None,
        response_policy: ResponsePolicy | None = None,
        memory: MemoryManager | None = None,
        approval_store: ApprovalStore | None = None,
        fast_router: LayaRouter | None = None,
        supervisor: Supervisor | None = None,
        state_store=None,
        mcp_bus=None,
    ) -> None:
        self.cfg = cfg
        self.state: ConversationState = ConversationState.IDLE
        self.history: list[Message] = []
        # Phase 10: FIFO queue of pending approvals (was a single slot).
        # Each expires after cfg.approvals.timeout_sec; the queue caps at
        # cfg.approvals.max_pending (newest refused when full).
        # Phase 12: restored from SQLite - a restart never loses or
        # silently drops a waiting approval.
        self._approval_store = approval_store or ApprovalStore()
        self._pending: list[PendingApproval] = (
            self._approval_store.load_pending()
        )
        self._prune_expired()
        # Phase 3: Laya fast router. None = regex routing only (the safe
        # default used by tests). Pass LayaRouter() to enable the fast path.
        self._fast_router = fast_router
        self._supervisor_param = supervisor
        self._state_store_param = state_store
        self.router = router or ModelRouter.from_config(
            base_url=cfg.llm.base_url,
            model=cfg.llm.model,
            timeout_sec=float(cfg.llm.request_timeout_sec),
        )
        self.intent_router = intent_router or IntentRouter()
        self.tool_registry = tool_registry or _default_registry(
            self._state_store_param
        )
        # Phase 4: Pydantic AI supervisor. Every tool call runs through
        # the safety pipeline (scope -> permission -> approval ->
        # executor -> verifier) and the lifecycle tracker. Pass a
        # Supervisor() to override (tests use TestModel-backed ones).
        self._supervisor = self._supervisor_param or Supervisor(
            self.tool_registry,
            approval_store=self._approval_store,
            state_store=self._state_store_param,
        )
        # Phase 8: MCP tool bus. The bus must already be connected
        # (bus.connect()); its allowlisted tools join the same
        # registry, and their policies join the supervisor's permission
        # table - the full safety pipeline applies to them.
        self._mcp_bus = mcp_bus
        if mcp_bus is not None:
            bridged = mcp_bus.register_into(
                self.tool_registry,
                self._supervisor.permissions,
                self._supervisor.scope_guard,
            )
            log.info("mcp tools registered: %s", bridged)
        # Phase 9: user-facing permissions. The PermissionManager wraps the
        # supervisor's permission table, loads persisted overrides, and
        # applies them - changes take effect immediately and survive
        # restarts. MCP skills are registered on the scope guard above,
        # so they show up here too.
        self._permissions = PermissionManager(
            self._supervisor.permissions,
            self._supervisor.scope_guard,
            self._state_store_param,
        )
        # Phase 7: switchable personalities. Tone only - the safety
        # pipeline, tool formatters, and approvals are untouched.
        self._personality = PersonalityManager(self._state_store_param)
        self.response_policy = response_policy or ResponsePolicy(
            forbidden_prefixes=self._personality.current.forbidden_phrases
        )
        self.memory_retriever = memory_retriever
        self.memory = memory
        self._perf_sink = Path(cfg.logging.perf_file)

    def set_state(self, s: ConversationState) -> None:
        if self.state == s:
            return
        log.debug("state %s -> %s", self.state.value, s.value)
        self.state = s

    def reset(self) -> None:
        self.history.clear()
        self.state = ConversationState.IDLE

    async def health(self) -> bool:
        return await self.router.health()

    # ---------- Phase 1: text conversation ------------------------------------

    async def respond_text(self, user_text: str) -> AsyncIterator[ChatChunk]:
        perf = PerfTrace(self._perf_sink)
        perf.mark("turn_start:text")

        user_text = user_text.strip()
        if not user_text:
            return

        self.history.append(Message(role="user", content=user_text, ts=time.time()))

        # A pending approval takes priority over normal routing - the
        # user is answering a question OS just asked, not starting a
        # new request. Nothing external executes without going through
        # this branch first. Phase 10: expired approvals are pruned here.
        # Exception: a NEW tool-call request is allowed through while
        # approvals are pending, so the queue can actually fill. Its
        # result goes through the same approval gate (needs_approval)
        # and enqueues like any other.
        expired = self._prune_expired()
        if self._pending or expired:
            # `expired` covers the case where everything the user might
            # have been answering lapsed: _handle_pending_approval says
            # so plainly instead of misrouting "approve" as chat.
            route_through = True
            if self._pending:
                early = self.intent_router.classify(user_text)
                route_through = early.intent != Intent.TOOL_CALL
            if route_through:
                async for chunk in self._handle_pending_approval(user_text):
                    yield chunk
                perf.mark("turn_end:text")
                perf.flush("text_turn")
                return

        decision = self.intent_router.classify(user_text)

        # Phase 3: Laya fast path. Consulted only when the regex router
        # found no tool - exact regex hits stay authoritative. A confident
        # Laya skill pick becomes the decision; anything unsure falls
        # through to the old path unchanged. Phase 5/7: TASK and PERSONA
        # intents skip Laya - neither is a single-skill decision.
        if (
            self._fast_router is not None
            and decision.tool_name is None
            and decision.intent not in (Intent.TASK, Intent.PERSONA)
        ):
            hit = self._fast_router.route(user_text)
            if hit is not None:
                skill, _confidence, _latency_ms = hit
                tool_name = _LAYA_TOOL_MAP.get(skill)
                if tool_name == "linkedin_draft":
                    # No regex pattern matched, so no idea was extracted;
                    # the whole message is the drafting prompt.
                    decision = RouteDecision(
                        intent=Intent.TOOL_CALL,
                        tool_name=tool_name,
                        args={"idea": user_text},
                    )

        if decision.intent == Intent.TOOL_CALL and decision.tool_name:
            async for chunk in self._handle_tool(
                decision.tool_name, user_text, perf, decision.args
            ):
                yield chunk
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        if decision.intent == Intent.TASK:
            # Phase 5: multi-step request -> dynamic agent team under the
            # supervisor (plan -> parallel workers -> verify -> merge).
            async for chunk in self._handle_team(user_text, perf):
                yield chunk
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        if decision.intent == Intent.PERSONA:
            # Phase 7: personality switch. Tone only - no tools, no
            # supervisor pipeline, no external effect.
            async for chunk in self._handle_persona(decision.args, perf):
                yield chunk
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        if decision.intent == Intent.PERMISSION:
            # Phase 9: permission changes. Local settings only - no tools,
            # no supervisor pipeline, no external effect.
            async for chunk in self._handle_permission(decision.args, perf):
                yield chunk
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        if decision.intent == Intent.APPROVALS:
            # Phase 10: approval audit trail. Read-only view of the
            # immutable approvals log - no tools, no external effect.
            async for chunk in self._handle_approvals(decision.args, perf):
                yield chunk
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        async for chunk in self._handle_llm_chat(user_text, perf):
            yield chunk

    async def _handle_tool(
        self,
        tool_name: str,
        user_text: str,
        perf: PerfTrace,
        args: dict[str, str] | None = None,
    ):
        args = args or {}
        try:
            spec, _handler, formatter = self.tool_registry.get(tool_name)
        except KeyError:
            fr = self.response_policy.apply_llm_chat("")
            yield ChatChunk(delta=fr.text, done=True)
            return

        if spec.requires_memory and self.memory_retriever is not None:
            self.memory_retriever.retrieve_relevant(user_text, needs_memory=True)

        self.set_state(ConversationState.THINKING)

        # Phase 4: every tool call runs through the supervisor's safety
        # pipeline (scope -> permission -> approval -> executor ->
        # verifier) instead of hitting the registry directly.
        supervised = await self._supervisor.run_tool(tool_name, args, user_text)
        perf.mark("tool_executed")

        if supervised.status == "rejected":
            # Fail closed with the explicit code - nothing executed.
            text = f"{supervised.message} [{supervised.code}]"
            self.history.append(
                Message(role="assistant", content=text, ts=time.time())
            )
            self.set_state(ConversationState.SPEAKING)
            yield ChatChunk(delta=text, done=True)
            self.set_state(ConversationState.READY)
            return

        if supervised.verification_failed:
            # Phase 11: the tool's "done" claim did not verify. Never
            # format or present the unverified result - say so plainly.
            text = supervised.message
            self.history.append(
                Message(role="assistant", content=text, ts=time.time())
            )
            self.set_state(ConversationState.SPEAKING)
            yield ChatChunk(delta=text, done=True)
            self.set_state(ConversationState.READY)
            return

        result = supervised.tool_result
        if result is None:  # executor-level failure inside the pipeline
            fr = self.response_policy.apply_llm_chat("")
            yield ChatChunk(delta=fr.text, done=True)
            return

        if spec.execution_mode == ExecutionMode.DIRECT and formatter is not None:
            fr = self.response_policy.apply_direct(tool_name, result, formatter)
        else:
            fr = self.response_policy.apply_tool_then_llm(tool_name, result)

        # Drafting is never the last step for a skill with external
        # effects - stash it as pending and wait for the next turn's
        # approve/reject instead of finishing here. See
        # _handle_pending_approval() and server/approvals/gate.py.
        # Phase 4: the supervisor marks NEEDS_APPROVAL tools as
        # waiting_approval; the run_id ties the approval back to the
        # lifecycle run for APPROVE -> EXECUTE -> VERIFY -> REMEMBER.
        if supervised.needs_approval and result.status == "success":
            data = result.data or {}
            if "draft" in data:
                # Drafting skill with external effects (linkedin): stash
                # the draft and wait for the next turn's approve/reject.
                draft = data["draft"]
                pending = PendingApproval(
                    skill="linkedin",
                    input_text=args.get("idea", user_text),
                    draft=draft,
                    approved_hash=content_hash(draft),
                    run_id=supervised.run_id,
                )
            else:
                # Phase 9: a local-only tool the user put in ask-mode.
                # The result is already computed and has no external
                # effect; show it and hold for a plain confirmation.
                # APPROVE accepts it, REJECT discards it.
                shown = fr.text
                skill = self._supervisor.scope_guard.skill_for(tool_name)
                pending = PendingApproval(
                    skill=skill or tool_name,
                    input_text=user_text,
                    draft=shown,
                    approved_hash=content_hash(shown),
                    run_id=supervised.run_id,
                )
            if not self._enqueue_pending(pending):
                # Queue full: fail closed. The item is shown but cannot
                # be approved - clear the queue and ask again.
                self.history.append(
                    Message(role="assistant", content=fr.text, ts=time.time())
                )
                self.set_state(ConversationState.SPEAKING)
                text = (
                    f"{fr.text}\n\nMy approval queue is full "
                    f"({len(self._pending)} waiting). I can't hold this one "
                    f"for approval - approve or reject what's waiting, "
                    f"then ask me again."
                )
                yield ChatChunk(delta=text, done=True)
                self.set_state(ConversationState.READY)
                return
            if "draft" in data:
                self._approval_store.log(
                    skill="linkedin",
                    input_text=pending.input_text,
                    draft=pending.draft,
                    status="SHOWN",
                )
            else:
                self.history.append(
                    Message(role="assistant", content=fr.text, ts=time.time())
                )
                self.set_state(ConversationState.SPEAKING)
                n_more = len(self._pending) - 1
                more = f" ({n_more} more waiting.)" if n_more else ""
                note = (
                    "\n\nThat's waiting on your approval - say 'approve' "
                    f"or 'reject'.{more}"
                )
                yield ChatChunk(delta=fr.text + note, done=True)
                self.set_state(ConversationState.READY)
                return

        self.history.append(
            Message(role="assistant", content=fr.text, ts=time.time())
        )
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=fr.text, done=True)
        self.set_state(ConversationState.READY)

    async def _handle_approvals(self, args: dict[str, str], perf: PerfTrace):
        """Phase 10: approval audit trail ('what did I approve?').

        Read-only view over the immutable ApprovalStore log.
        """
        self.set_state(ConversationState.THINKING)
        entries = self._approval_store.recent(limit=10)
        if not entries:
            text = "Nothing approved or rejected yet - the approval log is empty."
        else:
            lines = []
            for e in entries:
                ts = str(e["ts"])[:16].replace("T", " ")
                status = str(e["status"]).replace("_", " ").title()
                lines.append(f"- {ts} | {e['skill']} | {status}")
            text = "Approval history (newest first):\n" + "\n".join(lines)
        self.history.append(
            Message(role="assistant", content=text, ts=time.time())
        )
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=text, done=True)
        self.set_state(ConversationState.READY)

    async def _handle_permission(self, args: dict[str, str], perf: PerfTrace):
        """Phase 9: allow / ask / deny per skill, show, reset.

        Local settings change only - persisted in SQLite, effective
        immediately. Unknown skill names change nothing (fail closed).
        """
        self.set_state(ConversationState.THINKING)
        action = (args or {}).get("action", "")
        target = (args or {}).get("target", "")

        if action in ("allow", "ask", "deny"):
            skill = self._permissions.resolve_skill(target)
            if skill is None:
                known = ", ".join(self._permissions.skills())
                text = (
                    f"I don't know a skill called '{target}'. "
                    f"Known skills: {known}. Nothing changed."
                )
            else:
                policy = WORD_POLICIES[action]
                changed = self._permissions.set_skill_policy(skill, policy)
                word = POLICY_WORDS[policy]
                if policy == ToolPolicy.ALLOW:
                    text = (
                        f"Done - {skill} will now run without asking."
                    )
                elif policy == ToolPolicy.NEEDS_APPROVAL:
                    text = (
                        f"Done - I'll ask before running anything "
                        f"from {skill}."
                    )
                else:
                    text = f"Done - {skill} is now denied."
                perf.mark("permission_set")
        elif action == "show":
            lines = ["Here's how your skills are set:"]
            for row in self._permissions.table():
                marker = " *" if row["custom"] else ""
                lines.append(
                    f"- {row['skill']}: {row['policy']}{marker}"
                )
            lines.append("(* = you changed this from the default)")
            text = "\n".join(lines)
        elif action == "reset":
            self._permissions.reset_all()
            text = "Permissions reset to defaults."
            perf.mark("permission_reset")
        else:
            text = "Sorry, I didn't catch that permission change."

        self.history.append(
            Message(role="assistant", content=text, ts=time.time())
        )
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=text, done=True)
        self.set_state(ConversationState.READY)

    async def _handle_team(self, user_text: str, perf: PerfTrace):
        """Phase 5: run a dynamic agent team for a multi-step request."""
        self.set_state(ConversationState.THINKING)
        team_result = await self._supervisor.run_team(user_text)
        perf.mark("team_done")
        text = team_result.text or "I couldn't complete that task."
        if team_result.status == "partial":
            text += (
                f"\n\n({team_result.verified} of "
                f"{len(team_result.subtasks)} parts verified; "
                f"{team_result.dropped} dropped.)"
            )
        self.history.append(
            Message(role="assistant", content=text, ts=time.time())
        )
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=text, done=True)
        self.set_state(ConversationState.READY)

    async def _handle_persona(self, args: dict[str, str], perf: PerfTrace):
        """Phase 7: switch the active persona. Tone only."""
        self.set_state(ConversationState.THINKING)
        name = (args or {}).get("persona", "")
        try:
            persona = self._personality.set_persona(name)
        except ValueError as e:
            text = str(e)
            self.history.append(
                Message(role="assistant", content=text, ts=time.time())
            )
            yield ChatChunk(delta=text, done=True)
            self.set_state(ConversationState.READY)
            return
        # Forbidden phrases follow the persona.
        self.response_policy = ResponsePolicy(
            forbidden_prefixes=persona.forbidden_phrases
        )
        perf.mark("persona_switched")
        text = persona.confirm_template
        self.history.append(
            Message(role="assistant", content=text, ts=time.time())
        )
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=text, done=True)
        self.set_state(ConversationState.READY)

    def _prune_expired(self) -> int:
        """Drop expired pending approvals (fail closed). Returns count."""
        timeout = float(self.cfg.approvals.timeout_sec)
        kept: list[PendingApproval] = []
        expired = 0
        for p in self._pending:
            if p.expired(timeout):
                expired += 1
                self._approval_store.log(
                    p.skill, p.input_text, p.draft, "EXPIRED"
                )
                if p.pending_id:
                    self._approval_store.remove_pending(p.pending_id)
                # Close the lifecycle run - discarded, nothing executed.
                # At startup (restoring the queue) there is no live
                # supervisor yet; the run died with the old process.
                sup = getattr(self, "_supervisor", None)
                if sup is not None:
                    sup.reject_approved_run(p.run_id, p.skill)
            else:
                kept.append(p)
        self._pending = kept
        return expired

    def _enqueue_pending(self, pending: PendingApproval) -> bool:
        """Add to the approval queue. False = queue full, item refused."""
        self._prune_expired()
        if len(self._pending) >= max(1, int(self.cfg.approvals.max_pending)):
            return False
        self._pending.append(pending)
        # Phase 12: write-through so the queue survives a restart.
        pending.pending_id = self._approval_store.save_pending(pending)
        return True

    async def _approve_one(self, pending: PendingApproval) -> str:
        """Approve a single pending item. Returns the reply text."""
        # Phase 12: the item leaves the persisted queue the moment it is
        # processed, whatever the outcome.
        if pending.pending_id:
            self._approval_store.remove_pending(pending.pending_id)
        # Recompute the hash at execution time - if the draft was
        # mutated after being shown, this stops matching and the
        # approval is refused. No execution on a stale approval.
        if content_hash(pending.draft) != pending.approved_hash:
            self._approval_store.log(
                pending.skill, pending.input_text, pending.draft,
                "REJECTED_HASH_MISMATCH",
            )
            return (
                "That changed since I showed it - I won't approve "
                "something you didn't actually see. Ask me to do it again."
            )
        if pending.skill == "linkedin":
            # STUB: no LinkedIn connector configured yet. Replace
            # this branch with a real publish call when one exists -
            # nothing else in this flow needs to change.
            # Phase 4: the publish runs inside the supervisor as the
            # APPROVE -> EXECUTE -> VERIFY -> REMEMBER tail of the
            # lifecycle run that produced the draft.
            def _publish() -> str:
                text = (
                    "[stub] Would post to LinkedIn now:\n\n"
                    f"{pending.draft}\n\n"
                    "(No LinkedIn connector is wired up yet, so nothing "
                    "actually went out.)"
                )
                self._approval_store.log(
                    pending.skill, pending.input_text, pending.draft,
                    "PUBLISHED_STUB",
                )
                return text

            completed = await self._supervisor.complete_approved(
                pending.run_id, "linkedin_draft", _publish
            )
            return completed.message
        # Phase 9: generic ask-mode confirmation. The result was
        # local-only with no external effect - approval just
        # accepts what was already shown.
        self._approval_store.log(
            pending.skill, pending.input_text, pending.draft,
            "ACCEPTED_BY_USER",
        )
        self._supervisor.accept_approved_run(pending.run_id, pending.skill)
        return "Approved."

    def _reject_one(self, pending: PendingApproval) -> str:
        """Reject a single pending item. Returns the reply text."""
        self._approval_store.log(
            pending.skill, pending.input_text, pending.draft,
            "REJECTED_BY_USER",
        )
        if pending.pending_id:
            self._approval_store.remove_pending(pending.pending_id)
        # Phase 4: close the lifecycle run - discarded, nothing ran.
        self._supervisor.reject_approved_run(pending.run_id, pending.skill)
        if pending.skill == "linkedin":
            return "Okay, discarded. Nothing was posted."
        return "Okay, discarded."

    async def _handle_pending_approval(self, user_text: str):
        # Phase 10: the queue. Approve/reject act on the oldest item;
        # "approve all" / "reject all" drain the whole queue in order.
        self._prune_expired()
        if not self._pending:
            text = (
                "The pending approvals expired while waiting - "
                "nothing was executed."
            )
            self.history.append(
                Message(role="assistant", content=text, ts=time.time())
            )
            yield ChatChunk(delta=text, done=True)
            return

        if _APPROVE_ALL_RE.match(user_text):
            parts = []
            while self._pending:
                parts.append(await self._approve_one(self._pending.pop(0)))
            text = "\n\n".join(parts)
        elif _APPROVE_RE.match(user_text):
            text = await self._approve_one(self._pending.pop(0))
            if self._pending:
                text += f"\n\n({len(self._pending)} more waiting.)"
        elif _REJECT_ALL_RE.match(user_text):
            parts = []
            while self._pending:
                parts.append(self._reject_one(self._pending.pop(0)))
            text = "\n\n".join(parts)
        elif _REJECT_RE.match(user_text):
            text = self._reject_one(self._pending.pop(0))
            if self._pending:
                text += f"\n\n({len(self._pending)} more waiting.)"
        else:
            # Ambiguous reply while something is pending - don't guess in
            # either direction, don't silently drop the pending items.
            pending = self._pending[0]
            n = len(self._pending)
            waiting = f" ({n} waiting)" if n > 1 else ""
            if pending.skill == "linkedin":
                text = (
                    f"I've still got a draft waiting on your approval{waiting}. "
                    "Say 'yes' to post it or 'no' to discard it."
                )
            else:
                text = (
                    f"I've still got something waiting on your approval{waiting}. "
                    "Say 'approve' to accept it or 'reject' to discard it."
                )
            yield ChatChunk(delta=text, done=True)
            self.set_state(ConversationState.READY)
            return

        self.history.append(
            Message(role="assistant", content=text, ts=time.time())
        )
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=text, done=True)
        self.set_state(ConversationState.READY)

    async def _handle_llm_chat(self, user_text: str, perf: PerfTrace):
        memories: list[str] = []
        if self.memory_retriever is not None:
            memories = self.memory_retriever.retrieve_relevant(user_text)

        sys_prompt = build_system_prompt(self._personality.to_config())
        messages = build_context_messages(
            self.history[:-1],
            conversation_cfg=self.cfg.conversation,
            system_prompt=sys_prompt,
            relevant_memories=memories,
            task_context="",
        )
        messages.append(self.history[-1])

        client = self.router.client_for("conversation")
        self.set_state(ConversationState.THINKING)

        full_parts: list[str] = []
        self.set_state(ConversationState.SPEAKING)
        try:
            async for chunk in client.chat_stream(
                messages,
                temperature=self.cfg.llm.temperature,
                max_tokens=self.cfg.llm.max_tokens,
                stop=self.cfg.llm.stop or None,
                perf=perf,
            ):
                if chunk.delta:
                    full_parts.append(chunk.delta)
                    yield chunk
                if chunk.done:
                    break
        except Exception as e:  # noqa: BLE001
            log.exception("LLM stream failed: %s", e)
            fr = self.response_policy.apply_llm_chat("")
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
            yield ChatChunk(delta=fr.text, done=True)
            self.set_state(ConversationState.READY)
            return

        full = "".join(full_parts).strip()
        fr = self.response_policy.apply_llm_chat(full)
        if not full_parts:
            yield ChatChunk(delta=fr.text, done=True)
        if fr.text and (
            not self.history or self.history[-1].content != fr.text
        ):
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
        self.set_state(ConversationState.READY)
        perf.mark("turn_end:text")
        perf.flush("text_turn")

    async def respond_text_collected(self, user_text: str) -> TurnResult:
        perf = PerfTrace(self._perf_sink)
        perf.mark("turn_start:text_collected")
        out: list[str] = []
        async for chunk in self.respond_text(user_text):
            out.append(chunk.delta)
        text = "".join(out).strip()
        perf.mark("turn_end:text_collected")
        perf.flush("text_turn_collected")
        return TurnResult(text=text, state=self.state, perf=perf)

    # ---------- Phase 5+ hooks -------------------------------------------------

    def interrupt(self) -> None:
        self.set_state(ConversationState.INTERRUPTED)
        log.info("barge-in requested (no TTS to stop in Phase 1 yet)")

    def begin_listen(self) -> None:
        self.set_state(ConversationState.LISTENING)

    def speech_detected(self) -> None:
        self.set_state(ConversationState.SPEECH_DETECTED)

    def transcribing(self) -> None:
        self.set_state(ConversationState.TRANSCRIBING)

    def user_finished(self) -> None:
        self.set_state(ConversationState.USER_FINISHED)
