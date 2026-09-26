"""Pocket TTS engine — local TTS via pocket_tts.TTSModel.

Honest loading semantics (adapted from OpenJarvis's backend pattern,
https://github.com/open-jarvis/OpenJarvis, Apache-2.0,
src/openjarvis/speech/faster_whisper.py):

- Model loading is lazy and explicit via `_ensure_model()`.
- Load failures are recorded in `_last_error` — never swallowed silently.
- `is_ready()` is True only when a model is actually loaded.
- `speak()` raises RuntimeError with the real cause when the model is
  unavailable, instead of returning fake silence.
"""
from __future__ import annotations

import logging
import os
import struct
from typing import AsyncIterator, Optional

from .base import TTSEngine, TTSCard

log = logging.getLogger("os.tts.pocket")


class PocketTTSEngine(TTSEngine):
    name = "pocket-tts"

    def __init__(
        self,
        model_state_path: str | None = None,
        model_config_path: str | None = None,
        voice: str | None = None,
    ) -> None:
        # Lazy on purpose: constructing the engine must never download weights or
        # raise. Any load failure is recorded in _last_error and raised (with its
        # real cause) at speak() time — never masked as silence.
        #
        # model_config_path: YAML config whose weights/tokenizer entries point at
        #   local files — for offline use or custom weights. Also honored via
        #   POCKET_TTS_CONFIG. (With a custom config, use a wav file for the voice;
        #   predefined voice names only work with the stock language configs.)
        # model_state_path: legacy positional override (kept for API compat).
        # voice: predefined voice name (e.g. "alba") or a path to a .wav voice
        #   prompt. Defaults to "alba". Also honored via POCKET_TTS_VOICE.
        self._state_path = model_state_path
        self._config_path = model_config_path or os.environ.get("POCKET_TTS_CONFIG")
        self._voice = voice or os.environ.get("POCKET_TTS_VOICE") or "alba"
        self._model = None
        self._voice_state = None
        self._sample_rate: int = 24000  # updated on successful load
        self._last_error: Optional[str] = None

    # ---------- loading ----------

    def _ensure_model(self):
        """Load the model on first use; raise with a clear cause on failure."""
        if self._model is not None:
            return self._model
        try:
            from pocket_tts import TTSModel
        except ImportError as exc:
            self._last_error = (
                "pocket_tts is not installed. Install with: pip install pocket-tts"
            )
            raise RuntimeError(self._last_error) from exc
        try:
            if self._config_path:
                self._model = TTSModel.load_model(config=self._config_path)
            elif self._state_path:
                self._model = TTSModel.load_model(self._state_path)
            else:
                self._model = TTSModel.load_model()
            self._sample_rate = int(getattr(self._model, "sample_rate", 24000))
            self._last_error = None
            log.info("PocketTTS model loaded (sample_rate=%d)", self._sample_rate)
        except Exception as exc:
            self._last_error = f"Pocket TTS model failed to load: {exc}"
            log.error(self._last_error, exc_info=True)
            self._model = None
            raise RuntimeError(self._last_error) from exc
        return self._model

    def is_ready(self) -> bool:
        """True only when the model is actually loaded (no silent stubs)."""
        return self._model is not None

    def last_error(self) -> Optional[str]:
        """Return the last model load/synthesis error, if any."""
        return self._last_error

    def status(self) -> dict:
        """Machine-readable health report for diagnostics/UIs."""
        return {
            "engine": self.name,
            "ready": self.is_ready(),
            "sample_rate": self._sample_rate,
            "voice": self._voice,
            "model_path": self._state_path,
            "model_config_path": self._config_path,
            "last_error": self._last_error,
        }

    # ---------- synthesis ----------

    def speak(self, text: str) -> bytes:
        """Synthesize full text to int16 PCM bytes.

        Raises RuntimeError if the model is not loaded — callers must check
        is_ready()/status() and handle the failure explicitly.
        """
        model = self._ensure_model()
        try:
            state = self._ensure_voice_state(model)
            audio = model.generate_audio(state, text, copy_state=True)
        except Exception as exc:
            self._last_error = f"Pocket TTS synthesis failed: {exc}"
            log.error(self._last_error, exc_info=True)
            raise RuntimeError(self._last_error) from exc
        return self._to_pcm16(audio)

    def _ensure_voice_state(self, model):
        """Build (once) the voice-prompt state used for every generation."""
        if self._voice_state is not None:
            return self._voice_state
        try:
            # A predefined voice name ("alba", ...) resolves to a precomputed
            # state; a file path is encoded fresh through the model's mimi.
            self._voice_state = model.get_state_for_audio_prompt(self._voice)
        except Exception as exc:
            raise RuntimeError(
                f"Pocket TTS voice {self._voice!r} failed: {exc} "
                "(set POCKET_TTS_VOICE to a predefined voice name or a local .wav)"
            ) from exc
        return self._voice_state

    async def synthesize(self, text: str) -> bytes:
        return self.speak(text)

    async def stream(self, text: str) -> AsyncIterator[TTSCard]:
        yield TTSCard(delta=self.speak(text), sample_rate=self._sample_rate, done=True)

    def stop(self) -> None:
        return None

    # ---------- helpers ----------

    def _to_pcm16(self, audio) -> bytes:
        import numpy as np

        # torch.Tensor [channels, samples] from generate_audio()
        if hasattr(audio, "detach") and hasattr(audio, "cpu"):
            arr = audio.detach().cpu().numpy()
            if arr.ndim == 2:
                arr = arr[0]  # first channel
            pcm = (np.clip(arr, -1.0, 1.0) * 32767).astype(np.int16)
            return pcm.tobytes()
        if isinstance(audio, np.ndarray):
            if audio.dtype != np.int16:
                audio = (np.clip(audio, -1.0, 1.0) * 32767).astype(np.int16)
            return audio.tobytes()
        if isinstance(audio, (bytes, bytearray)):
            return bytes(audio)
        raise RuntimeError(
            f"Pocket TTS returned unexpected audio type: {type(audio).__name__}"
        )

    @staticmethod
    def silence(duration: float, sample_rate: int = 24000) -> bytes:
        """Explicit silence generator — use deliberately, never as a hidden fallback."""
        n = int(sample_rate * duration)
        return struct.pack(f"<{n}h", *([0] * n))
