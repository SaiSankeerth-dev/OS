"""Tests for sounddevice audio I/O guards and helpers.

On machines without PortAudio/audio hardware these raise clear,
actionable RuntimeErrors instead of failing obscurely. The happy path
(real capture/playback) is hardware-gated — see HARDWARE_TEST.md.
"""
import asyncio

import pytest

import server.voice.audio_io as audio_io_mod
from server.voice.audio_io import (
    MockAudioInput,
    MockAudioOutput,
    SoundDeviceAudioInput,
    SoundDeviceAudioOutput,
    list_audio_devices,
)


def test_require_sounddevice_raises_clear_error(monkeypatch):
    import builtins
    real_import = builtins.__import__

    def fake_import(name, *args, **kwargs):
        if name == "sounddevice":
            raise ImportError("No module named 'sounddevice'")
        return real_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", fake_import)
    with pytest.raises(RuntimeError, match="pip install sounddevice"):
        audio_io_mod._require_sounddevice()


def test_input_constructor_fails_loudly_without_backend(monkeypatch):
    monkeypatch.setattr(
        audio_io_mod, "_require_sounddevice",
        lambda: (_ for _ in ()).throw(RuntimeError("sounddevice is required")),
    )
    with pytest.raises(RuntimeError, match="sounddevice is required"):
        SoundDeviceAudioInput()


def test_output_constructor_fails_loudly_without_backend(monkeypatch):
    monkeypatch.setattr(
        audio_io_mod, "_require_sounddevice",
        lambda: (_ for _ in ()).throw(RuntimeError("sounddevice is required")),
    )
    with pytest.raises(RuntimeError, match="sounddevice is required"):
        SoundDeviceAudioOutput()


def test_list_devices_fails_loudly_without_backend(monkeypatch):
    monkeypatch.setattr(
        audio_io_mod, "_require_sounddevice",
        lambda: (_ for _ in ()).throw(RuntimeError("sounddevice is required")),
    )
    with pytest.raises(RuntimeError, match="sounddevice is required"):
        list_audio_devices()


def test_resolve_device_by_name_substring():
    class FakeSD:
        @staticmethod
        def query_devices():
            return [
                {"name": "Built-in Microphone", "max_input_channels": 2,
                 "max_output_channels": 0, "default_samplerate": 44100},
                {"name": "USB Headset", "max_input_channels": 1,
                 "max_output_channels": 2, "default_samplerate": 48000},
            ]

    assert audio_io_mod._resolve_device(FakeSD(), None, "input") is None
    assert audio_io_mod._resolve_device(FakeSD(), 1, "input") == 1
    assert audio_io_mod._resolve_device(FakeSD(), "headset", "input") == 1
    with pytest.raises(RuntimeError, match="No input audio device"):
        audio_io_mod._resolve_device(FakeSD(), "nonexistent", "input")


def test_output_speaker_reference_empty():
    # Construct without __init__ to avoid touching real hardware.
    out = SoundDeviceAudioOutput.__new__(SoundDeviceAudioOutput)
    import collections
    out._ref = collections.deque(maxlen=48000)
    import threading
    out._lock = threading.Lock()
    ref = out.speaker_reference(100)
    assert ref == b"\x00" * 200  # zeros when nothing played


def test_output_records_played_samples_for_aec():
    import collections
    import threading
    import numpy as np

    out = SoundDeviceAudioOutput.__new__(SoundDeviceAudioOutput)
    out._ref = collections.deque(maxlen=48000)
    out._lock = threading.Lock()
    pcm = (np.ones(480, dtype=np.int16) * 1000).tobytes()
    out._ref.extend((np.ones(480, dtype=np.float32) / 32768.0 * 1000).tolist())
    ref = out.speaker_reference(480)
    got = np.frombuffer(ref, dtype=np.int16)
    assert len(got) == 480
    assert abs(float(np.mean(got)) - 1000) < 2


def test_mocks_still_work():
    async def go():
        inp = MockAudioInput([b"a", b"b"])
        assert await inp.read_chunk() == b"a"
        assert await inp.read_chunk() == b"b"
        assert await inp.read_chunk() is None
        out = MockAudioOutput()
        await out.play(object())
        assert len(out.played) == 1

    asyncio.run(go())
