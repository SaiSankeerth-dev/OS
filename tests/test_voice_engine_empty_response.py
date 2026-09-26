import asyncio
from server.conversation.manager import ChatChunk
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.engine import VoiceEngine
from server.tts.mock import MockTTS


class _StubSTT:
    async def transcribe(self, audio: bytes) -> str:
        return "hello"


class _StubVAD:
    def is_speech(self, audio: bytes) -> bool:
        return True


class _EmptyCM:
    async def respond_text(self, t):
        if False:
            yield
        return


def test_empty_llm_response_speaks_fallback():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_EmptyCM(),
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_StubVAD(),
        stt=_StubSTT(),
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
    sentences = [c.sentence for c in out.played]
    assert any("didn't catch" in s for s in sentences)