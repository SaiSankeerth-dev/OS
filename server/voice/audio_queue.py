"""AudioCard + AudioQueue with generation-ID discard.

AudioQueue holds TTS-synthesized audio cards. Each card carries a gen_id.
Cards whose gen_id does not match the queue's current gen are silently dropped,
allowing VoiceEngine.interrupt() to invalidate stale work in one bump.
"""
from __future__ import annotations
import asyncio
from dataclasses import dataclass


@dataclass
class AudioCard:
    gen_id: int
    sentence: str
    samples: bytes
    sample_rate: int = 22050
    duration_ms: int = 0


class AudioQueue:
    def __init__(self) -> None:
        self._q: asyncio.Queue[AudioCard] = asyncio.Queue()
        self._current_gen: int = 0

    def set_gen(self, gen: int) -> None:
        self._current_gen = gen

    def current_gen(self) -> int:
        return self._current_gen

    async def put(self, card: AudioCard) -> None:
        if card.gen_id != self._current_gen:
            return
        await self._q.put(card)

    async def get(self) -> AudioCard:
        while True:
            card = await self._q.get()
            if card.gen_id == self._current_gen:
                return card

    def clear_stale(self) -> int:
        kept: list[AudioCard] = []
        dropped = 0
        n = self._q.qsize()
        for _ in range(n):
            try:
                c = self._q.get_nowait()
            except asyncio.QueueEmpty:
                break
            if c.gen_id == self._current_gen:
                kept.append(c)
            else:
                dropped += 1
        for c in kept:
            self._q.put_nowait(c)
        return dropped