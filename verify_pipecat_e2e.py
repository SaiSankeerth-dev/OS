"""Stage 1-3 verification: bridge + Pocket TTS through the pipeline graph.

Proves:
  Stage 1: TranscriptionFrame -> bridge consumes it (frame shape OK)
  Stage 2: bridge -> ConversationManager -> text responses (LLM path works)
  Stage 3: Pocket TTS receives aggregated TextFrames -> emits TTSAudioRawFrame with PCM bytes

No LocalAudioTransport (no mic/speaker in this shell). We wire the pipeline
manually and inject a fake TranscriptionFrame at the head, then collect what
the TTS service emits downstream.
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
    TTSAudioRawFrame,
    TTSStartedFrame,
    TTSStoppedFrame,
    TranscriptionFrame,
)
from pipecat.pipeline.pipeline import Pipeline
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.services.pocket_tts.tts import PocketTTSService


class CaptureSink(FrameProcessor):
    """Last in the pipeline: collect audio frames + start/stop for visibility."""

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
        # do not push further


class FakeInput(FrameProcessor):
    """Push a TranscriptionFrame at the start of the pipeline."""

    def __init__(self, text: str) -> None:
        super().__init__(name="fake-input")
        self.text = text
        self._pushed = False

    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        await super().process_frame(frame, direction)
        # Push StartFrame first so the pipeline init runs, then inject on next
        # downstream pass. Equivalently: only one of StartFrame/TranscriptionFrame
        # triggers we use the StartFrame as the trigger.
        if not self._pushed:
            # Allow through the start frame so the pipeline initializes.
            if frame.__class__.__name__ == "StartFrame":
                self._pushed = True
                await self.push_frame(frame, direction)
                # Now inject our transcription.
                await self.push_frame(
                    TranscriptionFrame(text=self.text, user_id="test", timestamp="now"),
                    direction,
                )
                return
        # Pass everything else through untouched.
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
    src = FakeInput("what time is it?")

    pipeline = Pipeline([src, bridge, tts, sink])

    from pipecat.pipeline.runner import PipelineRunner
    from pipecat.pipeline.task import PipelineTask

    task = PipelineTask(pipeline)
    runner = PipelineRunner(handle_sigint=False)

    # Run pipeline in background; we kill it after the first audio arrives.
    async def kill_after_audio():
        for _ in range(200):  # up to 20s
            await asyncio.sleep(0.1)
            if sink.audio_chunks:
                await asyncio.sleep(1.0)  # let TTS finish current utterance
                await task.stop()
                return

    killer = asyncio.create_task(kill_after_audio())
    try:
        await runner.run(task)
    finally:
        killer.cancel()

    print(f"started frames: {sink.started}")
    print(f"stopped frames: {sink.stopped}")
    print(f"audio chunks:   {len(sink.audio_chunks)}")
    total_bytes = sum(len(c) for c in sink.audio_chunks)
    print(f"total pcm bytes: {total_bytes}")
    print(f"sentences spoken: {bridge.spoken_sentences}")
    assert sink.started >= 1, "TTS never started"
    assert sink.audio_chunks, "TTS produced no audio frames"
    assert any(":" in s for s in bridge.spoken_sentences), "no clock string in spoken sentences"
    print("STAGE 1-3 PASS")


if __name__ == "__main__":
    asyncio.run(main())
