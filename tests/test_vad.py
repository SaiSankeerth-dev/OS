"""Tests for VADService: Silero backend when available, energy fallback,
and legacy numpy API compatibility."""
import numpy as np
import pytest

from server.voice.vad import VADService

SR = 16000


def _speech_pcm(seconds: float = 1.0) -> bytes:
    t = np.arange(int(SR * seconds)) / SR
    sig = (
        0.5 * np.sin(2 * np.pi * 120 * t)
        + 0.3 * np.sin(2 * np.pi * 240 * t)
        + 0.2 * np.sin(2 * np.pi * 360 * t)
    ) * (0.5 + 0.5 * np.sin(2 * np.pi * 4 * t))
    return (sig * 20000).astype(np.int16).tobytes()


def _silence_pcm(seconds: float = 1.0) -> bytes:
    return np.zeros(int(SR * seconds), dtype=np.int16).tobytes()


def _noise_pcm(seconds: float = 1.0, amp: float = 60.0) -> bytes:
    rng = np.random.default_rng(0)
    return rng.normal(0, amp, int(SR * seconds)).astype(np.int16).tobytes()


# ---------- energy fallback (deterministic, no torch needed) ----------

def test_energy_backend_detects_speech():
    vad = VADService(sampling_rate=SR, use_silero=False)
    assert vad.backend == "energy"
    assert vad.is_speech(_speech_pcm()) is True


def test_energy_backend_rejects_silence():
    vad = VADService(sampling_rate=SR, use_silero=False)
    assert vad.is_speech(_silence_pcm()) is False


def test_energy_backend_rejects_quiet_noise():
    vad = VADService(sampling_rate=SR, use_silero=False)
    assert vad.is_speech(_noise_pcm()) is False


def test_energy_empty_bytes():
    vad = VADService(sampling_rate=SR, use_silero=False)
    assert vad.is_speech(b"") is False


def test_legacy_detect_speech_numpy_api():
    vad = VADService(sampling_rate=SR, use_silero=False)
    speech = np.frombuffer(_speech_pcm(), dtype=np.int16)
    silence = np.frombuffer(_silence_pcm(), dtype=np.int16)
    assert vad.detect_speech(speech) is True
    assert vad.detect_speech(silence) is False
    assert vad.detect_end_of_speech(silence) is True
    assert vad.detect_end_of_speech(speech) is False


def test_legacy_detect_speech_stereo():
    vad = VADService(sampling_rate=SR, use_silero=False)
    mono = np.frombuffer(_speech_pcm(), dtype=np.int16)
    stereo = np.stack([mono, mono], axis=1)
    assert vad.detect_speech(stereo) is True


# ---------- Silero backend (skipped when torch/silero missing) ----------

def _needs_silero():
    pytest.importorskip("torch", reason="torch not installed")
    pytest.importorskip("silero_vad", reason="silero-vad not installed")


def test_silero_backend_loads():
    _needs_silero()
    vad = VADService(sampling_rate=SR, use_silero=True)
    assert vad.backend == "silero"


def test_silero_detects_speech_not_silence():
    _needs_silero()
    vad = VADService(sampling_rate=SR, use_silero=True)
    assert vad.is_speech(_speech_pcm()) is True
    # Feed enough silence for the streaming tail to flush, then expect False.
    assert vad.is_speech(_silence_pcm()) in (True, False)  # tail may linger
    assert vad.is_speech(_silence_pcm()) is False


def test_silero_fresh_silence_is_not_speech():
    _needs_silero()
    vad = VADService(sampling_rate=SR, use_silero=True)
    assert vad.is_speech(_silence_pcm()) is False
