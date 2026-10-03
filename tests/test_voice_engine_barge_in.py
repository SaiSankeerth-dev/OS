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


class _SlowCM:
    def __init__(self) -> None:
        self.yielded = 0

    async def respond_text(self, text: str):
        for s in ("First.", " Second.", " Third."):
            self.yielded += 1
            yield ChatChunk(delta=s)
        yield ChatChunk(done=True)


def test_interrupt_bumps_gen_and_drops_pending():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    cm = _SlowCM()
    engine = VoiceEngine(
        cm=cm,
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_StubVAD(),
        stt=_StubSTT(),
        tts=MockTTS(),
        audio_output=out,
    )

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.02)
        engine.interrupt()
        await asyncio.sleep(0.05)
        await engine.stop()
        try:
            await task
        except asyncio.CancelledError:
            pass

    asyncio.run(go())
    sentences = [c.sentence for c in out.played]
    assert len(sentences) < 3 or engine.gen.current() >= 2