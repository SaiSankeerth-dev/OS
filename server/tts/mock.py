"""Mock TTS engine that returns deterministic bytes per sentence.

Used by tests and as a fallback when no real engine is available.
"""
from __future__ import annotations
import asyncio

from .base import TTSEngine


class MockTTS(TTSEngine):
    name = "mock"

    async def synthesize(self, text: str) -> bytes:
        await asyncio.sleep(0)
        return (text.encode() * 4)[: 64]

    def speak(self, text: str) -> bytes:
        return self._sync_speak(text)

    def _sync_speak(self, text: str) -> bytes:
        return (text.encode() * 4)[: 64]

    async def stream(self, text: str):
        yield await self.synthesize(text)

    def stop(self) -> None:
        return None

    def is_ready(self) -> bool:
        return True