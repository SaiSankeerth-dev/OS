"""Regression test: the engine must buffer VAD-positive chunks into a full
utterance and transcribe it ONCE (not once per 64ms chunk).

Background: start_listening used to call stt.transcribe() on every single
chunk. Whisper cannot decode a 64ms fragment, so transcripts came back empty
and JARVIS never answered on real hardware.
"""
import asyncio

from server.conversation.manager import ChatChunk
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.engine import VoiceEngine
from server.voice.states import VoiceState
from server.tts.mock import MockTTS


SPEECH = b"\x01" * 64
SILENCE = b"\x00" * 64


class _ContentVAD:
    """Speech only for chunks that look like speech."""

    def is_speech(self, audio: bytes) -> bool:
        return audio == SPEECH


class _RecordingSTT:
    cfg = None  # engine falls back to default segmentation timings

    def __init__(self):
        self.calls: list[bytes] = []

    async def transcribe(self, audio: bytes):
        self.calls.append(audio)
        return "hello jarvis"


class _CM:
    def __init__(self):
        self.heard: list[str] = []

    async def respond_text(self, text: str):
        self.heard.append(text)
        yield ChatChunk(delta="At your service.", done=True)


def test_utterance_buffered_and_transcribed_once():
    # 5 speech chunks, then 12 silent chunks (12*64ms=768ms > 700ms end-silence)
    chunks = [SPEECH] * 5 + [SILENCE] * 12
    inp = MockAudioInput(chunks)
    out = MockAudioOutput()
    stt = _RecordingSTT()
    cm = _CM()
    engine = VoiceEngine(
        cm=cm,
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_ContentVAD(),
        stt=stt,
        tts=MockTTS(),
        audio_output=out,
    )

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.3)
        await engine.stop()
        try:
            await task
        except asyncio.CancelledError:
            pass

    asyncio.run(go())

    # Exactly one transcription, containing the whole utterance (speech + tail).
    assert len(stt.calls) == 1, f"expected 1 transcribe call, got {len(stt.calls)}"
    assert stt.calls[0].startswith(SPEECH * 5)
    # The transcript reached the conversation manager and got spoken.
    assert cm.heard == ["hello jarvis"]
    assert out.played, "expected TTS audio to be played back"
    history = engine.state_history()
    assert VoiceState.USER_SPEAKING in history
    assert VoiceState.SPEAKING in history
