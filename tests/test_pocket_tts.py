"""Tests for PocketTTSEngine honesty: no silent fallbacks.

- is_ready() is True only when a model is actually loaded.
- speak() raises RuntimeError with the real cause when the model is
  unavailable (instead of returning fake silence).
- status()/last_error() surface diagnostics.
- A real-model test runs only when model weights are present locally.
"""
import os

import pytest

from server.tts.pocket import PocketTTSEngine


def test_is_ready_false_when_load_fails(monkeypatch):
    import server.tts.pocket as pocket_mod

    def boom_load_model(*a, **k):
        raise RuntimeError("disk on fire")

    fake_mod = type("FakeMod", (), {"TTSModel": type("T", (), {
        "load_model": staticmethod(boom_load_model)})})()
    monkeypatch.setitem(__import__("sys").modules, "pocket_tts", fake_mod)
    eng = PocketTTSEngine.__new__(PocketTTSEngine)
    # Bypass __init__'s eager _load to control the failure path explicitly.
    eng._model = None
    eng._sample_rate = 24000
    eng._last_error = None
    eng._state_path = None
    eng._config_path = None
    eng._voice = "alba"
    eng._voice_state = None
    with pytest.raises(RuntimeError, match="disk on fire"):
        eng._ensure_model()
    assert eng.is_ready() is False
    assert "disk on fire" in (eng.last_error() or "")
    status = eng.status()
    assert status["ready"] is False
    assert "disk on fire" in (status["last_error"] or "")


def test_speak_raises_when_model_missing(monkeypatch):
    eng = PocketTTSEngine.__new__(PocketTTSEngine)
    eng._model = None
    eng._sample_rate = 24000
    eng._last_error = "previous load failed"
    eng._state_path = None

    def boom(self):
        raise RuntimeError("Pocket TTS model failed to load: previous load failed")

    monkeypatch.setattr(PocketTTSEngine, "_ensure_model", boom)
    with pytest.raises(RuntimeError, match="failed to load"):
        eng.speak("hello")


def test_speak_uses_loaded_model():
    eng = PocketTTSEngine.__new__(PocketTTSEngine)
    eng._sample_rate = 24000
    eng._last_error = None
    eng._state_path = None
    eng._config_path = None
    eng._voice_state = "cached-state"

    class FakeModel:
        sample_rate = 24000

        def generate_audio(self, state, text, copy_state=True):
            assert state == "cached-state"
            assert text == "hi"
            import numpy as np
            return np.full((1, 2400), 0.05, dtype=np.float32)  # [ch, samples]

    eng._model = FakeModel()
    out = eng.speak("hi")
    assert len(out) == 2400 * 2
    assert eng.is_ready() is True


def test_to_pcm16_handles_torch_tensor():
    torch = pytest.importorskip("torch")
    eng = PocketTTSEngine.__new__(PocketTTSEngine)
    t = torch.tensor([[0.0, 0.5, -0.5, 1.0]])
    out = eng._to_pcm16(t)
    import numpy as np
    pcm = np.frombuffer(out, dtype=np.int16)
    assert len(pcm) == 4
    assert pcm[1] == int(0.5 * 32767)
    assert pcm[3] == 32767  # clipped


def test_missing_package_gives_install_hint(monkeypatch):
    import sys

    eng = PocketTTSEngine.__new__(PocketTTSEngine)
    eng._model = None
    eng._sample_rate = 24000
    eng._last_error = None
    eng._state_path = None
    monkeypatch.setitem(sys.modules, "pocket_tts", None)
    # Force a fresh import attempt inside _ensure_model.
    monkeypatch.delitem(sys.modules, "pocket_tts", raising=False)
    import builtins
    real_import = builtins.__import__

    def fake_import(name, *args, **kwargs):
        if name == "pocket_tts":
            raise ImportError("No module named 'pocket_tts'")
        return real_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", fake_import)
    with pytest.raises(RuntimeError, match="pip install pocket-tts"):
        eng._ensure_model()


@pytest.mark.skipif(
    not os.path.exists(
        os.path.expanduser("~/.cache/huggingface/hub/models--kyutai--pocket-tts-without-voice-cloning")
    ),
    reason="PocketTTS weights not downloaded on this machine",
)
@pytest.mark.skipif(
    not os.path.exists(
        os.path.expanduser("~/.cache/huggingface/hub/models--kyutai--pocket-tts-without-voice-cloning")
    ),
    reason="PocketTTS weights not downloaded on this machine",
)
@pytest.mark.skipif(
    not os.path.exists(
        os.path.expanduser("~/.cache/huggingface/hub/models--kyutai--pocket-tts-without-voice-cloning")
    ),
    reason="PocketTTS weights not downloaded on this machine",
)
def test_real_tts_to_stt_roundtrip(monkeypatch):
    """End-to-end voice loop with real models: PocketTTS speaks, faster-whisper
    transcribes. Verified 2026-09-26: 'The weather is nice today.' round-trips
    exactly with the tiny model."""
    import numpy as np

    monkeypatch.delenv("POCKET_TTS_CONFIG", raising=False)
    monkeypatch.delenv("POCKET_TTS_VOICE", raising=False)
    from server.tts.pocket import PocketTTSEngine
    from server.voice.stt import STTService, STTServiceConfig

    tts = PocketTTSEngine()
    audio = tts.speak("The weather is nice today.")
    assert np.sqrt(np.mean(np.frombuffer(audio, dtype=np.int16).astype(float) ** 2)) > 50

    stt = STTService(STTServiceConfig(model_size="tiny", device="cpu",
                                      compute_type="int8", language="en"))
    result = stt.transcribe(audio)
    assert "weather" in result.text.lower() and "nice" in result.text.lower(), \
        f"roundtrip transcription off: {result.text!r}"


def test_real_model_loads_and_synthesizes(monkeypatch):
    import numpy as np

    # Default path: stock english config -> public non-voice-cloning weights
    # (auto-downloaded to the HF cache) + predefined "alba" voice.
    monkeypatch.delenv("POCKET_TTS_CONFIG", raising=False)
    monkeypatch.delenv("POCKET_TTS_VOICE", raising=False)
    eng = PocketTTSEngine()
    assert eng.is_ready() is False  # lazy: not loaded until first speak
    audio = eng.speak("The weather is nice today.")
    assert eng.is_ready() is True
    pcm = np.frombuffer(audio, dtype=np.int16)
    assert len(pcm) > 1000
    assert np.sqrt(np.mean(pcm.astype(float) ** 2)) > 50  # real speech, not silence
    assert eng.last_error() is None
