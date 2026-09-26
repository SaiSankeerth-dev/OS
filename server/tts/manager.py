"""Fallback TTS engine for when Pocket TTS isn't fully usable."""

from ..tts.base import TTSEngine, TTSCard
import struct


class _FallbackEngine(TTSEngine):
    name = "fallback"

    def speak(self, text: str) -> bytes:
        """Generate silence audio bytes."""
        return self._generate_silence(16000, 0.5)

    def stream(self, text: str):
        """Return silence chunks."""
        return [self._card_from_silence(1.0)]

    def stop(self) -> None:
        pass

    def is_ready(self) -> bool:
        return True

    @staticmethod
    def _generate_silence(sample_rate: int, duration: float) -> bytes:
        """Generate silence audio bytes (16-bit PCM)."""
        n_samples = int(sample_rate * duration)
        samples = struct.pack(f"<{n_samples}h", *[0] * n_samples)
        return samples

    @staticmethod
    def _card_from_silence(duration: float) -> TTSCard:
        import struct
        n_samples = int(16000 * duration)
        data = struct.pack(f"<{n_samples}h", *[0] * n_samples)
        return TTSCard(delta=data, sample_rate=16000, done=True)