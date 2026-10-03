"""AEC Protocol + implementations.

AEC (Acoustic Echo Cancellation) removes speaker/reference audio from the
microphone capture.

- `PassthroughAEC`: v1 no-op (returns mic bytes unchanged).
- `NlmsAEC`: real acoustic echo cancellation using a Normalized Least Mean
  Squares (NLMS) adaptive FIR filter in numpy. The filter learns the
  room impulse response from the speaker reference signal and subtracts
  the predicted echo from the microphone signal.

Both satisfy the `AEC` Protocol, so VoiceEngine needs no changes to swap.
"""
from __future__ import annotations

import collections
import logging
from typing import Protocol

import numpy as np

log = logging.getLogger("os.voice.aec")


class AEC(Protocol):
    def process(self, mic_chunk: bytes, speaker_ref: bytes | None = None) -> bytes: ...


class PassthroughAEC:
    """v1 AEC: returns mic bytes unchanged."""

    def process(self, mic_chunk: bytes, speaker_ref: bytes | None = None) -> bytes:
        return mic_chunk


class NlmsAEC:
    """NLMS adaptive-filter acoustic echo canceller.

    Args:
        sample_rate: audio sample rate (Hz). Mic and reference must match.
        filter_len: number of FIR taps (~16ms of room response at 16kHz
            with 256 taps; increase for reverberant rooms).
        mu: adaptation step size in (0, 2); 0.5 is a safe default.
        eps: regularization to avoid division by zero.

    Chunks are int16 PCM mono bytes. `speaker_ref` should be the audio
    recently played through the speaker, time-aligned as closely as
    possible with the mic capture. When no reference is available the
    mic audio is returned unchanged (safe no-op, not silence).
    """

    def __init__(
        self,
        *,
        sample_rate: int = 16000,
        filter_len: int = 256,
        mu: float = 0.5,
        eps: float = 1e-6,
    ) -> None:
        if not 0.0 < mu < 2.0:
            raise ValueError("mu must be in (0, 2)")
        self.sample_rate = sample_rate
        self.filter_len = filter_len
        self.mu = mu
        self.eps = eps
        self._w = np.zeros(filter_len, dtype=np.float64)
        # Continuous reference history buffer across chunk boundaries
        self._ref_buffer = np.zeros(filter_len, dtype=np.float64)
        self._adapted_chunks = 0

    @property
    def adapted_chunks(self) -> int:
        return self._adapted_chunks

    def reset(self) -> None:
        """Forget the learned room response (e.g. on device change)."""
        self._w[:] = 0.0
        self._ref_buffer[:] = 0.0
        self._adapted_chunks = 0

    def process(self, mic_chunk: bytes, speaker_ref: bytes | None = None) -> bytes:
        if not mic_chunk:
            return mic_chunk
        if not speaker_ref:
            # No reference -> cannot cancel; return mic unchanged.
            return mic_chunk

        mic = np.frombuffer(mic_chunk, dtype=np.int16).astype(np.float64) / 32768.0
        ref = np.frombuffer(speaker_ref, dtype=np.int16).astype(np.float64) / 32768.0

        # Align lengths; zero-pad the shorter side.
        n = len(mic)
        if len(ref) < n:
            ref = np.pad(ref, (0, n - len(ref)))
        else:
            ref = ref[:n]

        out = np.empty(n, dtype=np.float64)
        w = self._w
        mu = self.mu
        eps = self.eps
        L = self.filter_len

        # Concatenate past history buffer with new reference audio
        extended_ref = np.concatenate((self._ref_buffer, ref))
        # Keep last L samples for the next chunk
        self._ref_buffer = extended_ref[-L:].copy()

        # Build strided sliding window view across the reference samples
        from numpy.lib.stride_tricks import sliding_window_view
        windows = sliding_window_view(extended_ref, window_shape=L)
        # Windows: windows[1 : n + 1] has n windows ending at ref[0]..ref[n-1]
        # Reverse along columns so w[0] multiplies the most recent sample
        X = windows[1 : n + 1, ::-1]

        # Vectorized energy norm across all sample windows in single C call
        norm_sq = np.sum(X * X, axis=1) + eps

        # Highly optimized loop without allocations
        for i in range(n):
            xi = X[i]
            y = float(np.dot(w, xi))
            e = mic[i] - y
            w += (mu * e / norm_sq[i]) * xi
            out[i] = e

        self._adapted_chunks += 1
        cleaned = np.clip(out * 32768.0, -32768, 32767).astype(np.int16)
        return cleaned.tobytes()
