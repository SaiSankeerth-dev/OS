import asyncio
from server.conversation.manager import ChatChunk
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.engine import VoiceEngine
from server.tts.base import TTSEngine


class _StubSTT:
    async def transcribe(self, audio: bytes) -> str:
        return "hello"


class _StubVAD:
    def is_speech(self, audio: bytes) -> bool:
        return True


class _BoomTTS(TTSEngine):
    name = "boom"

    async def synthesize(self, text: str) -> bytes:
        raise RuntimeError("tts kaboom")

    def speak(self, text: str) -> bytes:
        raise RuntimeError("tts kaboom")

    async def stream(self, text: str):
        raise RuntimeError("tts kaboom")
        yield  # pragma: no cover

    def stop(self) -> None:
        return None

    def is_ready(self) -> bool:
        return True


class _CM:
    async def respond_text(self, t):
        yield ChatChunk(delta="hi.", done=True)


def test_tts_failure_does_not_crash_engine():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_CM(),
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_StubVAD(),
        stt=_StubSTT(),
        tts=_BoomTTS(),
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
    assert engine.state.value == "IDLE"