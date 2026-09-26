# OS Voice Engine v1 — Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real-time voice layer (listen → think → speak) around the already-tested `ConversationManager`, with deterministic recovery paths and generation-ID-based stale-work discard.

**Architecture:** `VoiceEngine` owns the audio state machine. It pulls mic frames through `AudioInput → AEC → VAD → STT`, hands recognized text to `ConversationManager.respond_text`, then pipes the resulting `ChatChunk` stream through `SentenceBuffer → TTS → AudioQueue → AudioOutput`. STT/VAD/TTS/AEC/Audio I/O are all Protocol/ABC + mock impl; real impls (Silero, faster-whisper, PocketTTS, sounddevice) ship with correct interfaces but are not wired to hardware in v1.

**Tech Stack:** Python 3.12, asyncio, dataclasses, faster-whisper (interface only — not wired), silero-vad (interface only), pocket-tts (fixed interface — not wired), existing ConversationManager.

## Global Constraints

1. AEC belongs on the microphone/input path: `Microphone → AEC → VAD → STT`. Do not place AEC after AudioOutput.
2. AEC v1 is a pass-through interface only (`PassthroughAEC`). Must be replaceable by a real implementation later.
3. VoiceEngine must have explicit recovery paths for: STT failure, LLM failure, empty LLM stream, TTS failure, audio queue failure.
4. No failure may leave VoiceEngine permanently stuck in `USER_SPEAKING`, `THINKING`, or `SPEAKING`.
5. Generation IDs represent the entire response generation. LLM chunks, sentences, TTS jobs, and AudioCards must be associated with the generation.
6. Interrupting (`interrupt()`) increments the generation ID and cancels/discards all stale work.
7. SentenceBuffer flushes on sentence-ending punctuation (`.`, `!`, `?`) but must skip obvious decimal/abbreviation splits and must have a `MAX_CHARS` ceiling.
8. VoiceEngine must NOT modify `ConversationManager`.
9. Keep all I/O mocked in v1.
10. Add deterministic tests for every state transition, interruption, stale-generation discard, empty response, TTS failure, STT failure, and sentence buffering.
11. Conversation engine stays frozen at 33/33 passing tests. Do not change `ConversationManager`, `IntentRouter`, `ToolRegistry`, `ResponsePolicy`, `MemoryRetriever`, or `personality.py`.

---

## Architecture

```
 USER (mic)
     │
     ▼
 AudioInput (Protocol + Mock)            AudioOutput (Protocol + Mock)
     │                                          ▲
     ▼                                          │
 AEC (Protocol + PassthroughAEC)                │
     │                                          │
     ▼                                          │
 VADService (Protocol + MockVAD)                │
     │                                          │
     ▼                                          │
 STTService (Protocol + MockSTT)                │
     │                                          │
     ▼ user_text                                │
     │                                          │
     ▼                                          │
 ConversationManager.respond_text  ← untouched │
     │                                          │
     ▼                                          │
 ChatChunk stream (gen_id = N)                  │
     │                                          │
     ▼                                          │
 SentenceBuffer (punctuation + MAX_CHARS)       │
     │                                          │
     ▼                                          │
 TTSEngine (ABC + MockTTS)                      │
     │                                          │
     ▼                                          │
 AudioCard(gen_id=N) → AudioQueue ──────────────┘
                  │
                  ▼ stale (gen_id < N) discarded
```

## Generation ID Rules

- One monotonic `gen_id` covers: LLM chunks → sentences → TTS jobs → AudioCards.
- `GenerationCounter` lives on `VoiceEngine`.
- `interrupt()` calls `gen.bump()`; `AudioQueue.set_gen(new)` immediately rejects older cards.
- Every `ChatChunk` arrival, sentence synthesis, and AudioCard enqueue checks `gen == self.gen.current()` first.
- Stale work is silently dropped — no exceptions, no logs beyond debug.

## State Machine (with recovery)

```
                    ┌──────────────┐
                    │     IDLE     │
                    └──────┬───────┘
                           ▼
                      LISTENING
                           ▼
                    USER_SPEAKING
                           ▼
                       THINKING
                       ┌─┴─┐
                failure│   │success
                       ▼   ▼
                    ERROR  SPEAKING
                       │   │
                       └─┬─┘
                         ▼
                     LISTENING
```

Hard rule: every catch path lands on `LISTENING` (or `IDLE` after `stop()`). No `return` leaves the engine in `USER_SPEAKING`, `THINKING`, or `SPEAKING`.

## File Layout

```
server/voice/
├── __init__.py
├── base.py              # existing Protocols: STTService, VADService
├── stt.py               # existing file-based STT (kept as legacy)
├── stt_base.py          # existing
├── vad.py               # existing energy-based VAD (kept as legacy)
├── aec.py               # NEW: AEC Protocol + PassthroughAEC
├── audio_io.py          # NEW: AudioInput/AudioOutput Protocols + Mocks
├── sentence_buffer.py   # NEW: punctuation + MAX_CHARS splitter
├── audio_queue.py       # NEW: AudioCard + AudioQueue with gen_id discard
├── generation.py        # NEW: GenerationCounter (atomic int)
├── states.py            # NEW: VoiceState enum
└── engine.py            # NEW: VoiceEngine orchestrator

server/tts/
├── __init__.py
├── base.py              # existing ABC — kept
├── pocket.py            # FIX: rename pocket_ttf typo, fix stream() impl
├── mock.py              # NEW: MockTTS
└── manager.py           # FIX: actually pick PocketTTS first, fallback Mock

tests/
├── test_aec.py
├── test_audio_io.py
├── test_sentence_buffer.py
├── test_audio_queue.py
├── test_generation.py
├── test_voice_engine_state_machine.py
├── test_voice_engine_barge_in.py
├── test_voice_engine_stale_gen.py
├── test_voice_engine_empty_response.py
├── test_voice_engine_tts_failure.py
├── test_voice_engine_stt_failure.py
└── test_voice_engine_sentence_buffering.py
```

## Component Interfaces

### AEC (server/voice/aec.py)

```python
class AEC(Protocol):
    def process(self, mic_chunk: bytes, speaker_ref: bytes | None = None) -> bytes: ...

class PassthroughAEC:
    def process(self, mic_chunk: bytes, speaker_ref: bytes | None = None) -> bytes:
        return mic_chunk
```

### Audio I/O (server/voice/audio_io.py)

```python
class AudioInput(Protocol):
    async def read_chunk(self, timeout_ms: int = 100) -> bytes | None: ...
    def stop(self) -> None: ...

class MockAudioInput:
    """Yields pre-loaded byte chunks from a list; returns None on stop()."""

class AudioOutput(Protocol):
    async def play(self, card: "AudioCard") -> None: ...
    def stop(self) -> None: ...

class MockAudioOutput:
    """Records played cards in a list; honors stop()."""
```

### SentenceBuffer (server/voice/sentence_buffer.py)

```python
class SentenceBuffer:
    def __init__(self, max_chars: int = 240) -> None: ...
    def push(self, text: str) -> list[str]:
        """Returns 0+ complete sentences to speak; remainder retained."""
    def flush(self) -> list[str]:
        """Force-flush remainder (called on stream end and on interrupt)."""
```

Flush rules:
- Split on `. ` / `! ` / `? ` or terminal `.` / `!` / `?`.
- Skip if preceded by a digit AND followed by a digit (decimal: `3.12`).
- Skip if the matched token is in `{"Mr","Dr","Mrs","Ms","St","Jr","Sr","etc","vs","e.g","i.e","U.S","U.K"}`.
- Skip fragments shorter than 3 chars (`"ok."`).
- Force-flush if buffer exceeds `max_chars` regardless of punctuation.

### AudioQueue (server/voice/audio_queue.py)

```python
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

    async def put(self, card: AudioCard) -> None:
        if card.gen_id != self._current_gen:
            return
        await self._q.put(card)

    async def get(self) -> AudioCard:
        card = await self._q.get()
        if card.gen_id != self._current_gen:
            return await self.get()
        return card

    def clear_stale(self) -> int:
        """Drop all queued cards not matching current gen. Returns count dropped."""
```

### GenerationCounter (server/voice/generation.py)

```python
class GenerationCounter:
    def __init__(self) -> None:
        self._n: int = 0
    def current(self) -> int: return self._n
    def bump(self) -> int:
        self._n += 1
        return self._n
```

### VoiceState (server/voice/states.py)

```python
class VoiceState(str, enum.Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    USER_SPEAKING = "USER_SPEAKING"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"
    ERROR = "ERROR"
```

### TTSEngine (server/tts/base.py — fix existing)

Existing ABC kept. Add async `synthesize(text: str) -> bytes`. `MockTTS` returns a fixed bytes blob (e.g. `text.encode() * 10`). `FallbackTTS` wraps an ordered list of engines and tries each until one succeeds.

### VoiceEngine (server/voice/engine.py)

```python
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
    ) -> None: ...

    async def start_listening(self) -> None: ...
    def interrupt(self) -> None: ...
    async def stop(self) -> None: ...
```

`start_listening` loops: `raw → aec → vad → stt → _handle_user_text`. Each transition is wrapped; failures route to ERROR then back to LISTENING.

`_handle_user_text`:
1. `gen = self.gen.bump()`
2. `self.queue.set_gen(gen)`
3. State → THINKING
4. Iterate `cm.respond_text(text)`:
   - Skip if `gen != self.gen.current()` (interrupted)
   - Accumulate deltas; push to `SentenceBuffer`
   - For each complete sentence, `_synthesize(sentence, gen)`
5. After loop, `flush()` remaining buffer
6. If nothing was spoken, synthesize `"I didn't catch that."`
7. State → SPEAKING, drain queue
8. State → LISTENING

`_synthesize`:
1. Skip if stale
2. Try `tts.synthesize(sentence)` — on exception, silent skip (log only)
3. `queue.put(AudioCard(...))` — auto-discards stale

## Error Handling Matrix

| Failure | Caught in | Recovery |
|---|---|---|
| `read_chunk` returns None / empty | `start_listening` continue | stay in LISTENING |
| STT returns empty | `_handle_user_text` continue | back to LISTENING |
| STT raises | `start_listening` outer except | ERROR → LISTENING |
| LLM stream raises | `_handle_user_text` outer except | speak apology, LISTENING |
| LLM stream yields no deltas | after loop in `_handle_user_text` | speak "I didn't catch that", LISTENING |
| TTS raises | `_synthesize` except | silent skip, log only |
| `audio_output.play` raises | `_drain_queue` except | drain stops, state → LISTENING |
| Unexpected exception anywhere | top-level except | ERROR → LISTENING |

## Test Plan (your 10th rule, one test file per behavior)

1. `test_aec.py` — `PassthroughAEC` returns input bytes unchanged.
2. `test_audio_io.py` — `MockAudioInput` drains list then returns None; `MockAudioOutput` records cards.
3. `test_sentence_buffer.py`:
   - "Python 3.12.5 is installed." → 1 sentence
   - "Dr. Smith said hi." → 1 sentence
   - "Hello. World!" → 2 sentences
   - 300-char input with no punctuation → forced flush
   - Fragment "ok." → not flushed
4. `test_audio_queue.py`:
   - put/get happy path
   - put with stale gen → silently dropped
   - clear_stale drops only stale cards
5. `test_generation.py` — bump returns increasing ints; current() returns latest.
6. `test_voice_engine_state_machine.py` — record every state transition; assert no state skipped during one full turn.
7. `test_voice_engine_barge_in.py` — `interrupt()` mid-SPEAKING → gen bumped, remaining cards discarded.
8. `test_voice_engine_stale_gen.py` — manually enqueue stale card → never reaches `audio_output`.
9. `test_voice_engine_empty_response.py` — cm yields no deltas → "I didn't catch that" spoken.
10. `test_voice_engine_tts_failure.py` — tts.synthesize raises → engine stays alive, no card queued.
11. `test_voice_engine_stt_failure.py` — stt.transcribe raises → state returns to LISTENING.
12. `test_voice_engine_sentence_buffering.py` — multi-sentence stream → each sentence spoken separately, not merged.

## Out of Scope (v1)

- Real microphone capture (sounddevice).
- Real Silero VAD model load.
- Real faster-whisper model load.
- Real Pocket TTS model load.
- Real WebRTC AEC.
- Audio format conversion (sample-rate matching).
- Wake-word detection.
- Multi-channel / multi-user.