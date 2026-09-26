"""Tests for automatic barge-in: user speech detected while the engine is
SPEAKING (playing TTS) must trigger VoiceEngine.interrupt() without any
external call."""
import asyncio

import numpy as np

from server.conversation.manager import ChatChunk
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput
from server.voice.engine import VoiceEngine
from server.voice.states import VoiceState
from server.tts.mock import MockTTS


class _SpeechVAD:
    """VAD stub that reports speech for loud chunks, silence otherwise."""

    def is_speech(self, audio: bytes) -> bool:
        if not audio:
            return False
        arr = np.frombuffer(audio, dtype=np.int16).astype(np.float64)
        return float(np.sqrt(np.mean(arr ** 2))) > 1000


class _StubSTT:
    async def transcribe(self, audio: bytes) -> str:
        return "hello"


class _SlowCM:
    async def respond_text(self, text: str):
        for s in ("First sentence here.", " Second sentence here.", " Third."):
            yield ChatChunk(delta=s)
        yield ChatChunk(delta="", done=True)


class _SlowOutput:
    """AudioOutput that plays slowly so the barge-in monitor gets mic time."""

    def __init__(self) -> None:
        self.played: list = []
        self.stopped = False

    async def play(self, card) -> None:
        self.played.append(card)
        await asyncio.sleep(0.25)

    def stop(self) -> None:
        self.stopped = True


def _loud_chunk(seed: int = 0, n: int = 1024) -> bytes:
    rng = np.random.default_rng(seed)
    return (rng.normal(0, 8000, n)).astype(np.int16).tobytes()


def _quiet_chunk(n: int = 1024) -> bytes:
    return np.zeros(n, dtype=np.int16).tobytes()


def test_auto_barge_in_interrupts_playback():
    """Speech on the mic during SPEAKING triggers interrupt() automatically."""
    # Trigger phrase first (loud), then continuous loud chunks during playback.
    mic_chunks = [_loud_chunk(0)] + [_loud_chunk(i) for i in range(1, 40)]
    engine = VoiceEngine(
        cm=_SlowCM(),
        audio_input=MockAudioInput(mic_chunks),
        aec=PassthroughAEC(),
        vad=_SpeechVAD(),
        stt=_StubSTT(),
        tts=MockTTS(),
        audio_output=_SlowOutput(),
        barge_in_chunks=3,
    )
    interrupted = []

    orig_interrupt = engine.interrupt

    def spy_interrupt():
        interrupted.append(True)
        return orig_interrupt()

    engine.interrupt = spy_interrupt

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(2.5)
        await engine.stop()
        try:
            await task
        except asyncio.CancelledError:
            pass

    asyncio.run(go())
    assert interrupted, "barge-in never triggered interrupt()"
    assert VoiceState.LISTENING in engine.state_history()


def test_no_barge_in_on_silence():
    """Silence during playback must NOT trigger interrupt()."""
    mic_chunks = [_loud_chunk(0)] + [_quiet_chunk()] * 40
    engine = VoiceEngine(
        cm=_SlowCM(),
        audio_input=MockAudioInput(mic_chunks),
        aec=PassthroughAEC(),
        vad=_SpeechVAD(),
        stt=_StubSTT(),
        tts=MockTTS(),
        audio_output=_SlowOutput(),
        barge_in_chunks=3,
    )
    interrupted = []
    orig_interrupt = engine.interrupt

    def spy_interrupt():
        interrupted.append(True)
        return orig_interrupt()

    engine.interrupt = spy_interrupt

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(2.5)
        await engine.stop()
        try:
            await task
        except asyncio.CancelledError:
            pass

    asyncio.run(go())
    assert not interrupted, "silence wrongly triggered barge-in"
    assert len(engine.audio_output.played) == 3


def test_interrupt_ungates_mic():
    engine = VoiceEngine(
        cm=_SlowCM(),
        audio_input=MockAudioInput([]),
        aec=PassthroughAEC(),
        vad=_SpeechVAD(),
        stt=_StubSTT(),
        tts=MockTTS(),
        audio_output=_SlowOutput(),
    )
    engine.enter_speaking()
    assert engine._mic_gated is True
    engine.interrupt()
    assert engine._mic_gated is False
    assert engine.state == VoiceState.LISTENING
