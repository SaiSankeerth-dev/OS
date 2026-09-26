"""Smoke test: voice engine + conversation engine with mocks."""
import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config
from server.conversation.manager import ChatChunk
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.tools.datetime_tool import DATETIME_SPEC, format_datetime, get_current_datetime
from server.response.policy import ResponsePolicy
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.engine import VoiceEngine
from server.voice.states import VoiceState
from server.tts.mock import MockTTS


class _StubSTT:
    async def transcribe(self, a):
        return "what time is it?"


class _StubVAD:
    def is_speech(self, a):
        return True


async def main():
    cfg = load_config()
    cm = ConversationManager(cfg) if False else None  # see below
    # ConversationManager requires a router
    from server.conversation.manager import ConversationManager as CM
    cm = CM(
        cfg,
        intent_router=IntentRouter(),
        tool_registry=ToolRegistry(),
        response_policy=ResponsePolicy(forbidden_prefixes=cfg.personality.forbidden_phrases),
    )
    reg = cm.tool_registry
    reg.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    eng = VoiceEngine(
        cm=cm, audio_input=inp, aec=PassthroughAEC(),
        vad=_StubVAD(), stt=_StubSTT(), tts=MockTTS(), audio_output=out,
    )
    task = asyncio.create_task(eng.start_listening())
    await asyncio.sleep(0.2)
    await eng.stop()
    try:
        await task
    except asyncio.CancelledError:
        pass
    print(f"final state: {eng.state.value}")
    print(f"played cards: {[c.sentence for c in out.played]}")
    print(f"history: {[s.value for s in eng.state_history()]}")


if __name__ == "__main__":
    asyncio.run(main())