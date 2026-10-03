"""Tests for real AEC: PassthroughAEC (unchanged) and NlmsAEC (new).

NlmsAEC is verified with synthetic echo: mic = attenuated delayed copy of
the speaker reference. After adaptation, residual echo energy must drop
substantially (ERLE check).
"""
import numpy as np
import pytest

from server.voice.aec import AEC, NlmsAEC, PassthroughAEC


def _pcm(arr: np.ndarray) -> bytes:
    return np.clip(arr, -32768, 32767).astype(np.int16).tobytes()


def _echo_pair(n_samples: int, delay: int = 40, atten: float = 0.5, seed: int = 7):
    rng = np.random.default_rng(seed)
    ref = rng.normal(0, 8000, n_samples)
    mic = np.concatenate([np.zeros(delay), ref[:-delay] * atten])
    return _pcm(mic), _pcm(ref)


def test_passthrough_returns_input_unchanged():
    aec = PassthroughAEC()
    assert aec.process(b"\x01\x02\x03") == b"\x01\x02\x03"


def test_passthrough_ignores_speaker_ref():
    aec = PassthroughAEC()
    assert aec.process(b"mic", speaker_ref=b"speaker") == b"mic"


def test_aec_is_a_protocol():
    assert hasattr(AEC, "process")


def test_nlms_satisfies_protocol():
    aec = NlmsAEC()
    assert hasattr(aec, "process")
    assert callable(aec.process)


def test_nlms_no_reference_returns_mic_unchanged():
    aec = NlmsAEC()
    mic, _ = _echo_pair(1024)
    assert aec.process(mic, None) == mic
    assert aec.process(mic) == mic


def test_nlms_empty_chunk():
    aec = NlmsAEC()
    assert aec.process(b"", b"ref") == b""


def test_nlms_cancels_synthetic_echo():
    sr = 16000
    aec = NlmsAEC(sample_rate=sr, filter_len=128, mu=0.5)
    # Adapt on 2 seconds of echo.
    for _ in range(31):
        mic, ref = _echo_pair(1024)
        aec.process(mic, ref)
    assert aec.adapted_chunks == 31
    # Measure on fresh echo.
    mic, ref = _echo_pair(8192, seed=99)
    out = aec.process(mic, ref)
    mic_f = np.frombuffer(mic, dtype=np.int16).astype(np.float64)
    res_f = np.frombuffer(out, dtype=np.int16).astype(np.float64)
    erle_db = 10 * np.log10(np.mean(mic_f ** 2) / max(np.mean(res_f ** 2), 1e-9))
    assert erle_db > 10.0, f"ERLE too low: {erle_db:.1f} dB"


def test_nlms_preserves_near_end_speech():
    """Near-end speech (not in the reference) must survive cancellation."""
    sr = 16000
    aec = NlmsAEC(sample_rate=sr, filter_len=128, mu=0.5)
    for _ in range(31):
        mic, ref = _echo_pair(1024)
        aec.process(mic, ref)
    # Now mic = echo + loud near-end tone absent from the reference.
    t = np.arange(4096) / sr
    near = (np.sin(2 * np.pi * 440 * t) * 12000).astype(np.int16)
    rng = np.random.default_rng(3)
    ref = rng.normal(0, 8000, 4096)
    echo = np.concatenate([np.zeros(40), ref[:-40] * 0.5])
    mic = (echo + near.astype(np.float64)).astype(np.int16)
    out = aec.process(_pcm(mic), _pcm(ref))
    out_f = np.frombuffer(out, dtype=np.int16).astype(np.float64)
    # Near-end tone dominates the residual: strong 440Hz component remains.
    spectrum = np.abs(np.fft.rfft(out_f))
    freqs = np.fft.rfftfreq(len(out_f), 1 / sr)
    peak = freqs[int(np.argmax(spectrum))]
    assert abs(peak - 440) < 30, f"near-end tone lost, peak at {peak:.0f} Hz"


def test_nlms_reset():
    aec = NlmsAEC()
    mic, ref = _echo_pair(1024)
    aec.process(mic, ref)
    assert aec.adapted_chunks == 1
    aec.reset()
    assert aec.adapted_chunks == 0


def test_nlms_bad_mu_rejected():
    with pytest.raises(ValueError):
        NlmsAEC(mu=2.5)
