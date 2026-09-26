"""TTS engines + manager.
Phase 4: multiple TTS engines with same interface.
Phase 5-7: streaming, interruption, audio queue.
"""
from .base import TTSEngine
from .mock import MockTTS

__all__ = ["TTSEngine", "MockTTS"]