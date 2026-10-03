"""Self echo gate — drops audio frames while the bot is speaking, plus a short
tail after it stops, so OS never transcribes its own voice.

Sits between VAD and STT on the input path.  Works with Pipecat's existing
BotStartedSpeakingFrame / BotStoppedSpeakingFrame signals on the output
side of the pipeline.  When real AEC arrives (Priority 1) this can be
removed and replaced with proper acoustic echo cancellation.
"""
from __future__ import annotations

import logging
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

log = logging.getLogger("os.voice.self_echo_gate")

ECHO_TAIL_SECONDS = 0.25  # room decay after bot stops — tune per speaker/room


class SelfEchoGate(FrameProcessor):
    """
    Drops audio/transcription frames while the bot is speaking,
    plus a short tail after it stops, so OS never transcribes its own voice.

    Frame flow:
      - BotStartedSpeakingFrame  → gate on, suppress downstream unless barge-in
      - BotStoppedSpeakingFrame  → gate off after ECHO_TAIL_SECONDS
      - UserStartedSpeakingFrame → if allow_barge_in, break gate and forward frame
      - All other frames pass through unchanged when gate is down
    """

    def __init__(self, allow_barge_in: bool = True) -> None:
        super().__init__()
        self.allow_barge_in = allow_barge_in
        self._bot_speaking = False
        self._gate_until = 0.0
        self.barge_in_count = 0

    @property
    def is_gated(self) -> bool:
        return self._bot_speaking or time.monotonic() < self._gate_until

    def interrupt(self) -> None:
        """Manually trigger barge-in / cancel gate."""
        self._bot_speaking = False
        self._gate_until = 0.0
        self.barge_in_count += 1

    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        # Bot state frames travel on the output side but pass through
        # the pipeline — catch them to update gate state.
        if isinstance(frame, BotStartedSpeakingFrame):
            self._bot_speaking = True
            self._gate_until = float("inf")
        elif isinstance(frame, BotStoppedSpeakingFrame):
            self._bot_speaking = False
            self._gate_until = time.monotonic() + ECHO_TAIL_SECONDS

        # Check for user barge-in while gated
        if self.allow_barge_in and self.is_gated:
            if isinstance(frame, UserStartedSpeakingFrame):
                log.info("SelfEchoGate: User barge-in detected. Breaking echo gate.")
                self.interrupt()
                await self.push_frame(frame, direction)
                return

        # If the gate is up (bot speaking or echo tail), drop input frames.
        if self.is_gated and isinstance(
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