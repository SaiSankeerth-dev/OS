"""STT + VAD subsystem.

Phase 3: faster-whisper + Silero VAD.
Phase 5-7: streaming, barge-in.
"""
from .stt import STTService
from .vad import VADService

__all__ = ["STTService", "VADService"]