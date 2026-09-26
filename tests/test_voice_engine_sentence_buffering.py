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
        return audio != b"\x00" * 64


class _MultiSentenceCM:
    async def respond_text(self, t):
        for piece in ("First. ", "Second. ", "Third."):
            yield ChatChunk(delta=piece)
        yield ChatChunk(done=True)


def test_three_sentences_yield_three_cards():
    # Speech chunks + trailing silence so the utterance flushes.
    inp = MockAudioInput([b"x", b"y"] + [b"\x00" * 64] * 12)
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_MultiSentenceCM(),
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
    assert "First." in sentences
    assert "Second." in sentences
    assert "Third." in sentences