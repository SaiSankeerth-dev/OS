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
        self._pending_approval: PendingApproval | None = None
        self._approval_store = approval_store or ApprovalStore()
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
        # this branch first.
        if self._pending_approval is not None:
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
                self._pending_approval = PendingApproval(
                    skill="linkedin",
                    input_text=args.get("idea", user_text),
                    draft=draft,
                    approved_hash=content_hash(draft),
                    run_id=supervised.run_id,
                )
                self._approval_store.log(
                    skill="linkedin",
                    input_text=self._pending_approval.input_text,
                    draft=draft,
                    status="SHOWN",
                )
            else:
                # Phase 9: a local-only tool the user put in ask-mode.
                # The result is already computed and has no external
                # effect; show it and hold for a plain confirmation.
                # APPROVE accepts it, REJECT discards it.
                shown = fr.text
                skill = self._supervisor.scope_guard.skill_for(tool_name)
                self._pending_approval = PendingApproval(
                    skill=skill or tool_name,
                    input_text=user_text,
                    draft=shown,
                    approved_hash=content_hash(shown),
                    run_id=supervised.run_id,
                )
                self.history.append(
                    Message(role="assistant", content=shown, ts=time.time())
                )
                self.set_state(ConversationState.SPEAKING)
                note = "\n\nThat's waiting on your approval - say 'approve' or 'reject'."
                yield ChatChunk(delta=shown + note, done=True)
                self.set_state(ConversationState.READY)
                return

        self.history.append(
            Message(role="assistant", content=fr.text, ts=time.time())
        )
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=fr.text, done=True)
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

    async def _handle_pending_approval(self, user_text: str):
        pending = self._pending_approval
        assert pending is not None

        if _APPROVE_RE.match(user_text):
            # Recompute the hash at execution time - if the draft was
            # mutated after being shown, this stops matching and the
            # approval is refused. No execution on a stale approval.
            if content_hash(pending.draft) != pending.approved_hash:
                text = (
                    "That changed since I showed it - I won't approve "
                    "something you didn't actually see. Ask me to do it again."
                )
                self._approval_store.log(
                    pending.skill, pending.input_text, pending.draft,
                    "REJECTED_HASH_MISMATCH",
                )
            elif pending.skill == "linkedin":
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
                text = completed.message
            else:
                # Phase 9: generic ask-mode confirmation. The result was
                # local-only with no external effect - approval just
                # accepts what was already shown.
                self._approval_store.log(
                    pending.skill, pending.input_text, pending.draft,
                    "ACCEPTED_BY_USER",
                )
                self._supervisor.accept_approved_run(
                    pending.run_id, pending.skill
                )
                text = "Approved."
            self._pending_approval = None
            self.history.append(
                Message(role="assistant", content=text, ts=time.time())
            )
            self.set_state(ConversationState.SPEAKING)
            yield ChatChunk(delta=text, done=True)
            self.set_state(ConversationState.READY)
            return

        if _REJECT_RE.match(user_text):
            self._approval_store.log(
                pending.skill, pending.input_text, pending.draft,
                "REJECTED_BY_USER",
            )
            # Phase 4: close the lifecycle run - discarded, nothing ran.
            self._supervisor.reject_approved_run(pending.run_id, pending.skill)
            self._pending_approval = None
            text = (
                "Okay, discarded. Nothing was posted."
                if pending.skill == "linkedin"
                else "Okay, discarded."
            )
            self.history.append(
                Message(role="assistant", content=text, ts=time.time())
            )
            self.set_state(ConversationState.SPEAKING)
            yield ChatChunk(delta=text, done=True)
            self.set_state(ConversationState.READY)
            return

        # Ambiguous reply while something is pending - don't guess in
        # either direction, don't silently drop the pending item.
        if pending.skill == "linkedin":
            text = (
                "I've still got a draft waiting on your approval. "
                "Say 'yes' to post it or 'no' to discard it."
            )
        else:
            text = (
                "I've still got something waiting on your approval. "
                "Say 'approve' to accept it or 'reject' to discard it."
            )
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
