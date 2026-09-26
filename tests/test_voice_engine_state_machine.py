import asyncio
from server.conversation.manager import ChatChunk
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.engine import VoiceEngine
from server.voice.states import VoiceState
from server.tts.mock import MockTTS


class _StubSTT:
    async def transcribe(self, audio: bytes) -> str:
        return "hello"


class _StubVAD:
    def is_speech(self, audio: bytes) -> bool:
        return audio != b"\x00" * 64


class _StubCM:
    async def respond_text(self, text: str):
        yield ChatChunk(delta="Hi there.", done=True)


async def _drive(engine: VoiceEngine) -> None:
    inp_task = asyncio.create_task(engine.start_listening())
    await asyncio.sleep(0.05)
    await engine.stop()
    try:
        await inp_task
    except asyncio.CancelledError:
        pass


def test_full_turn_state_progression():
    # Speech chunks + trailing silence so the utterance flushes.
    inp = MockAudioInput([b"x", b"y"] + [b"\x00" * 64] * 12)
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_StubCM(),
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_StubVAD(),
        stt=_StubSTT(),
        tts=MockTTS(),
        audio_output=out,
    )
    asyncio.run(_drive(engine))
    history = engine.state_history()
    for s in (VoiceState.LISTENING, VoiceState.THINKING,
              VoiceState.SPEAKING, VoiceState.IDLE):
        assert s in history, f"missing {s} in {history}"
    assert history[-1] == VoiceState.IDLE