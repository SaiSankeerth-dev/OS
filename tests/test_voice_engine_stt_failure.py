import asyncio
from server.conversation.manager import ChatChunk
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.engine import VoiceEngine
from server.voice.states import VoiceState
from server.tts.mock import MockTTS


class _StubVAD:
    def is_speech(self, audio: bytes) -> bool:
        return True


class _BoomSTT:
    async def transcribe(self, a):
        raise RuntimeError("stt down")


class _CM:
    async def respond_text(self, t):
        yield ChatChunk(delta="never", done=True)


def test_stt_failure_returns_to_listening():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_CM(),
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_StubVAD(),
        stt=_BoomSTT(),
        tts=MockTTS(),
        audio_output=out,
    )

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.05)
        await engine.stop()
        try:
            await task
        except asyncio.CancelledError:
            pass

    asyncio.run(go())
    history = engine.state_history()
    assert VoiceState.LISTENING in history
    assert engine.state.value == "IDLE"
    assert out.played == []