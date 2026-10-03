"""Bridge between Pipecat frames and ConversationManager.

Pipecat handles audio transport, VAD, STT, TTS. This bridge ONLY translates
between Pipecat's frame stream and the existing ConversationManager.

ConversationManager is untouched. The bridge is a thin FrameProcessor that:
  - Receives TranscriptionFrame from STT → calls cm.respond_text(text)
  - Buffers LLM deltas into SentenceBuffer
  - Emits per-sentence TTSQueueTextFrame (or TTSSpeakFrame) to the TTS service
  - Honors InterruptionFrame by cancelling the active respond_text task

A test-friendly `feed_text()` method is also provided so the bridge can be
exercised without running a full Pipecat pipeline.
"""
from __future__ import annotations
import asyncio
import logging
from typing import List, Optional

from pipecat.frames.frames import (
    Frame,
    InterruptionFrame,
    LLMFullResponseStartFrame,
    LLMFullResponseEndFrame,
    TextFrame,
    TranscriptionFrame,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor

from server.conversation.manager import ConversationManager, ChatChunk
from .sentence_buffer import SentenceBuffer

log = logging.getLogger("os.voice.bridge")


class ConversationBridge(FrameProcessor):
    """Pipecat FrameProcessor that bridges to ConversationManager.

    Receives TranscriptionFrame (from STT) and pushes TextFrame (to TTS).
    Pushes LLMFullResponseStart/End on each turn to give Pipecat proper
    turn boundaries for TTS service interruption.
    """

    def __init__(
        self,
        conversation_manager: ConversationManager,
        sentence_buffer: Optional[SentenceBuffer] = None,
        *,
        name: str | None = "os-conversation-bridge",
    ) -> None:
        super().__init__(name=name)
        self.cm = conversation_manager
        self.buffer = sentence_buffer or SentenceBuffer()
        self._active_task: Optional[asyncio.Task] = None
        self._cancelled: bool = False
        # Test hook: sentences that have been emitted to the TTS queue.
        self.spoken_sentences: List[str] = []

    # ---------- public control ----------

    def interrupt(self) -> None:
        """Cancel the active respond_text task and flush the buffer."""
        self._cancelled = True
        if self._active_task and not self._active_task.done():
            self._active_task.cancel()
        self.buffer.flush()

    # ---------- pipecat entry point ----------

    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        await super().process_frame(frame, direction)

        if isinstance(frame, InterruptionFrame):
            self.interrupt()
            await self.push_frame(frame, direction)
            return

        if isinstance(frame, TranscriptionFrame):
            text = (frame.text or "").strip()
            if text:
                # Stream the LLM response as TextFrames for TTS.
                await self.push_frame(LLMFullResponseStartFrame(), direction)
                try:
                    async for chunk in self.cm.respond_text(text):
                        if self._cancelled:
                            break
                        if chunk.delta:
                            # push() drains terminated sentences; flush()
                            # is only called at end-of-turn so mid-stream
                            # fragments don't get emitted as "sentences".
                            for sent in self.buffer.push(chunk.delta):
                                self.spoken_sentences.append(sent)
                                await self.push_frame(
                                    TextFrame(text=sent), direction
                                )
                    # End of turn: emit whatever remains.
                    for sent in self.buffer.flush():
                        self.spoken_sentences.append(sent)
                        await self.push_frame(TextFrame(text=sent), direction)
                except Exception:
                    log.exception("bridge failed")
                finally:
                    await self.push_frame(LLMFullResponseEndFrame(), direction)
            return

        # Pass through all other frames untouched.
        await self.push_frame(frame, direction)

    # ---------- test / direct entry point ----------

    async def feed_text(self, text: str) -> List[str]:
        """Drive the bridge with a transcription, ignoring Frame protocol.

        Returns the list of complete sentences the TTS pipeline should speak.
        """
        self._cancelled = False
        self.spoken_sentences.clear()
        try:
            async for chunk in self.cm.respond_text(text):
                if self._cancelled:
                    break
                if chunk.delta:
                    for sent in self.buffer.push(chunk.delta):
                        self.spoken_sentences.append(sent)
            for sent in self.buffer.flush():
                self.spoken_sentences.append(sent)
        except asyncio.CancelledError:
            pass
        except Exception:
            log.exception("bridge feed_text failed")
        return list(self.spoken_sentences)
