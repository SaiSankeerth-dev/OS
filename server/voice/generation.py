"""GenerationCounter — atomic monotonic counter for invalidating stale work.

One gen_id spans an entire response generation: LLM chunks → sentences →
TTS jobs → AudioCards. interrupt() bumps the counter; older items are
silently discarded by every downstream consumer.
"""
from __future__ import annotations


class GenerationCounter:
    def __init__(self) -> None:
        self._n: int = 0

    def current(self) -> int:
        return self._n

    def bump(self) -> int:
        self._n += 1
        return self._n