"""VAD service — Silero VAD with energy-based fallback.

Phase 3: Silero VAD integration.
Phase 5-7: Real-time turn detection, barge-in.

The engine-facing API is `is_speech(audio: bytes)` (int16 PCM mono bytes).
`detect_speech(np.ndarray)` / `detect_end_of_speech(np.ndarray)` are kept
for backward compatibility.

If the `silero_vad` package (or torch) is unavailable, the service falls
back to energy-based detection and reports `backend == "energy"` — the
fallback is explicit, never silent.
"""
from __future__ import annotations

import logging
from typing import Optional

import numpy as np

log = logging.getLogger("os.voice.vad")

_SILERO_WINDOW = 512  # samples per Silero inference window at 16kHz


class VADService:
    """Voice Activity Detection.

    Determines: are you speaking? did you stop? did you start speaking again?
    (Section 4 of the plan: VAD responsibilities)
    """

    def __init__(
        self,
        sampling_rate: int = 16000,
        *,
        threshold: float = 0.5,
        use_silero: bool = True,
        energy_threshold: float = 0.02,
    ) -> None:
        self.sampling_rate = sampling_rate
        self.threshold = threshold
        self._energy_threshold = energy_threshold
        self._model = None
        self._torch = None
        self._backend = "energy"
        self._buf = np.zeros(0, dtype=np.float32)

        if use_silero:
            try:
                self._load_silero()
            except Exception as exc:
                log.warning(
                    "Silero VAD unavailable (%s); using energy fallback.", exc
                )

    def _load_silero(self) -> None:
        import torch  # noqa: F401  (kept for inference below)
        from silero_vad import load_silero_vad

        self._torch = torch
        self._model = load_silero_vad()
        self._model.eval()
        self._backend = "silero"
        log.info("Silero VAD loaded.")

    @property
    def backend(self) -> str:
        """Which detector is active: 'silero' or 'energy'."""
        return self._backend

    # ---------- engine-facing API ----------

    def is_speech(self, audio: bytes) -> bool:
        """Return True if the PCM16 mono chunk contains speech."""
        if not audio:
            return False
        samples = np.frombuffer(audio, dtype=np.int16).astype(np.float32) / 32768.0
        if self._backend == "silero":
            return self._silero_is_speech(samples)
        return self._energy_is_speech(samples)

    def _silero_is_speech(self, samples: np.ndarray) -> bool:
        # Accumulate into 512-sample windows; speech if any window exceeds threshold.
        self._buf = np.concatenate([self._buf, samples])
        speech = False
        torch = self._torch
        with torch.no_grad():
            while len(self._buf) >= _SILERO_WINDOW:
                window = self._buf[:_SILERO_WINDOW]
                self._buf = self._buf[_SILERO_WINDOW:]
                tensor = torch.from_numpy(window).unsqueeze(0)
                prob = float(self._model(tensor, self.sampling_rate).item())
                if prob > self.threshold:
                    speech = True
        # Keep the tail (unprocessed remainder) bounded.
        if len(self._buf) > _SILERO_WINDOW:
            self._buf = self._buf[-_SILERO_WINDOW:]
        return speech

    def _energy_is_speech(self, samples: np.ndarray) -> bool:
        rms = float(np.sqrt(np.mean(samples ** 2))) if samples.size else 0.0
        return rms > self._energy_threshold

    # ---------- legacy numpy API (backward compatible) ----------

    def detect_speech(self, audio_chunk: np.ndarray) -> bool:
        """Detect if audio chunk contains speech (legacy numpy API)."""
        if audio_chunk.ndim > 1:
            audio_chunk = np.mean(audio_chunk, axis=1)
        if audio_chunk.dtype != np.float32:
            # Assume int16 PCM if integer, else raw float samples.
            if np.issubdtype(audio_chunk.dtype, np.integer):
                samples = audio_chunk.astype(np.float32) / 32768.0
            else:
                samples = audio_chunk.astype(np.float32)
        else:
            samples = audio_chunk
        if self._backend == "silero":
            return self._silero_is_speech(samples)
        return self._energy_is_speech(samples)

    def detect_end_of_speech(self, audio_chunk: np.ndarray) -> bool:
        """Detect if audio chunk marks end of speech (legacy numpy API)."""
        return not self.detect_speech(audio_chunk)
