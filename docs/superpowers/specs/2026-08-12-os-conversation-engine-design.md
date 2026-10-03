# OS Conversation Engine — Design Spec

**Date:** 2026-08-12
**Status:** Approved
**Scope:** Phase 1 text-mode conversation engine. No STT/TTS/AEC/VAD rewrite.

## Problem

OS's conversation layer has measurable bugs:

1. Time/date detection is keyword-only, so "what time is it?" works but "what date is it?" or "today?" leak to the LLM and produce hallucinated answers.
2. Memory subsystem exists but is never wired into the conversation flow.
3. Tool subsystem exists but is never invoked.
4. Forbidden-phrase list blocks legitimate English ("it is", "today is", "right now is").
5. No intent routing — every non-time/date query goes straight to the LLM, including ones that should hit a deterministic tool.
6. Tool results (when added) would be sent raw to TTS/terminal without formatting.
7. The LLM is asked to fabricate facts the OS already has (date/time, system info).

## Goals

- Add a rule-based intent router.
- Wire memory retrieval behind a cheap relevance gate.
- Add a tool registry with structured results and a DIRECT execution mode.
- Add a ResponsePolicy layer that prevents raw tool JSON from leaking to TTS or terminal and prevents fabricated information.
- Trim the forbidden-phrase list to genuine filler.
- Expand the system prompt with explicit conversation rules.
- Add automated tests for the new components.
- Keep the existing `ConversationManager` streaming flow intact.

## Non-Goals

- No STT, TTS, VAD, AEC, or speaker integration in this phase.
- No embedding-based memory search.
- No LLM-as-router.
- No task/planner integration (TASK intent reserved but unused).
- No rewrite of the streaming LLM client.

## Architecture

```
                         USER TEXT
                            │
                            ▼
                  ConversationManager
                            │
                            ▼
                     IntentRouter
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          TOOL_CALL      LLM_CHAT         TASK
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                     Memory Gate
                  (cheap relevance check)
                            │
                            ▼
                      Context Builder
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
        ToolRegistry                  OllamaClient
             │                             │
             ▼                             ▼
        ToolResult                   ChatChunk stream
             │                             │
             └─────────────┬───────────────┘
                           ▼
                     ResponsePolicy
                           │
                     ┌─────┴─────┐
                     ▼           ▼
                  Terminal       TTS
```

**Key invariants:**

- Memory is enrichment, never a separate intent.
- Tool results are structured (`ToolResult` dataclass); raw output never reaches TTS.
- ResponsePolicy never fabricates information.
- Developer logs go to `logs/os.log` via stderr only; the CLI's user-facing channel is `print()`.

## Components

### 1. `server/intent/router.py`

Rule-based pattern matcher. First-match-wins over a small regex list.

```python
class Intent(str, Enum):
    TOOL_CALL = "tool_call"
    LLM_CHAT = "llm_chat"
    TASK = "task"

@dataclass
class RouteDecision:
    intent: Intent
    tool_name: str | None = None
    confidence: float = 1.0
```

**Patterns (ordered):**

| Regex                                              | Intent    | Tool                  |
|----------------------------------------------------|-----------|-----------------------|
| `^\s*(what(?:'s)?\s+time\|what\s+date\|what\s+day\|today(?:'s)?\s+date\|when\s+is\s+it\|current\s+(?:date\|time\|day))` | TOOL_CALL | `get_current_datetime` |
| `^\s*(battery\|cpu(?:\s+usage)?\|memory(?:\s+usage)?\|ram(?:\s+usage)?\|disk(?:\s+usage)?\|system\s+info)\b` | TOOL_CALL | `get_system_info`     |
| `.*`                                               | LLM_CHAT  | None                  |

`open_application` and other app-launch tools are deferred — not added to the router in this phase.

### 2. `server/intent/registry.py`

```python
class ExecutionMode(str, Enum):
    DIRECT = "DIRECT"
    RESULT_THEN_LLM = "RESULT_THEN_LLM"

@dataclass
class ToolSpec:
    name: str
    description: str
    execution_mode: ExecutionMode
    requires_memory: bool = False
    requires_llm_interpretation: bool = False

@dataclass
class ToolResult:
    status: Literal["success", "failure"]
    mode: ExecutionMode
    data: dict[str, Any]
    error: str | None = None
```

`ToolRegistry.register(spec, handler, formatter)`:
- `handler(**kwargs) -> ToolResult` (async)
- `formatter(result: ToolResult) -> str` — DIRECT-mode user-facing sentence. Required for DIRECT. Not called for RESULT_THEN_LLM.

`ToolRegistry.execute(name, **kwargs) -> ToolResult`.

### 3. `server/memory/retriever.py`

```python
class MemoryRetriever:
    def __init__(self, memory: MemoryManager, cfg: ConversationConfig): ...
    def retrieve_relevant(self, user_text: str, needs_memory: bool = False) -> list[str]
```

Cheap relevance gate: skip retrieval when `user_text` matches trivial patterns (`hi`, `hello`, `how are you`, `tell me a joke`, `thanks`, `thank you`) regardless of `needs_memory`. Otherwise, always call `memory.retrieve(text, limit=max_relevant_memories)`. Limit defaults to `cfg.conversation.max_relevant_memories` (4).

### 4. `server/tools/datetime_tool.py`

```python
def get_current_datetime(**kwargs) -> ToolResult:
    now = datetime.datetime.now().astimezone()
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={
            "date": now.strftime("%A, %B %d, %Y"),
            "time": now.strftime("%I:%M %p"),
            "timezone": str(now.tzinfo),
            "iso": now.isoformat(),
        },
    )

def format_datetime(result: ToolResult) -> str:
    d = result.data
    return f"It's {d['time']} on {d['date']} ({d['timezone']})."
```

### 5. `server/tools/system_info_tool.py`

Stub. Returns ToolResult with `data={...}` placeholder. `format_system_info` returns "CPU: ...%, memory: ...%". Full implementation deferred to a later phase; the spec, file, and tests are added now to lock the contract.

### 6. `server/response/policy.py`

```python
@dataclass
class FinalResponse:
    text: str
    source: Literal["direct_tool", "tool_then_llm", "llm_chat", "fallback", "policy"]

class ResponsePolicy:
    def apply_direct(self, result: ToolResult, formatter: Callable[[ToolResult], str]) -> FinalResponse: ...
    def apply_tool_then_llm(self, result: ToolResult) -> FinalResponse: ...  # stub for now
    def apply_llm_chat(self, raw_text: str, forbidden_prefixes: list[str]) -> FinalResponse: ...
```

**Rules:**

| Case                          | Behavior                                                                |
|-------------------------------|-------------------------------------------------------------------------|
| DIRECT success                | `formatter(result.data)`; if empty → fallback message                   |
| DIRECT failure                | `f"I couldn't run {spec.name}. {result.error or 'Unknown error'}."`     |
| RESULT_THEN_LLM success       | Reserved; returns FinalResponse asking orchestrator to re-prompt LLM    |
| RESULT_THEN_LLM failure       | Same as DIRECT failure                                                  |
| LLM_CHAT normal               | Stream; sanitize only known filler prefixes (`Sure,`, `Certainly.`)     |
| LLM_CHAT empty                | `"I don't have anything to add."`                                       |
| Any                           | Never fabricate. Never invent current date/time. Never pretend success. |

### 7. `server/conversation/manager.py` (modified)

- Drop `_detect_time_query` and `_get_system_time`.
- Constructor takes `intent_router`, `tool_registry`, `memory_retriever`, `response_policy`, `memory` (for extraction).
- `respond_text` flow:
  1. `decision = router.classify(user_text)`
  2. If `TOOL_CALL`: get spec from registry; if `requires_memory`, fetch memories; call handler; apply policy via `apply_direct(result, formatter)`; yield single `ChatChunk(delta=text, done=True)`; append to history; return.
  3. If `LLM_CHAT`: fetch memories via gate; build context; stream LLM; collect; apply `apply_llm_chat`; yield streamed chunks; append to history.
  4. If `TASK`: yield polite deferral `"I'll handle tasks in a later phase."`; return.

### 8. `server/conversation/personality.py` (modified)

`build_system_prompt` appends an 18-rule "Conversation Rules" block from the goal text (Section 2). Existing tone/traits/forbidden behavior preserved.

### 9. `config/settings.yaml` (modified)

`forbidden_phrases` trimmed:

```yaml
forbidden_phrases:
  - "Based on the available conversation context"
  - "Certainly."
  - "Understood."
  - "Your request has been received."
  - "Processing..."
  - "Task completed successfully."
```

Dropped: `"right now is"`, `"today is"`, `"current date"`, `"current time"`, `"it is"`, `"How can I help you today"`, `"How can I assist you"`.

Add a new top-level block:

```yaml
tools:
  enabled:
    - get_current_datetime
    - get_system_info
```

## Logging boundary

Already enforced in `server/utils/__init__.py:setup_logging`:
- `httpx`, `httpcore`, `urllib3` → WARNING
- App log → stderr + `logs/os.log`
- CLI prints (`print(...)`) only in `cli.py`; the LLM stream is yielded as `chunk.delta`, which `cli.py` prints with a leading 2-space indent and no prefix.

No code path puts an httpx INFO line into a `print()` call.

## Tests

New file: `tests/test_conversation_engine.py`. Pure unit tests where possible; live tests gated on Ollama availability.

**Unit (always run):**

- `test_intent_router.py`:
  - T-IR-1: "what time is it?" → TOOL_CALL / get_current_datetime
  - T-IR-2: "what's the date?" → TOOL_CALL / get_current_datetime
  - T-IR-3: "today?" → TOOL_CALL / get_current_datetime
  - T-IR-4: "what is Python?" → LLM_CHAT
  - T-IR-5: "open chrome" → TOOL_CALL / open_application
  - T-IR-6: "battery" → TOOL_CALL / get_system_info

- `test_response_policy.py`:
  - T-RP-1: DIRECT success → formatter output, source=`direct_tool`
  - T-RP-2: DIRECT failure → `"I couldn't run ..."`, no fabrication
  - T-RP-3: LLM_CHAT empty → fallback message
  - T-RP-4: LLM_CHAT with leading "Sure," → scrubbed
  - T-RP-5: LLM_CHAT with "It is a programming language." → untouched

- `test_datetime_tool.py`:
  - T-DT-1: `get_current_datetime()` returns ToolResult with `status=success`, mode=DIRECT, populated `data`.
  - T-DT-2: `format_datetime(result)` produces a string containing both date and time, format `It's H:MM AM/PM on <weekday>, <month> DD, YYYY (TZ).`

**Integration (gated on `OLLAMA_RUNNING=1`):**

- `test_conversation_engine.py::test_live_acceptance`:
  - T1: "hi" → non-empty
  - T2: "what is Python?" → contains "Python" or "programming language"
  - T3: "what time is it?" → matches `^\d{1,2}:\d{2} (AM|PM)$`
  - T4: follow-up "who created it?" after "what is Python?" → contains "Guido" or "van Rossum"
  - T5: "what were we talking about?" after T2 → mentions "Python"
  - T6: store memory "user prefers dark mode" via SQLiteMemoryManager.store; ask "what do I prefer?" → contains "dark"
  - T7: malformed Ollama URL → friendly error message (no traceback)
  - T8: 5 unrelated questions → 5 distinct responses (verified by hashing)

## Acceptance criteria

1. `pytest tests/test_intent_router.py tests/test_response_policy.py tests/test_datetime_tool.py` passes with no Ollama required.
2. `pytest tests/test_conversation_engine.py` passes when Ollama is running.
3. `python cli.py` runs end-to-end with no httpx INFO lines on stderr and no Python tracebacks for normal queries.
4. `python verify_fixes.py` returns distinct, relevant responses for the four cases there.
5. Forbidden-phrase list no longer contains `"it is"`, `"today is"`, or `"right now is"`.

## Files changed

**New:**

- `server/intent/__init__.py`
- `server/intent/router.py`
- `server/intent/registry.py`
- `server/memory/retriever.py`
- `server/tools/__init__.py`
- `server/tools/datetime_tool.py`
- `server/tools/system_info_tool.py`
- `server/response/__init__.py`
- `server/response/policy.py`
- `tests/test_intent_router.py`
- `tests/test_response_policy.py`
- `tests/test_datetime_tool.py`
- `tests/test_conversation_engine.py`

**Modified:**

- `server/conversation/manager.py`
- `server/conversation/personality.py`
- `config/settings.yaml`

**Unchanged:**

- `cli.py`
- `server/llm/*`
- `server/voice/*`
- `server/tts/*`
- `server/memory/sqlite_impl.py`
- `server/tools/base.py`
- `server/tools/manager.py` (existing skill-based loader; we keep it but do not invoke from `ConversationManager` in this phase)

## Risks

- The current `_detect_time_query` matches `"current"` anywhere in the string. The new router's regex is anchored, so existing keys like "what's the current status" no longer route to the time tool. This is correct but changes behavior; tests verify it.
- Adding a TASK intent reservation without implementation may confuse future readers. Mitigated by a docstring on `Intent.TASK` and a stub in `respond_text`.
- `SQLiteMemoryManager.retrieve` uses `LIKE %query%` which is fragile for short queries. Acceptable for Phase 1; the retriever interface lets us swap to BM25/embeddings later.