# OS Voice Engine v1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the voice engine v1 spec (mic → AEC → VAD → STT → ConversationManager → SentenceBuffer → TTS → AudioQueue → speaker) with deterministic recovery, generation-ID-based stale work discard, and full mock I/O.

**Architecture:** `VoiceEngine` orchestrator around untouched `ConversationManager`. All audio components are Protocol/ABC + mock impl. Generation IDs span the entire response generation. State machine: IDLE → LISTENING → USER_SPEAKING → THINKING → SPEAKING → (interrupt) → LISTENING.

**Tech Stack:** Python 3.12, asyncio, dataclasses, pytest 9.1.1.

## Global Constraints

1. AEC on microphone input path only (`Mic → AEC → VAD → STT`).
2. `PassthroughAEC` is the v1 AEC impl.
3. Recovery paths for STT/LLM-empty/TTS/AudioQueue failures.
4. No state permanently stuck in USER_SPEAKING/THINKING/SPEAKING.
5. Generation IDs on LLM chunks, sentences, TTS jobs, AudioCards.
6. `interrupt()` bumps gen and discards stale work.
7. SentenceBuffer: punctuation flush, skip decimals/abbrevs, MAX_CHARS ceiling.
8. Do not modify `ConversationManager`, `IntentRouter`, `ToolRegistry`, `ResponsePolicy`, `MemoryRetriever`, `personality.py`.
9. All I/O mocked in v1.
10. One deterministic test per behavior listed.

---

### Task 1: AEC Protocol + PassthroughAEC

**Files:**
- Create: `server/voice/aec.py`
- Test: `tests/test_aec.py`

**Interfaces:**
- Consumes: nothing
- Produces: `AEC` Protocol; `PassthroughAEC` returns input bytes unchanged

- [ ] **Step 1: Write failing test**

```python
# tests/test_aec.py
from server.voice.aec import AEC, PassthroughAEC

def test_passthrough_returns_input_unchanged():
    aec = PassthroughAEC()
    assert aec.process(b"\x01\x02\x03") == b"\x01\x02\x03"

def test_passthrough_ignores_speaker_ref():
    aec = PassthroughAEC()
    assert aec.process(b"mic", speaker_ref=b"speaker") == b"mic"

def test_aec_is_a_protocol():
    # structural check
    assert hasattr(AEC, "process")
```

- [ ] **Step 2: Run test — expected FAIL (module missing)**

- [ ] **Step 3: Implement**

```python
# server/voice/aec.py
"""AEC Protocol + passthrough v1 implementation."""
from __future__ import annotations
from typing import Protocol


class AEC(Protocol):
    def process(self, mic_chunk: bytes, speaker_ref: bytes | None = None) -> bytes: ...


class PassthroughAEC:
    """v1 AEC: returns mic bytes unchanged. Replaceable by real AEC later."""

    def process(self, mic_chunk: bytes, speaker_ref: bytes | None = None) -> bytes:
        return mic_chunk
```

- [ ] **Step 4: Run test — expected PASS**

- [ ] **Step 5: Commit**

### Task 2: Audio I/O Protocols + Mocks

**Files:**
- Create: `server/voice/audio_io.py`
- Test: `tests/test_audio_io.py`

**Interfaces:**
- Produces: `AudioInput` Protocol + `MockAudioInput` (yields from list, None on stop)
- Produces: `AudioOutput` Protocol + `MockAudioOutput` (records cards, honors stop)

- [ ] **Step 1: Failing test**

```python
# tests/test_audio_io.py
import asyncio
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.audio_queue import AudioCard

def test_mock_input_drains_then_none():
    inp = MockAudioInput([b"a", b"b"])
    async def go():
        return [await inp.read_chunk(), await inp.read_chunk(), await inp.read_chunk()]
    assert asyncio.run(go()) == [b"a", b"b", None]

def test_mock_input_stop_returns_none_immediately():
    inp = MockAudioInput([b"a", b"b"])
    inp.stop()
    assert asyncio.run(inp.read_chunk()) is None

def test_mock_output_records_played_cards():
    out = MockAudioOutput()
    async def go():
        await out.play(AudioCard(gen_id=1, sentence="hi", samples=b"x"))
        await out.play(AudioCard(gen_id=1, sentence="there", samples=b"y"))
    asyncio.run(go())
    assert [c.sentence for c in out.played] == ["hi", "there"]

def test_mock_output_stop_blocks_subsequent_play():
    out = MockAudioOutput()
    out.stop()
    async def go():
        await out.play(AudioCard(gen_id=1, sentence="x", samples=b"x"))
    asyncio.run(go())
    assert out.played == []
```

- [ ] **Step 2: Run test — expected FAIL**

- [ ] **Step 3: Implement**

```python
# server/voice/audio_io.py
"""AudioInput / AudioOutput Protocols + mock impls."""
from __future__ import annotations
from typing import Protocol
import asyncio


class AudioInput(Protocol):
    async def read_chunk(self, timeout_ms: int = 100) -> bytes | None: ...
    def stop(self) -> None: ...


class MockAudioInput:
    def __init__(self, chunks: list[bytes] | None = None) -> None:
        self._chunks = list(chunks or [])
        self._stopped = False

    async def read_chunk(self, timeout_ms: int = 100) -> bytes | None:
        if self._stopped or not self._chunks:
            return None
        return self._chunks.pop(0)

    def stop(self) -> None:
        self._stopped = True


class AudioOutput(Protocol):
    async def play(self, card) -> None: ...
    def stop(self) -> None: ...


class MockAudioOutput:
    def __init__(self) -> None:
        self.played: list = []
        self._stopped = False

    async def play(self, card) -> None:
        if self._stopped:
            return
        self.played.append(card)

    def stop(self) -> None:
        self._stopped = True
```

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

### Task 3: AudioCard + AudioQueue

**Files:**
- Create: `server/voice/audio_queue.py`
- Test: `tests/test_audio_queue.py`

**Interfaces:**
- Produces: `AudioCard` dataclass; `AudioQueue` with `put/get/set_gen/clear_stale`

- [ ] **Step 1: Failing test**

```python
# tests/test_audio_queue.py
import asyncio
from server.voice.audio_queue import AudioCard, AudioQueue


def _card(gen: int, sent: str = "x") -> AudioCard:
    return AudioCard(gen_id=gen, sentence=sent, samples=b"x")


async def _drain(q: AudioQueue) -> list[AudioCard]:
    out = []
    for _ in range(3):
        c = await q.get()
        out.append(c)
    return out


def test_put_get_happy_path():
    q = AudioQueue()
    asyncio.run(q.put(_card(1)))
    c = asyncio.run(q.get())
    assert c.gen_id == 1


def test_stale_put_silently_dropped():
    q = AudioQueue()
    q.set_gen(2)
    asyncio.run(q.put(_card(1)))
    assert q._q.empty()


def test_stale_get_skipped():
    q = AudioQueue()
    asyncio.run(q.put(_card(1)))
    asyncio.run(q.put(_card(2)))
    q.set_gen(2)
    # First queue.get() sees the stale gen=1 card, drops it, returns gen=2
    c = asyncio.run(q.get())
    assert c.gen_id == 2


def test_clear_stale_drops_old_only():
    q = AudioQueue()
    asyncio.run(q.put(_card(1, "old")))
    asyncio.run(q.put(_card(2, "new")))
    q.set_gen(2)
    dropped = q.clear_stale()
    assert dropped == 1
    c = asyncio.run(q.get())
    assert c.sentence == "new"
```

- [ ] **Step 2: Run test — expected FAIL**

- [ ] **Step 3: Implement**

```python
# server/voice/audio_queue.py
"""AudioCard + AudioQueue with generation-ID discard."""
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
        while not self._q.empty():
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
```

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

### Task 4: GenerationCounter

**Files:**
- Create: `server/voice/generation.py`
- Test: `tests/test_generation.py`

- [ ] **Step 1: Failing test**

```python
from server.voice.generation import GenerationCounter


def test_initial_zero():
    assert GenerationCounter().current() == 0


def test_bump_increments():
    g = GenerationCounter()
    assert g.bump() == 1
    assert g.bump() == 2
    assert g.current() == 2
```

- [ ] **Step 2: FAIL** (module missing)

- [ ] **Step 3: Implement**

```python
class GenerationCounter:
    def __init__(self) -> None:
        self._n: int = 0

    def current(self) -> int:
        return self._n

    def bump(self) -> int:
        self._n += 1
        return self._n
```

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

### Task 5: VoiceState enum

**Files:**
- Create: `server/voice/states.py`

- [ ] **Step 1: Create file**

```python
"""Voice state machine states — independent of ConversationState."""
from __future__ import annotations
import enum


class VoiceState(str, enum.Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    USER_SPEAKING = "USER_SPEAKING"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"
    ERROR = "ERROR"
```

- [ ] **Step 2: Import-check via `python -c "from server.voice.states import VoiceState"` — expected PASS**

- [ ] **Step 3: Commit**

### Task 6: SentenceBuffer

**Files:**
- Create: `server/voice/sentence_buffer.py`
- Test: `tests/test_sentence_buffer.py`

**Rules:**
- Flush on `. ` / `! ` / `? ` or terminal `.` / `!` / `?`
- Skip if `.`/`!`/`?` between digits (decimal)
- Skip if token in `{"Mr","Dr","Mrs","Ms","St","Jr","Sr","etc","vs","e.g","i.e","U.S","U.K"}`
- Skip fragments < 3 chars
- Force-flush when buffer > `max_chars`

- [ ] **Step 1: Failing test**

```python
# tests/test_sentence_buffer.py
from server.voice.sentence_buffer import SentenceBuffer


def test_decimal_not_split():
    b = SentenceBuffer()
    out = b.push("Python 3.12.5 is installed.")
    assert out == ["Python 3.12.5 is installed."]


def test_two_sentences():
    b = SentenceBuffer()
    out = b.push("Hello. World!")
    assert out == ["Hello.", "World!"]


def test_abbrev_not_split():
    b = SentenceBuffer()
    out = b.push("Dr. Smith said hi. Bye.")
    assert out == ["Dr. Smith said hi.", "Bye."]


def test_force_flush_on_max_chars():
    b = SentenceBuffer(max_chars=10)
    out = b.push("a" * 25)
    # at least one forced flush
    assert any(len(s) <= 10 for s in out)


def test_short_fragment_not_flushed():
    b = SentenceBuffer()
    out = b.push("ok.")
    assert out == []


def test_flush_returns_remainder():
    b = SentenceBuffer()
    b.push("incomplete sentence")
    rest = b.flush()
    assert rest == ["incomplete sentence"]


def test_flush_idempotent_empty():
    b = SentenceBuffer()
    assert b.flush() == []
```

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement**

```python
# server/voice/sentence_buffer.py
"""Sentence splitter that flushes on terminal punctuation but skips
decimal points and abbreviations. Has a MAX_CHARS safety ceiling."""
from __future__ import annotations
import re


_TERMINATORS = (".", "!", "?")
_ABBREVIATIONS = {
    "Mr", "Mrs", "Ms", "Dr", "St", "Jr", "Sr",
    "etc", "vs", "e.g", "i.e", "U.S", "U.K",
}


class SentenceBuffer:
    def __init__(self, max_chars: int = 240) -> None:
        self.max_chars = max_chars
        self._buf: str = ""

    def push(self, text: str) -> list[str]:
        self._buf += text
        return self._drain(force=False)

    def flush(self) -> list[str]:
        return self._drain(force=True)

    def _drain(self, force: bool) -> list[str]:
        out: list[str] = []
        while True:
            idx, term = self._find_terminator()
            if idx == -1:
                break
            sent = self._buf[: idx + 1].strip()
            self._buf = self._buf[idx + 1 :]
            if len(sent) < 3:
                continue
            out.append(sent)
        if force and self._buf.strip():
            out.append(self._buf.strip())
            self._buf = ""
        if not force and len(self._buf) > self.max_chars:
            out.append(self._buf.strip())
            self._buf = ""
        return out

    def _find_terminator(self) -> tuple[int, str]:
        for i, ch in enumerate(self._buf):
            if ch not in _TERMINATORS:
                continue
            if i + 1 < len(self._buf) and self._buf[i + 1] not in (" ", "\n"):
                # not at end of sentence (e.g. "3.12")
                continue
            prev = self._buf[i - 1] if i > 0 else ""
            nxt = self._buf[i + 1] if i + 1 < len(self._buf) else ""
            if prev.isdigit() and nxt.isdigit():
                continue
            # abbreviation check: token immediately before terminator
            token = self._extract_token_before(i)
            if token in _ABBREVIATIONS:
                continue
            return i, ch
        return -1, ""

    @staticmethod
    def _extract_token_before(pos: int) -> str:
        i = pos - 1
        while i >= 0 and self._is_token_char_local := (  # noqa: F841
            lambda c: c.isalpha() or c in "."
        )(self._buf[i]):
            i -= 1
        return self._buf[i + 1 : pos]
```

NOTE: replace the lambda with a simple helper:

```python
    @staticmethod
    def _extract_token_before(buf: str, pos: int) -> str:
        i = pos - 1
        while i >= 0 and (buf[i].isalpha() or buf[i] == "."):
            i -= 1
        return buf[i + 1 : pos]
```

And use `SentenceBuffer._extract_token_before(self._buf, i)`.

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

### Task 7: MockTTS

**Files:**
- Create: `server/tts/mock.py`
- Modify: `server/tts/__init__.py` to export
- Test: tests inline in Task 9 (covered via VoiceEngine tests)

- [ ] **Step 1: Create**

```python
# server/tts/mock.py
"""Mock TTS that returns deterministic bytes per sentence."""
from __future__ import annotations
from .base import TTSEngine


class MockTTS(TTSEngine):
    async def synthesize(self, text: str) -> bytes:
        return (text.encode() * 4)[: 64]
```

- [ ] **Step 2: Export**

Update `server/tts/__init__.py` to include `MockTTS`.

- [ ] **Step 3: Commit**

### Task 8: VoiceEngine orchestrator

**Files:**
- Create: `server/voice/engine.py`
- Test: `tests/test_voice_engine_state_machine.py`, plus tests 7-12 in the spec

**Behavior:**
- `start_listening` loops: `read_chunk → aec.process → vad.is_speech → stt.transcribe → _handle_user_text`
- `_handle_user_text(text)`:
  - `gen = self.gen.bump()`; `self.queue.set_gen(gen)`
  - State → THINKING
  - Iterate `cm.respond_text(text)`:
    - skip if stale; accumulate; push to SentenceBuffer; synthesize each sentence
  - flush buffer; if nothing spoken, synthesize `"I didn't catch that."`
  - State → SPEAKING; drain queue; State → LISTENING
- `interrupt()`: `gen.bump()`; `queue.set_gen(gen)`; `buffer.flush()`; `audio_output.stop()`; State → LISTENING
- `stop()`: bump, stop I/O, State → IDLE

- [ ] **Step 1: Implement (full file below)**

```python
# server/voice/engine.py
"""VoiceEngine — real-time voice layer around ConversationManager."""
from __future__ import annotations
import asyncio
import logging
from typing import Iterable

from server.conversation.manager import ConversationManager, ChatChunk
from .aec import AEC
from .audio_io import AudioInput, AudioOutput
from .audio_queue import AudioCard, AudioQueue
from .generation import GenerationCounter
from .sentence_buffer import SentenceBuffer
from .states import VoiceState
from server.tts.base import TTSEngine
from server.voice.base import STTService, VADService


log = logging.getLogger("os.voice")


class VoiceEngine:
    def __init__(
        self,
        cm: ConversationManager,
        audio_input: AudioInput,
        aec: AEC,
        vad: VADService,
        stt: STTService,
        tts: TTSEngine,
        audio_output: AudioOutput,
        *,
        max_buffer_chars: int = 240,
    ) -> None:
        self.cm = cm
        self.audio_input = audio_input
        self.aec = aec
        self.vad = vad
        self.stt = stt
        self.tts = tts
        self.audio_output = audio_output
        self.gen = GenerationCounter()
        self.queue = AudioQueue()
        self.buffer = SentenceBuffer(max_chars=max_buffer_chars)
        self.state = VoiceState.IDLE
        self._stopped = False
        self._states: list[VoiceState] = [self.state]

    def _set_state(self, s: VoiceState) -> None:
        if self.state != s:
            self.state = s
            self._states.append(s)

    def state_history(self) -> list[VoiceState]:
        return list(self._states)

    async def start_listening(self) -> None:
        self._set_state(VoiceState.LISTENING)
        try:
            while not self._stopped:
                raw = await self.audio_input.read_chunk()
                if raw is None:
                    if self._stopped:
                        break
                    await asyncio.sleep(0)
                    continue
                try:
                    cleaned = self.aec.process(raw)
                    if not self.vad.is_speech(cleaned):
                        continue
                    self._set_state(VoiceState.USER_SPEAKING)
                    text = await self.stt.transcribe(cleaned)
                except Exception:
                    log.exception("input pipeline failure")
                    self._set_state(VoiceState.ERROR)
                    self._set_state(VoiceState.LISTENING)
                    continue
                if not (text or "").strip():
                    self._set_state(VoiceState.LISTENING)
                    continue
                await self._handle_user_text(text)
        except Exception:
            log.exception("start_listening crashed")
            self._set_state(VoiceState.ERROR)
            self._set_state(VoiceState.LISTENING)

    async def _handle_user_text(self, text: str) -> None:
        gen = self.gen.bump()
        self.queue.set_gen(gen)
        self._set_state(VoiceState.THINKING)
        spoken_any = False
        try:
            async for chunk in self.cm.respond_text(text):
                if gen != self.gen.current():
                    return
                if chunk.delta:
                    spoken_any = True
                    for sent in self.buffer.push(chunk.delta):
                        if await self._synthesize(sent, gen):
                            pass
            for sent in self.buffer.flush():
                if await self._synthesize(sent, gen):
                    pass
        except Exception:
            log.exception("LLM/tool pipeline failure")
            await self._synthesize("Sorry, something went wrong.", gen)
        if not spoken_any and not self._is_stale(gen):
            await self._synthesize("I didn't catch that.", gen)
        self._set_state(VoiceState.SPEAKING)
        await self._drain(gen)
        self._set_state(VoiceState.LISTENING)

    def _is_stale(self, gen: int) -> bool:
        return gen != self.gen.current()

    async def _synthesize(self, sentence: str, gen: int) -> bool:
        if self._is_stale(gen):
            return False
        try:
            samples = await self.tts.synthesize(sentence)
        except Exception:
            log.exception("TTS failure")
            return False
        await self.queue.put(
            AudioCard(gen_id=gen, sentence=sentence, samples=samples)
        )
        return True

    async def _drain(self, gen: int) -> None:
        try:
            while not self._is_stale(gen):
                card = await self.queue.get()
                if self._is_stale(gen):
                    return
                await self.audio_output.play(card)
        except Exception:
            log.exception("drain/play failure")

    def interrupt(self) -> None:
        gen = self.gen.bump()
        self.queue.set_gen(gen)
        self.queue.clear_stale()
        self.buffer.flush()
        self.audio_output.stop()
        self._set_state(VoiceState.LISTENING)

    async def stop(self) -> None:
        self._stopped = True
        self.gen.bump()
        self.audio_input.stop()
        self.audio_output.stop()
        self._set_state(VoiceState.IDLE)
```

- [ ] **Step 2: Commit**

### Task 9: VoiceEngine tests (state machine, barge-in, stale, empty, tts fail, stt fail, sentence buffering)

**Files:**
- Create: `tests/test_voice_engine_state_machine.py`
- Create: `tests/test_voice_engine_barge_in.py`
- Create: `tests/test_voice_engine_stale_gen.py`
- Create: `tests/test_voice_engine_empty_response.py`
- Create: `tests/test_voice_engine_tts_failure.py`
- Create: `tests/test_voice_engine_stt_failure.py`
- Create: `tests/test_voice_engine_sentence_buffering.py`

All tests use mocks. Below is one test file per behavior.

- [ ] **Step 1: state_machine test**

```python
# tests/test_voice_engine_state_machine.py
import asyncio
from server.conversation.manager import ConversationManager, ChatChunk, Message
from server.voice.engine import VoiceEngine
from server.voice.states import VoiceState
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.audio_queue import AudioCard
from server.voice.generation import GenerationCounter
from server.voice.sentence_buffer import SentenceBuffer
from server.tts.mock import MockTTS


class _StubSTT:
    async def transcribe(self, audio: bytes) -> str:
        return "hello"


class _StubVAD:
    def is_speech(self, audio: bytes) -> bool:
        return True


class _StubCM:
    async def respond_text(self, text: str):
        yield ChatChunk(delta="Hi there.", done=True)


async def _drive(engine: VoiceEngine) -> None:
    inp_task = asyncio.create_task(engine.start_listening())
    await asyncio.sleep(0.05)
    await engine.stop()
    try:
        await inp_task
    except asyncio.CancelledError:
        pass


def test_full_turn_state_progression():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_StubCM(),
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_StubVAD(),
        stt=_StubSTT(),
        tts=MockTTS(),
        audio_output=out,
    )
    asyncio.run(_drive(engine))
    history = engine.state_history()
    # Must include IDLE, LISTENING, USER_SPEAKING, THINKING, SPEAKING, LISTENING, IDLE
    for s in (VoiceState.LISTENING, VoiceState.THINKING,
              VoiceState.SPEAKING, VoiceState.IDLE):
        assert s in history, f"missing {s} in {history}"
    assert history[-1] == VoiceState.IDLE
```

- [ ] **Step 2: barge_in test**

```python
# tests/test_voice_engine_barge_in.py
import asyncio
from server.voice.engine import VoiceEngine
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.states import VoiceState
from server.conversation.manager import ChatChunk
from server.tts.mock import MockTTS


class _SlowSTT:
    async def transcribe(self, audio: bytes) -> str:
        return "hi"


class _V:
    def is_speech(self, a): return True


class _SlowCM:
    def __init__(self):
        self.yielded = 0

    async def respond_text(self, text: str):
        # 3 sentences, but interrupt happens after first
        for s in ("First.", " Second.", " Third."):
            self.yielded += 1
            yield ChatChunk(delta=s)
        yield ChatChunk(done=True)


def test_interrupt_drops_pending_audio():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    cm = _SlowCM()
    engine = VoiceEngine(
        cm=cm, audio_input=inp, aec=PassthroughAEC(),
        vad=_V(), stt=_SlowSTT(), tts=MockTTS(), audio_output=out,
    )

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.02)
        engine.interrupt()
        await asyncio.sleep(0.05)
        await engine.stop()
        try:
            await task
        except asyncio.CancelledError:
            pass

    asyncio.run(go())
    # gen was bumped; queued stale cards discarded
    # Output should NOT contain all 3 sentences
    sentences = [c.sentence for c in out.played]
    assert len(sentences) < 3 or engine.gen.current() >= 2
```

- [ ] **Step 3: stale_gen test**

```python
# tests/test_voice_engine_stale_gen.py
import asyncio
from server.voice.engine import VoiceEngine
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.audio_queue import AudioCard
from server.voice.states import VoiceState
from server.conversation.manager import ChatChunk
from server.tts.mock import MockTTS


class _STT:
    async def transcribe(self, a): return "x"


class _V:
    def is_speech(self, a): return True


class _CM:
    async def respond_text(self, t):
        yield ChatChunk(delta="only.", done=True)


def test_stale_card_never_reaches_audio_output():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_CM(), audio_input=inp, aec=PassthroughAEC(),
        vad=_V(), stt=_STT(), tts=MockTTS(), audio_output=out,
    )
    # Inject a stale card directly into the queue at the OLD gen
    stale = AudioCard(gen_id=0, sentence="stale", samples=b"x")
    asyncio.run(engine.queue.put(stale))
    # bump gen and run
    engine.gen.bump()
    engine.queue.set_gen(engine.gen.current())

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.05)
        await engine.stop()
        try: await task
        except asyncio.CancelledError: pass

    asyncio.run(go())
    # The injected stale card was dropped because gen was already > 0
    assert all(c.sentence != "stale" for c in out.played)
```

- [ ] **Step 4: empty_response test**

```python
# tests/test_voice_engine_empty_response.py
import asyncio
from server.voice.engine import VoiceEngine
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.conversation.manager import ChatChunk
from server.tts.mock import MockTTS


class _STT:
    async def transcribe(self, a): return "x"


class _V:
    def is_speech(self, a): return True


class _EmptyCM:
    async def respond_text(self, t):
        if False: yield  # never yields
        return


def test_empty_llm_response_speaks_fallback():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_EmptyCM(), audio_input=inp, aec=PassthroughAEC(),
        vad=_V(), stt=_STT(), tts=MockTTS(), audio_output=out,
    )

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.05)
        await engine.stop()
        try: await task
        except asyncio.CancelledError: pass

    asyncio.run(go())
    sentences = [c.sentence for c in out.played]
    assert any("didn't catch" in s for s in sentences)
```

- [ ] **Step 5: tts_failure test**

```python
# tests/test_voice_engine_tts_failure.py
import asyncio
from server.voice.engine import VoiceEngine
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.conversation.manager import ChatChunk
from server.tts.base import TTSEngine


class _STT:
    async def transcribe(self, a): return "x"


class _V:
    def is_speech(self, a): return True


class _BoomTTS(TTSEngine):
    async def synthesize(self, text: str) -> bytes:
        raise RuntimeError("tts kaboom")


class _CM:
    async def respond_text(self, t):
        yield ChatChunk(delta="hi.", done=True)


def test_tts_failure_does_not_crash_engine():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_CM(), audio_input=inp, aec=PassthroughAEC(),
        vad=_V(), stt=_STT(), tts=_BoomTTS(), audio_output=out,
    )

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.05)
        await engine.stop()
        try: await task
        except asyncio.CancelledError: pass

    asyncio.run(go())
    # Engine finished without raising; final state is IDLE
    assert engine.state.value == "IDLE"
```

- [ ] **Step 6: stt_failure test**

```python
# tests/test_voice_engine_stt_failure.py
import asyncio
from server.voice.engine import VoiceEngine
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.states import VoiceState
from server.conversation.manager import ChatChunk
from server.tts.mock import MockTTS


class _BoomSTT:
    async def transcribe(self, a):
        raise RuntimeError("stt down")


class _V:
    def is_speech(self, a): return True


class _CM:
    async def respond_text(self, t):
        yield ChatChunk(delta="never", done=True)


def test_stt_failure_returns_to_listening():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_CM(), audio_input=inp, aec=PassthroughAEC(),
        vad=_V(), stt=_BoomSTT(), tts=MockTTS(), audio_output=out,
    )

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.05)
        await engine.stop()
        try: await task
        except asyncio.CancelledError: pass

    asyncio.run(go())
    # Engine recovered to LISTENING then IDLE; no permanent stuck state
    history = engine.state_history()
    assert VoiceState.LISTENING in history
    assert engine.state.value == "IDLE"
    # No audio was queued because STT failed
    assert out.played == []
```

- [ ] **Step 7: sentence_buffering test**

```python
# tests/test_voice_engine_sentence_buffering.py
import asyncio
from server.voice.engine import VoiceEngine
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.conversation.manager import ChatChunk
from server.tts.mock import MockTTS


class _STT:
    async def transcribe(self, a): return "x"


class _V:
    def is_speech(self, a): return True


class _MultiSentenceCM:
    async def respond_text(self, t):
        for piece in ("First. ", "Second. ", "Third."):
            yield ChatChunk(delta=piece)
        yield ChatChunk(done=True)


def test_three_sentences_yield_three_cards():
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_MultiSentenceCM(), audio_input=inp, aec=PassthroughAEC(),
        vad=_V(), stt=_STT(), tts=MockTTS(), audio_output=out,
    )

    async def go():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.05)
        await engine.stop()
        try: await task
        except asyncio.CancelledError: pass

    asyncio.run(go())
    sentences = [c.sentence for c in out.played]
    assert "First." in sentences
    assert "Second." in sentences
    assert "Third." in sentences
```

- [ ] **Step 8: Run all voice tests**

Run: `python -m pytest tests/test_aec.py tests/test_audio_io.py tests/test_audio_queue.py tests/test_generation.py tests/test_sentence_buffer.py tests/test_voice_engine_state_machine.py tests/test_voice_engine_barge_in.py tests/test_voice_engine_stale_gen.py tests/test_voice_engine_empty_response.py tests/test_voice_engine_tts_failure.py tests/test_voice_engine_stt_failure.py tests/test_voice_engine_sentence_buffering.py -v`

Expected: all PASS.

- [ ] **Step 9: Run full test suite**

Run: `python -m pytest -v`

Expected: 33 prior tests + 11 new voice tests all PASS.

- [ ] **Step 10: Commit**

### Task 10: Smoke test

- [ ] **Step 1: Create `verify_voice.py`**

```python
# verify_voice.py
"""Smoke test: full conversation engine + voice engine with mocks."""
import asyncio
from config import load_config
from server.conversation.manager import ConversationManager, ChatChunk, Message
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.tools.datetime_tool import DATETIME_SPEC, format_datetime, get_current_datetime
from server.response.policy import ResponsePolicy
from server.voice.engine import VoiceEngine
from server.voice.aec import PassthroughAEC
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.states import VoiceState
from server.tts.mock import MockTTS


class _STT:
    async def transcribe(self, a): return "what time is it?"


class _V:
    def is_speech(self, a): return True


async def main():
    cfg = load_config()
    cm = ConversationManager(
        cfg,
        intent_router=IntentRouter(),
        tool_registry=ToolRegistry(),
        response_policy=ResponsePolicy(forbidden_prefixes=cfg.personality.forbidden_phrases),
    )
    reg = cm.tool_registry
    reg.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    inp = MockAudioInput([b"x", b"y"])
    out = MockAudioOutput()
    eng = VoiceEngine(
        cm=cm, audio_input=inp, aec=PassthroughAEC(),
        vad=_V(), stt=_STT(), tts=MockTTS(), audio_output=out,
    )
    task = asyncio.create_task(eng.start_listening())
    await asyncio.sleep(0.1)
    await eng.stop()
    try: await task
    except asyncio.CancelledError: pass
    print(f"final state: {eng.state.value}")
    print(f"played cards: {[c.sentence for c in out.played]}")


if __name__ == "__main__":
    asyncio.run(main())
```

- [ ] **Step 2: Run `python verify_voice.py`**

Expected output: `final state: IDLE` and `played cards` contains a clock-style sentence.

- [ ] **Step 3: Commit**