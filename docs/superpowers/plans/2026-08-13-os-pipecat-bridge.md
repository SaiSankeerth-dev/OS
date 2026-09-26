# Pipecat Voice Bridge v1 — Implementation Plan

**Goal:** Wire `ConversationManager` into Pipecat's pipeline so OS gets a real listen → think → speak loop with Pipecat handling audio transport + VAD + STT + TTS, and ConversationManager handling routing/tools/memory/policy.

**Architecture:** Thin `ConversationBridge` FrameProcessor. Pipecat's STT service produces transcription frames; bridge forwards text to `ConversationManager.respond_text`, accumulates deltas, flushes sentences to Pipecat's TTS service via `TTSSpeakFrame`. ConversationManager is untouched.

**Tech Stack:** pipecat-ai 1.7.0, faster-whisper, silero-vad, pocket-tts, pyaudio.

## Global Constraints

1. Do NOT modify `ConversationManager`. The bridge calls `respond_text(user_text)` only.
2. All existing 63 tests must continue to pass.
3. Pipecat imports only inside the bridge module — keep `server/voice/` mock-only.
4. Bridge exposes async `process_frame(frame)` per Pipecat conventions.
5. Bridge must handle `InterruptionFrame` → interrupt the active `respond_text` task.
6. v1 wires: mic → Pipecat LocalAudio → SileroVAD → WhisperSTT → **Bridge** → SentenceBuffer → PocketTTS → speaker.
7. Tests use a mock FrameProcessor harness — no real audio I/O in tests.

---

### Task 1: Bridge module

**Files:**
- Create: `server/voice/pipecat_bridge.py`
- Test: `tests/test_pipecat_bridge.py`

**Interface:**
```python
class ConversationBridge(FrameProcessor):
    def __init__(self, conversation_manager: ConversationManager, sentence_buffer: SentenceBuffer | None = None) -> None: ...
    async def process_frame(self, frame, direction): ...
    async def _handle_transcription(self, text: str): ...
```

- [ ] **Step 1: Write failing test**

```python
# tests/test_pipecat_bridge.py
import asyncio
from server.conversation.manager import ChatChunk
from server.voice.pipecat_bridge import ConversationBridge
from server.voice.sentence_buffer import SentenceBuffer


class _CM:
    async def respond_text(self, t):
        yield ChatChunk(delta="Hi there.", done=True)


async def test_bridge_yields_speak_frames_for_sentences():
    bridge = ConversationBridge(_CM(), SentenceBuffer(max_chars=240))
    frames = []
    # Simulate a Transcriptions frame
    from pipecat.frames.frames import TranscriptionsFrame
    frame = TranscriptionsFrame(text=["hello"], content="hello")
    # Bridge should consume transcription, fetch response, emit TTS queues
    # ... assert
```

(Skip detailed pipecat internals for tests; use a `start()`/`push()` style API.)

**Pragmatic test approach:** add a `feed_text(text)` async method to the bridge that bypasses pipecat frames but exercises the same code path. This makes the bridge testable without running pipecat's pipeline.

- [ ] **Step 2: Implement bridge**

```python
# server/voice/pipecat_bridge.py
"""Bridge between Pipecat frames and ConversationManager.

Pipecat handles audio transport, VAD, STT, TTS. This bridge ONLY translates
between Pipecat's frame stream and the existing ConversationManager.

Frames consumed:
  - TranscriptionsFrame (from STT) → call cm.respond_text(text)
  - InterruptionFrame → cancel active respond_text task, clear buffer

Frames produced:
  - TTSQueueFrame (sentences flushed from buffer) for TTS
  - EndFrame / StopFrame on shutdown
"""
from __future__ import annotations
import asyncio
import logging
from typing import Awaitable

from server.conversation.manager import ConversationManager, ChatChunk
from .sentence_buffer import SentenceBuffer

log = logging.getLogger("os.voice.bridge")


class ConversationBridge:
    """Test-friendly wrapper. Real Pipecat integration uses process_frame."""

    def __init__(
        self,
        conversation_manager: ConversationManager,
        sentence_buffer: SentenceBuffer | None = None,
    ) -> None:
        self.cm = conversation_manager
        self.buffer = sentence_buffer or SentenceBuffer()
        self._active_task: asyncio.Task | None = None
        self._cancelled = False
        self.spoken_sentences: list[str] = []  # test hook

    def interrupt(self) -> None:
        self._cancelled = True
        if self._active_task and not self._active_task.done():
            self._active_task.cancel()
        self.buffer.flush()

    async def feed_text(self, text: str) -> list[str]:
        """Drive the bridge with a transcription. Returns sentences spoken."""
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
        return list(self.spoken_sentences)

    def process_frame(self, frame, direction) -> None:
        """Pipecat frame entry point. Minimal mapping for v1."""
        from pipecat.frames.frames import (
            TranscriptionsFrame,
            InterruptionFrame,
        )
        if isinstance(frame, InterruptionFrame):
            self.interrupt()
        elif isinstance(frame, TranscriptionsFrame):
            # Pipecat TranscriptionsFrame.content is the latest text
            text = getattr(frame, "content", "") or ""
            if text:
                # Run feed_text as a background task so the pipeline can keep moving
                self._active_task = asyncio.create_task(self.feed_text(text))
```

NOTE: Pipecat's `process_frame` is `async def`, not sync. Adjust.

- [ ] **Step 3: Run tests**

Run: `python -m pytest tests/test_pipecat_bridge.py -v`

Expected: PASS.

- [ ] **Step 4: Run full suite**

Run: `python -m pytest`

Expected: 63 + N PASS.

- [ ] **Step 5: Commit**

---

### Task 2: Verify bridge works with real ConversationManager

**Files:**
- Create: `verify_bridge.py`

**Mirrors verify_voice.py but uses the bridge and asserts sentences come out correct.**

- [ ] **Step 1: Write verify_bridge.py**

```python
import asyncio
from pathlib import Path
import sys
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


async def main():
    cfg = load_config()
    cm = ConversationManager(
        cfg,
        intent_router=IntentRouter(),
        tool_registry=ToolRegistry(),
        response_policy=ResponsePolicy(forbidden_prefixes=cfg.personality.forbidden_phrases),
    )
    cm.tool_registry.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    bridge = ConversationBridge(cm)
    sents = await bridge.feed_text("what time is it?")
    print("sentences:", sents)
    assert any(":" in s for s in sents), "expected clock string"


if __name__ == "__main__":
    asyncio.run(main())
```

- [ ] **Step 2: Run `python verify_bridge.py`**

Expected: `sentences: ["It's 12:34 AM on ..."]` (real clock string).

- [ ] **Step 3: Commit**

---

### Task 3: Wire Pipecat pipeline (real audio path)

**Files:**
- Create: `server/voice/pipecat_runner.py`

**This is the Path A wiring. Only attempt if the user wants real voice I/O.**

Sketch:
```python
# server/voice/pipecat_runner.py
"""Run a real Pipecat voice loop with ConversationManager."""
from pipecat.pipeline.pipeline import Pipeline
from pipecat.transports.local.audio import LocalAudioTransport
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.services.whisper.stt import WhisperSTTService
from pipecat.services.pocket_tts.tts import PocketTTSService  # or HTTP TTS
from .pipecat_bridge import ConversationBridge


async def run(cm: ConversationManager):
    transport = LocalAudioTransport(...)
    vad = SileroVADAnalyzer()
    stt = WhisperSTTService(model="small")
    tts = PocketTTSService()  # or HTTP/elevenlabs
    bridge = ConversationBridge(cm)
    pipeline = Pipeline([transport.input(), vad, stt, bridge, tts, transport.output()])
    await pipeline.run()
```

Note: Pipecat TTS service names may differ. Discover via `pipecat.services.*`.

- [ ] **Step 1: Confirm TTS service**

`python -c "from pipecat.services.pocket_tts.tts import PocketTTSService; print('OK')"` — if module missing, list available services.

- [ ] **Step 2: Implement runner**

- [ ] **Step 3: Run `python -m server.voice.pipecat_runner` with mic/speaker live**

NOTE: This requires actual hardware. The first run may download whisper + pocket TTS models.

## Out of Scope (v1)

- Multi-language support
- Speaker identification
- Echo cancellation (Pipecat's built-in or WebRTC)
- WebRTC / remote clients
- Production TTS (ElevenLabs, OpenAI TTS)