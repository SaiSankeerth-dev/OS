"""STT service interface."""
from __future__ import annotations

from dataclasses import dataclass
from typing import AsyncIterator


@dataclass
class Transcript:
    text: str
    is_final: bool
    confidence: float = 1.0


class STTService:
    """Speech-to-Text.

    Determines: what did you say? (Section 4 of the plan)
    """

    def transcribe(self, audio_bytes: bytes) -> Transcript:
        """Transcribe a full audio buffer."""
        raise NotImplementedError

    def stream(self, audio_generator) -> AsyncIterator[Transcript]:
        """Stream transcription over a generator of audio chunks."""
        raise NotImplementedError