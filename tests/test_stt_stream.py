"""Tests for STTService: bytes/path transcription plumbing and VAD-gated
streaming segmentation. The faster-whisper model is stubbed so these run
without downloading weights; a real-model test is skipped unless the
tiny model is cached locally."""
import asyncio

import numpy as np
import pytest

from server.voice.stt import STTService, STTServiceConfig
from server.voice.stt_base import Transcript

SR = 16000


def _speech_chunk(n: int = 1024, seed: int = 0) -> bytes:
    rng = np.random.default_rng(seed)
    t = np.arange(n) / SR
    sig = (np.sin(2 * np.pi * 150 * t) * 0.6 + rng.normal(0, 0.05, n)) * 20000
    return sig.astype(np.int16).tobytes()


def _silence_chunk(n: int = 1024) -> bytes:
    return np.zeros(n, dtype=np.int16).tobytes()


class _FakeModel:
    """Stands in for faster_whisper.WhisperModel."""

    def __init__(self):
        self.transcribe_calls: list[str] = []

    def transcribe(self, audio_path, **kwargs):
        self.transcribe_calls.append(audio_path)
        info = type("Info", (), {"language": "en", "language_probability": 0.99})()
        seg = type("Seg", (), {"text": "hello world"})()
        return [seg], info


@pytest.fixture()
def stubbed_stt(monkeypatch):
    stt = STTService(STTServiceConfig(model_size="tiny"))
    fake = _FakeModel()
    monkeypatch.setattr(stt, "_ensure_model", lambda: fake)
    stt.model = fake  # bypass lazy load
    return stt, fake


def test_transcribe_bytes_returns_transcript(stubbed_stt, tmp_path):
    stt, fake = stubbed_stt
    result = stt.transcribe(_speech_chunk(16000))
    assert isinstance(result, Transcript)
    assert result.text == "hello world"
    assert result.is_final is True
    assert len(fake.transcribe_calls) == 1
    assert fake.transcribe_calls[0].endswith(".wav")


def test_transcribe_path_passthrough(stubbed_stt, tmp_path):
    stt, fake = stubbed_stt
    p = tmp_path / "in.wav"
    p.write_bytes(b"RIFF....")
    result = stt.transcribe(str(p))
    assert result.text == "hello world"
    assert fake.transcribe_calls[0] == str(p)


def test_transcribe_empty_bytes_raises(stubbed_stt):
    stt, _ = stubbed_stt
    with pytest.raises(RuntimeError, match="empty audio"):
        stt.transcribe(b"")


def test_transcribe_surfaces_model_failure(monkeypatch):
    stt = STTService(STTServiceConfig(model_size="tiny"))

    def boom():
        raise RuntimeError("no model here")

    monkeypatch.setattr(stt, "_ensure_model", boom)
    with pytest.raises(RuntimeError, match="no model here"):
        stt.transcribe(_speech_chunk(16000))


def test_stream_segments_on_silence(stubbed_stt):
    """Speech, then enough silence, then speech -> two transcribed segments."""
    stt, fake = stubbed_stt
    stt.cfg.end_silence_ms = 700
    stt.cfg.chunk_ms = 64

    async def chunks():
        for i in range(12):  # ~0.77s of speech-like audio
            yield _speech_chunk(seed=i)
        for _ in range(12):  # ~0.77s of silence -> end of utterance
            yield _silence_chunk()
        for i in range(12, 24):
            yield _speech_chunk(seed=i)
        for _ in range(12):
            yield _silence_chunk()

    async def collect():
        return [t async for t in stt.stream(chunks())]

    results = asyncio.run(collect())
    assert len(results) == 2, f"expected 2 segments, got {len(results)}"
    assert all(r.text == "hello world" for r in results)
    assert all(r.is_final for r in results)


def test_stream_ignores_leading_silence(stubbed_stt):
    stt, fake = stubbed_stt
    stt.cfg.chunk_ms = 64

    async def chunks():
        for _ in range(20):
            yield _silence_chunk()

    async def collect():
        return [t async for t in stt.stream(chunks())]

    assert asyncio.run(collect()) == []
    assert fake.transcribe_calls == []


def test_stream_accepts_sync_iterable(stubbed_stt):
    stt, _ = stubbed_stt
    stt.cfg.chunk_ms = 64
    chunks = [_speech_chunk(seed=i) for i in range(12)] + [_silence_chunk()] * 12

    async def collect():
        return [t async for t in stt.stream(iter(chunks))]

    results = asyncio.run(collect())
    assert len(results) == 1


def test_stream_flushes_trailing_speech(stubbed_stt):
    """Speech at end of stream (no trailing silence) still gets transcribed."""
    stt, _ = stubbed_stt
    stt.cfg.chunk_ms = 64

    async def chunks():
        for i in range(8):
            yield _speech_chunk(seed=i)

    async def collect():
        return [t async for t in stt.stream(chunks())]

    results = asyncio.run(collect())
    assert len(results) == 1
    assert results[0].text == "hello world"

