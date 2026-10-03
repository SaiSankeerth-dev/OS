"""Self echo gate — drops audio frames while the bot is speaking, plus a short
tail after it stops, so OS never transcribes its own voice.

Sits between VAD and STT on the input path.  Works with Pipecat's existing
BotStartedSpeakingFrame / BotStoppedSpeakingFrame signals on the output
side of the pipeline.  When real AEC arrives (Priority 1) this can be
removed and replaced with proper acoustic echo cancellation.
"""
from __future__ import annotations

import time
from pipecat.frames.frames import (
    Frame,
    AudioRawFrame,
    BotStartedSpeakingFrame,
    BotStoppedSpeakingFrame,
    UserStartedSpeakingFrame,
    UserStoppedSpeakingFrame,
    TranscriptionFrame,
)
from pipecat.processors.frame_processor import FrameProcessor, FrameDirection


ECHO_TAIL_SECONDS = 0.25  # room decay after bot stops — tune per speaker/room


class SelfEchoGate(FrameProcessor):
    """
    Drops audio/transcription frames while the bot is speaking,
    plus a short tail after it stops, so OS never transcribes its own voice.

    Frame flow:
      - BotStartedSpeakingFrame  → gate on, suppress everything downstream
      - BotStoppedSpeakingFrame  → gate off after ECHO_TAIL_SECONDS
      - All other frames pass through unchanged
    """

    def __init__(self) -> None:
        super().__init__()
        self._bot_speaking = False
        self._gate_until = 0.0

    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        # Bot state frames travel on the output side but pass through
        # the pipeline — catch them to update gate state.
        if isinstance(frame, BotStartedSpeakingFrame):
            self._bot_speaking = True
            self._gate_until = float("inf")
        elif isinstance(frame, BotStoppedSpeakingFrame):
            self._bot_speaking = False
            self._gate_until = time.monotonic() + ECHO_TAIL_SECONDS

        # If the gate is up (bot speaking or echo tail), drop input frames.
        gated = self._bot_speaking or time.monotonic() < self._gate_until

        if gated and isinstance(
            frame,
            (
                AudioRawFrame,
                UserStartedSpeakingFrame,
                UserStoppedSpeakingFrame,
                TranscriptionFrame,
            ),
        ):
            # Drop silently — do not forward downstream.
            return

        await self.push_frame(frame, direction)