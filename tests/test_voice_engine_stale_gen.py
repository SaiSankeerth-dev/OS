import asyncio
from server.conversation.manager import ChatChunk
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.audio_queue import AudioCard
from server.voice.engine import VoiceEngine
from server.tts.mock import MockTTS


class _StubSTT:
    async def transcribe(self, audio: bytes) -> str:
        return "hello"


class _StubVAD:
    def is_speech(self, audio: bytes) -> bool:
        return True


class _CM:
    async def respond_text(self, t):
        yield ChatChunk(delta="only.", done=True)


def test_stale_card_never_reaches_audio_output():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_CM(),
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_StubVAD(),
        stt=_StubSTT(),
        tts=MockTTS(),
        audio_output=out,
    )
    stale = AudioCard(gen_id=0, sentence="stale", samples=b"x")
    asyncio.run(engine.queue.put(stale))
    engine.gen.bump()
    engine.queue.set_gen(engine.gen.current())

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.05)
        await engine.stop()
        try:
            await task
        except asyncio.CancelledError:
            pass

    asyncio.run(go())
    assert all(c.sentence != "stale" for c in out.played)