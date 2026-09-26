"""Conversation Manager — central orchestrator."""
from __future__ import annotations

import enum
import logging
import time
from dataclasses import dataclass
from pathlib import Path
from typing import AsyncIterator

from config import Config
from ..llm.base import ChatChunk, Message
from ..llm.router import ModelRouter
from ..memory.base import MemoryManager
from ..memory.retriever import MemoryRetriever
from ..tools.datetime_tool import (
    DATETIME_SPEC,
    format_datetime,
    get_current_datetime,
)
from ..tools.system_info_tool import (
    SYSTEM_INFO_SPEC,
    format_system_info,
    get_system_info,
)
from ..utils import PerfTrace
from ..intent.registry import ExecutionMode, ToolRegistry
from ..intent.router import Intent, IntentRouter
from ..response.policy import ResponsePolicy
from .context import build_context_messages
from .personality import build_system_prompt


log = logging.getLogger("os.conversation")


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


def _default_registry() -> ToolRegistry:
    reg = ToolRegistry()
    reg.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    reg.register(SYSTEM_INFO_SPEC, get_system_info, format_system_info)
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
    ) -> None:
        self.cfg = cfg
        self.state: ConversationState = ConversationState.IDLE
        self.history: list[Message] = []
        self.router = router or ModelRouter.from_config(
            base_url=cfg.llm.base_url,
            model=cfg.llm.model,
            timeout_sec=float(cfg.llm.request_timeout_sec),
        )
        self.intent_router = intent_router or IntentRouter()
        self.tool_registry = tool_registry or _default_registry()
        self.response_policy = response_policy or ResponsePolicy(
            forbidden_prefixes=cfg.personality.forbidden_phrases
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

        decision = self.intent_router.classify(user_text)
        self.history.append(Message(role="user", content=user_text, ts=time.time()))

        if decision.intent == Intent.TOOL_CALL and decision.tool_name:
            async for chunk in self._handle_tool(
                decision.tool_name, user_text, perf
            ):
                yield chunk
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        if decision.intent == Intent.TASK:
            fr = self.response_policy.apply_llm_chat(
                "I'll handle tasks in a later phase."
            )
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
            yield ChatChunk(delta=fr.text, done=True)
            self.set_state(ConversationState.READY)
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        async for chunk in self._handle_llm_chat(user_text, perf):
            yield chunk

    async def _handle_tool(
        self, tool_name: str, user_text: str, perf: PerfTrace
    ):
        try:
            spec, _handler, formatter = self.tool_registry.get(tool_name)
        except KeyError:
            fr = self.response_policy.apply_llm_chat("")
            yield ChatChunk(delta=fr.text, done=True)
            return

        if spec.requires_memory and self.memory_retriever is not None:
            self.memory_retriever.retrieve_relevant(user_text, needs_memory=True)

        self.set_state(ConversationState.THINKING)
        result = self.tool_registry.execute(tool_name)
        perf.mark("tool_executed")

        if spec.execution_mode == ExecutionMode.DIRECT and formatter is not None:
            fr = self.response_policy.apply_direct(tool_name, result, formatter)
        else:
            fr = self.response_policy.apply_tool_then_llm(tool_name, result)

        self.history.append(
            Message(role="assistant", content=fr.text, ts=time.time())
        )
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=fr.text, done=True)
        self.set_state(ConversationState.READY)

    async def _handle_llm_chat(self, user_text: str, perf: PerfTrace):
        memories: list[str] = []
        if self.memory_retriever is not None:
            memories = self.memory_retriever.retrieve_relevant(user_text)

        sys_prompt = build_system_prompt(self.cfg.personality)
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
