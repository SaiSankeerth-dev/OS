"""Voice service interfaces - STT and VAD."""

from __future__ import annotations

from dataclasses import dataclass
from typing import AsyncIterator


@dataclass
class SpeechSegment:
    start_ms: float
    end_ms: float
    confidence: float = 1.0


class VADService:
    """Voice Activity Detection.

    Determines: are you speaking? did you stop? did you start speaking again?
    (Section 4 of the plan: VAD responsibilities)
    """

    def analyze(self, audio_chunk: bytes) -> SpeechSegment | None:
        """Analyze one audio chunk; return segment if speech detected."""
        raise NotImplementedError

    def stream(self, audio_generator) -> AsyncIterator[SpeechSegment]:
        """Stream analysis over a generator of audio chunks."""
        raise NotImplementedError


class STTService:
    """Speech-to-Text.

    Determines: what did you say? (Section 4 of the plan)
    """

    def transcribe(self, audio_path: str) -> "STTService.Transcript":
        """Transcribe a full audio file."""
        raise NotImplementedError

    class Transcript:
        """One transcription result."""
        text: str
        is_final: bool
        confidence: float = 1.0

    def stream(self, audio_generator) -> AsyncIterator["STTService.Transcript"]:
        """Stream transcription over a generator of audio chunks."""
        raise NotImplementedError