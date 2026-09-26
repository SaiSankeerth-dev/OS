"""STT service.

Phase 3: faster-whisper integration.
Phase 5-7: Streaming STT, state machine integration.

Implements the `server/voice/stt_base.py` interface:
- `transcribe(audio_bytes: bytes) -> Transcript` (int16 PCM mono @16kHz;
  a file path string is also accepted for convenience).
- `stream(audio_chunks)` — VAD-gated chunked streaming transcription:
  speech segments are accumulated and transcribed when end-of-utterance
  (silence) is detected.

Model loading follows the lazy `_ensure_model()` pattern with explicit
`_last_error` tracking (adapted from OpenJarvis, Apache-2.0,
src/openjarvis/speech/faster_whisper.py) — failures surface as
RuntimeError with the real cause, never as silent empty transcripts.
"""
from __future__ import annotations

import inspect
import io
import logging
import os
import tempfile
import wave
from dataclasses import dataclass
from typing import AsyncIterator, Union

from .stt_base import Transcript

log = logging.getLogger("os.voice.stt")


@dataclass
class STTServiceConfig:
    """Configuration for STT service."""
    model_size: str = "small"  # tiny, base, small, medium, large-v3, large-v3-turbo
    device: str = "cpu"  # cpu, cuda, auto
    compute_type: str = "int8"  # int8, float16, float32
    language: str | None = None  # None = auto-detect, or "en", "zh", etc.
    beam_size: int = 5
    vad_filter: bool = True
    sample_rate: int = 16000
    # Streaming segmentation tuning
    end_silence_ms: int = 700  # silence after speech => end of utterance
    max_segment_ms: int = 15000  # hard cap per transcribed segment
    chunk_ms: int = 64  # expected chunk duration (for silence accounting)


class STTService:
    """Speech-to-Text.

    Determines: what did you say? (Section 4 of the plan)
    Uses faster-whisper for local transcription.
    """

    def __init__(self, cfg: STTServiceConfig | None = None) -> None:
        self.cfg = cfg or STTServiceConfig()
        self.model = None
        self._last_error: str | None = None

    # ---------- model loading ----------

    def _ensure_model(self):
        """Lazy-load the faster-whisper model; raise with cause on failure."""
        if self.model is not None:
            return self.model
        try:
            import faster_whisper
        except ImportError as exc:
            self._last_error = (
                "faster-whisper is not installed. Install with: pip install faster-whisper"
            )
            raise RuntimeError(self._last_error) from exc
        try:
            self.model = faster_whisper.WhisperModel(
                self.cfg.model_size,
                device=self.cfg.device,
                compute_type=self.cfg.compute_type,
            )
        except Exception as exc:
            self._last_error = f"faster-whisper model failed to load: {exc}"
            log.error(self._last_error, exc_info=True)
            self.model = None
            raise RuntimeError(self._last_error) from exc
        self._last_error = None
        log.info(
            "faster-whisper loaded: model=%s device=%s compute=%s",
            self.cfg.model_size, self.cfg.device, self.cfg.compute_type,
        )
        return self.model

    def is_ready(self) -> bool:
        return self.model is not None

    def last_error(self) -> str | None:
        return self._last_error

    # ---------- transcription ----------

    def transcribe(self, audio: Union[bytes, str]) -> Transcript:
        """Transcribe int16 PCM mono bytes (16kHz) or a file path.

        Raises RuntimeError if the model cannot be loaded or transcription
        fails — callers see the real cause, never a silent empty result.
        """
        model = self._ensure_model()
        if isinstance(audio, str):
            audio_path = audio
            tmp_to_unlink = None
        else:
            if not audio:
                raise RuntimeError("transcribe() received empty audio")
            tmp_to_unlink = self._pcm_bytes_to_wav_file(
                audio, sample_rate=self.cfg.sample_rate
            )
            audio_path = tmp_to_unlink
        try:
            segments, info = model.transcribe(
                audio_path,
                language=self.cfg.language,
                beam_size=self.cfg.beam_size,
                vad_filter=self.cfg.vad_filter,
            )
            full_text = " ".join(seg.text for seg in segments).strip()
        except Exception as exc:
            self._last_error = f"faster-whisper transcription failed: {exc}"
            log.error(self._last_error, exc_info=True)
            raise RuntimeError(self._last_error) from exc
        finally:
            if tmp_to_unlink:
                try:
                    os.unlink(tmp_to_unlink)
                except OSError:
                    pass
        self._last_error = None
        return Transcript(
            text=full_text,
            is_final=True,
            confidence=getattr(info, "language_probability", 1.0),
        )

    async def stream(self, audio_chunks) -> AsyncIterator[Transcript]:
        """VAD-gated chunked streaming transcription.

        `audio_chunks` may be a sync or async iterable of int16 PCM mono
        byte chunks. Speech segments are buffered; when `end_silence_ms`
        of silence follows speech (or `max_segment_ms` is reached), the
        segment is transcribed and yielded as a final Transcript.
        """
        from .vad import VADService

        vad = VADService(
            sampling_rate=self.cfg.sample_rate, use_silero=False
        )  # energy gating is cheap and sufficient for segmentation

        buf = bytearray()
        in_speech = False
        silence_ms = 0
        speech_ms = 0

        iterator = (
            audio_chunks.__aiter__()
            if hasattr(audio_chunks, "__aiter__")
            else _aiter_sync(audio_chunks)
        )
        async for chunk in iterator:
            if not chunk:
                continue
            is_speech = vad.is_speech(chunk)
            if is_speech:
                if not in_speech:
                    in_speech = True
                    speech_ms = 0
                silence_ms = 0
                speech_ms += self.cfg.chunk_ms
                buf.extend(chunk)
                if speech_ms >= self.cfg.max_segment_ms:
                    yield self.transcribe(bytes(buf))
                    buf.clear()
                    in_speech = False
                    silence_ms = 0
            else:
                if in_speech:
                    silence_ms += self.cfg.chunk_ms
                    buf.extend(chunk)
                    if silence_ms >= self.cfg.end_silence_ms:
                        text_seg = bytes(buf)
                        buf.clear()
                        in_speech = False
                        silence_ms = 0
                        transcript = self.transcribe(text_seg)
                        if transcript.text:
                            yield transcript
        # Flush any trailing speech at end of stream.
        if buf and in_speech:
            transcript = self.transcribe(bytes(buf))
            if transcript.text:
                yield transcript

    # ---------- helpers ----------

    @staticmethod
    def _pcm_bytes_to_wav_file(pcm: bytes, sample_rate: int) -> str:
        """Write int16 PCM mono bytes to a temp WAV file; return its path."""
        tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        try:
            with tmp:
                with wave.open(tmp, "wb") as wf:
                    wf.setnchannels(1)
                    wf.setsampwidth(2)
                    wf.setframerate(sample_rate)
                    wf.writeframes(pcm)
        except Exception:
            try:
                os.unlink(tmp.name)
            except OSError:
                pass
            raise
        return tmp.name


async def _aiter_sync(sync_iterable):
    for item in sync_iterable:
        yield item
