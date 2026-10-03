"""Stage 4 verification: barge-in.

While TTS is mid-utterance, push an InterruptionFrame downstream.
Confirm:
  - Bridge marks _cancelled and cancels the active task
  - TTS service pushes TTSStoppedFrame (or at minimum: no further TTSStartedFrame)
"""
import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config
from server.conversation.manager import ConversationManager
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.tools.datetime_tool import DATETIME_SPEC, format_datetime, get_current_datetime
from server.response.policy import ResponsePolicy
from server.voice.pipecat_bridge import ConversationBridge

from pipecat.frames.frames import (
    Frame,
    InterruptionFrame,
    TTSAudioRawFrame,
    TTSStartedFrame,
    TTSStoppedFrame,
    TranscriptionFrame,
)
from pipecat.pipeline.pipeline import Pipeline
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.services.pocket_tts.tts import PocketTTSService


class CaptureSink(FrameProcessor):
    def __init__(self) -> None:
        super().__init__(name="capture-sink")
        self.audio_chunks: list[bytes] = []
        self.started = 0
        self.stopped = 0

    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        await super().process_frame(frame, direction)
        if isinstance(frame, TTSAudioRawFrame):
            self.audio_chunks.append(frame.audio)
        elif isinstance(frame, TTSStartedFrame):
            self.started += 1
        elif isinstance(frame, TTSStoppedFrame):
            self.stopped += 1


class BargeInInjector(FrameProcessor):
    """Inject transcription, then InterruptionFrame after first audio chunk."""

    def __init__(self, text: str) -> None:
        super().__init__(name="barge-in-injector")
        self.text = text
        self._started = False
        self._injected_interruption = False
        self._saw_started = False

    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        await super().process_frame(frame, direction)
        if not self._started and frame.__class__.__name__ == "StartFrame":
            self._started = True
            await self.push_frame(frame, direction)
            await self.push_frame(
                TranscriptionFrame(text=self.text, user_id="test", timestamp="now"),
                direction,
            )
            return
        # Inject interruption the moment we see TTS audio start (any chunk).
        if not self._injected_interruption and isinstance(frame, TTSAudioRawFrame):
            self._injected_interruption = True
            # Push downstream (toward TTS sink) and upstream (toward TTS itself).
            await self.push_frame(InterruptionFrame(), direction)
            # Upstream direction = back toward TTS so it cancels.
            from pipecat.processors.frame_processor import FrameDirection
            await self.push_frame(InterruptionFrame(), FrameDirection.UPSTREAM)
            return
        await self.push_frame(frame, direction)


async def main() -> None:
    cfg = load_config()
    cm = ConversationManager(
        cfg,
        intent_router=IntentRouter(),
        tool_registry=ToolRegistry(),
        response_policy=ResponsePolicy(forbidden_prefixes=cfg.personality.forbidden_phrases),
    )
    cm.tool_registry.register(DATETIME_SPEC, get_current_datetime, format_datetime)

    bridge = ConversationBridge(cm)
    tts = PocketTTSService()
    sink = CaptureSink()
    src = BargeInInjector("tell me a long story about dragons and magic and brave knights in a far away kingdom")

    pipeline = Pipeline([src, bridge, tts, sink])
    from pipecat.pipeline.runner import PipelineRunner
    from pipecat.pipeline.task import PipelineTask

    task = PipelineTask(pipeline)
    runner = PipelineRunner(handle_sigint=False)

    async def kill_after_audio():
        for _ in range(200):
            await asyncio.sleep(0.1)
            if sink.stopped >= 1 and sink.audio_chunks and bridge._cancelled:
                await asyncio.sleep(0.5)
                await task.stop()
                return

    killer = asyncio.create_task(kill_after_audio())
    try:
        await runner.run(task)
    finally:
        killer.cancel()

    print(f"audio chunks:   {len(sink.audio_chunks)}")
    print(f"started frames: {sink.started}")
    print(f"stopped frames: {sink.stopped}")
    print(f"bridge cancelled flag: {bridge._cancelled}")
    print(f"interruption injected: {src._injected_interruption}")
    print(f"sentences spoken: {bridge.spoken_sentences}")
    assert src._injected_interruption, "interruption never injected"
    assert bridge._cancelled, "bridge did not set _cancelled"
    assert sink.stopped >= 1, "TTS never pushed TTSStoppedFrame"
    print("STAGE 4 PASS")


if __name__ == "__main__":
    asyncio.run(main())