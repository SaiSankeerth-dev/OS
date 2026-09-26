"""TTS engine interface - all engines expose the same ABC."""

from __future__ import annotations

from dataclasses import dataclass
from typing import AsyncIterator


@dataclass
class VoiceProfile:
    name: str = "default"
    speed: float = 1.0
    pitch: float = 1.0


@dataclass
class TTSCard:
    """One chunk of synthesized audio."""
    delta: bytes  # raw audio frames
    sample_rate: int = 16000
    done: bool = False


class TTSEngine:
    """TTS engine interface.

    All engines (Pocket TTS, Kokoro, Chatterbox, KittenTTS) must expose
    the same interface so OS can switch without changing the conversation system.
    (Section 8 of the plan)
    """

    name: str

    def speak(self, text: str) -> bytes:
        """Blocking synthesize full text to audio."""
        raise NotImplementedError

    def stream(self, text: str) -> AsyncIterator[TTSCard]:
        """Stream audio chunks as they're generated."""
        raise NotImplementedError

    def stop(self) -> None:
        """Request immediate stop of ongoing generation."""
        raise NotImplementedError

    def is_ready(self) -> bool:
        """Check if the engine is loaded and ready."""
        raise NotImplementedError