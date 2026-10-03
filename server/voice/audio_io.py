"""AudioInput / AudioOutput Protocols + mock + sounddevice implementations.

v1 shipped only Mocks. This module adds real audio I/O via `sounddevice`
(microphone capture + speaker playback) while keeping the Protocols so
VoiceEngine needs no changes.

Audio I/O patterns (lazy sounddevice import with a clear install hint,
chunked callback streams, WAV helpers) are adapted from OpenJarvis
(https://github.com/open-jarvis/OpenJarvis, Apache-2.0),
src/openjarvis/speech/voice_io.py.

On machines without audio hardware (or without PortAudio), constructing the
sounddevice classes raises a clear RuntimeError — use the mocks instead.
"""
from __future__ import annotations

import asyncio
import collections
import logging
import queue
import threading
from typing import Protocol, List

log = logging.getLogger("os.voice.audio")


# --------------------------------------------------------------------------
# Protocols (unchanged)
# --------------------------------------------------------------------------

class AudioInput(Protocol):
    async def read_chunk(self, timeout_ms: int = 100) -> bytes | None: ...
    def stop(self) -> None: ...


class AudioOutput(Protocol):
    async def play(self, card) -> None: ...
    def stop(self) -> None: ...


# --------------------------------------------------------------------------
# Mocks (unchanged)
# --------------------------------------------------------------------------

class MockAudioInput:
    """Yields pre-loaded byte chunks from a list; returns None on stop()."""

    def __init__(self, chunks: List[bytes] | None = None) -> None:
        self._chunks: list[bytes] = list(chunks or [])
        self._stopped: bool = False

    async def read_chunk(self, timeout_ms: int = 100) -> bytes | None:
        if self._stopped or not self._chunks:
            return None
        return self._chunks.pop(0)

    def stop(self) -> None:
        self._stopped = True


class MockAudioOutput:
    """Records played cards in a list; honors stop()."""

    def __init__(self) -> None:
        self.played: list = []
        self._stopped: bool = False

    async def play(self, card) -> None:
        if self._stopped:
            return
        self.played.append(card)

    def stop(self) -> None:
        self._stopped = True


# --------------------------------------------------------------------------
# sounddevice helpers
# --------------------------------------------------------------------------

def _require_sounddevice():
    """Import sounddevice lazily; raise a clear, actionable error if missing."""
    try:
        import sounddevice as sd
    except ImportError as exc:
        raise RuntimeError(
            "sounddevice is required for real audio I/O. "
            "Install with: pip install sounddevice "
            "(Linux also needs the PortAudio system library, e.g. "
            "`sudo apt install libportaudio2`)."
        ) from exc
    except OSError as exc:  # PortAudio shared library missing
        raise RuntimeError(
            "sounddevice is installed but the PortAudio system library could not "
            f"be loaded: {exc}. On Debian/Ubuntu: `sudo apt install libportaudio2`."
        ) from exc
    return sd


def list_audio_devices() -> list[dict]:
    """Enumerate audio devices via sounddevice.

    Returns a list of dicts: {index, name, max_input_channels,
    max_output_channels, default_samplerate}. Raises RuntimeError if
    sounddevice/PortAudio is unavailable.
    """
    sd = _require_sounddevice()
    devices = []
    for i, d in enumerate(sd.query_devices()):
        devices.append(
            {
                "index": i,
                "name": d["name"],
                "max_input_channels": d["max_input_channels"],
                "max_output_channels": d["max_output_channels"],
                "default_samplerate": d["default_samplerate"],
            }
        )
    return devices


def _resolve_device(sd, device, kind: str):
    """Resolve a device spec (index int, name str, or None=default) to an index."""
    if device is None:
        return None
    if isinstance(device, int):
        return device
    # name match (substring, case-insensitive)
    want = str(device).lower()
    for i, d in enumerate(sd.query_devices()):
        if want in d["name"].lower():
            key = "max_input_channels" if kind == "input" else "max_output_channels"
            if d[key] > 0:
                return i
    raise RuntimeError(f"No {kind} audio device matching {device!r} found.")


# --------------------------------------------------------------------------
# Real implementations
# --------------------------------------------------------------------------

class SoundDeviceAudioInput:
    """Microphone capture via sounddevice.

    Opens an InputStream with a callback that feeds a thread-safe queue;
    `read_chunk()` pulls int16 PCM byte chunks from the queue without
    blocking the event loop.
    """

    def __init__(
        self,
        *,
        sample_rate: int = 16000,
        channels: int = 1,
        chunk_samples: int = 1024,
        device=None,
    ) -> None:
        self.sample_rate = sample_rate
        self.channels = channels
        self.chunk_samples = chunk_samples
        self._sd = _require_sounddevice()
        self._queue: "queue.Queue[bytes]" = queue.Queue(maxsize=64)
        self._stopped = threading.Event()
        self._stream = None
        try:
            dev_index = _resolve_device(self._sd, device, "input")
            self._stream = self._sd.InputStream(
                samplerate=sample_rate,
                channels=channels,
                dtype="int16",
                blocksize=chunk_samples,
                device=dev_index,
                callback=self._callback,
            )
            self._stream.start()
        except Exception:
            self._stopped.set()
            if self._stream is not None:
                try:
                    self._stream.close()
                except Exception:
                    pass
            raise
        log.info(
            "mic opened: rate=%d ch=%d chunk=%d device=%s",
            sample_rate, channels, chunk_samples, device,
        )

    def _callback(self, indata, frames, time_info, status) -> None:
        if self._stopped.is_set():
            return
        try:
            self._queue.put_nowait(bytes(indata))
        except queue.Full:
            # Drop oldest to keep latency bounded.
            try:
                self._queue.get_nowait()
            except queue.Empty:
                pass
            try:
                self._queue.put_nowait(bytes(indata))
            except queue.Full:
                pass

    async def read_chunk(self, timeout_ms: int = 100) -> bytes | None:
        if self._stopped.is_set():
            return None
        try:
            return await asyncio.to_thread(
                self._queue.get, True, timeout_ms / 1000.0
            )
        except queue.Empty:
            return None

    def stop(self) -> None:
        self._stopped.set()
        if self._stream is not None:
            try:
                self._stream.stop()
                self._stream.close()
            except Exception:
                pass
            self._stream = None

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.stop()
        return False


class SoundDeviceAudioOutput:
    """Speaker playback via sounddevice.

    Keeps a persistent OutputStream and writes int16 PCM cards. Maintains a
    rolling buffer of recently played samples so the engine can feed a
    speaker reference to the AEC (echo cancellation).
    """

    def __init__(
        self,
        *,
        sample_rate: int = 24000,
        channels: int = 1,
        device=None,
        ref_seconds: float = 2.0,
    ) -> None:
        self.sample_rate = sample_rate
        self.channels = channels
        self._sd = _require_sounddevice()
        self._stream = None
        self._device = device
        self._lock = threading.Lock()
        self._stopped = False
        # Rolling reference buffer (float32 mono) for AEC.
        self._ref: collections.deque = collections.deque(
            maxlen=int(sample_rate * ref_seconds)
        )

    def _ensure_stream(self):
        if self._stream is None:
            dev_index = _resolve_device(self._sd, self._device, "output")
            self._stream = self._sd.OutputStream(
                samplerate=self.sample_rate,
                channels=self.channels,
                dtype="int16",
            )
            self._stream.start()

    async def play(self, card) -> None:
        """Play one AudioCard (card.samples = int16 PCM bytes)."""
        if self._stopped:
            return
        samples = getattr(card, "samples", b"") or b""
        if not samples:
            return
        import numpy as np

        pcm = np.frombuffer(samples, dtype=np.int16)
        card_rate = getattr(card, "sample_rate", None) or self.sample_rate
        if card_rate != self.sample_rate:
            # Simple linear resample to the output rate.
            n_out = int(len(pcm) * self.sample_rate / card_rate)
            if n_out > 0:
                x_old = np.linspace(0, 1, len(pcm))
                x_new = np.linspace(0, 1, n_out)
                pcm = np.interp(x_new, x_old, pcm).astype(np.int16)
        # Remember what we played (mono float32) for AEC reference.
        if self.channels == 1 and pcm.ndim == 1:
            mono = pcm.astype(np.float32) / 32768.0
        else:
            mono = pcm.reshape(-1, self.channels).mean(axis=1).astype(np.float32) / 32768.0
        with self._lock:
            if self._stopped:
                return
            self._ensure_stream()
            try:
                await asyncio.to_thread(self._stream.write, pcm)
            except Exception:
                log.exception("speaker write failed")
                return
            self._ref.extend(mono.tolist())

    def speaker_reference(self, n_samples: int) -> bytes:
        """Return the last `n_samples` played samples as int16 PCM bytes.

        Used as the far-end reference for AEC. Returns zeros when nothing
        has been played recently.
        """
        import numpy as np

        with self._lock:
            buf = list(self._ref)
        if len(buf) < n_samples:
            buf = [0.0] * (n_samples - len(buf)) + buf
        else:
            buf = buf[-n_samples:]
        return (np.asarray(buf, dtype=np.float32) * 32767.0).astype(np.int16).tobytes()

    def stop(self) -> None:
        with self._lock:
            self._stopped = True
            if self._stream is not None:
                try:
                    self._stream.abort()
                    self._stream.close()
                except Exception:
                    pass
                self._stream = None

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.stop()
        return False
