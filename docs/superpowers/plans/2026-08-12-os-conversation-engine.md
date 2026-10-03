# OS Conversation Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix OS's conversation engine so it routes tool questions to deterministic tools, retrieves memory, never hallucinates date/time, never leaks raw tool output to the user, and respects a trimmed forbidden-phrase list.

**Architecture:** Add a rule-based `IntentRouter`, a `ToolRegistry` with structured `ToolResult`s and user-facing formatters, a `MemoryRetriever` with a cheap relevance gate, and a `ResponsePolicy` that prevents fabrication. Wire all four into `ConversationManager` between routing and the existing Ollama stream. Trim `forbidden_phrases` in `config/settings.yaml`. Expand the system prompt with conversation rules. Do not touch STT/TTS/VAD/AEC.

**Tech Stack:** Python 3.11+, pytest, SQLite (existing), httpx (existing), Ollama (existing).

## Global Constraints

- **Conversation engine scope only.** Do not modify `server/voice/*`, `server/tts/*`, or any audio I/O code.
- **Streaming stays intact.** `OllamaClient.chat_stream` is unchanged. `ConversationManager.respond_text` still yields `ChatChunk` tokens.
- **Tool output is structured.** Raw `ToolResult.data` (a dict) must never reach `print()` or TTS. DIRECT tools have a `formatter: Callable[[ToolResult], str]` that produces the user-facing sentence.
- **No fabrication.** `ResponsePolicy` must never invent date/time, status, or success. On tool failure, return an explicit failure message; on empty LLM output, return a controlled fallback.
- **No over-sanitization.** The forbidden-phrase filter strips only known filler prefixes (`Sure,`, `Certainly.`, `Understood.`). Do not block legitimate phrases like `"it is"` or `"today is"`.
- **httpx/httpcore logs stay out of user output.** `setup_logging` already silences them; do not add new `logging.info(...)` lines in the response path.
- **Trimmed forbidden list:** `"Based on the available conversation context"`, `"Certainly."`, `"Understood."`, `"Your request has been received."`, `"Processing..."`, `"Task completed successfully."`. Drop the rest.
- **Commit policy.** One commit per task. Conventional Commits prefix: `feat:`, `fix:`, `test:`, `chore:`, `refactor:`.

---

## Task 1: Intent router — regex classifier

**Files:**
- Create: `server/intent/__init__.py`
- Create: `server/intent/router.py`
- Test: `tests/test_intent_router.py`

**Interfaces:**
- Consumes: user text string
- Produces:
  ```python
  class Intent(str, Enum):
      TOOL_CALL = "tool_call"
      LLM_CHAT = "llm_chat"
      TASK = "task"

  @dataclass
  class RouteDecision:
      intent: Intent
      tool_name: str | None
      confidence: float

  class IntentRouter:
      def __init__(self, patterns: list[tuple[str, Intent, str | None]] | None = None) -> None: ...
      def classify(self, text: str) -> RouteDecision: ...
  ```

- [ ] **Step 1: Write the failing test**

```python
# tests/test_intent_router.py
from server.intent.router import IntentRouter, Intent, RouteDecision


def _r() -> IntentRouter:
    return IntentRouter()


def test_time_question_is_tool_call():
    d = _r().classify("what time is it?")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_current_datetime"


def test_date_question_is_tool_call():
    d = _r().classify("what's today's date?")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_current_datetime"


def test_bare_today_is_tool_call():
    d = _r().classify("today?")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_current_datetime"


def test_python_question_is_llm_chat():
    d = _r().classify("what is Python?")
    assert d.intent == Intent.LLM_CHAT
    assert d.tool_name is None


def test_battery_is_tool_call():
    d = _r().classify("battery")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_system_info"


def test_cpu_usage_is_tool_call():
    d = _r().classify("cpu usage")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_system_info"


def test_greeting_is_llm_chat():
    d = _r().classify("hi")
    assert d.intent == Intent.LLM_CHAT


def test_classify_strips_whitespace():
    d = _r().classify("   what time is it   ")
    assert d.intent == Intent.TOOL_CALL
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/test_intent_router.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'server.intent'`

- [ ] **Step 3: Create the package**

```python
# server/intent/__init__.py
"""Intent routing: classify user text into a tool call, chat, or task."""
from .router import Intent, IntentRouter, RouteDecision

__all__ = ["Intent", "IntentRouter", "RouteDecision"]
```

- [ ] **Step 4: Implement the router**

```python
# server/intent/router.py
"""Rule-based intent router.

Classifies user text into one of:
- TOOL_CALL: needs a deterministic tool (clock, system info, etc.)
- LLM_CHAT: regular conversational reply
- TASK: deferred; reserved for the planner (not used in Phase 1)

Patterns are ordered; first match wins.
"""
from __future__ import annotations

import enum
import re
from dataclasses import dataclass


class Intent(str, enum.Enum):
    TOOL_CALL = "tool_call"
    LLM_CHAT = "llm_chat"
    TASK = "task"


@dataclass
class RouteDecision:
    intent: Intent
    tool_name: str | None = None
    confidence: float = 1.0


# Order matters: first match wins.
DEFAULT_PATTERNS: list[tuple[re.Pattern[str], Intent, str | None]] = [
    (
        re.compile(
            r"^\s*("
            r"what(?:'s|\s+is)?\s+(?:the\s+)?(?:current\s+)?time"
            r"|what(?:'s|\s+is)?\s+(?:the\s+)?(?:today'?s?\s+)?date"
            r"|what\s+day\s+is\s+(?:it|today)"
            r"|today(?:'s)?\s+date"
            r"|when\s+is\s+it"
            r"|current\s+(?:date|time|day)"
            r")\s*\??\s*$",
            re.IGNORECASE,
        ),
        Intent.TOOL_CALL,
        "get_current_datetime",
    ),
    (
        re.compile(
            r"^\s*("
            r"battery(?:\s+level)?"
            r"|cpu(?:\s+usage)?"
            r"|memory(?:\s+usage)?"
            r"|ram(?:\s+usage)?"
            r"|disk(?:\s+usage)?"
            r"|system\s+info"
            r")\s*\??\s*$",
            re.IGNORECASE,
        ),
        Intent.TOOL_CALL,
        "get_system_info",
    ),
]


class IntentRouter:
    def __init__(
        self,
        patterns: list[tuple[re.Pattern[str], Intent, str | None]] | None = None,
    ) -> None:
        self._patterns = patterns if patterns is not None else DEFAULT_PATTERNS

    def classify(self, text: str) -> RouteDecision:
        for pattern, intent, tool in self._patterns:
            if pattern.match(text):
                return RouteDecision(intent=intent, tool_name=tool)
        return RouteDecision(intent=Intent.LLM_CHAT)
```

- [ ] **Step 5: Run test to verify it passes**

Run: `python -m pytest tests/test_intent_router.py -v`
Expected: 8 PASSED

- [ ] **Step 6: Commit**

```bash
git add server/intent tests/test_intent_router.py
git commit -m "feat: add rule-based intent router"
```

---

## Task 2: Tool registry — structured results + DIRECT formatters

**Files:**
- Create: `server/intent/registry.py`
- Create: `server/tools/__init__.py`
- Create: `server/tools/system_info_tool.py`
- Test: `tests/test_tool_registry.py`

**Interfaces:**
- Consumes: tool name + kwargs
- Produces:
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
      data: dict
      error: str | None

  class ToolRegistry:
      def register(self, spec: ToolSpec, handler, formatter=None) -> None: ...
      def get(self, name: str) -> tuple[ToolSpec, Callable, Callable | None]: ...
      def execute(self, name: str, **kwargs) -> ToolResult: ...
      def names(self) -> list[str]: ...
  ```

- [ ] **Step 1: Write the failing test**

```python
# tests/test_tool_registry.py
import asyncio
from server.intent.registry import (
    ExecutionMode,
    ToolRegistry,
    ToolResult,
    ToolSpec,
)


def _spec(name="t", mode=ExecutionMode.DIRECT, requires_memory=False):
    return ToolSpec(
        name=name,
        description=f"test {name}",
        execution_mode=mode,
        requires_memory=requires_memory,
    )


def _handler_ok(**kwargs):
    return ToolResult(status="success", mode=ExecutionMode.DIRECT, data={"x": 1})


def _handler_fail(**kwargs):
    return ToolResult(
        status="failure", mode=ExecutionMode.DIRECT, data={}, error="boom"
    )


def _formatter(result: ToolResult) -> str:
    return f"value={result.data['x']}"


def test_register_and_get():
    reg = ToolRegistry()
    reg.register(_spec(), _handler_ok, _formatter)
    spec, handler, fmt = reg.get("t")
    assert spec.name == "t"
    assert handler is _handler_ok
    assert fmt is _formatter


def test_get_missing_raises():
    reg = ToolRegistry()
    try:
        reg.get("nope")
    except KeyError:
        return
    raise AssertionError("expected KeyError")


def test_execute_success_returns_result():
    reg = ToolRegistry()
    reg.register(_spec(), _handler_ok, _formatter)
    result = reg.execute("t")
    assert result.status == "success"
    assert result.data == {"x": 1}


def test_execute_failure_returns_result():
    reg = ToolRegistry()
    reg.register(_spec(), _handler_fail, _formatter)
    result = reg.execute("t")
    assert result.status == "failure"
    assert result.error == "boom"


def test_execute_handler_exception_becomes_failure():
    def bad(**kw):
        raise RuntimeError("kaboom")

    reg = ToolRegistry()
    reg.register(_spec(), bad, _formatter)
    result = reg.execute("t")
    assert result.status == "failure"
    assert "kaboom" in (result.error or "")


def test_names_returns_registered():
    reg = ToolRegistry()
    reg.register(_spec("a"), _handler_ok, _formatter)
    reg.register(_spec("b"), _handler_ok, _formatter)
    assert set(reg.names()) == {"a", "b"}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/test_tool_registry.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'server.intent.registry'`

- [ ] **Step 3: Create package + module + stub system info tool**

```python
# server/tools/__init__.py
"""OS tools: deterministic, structured-result helpers for the router."""
```

```python
# server/intent/registry.py
"""Tool registry: stores ToolSpec + handler + formatter, runs tools."""
from __future__ import annotations

import asyncio
import enum
import logging
from dataclasses import dataclass, field
from typing import Any, Callable, Literal

log = logging.getLogger("os.tools.registry")


class ExecutionMode(str, enum.Enum):
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
    data: dict[str, Any] = field(default_factory=dict)
    error: str | None = None


Handler = Callable[..., Any]
Formatter = Callable[[ToolResult], str]


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[
            str, tuple[ToolSpec, Handler, Formatter | None]
        ] = {}

    def register(
        self,
        spec: ToolSpec,
        handler: Handler,
        formatter: Formatter | None = None,
    ) -> None:
        if spec.execution_mode == ExecutionMode.DIRECT and formatter is None:
            raise ValueError(
                f"DIRECT tool '{spec.name}' requires a user-facing formatter"
            )
        self._tools[spec.name] = (spec, handler, formatter)

    def get(self, name: str) -> tuple[ToolSpec, Handler, Formatter | None]:
        if name not in self._tools:
            raise KeyError(f"unknown tool: {name}")
        return self._tools[name]

    def execute(self, name: str, **kwargs: Any) -> ToolResult:
        if name not in self._tools:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error=f"unknown tool: {name}",
            )
        spec, handler, _ = self._tools[name]
        try:
            result = handler(**kwargs)
            if asyncio.iscoroutine(result):
                result = asyncio.run(result)
            if not isinstance(result, ToolResult):
                return ToolResult(
                    status="failure",
                    mode=spec.execution_mode,
                    error=f"tool '{name}' did not return ToolResult",
                )
            return result
        except Exception as e:  # noqa: BLE001
            log.exception("tool '%s' raised", name)
            return ToolResult(
                status="failure",
                mode=spec.execution_mode,
                error=f"{type(e).__name__}: {e}",
            )

    def names(self) -> list[str]:
        return sorted(self._tools.keys())
```

```python
# server/tools/system_info_tool.py
"""System info tool stub.

Phase 1 stub: returns placeholder data and a stable formatter. Real
psutil/wmi queries are deferred so this phase stays scoped to the
conversation engine.
"""
from __future__ import annotations

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


def get_system_info(**kwargs) -> ToolResult:
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={"cpu_percent": None, "memory_percent": None, "note": "stub"},
    )


def format_system_info(result: ToolResult) -> str:
    d = result.data
    if d.get("cpu_percent") is None:
        return "System info isn't wired up yet in this phase."
    return f"CPU: {d['cpu_percent']}%, memory: {d['memory_percent']}%."


SYSTEM_INFO_SPEC = ToolSpec(
    name="get_system_info",
    description="Get current system information (CPU, memory, battery).",
    execution_mode=ExecutionMode.DIRECT,
)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/test_tool_registry.py -v`
Expected: 6 PASSED

- [ ] **Step 5: Commit**

```bash
git add server/intent/registry.py server/tools tests/test_tool_registry.py
git commit -m "feat: add tool registry with structured results"
```

---

## Task 3: Date/time tool + formatter

**Files:**
- Create: `server/tools/datetime_tool.py`
- Test: `tests/test_datetime_tool.py`

**Interfaces:**
- Consumes: nothing (reads system clock)
- Produces:
  ```python
  def get_current_datetime(**kwargs) -> ToolResult: ...
  def format_datetime(result: ToolResult) -> str: ...
  DATETIME_SPEC: ToolSpec
  ```

- [ ] **Step 1: Write the failing test**

```python
# tests/test_datetime_tool.py
from server.intent.registry import ExecutionMode, ToolResult
from server.tools.datetime_tool import (
    DATETIME_SPEC,
    format_datetime,
    get_current_datetime,
)


def test_spec_metadata():
    assert DATETIME_SPEC.name == "get_current_datetime"
    assert DATETIME_SPEC.execution_mode == ExecutionMode.DIRECT


def test_get_returns_success_with_required_fields():
    r = get_current_datetime()
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    for key in ("date", "time", "timezone", "iso"):
        assert key in r.data and r.data[key]


def test_format_contains_date_and_time():
    r = get_current_datetime()
    s = format_datetime(r)
    assert r.data["time"] in s
    assert r.data["date"] in s


def test_format_starts_with_it_is():
    r = get_current_datetime()
    assert format_datetime(r).startswith("It's ")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/test_datetime_tool.py -v`
Expected: FAIL with `ModuleNotFoundError`

- [ ] **Step 3: Implement**

```python
# server/tools/datetime_tool.py
"""Date/time tool: deterministic system clock wrapped in a DIRECT tool."""
from __future__ import annotations

import datetime

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


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


DATETIME_SPEC = ToolSpec(
    name="get_current_datetime",
    description="Get the current local date and time.",
    execution_mode=ExecutionMode.DIRECT,
)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/test_datetime_tool.py -v`
Expected: 4 PASSED

- [ ] **Step 5: Commit**

```bash
git add server/tools/datetime_tool.py tests/test_datetime_tool.py
git commit -m "feat: add date/time tool with DIRECT formatter"
```

---

## Task 4: Response policy — finalize the output

**Files:**
- Create: `server/response/__init__.py`
- Create: `server/response/policy.py`
- Test: `tests/test_response_policy.py`

**Interfaces:**
- Produces:
  ```python
  @dataclass
  class FinalResponse:
      text: str
      source: Literal["direct_tool", "tool_then_llm", "llm_chat", "fallback", "policy"]

  class ResponsePolicy:
      def __init__(self, forbidden_prefixes: list[str] | None = None) -> None: ...
      def apply_direct(self, spec_name: str, result: ToolResult, formatter: Callable[[ToolResult], str]) -> FinalResponse: ...
      def apply_tool_then_llm(self, spec_name: str, result: ToolResult) -> FinalResponse: ...
      def apply_llm_chat(self, raw_text: str) -> FinalResponse: ...
  ```

- [ ] **Step 1: Write the failing test**

```python
# tests/test_response_policy.py
from server.intent.registry import ExecutionMode, ToolResult
from server.response.policy import ResponsePolicy


def _ok(data=None):
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT, data=data or {"k": "v"}
    )


def _fail(err="boom"):
    return ToolResult(
        status="failure", mode=ExecutionMode.DIRECT, data={}, error=err
    )


def _fmt(r):
    return f"formatted({r.data['k']})"


def test_direct_success_uses_formatter():
    p = ResponsePolicy()
    fr = p.apply_direct("t", _ok({"k": "X"}), _fmt)
    assert fr.text == "formatted(X)"
    assert fr.source == "direct_tool"


def test_direct_failure_returns_explicit_error():
    p = ResponsePolicy()
    fr = p.apply_direct("t", _fail("nope"), _fmt)
    assert fr.source == "policy"
    assert "couldn't run" in fr.text
    assert "nope" in fr.text


def test_tool_then_llm_success_returns_marker():
    p = ResponsePolicy()
    fr = p.apply_tool_then_llm("t", _ok({"k": "v"}))
    assert fr.source == "tool_then_llm"


def test_llm_chat_strips_sure_prefix():
    p = ResponsePolicy(forbidden_prefixes=["Sure,", "Certainly."])
    fr = p.apply_llm_chat("Sure, here's the thing.")
    assert not fr.text.lower().startswith("sure,")


def test_llm_chat_keeps_legitimate_phrase():
    p = ResponsePolicy(forbidden_prefixes=["Sure,", "Certainly."])
    fr = p.apply_llm_chat("It is a programming language.")
    assert "It is" in fr.text


def test_llm_chat_empty_returns_fallback():
    p = ResponsePolicy()
    fr = p.apply_llm_chat("   ")
    assert fr.source == "fallback"
    assert fr.text.strip()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/test_response_policy.py -v`
Expected: FAIL with `ModuleNotFoundError`

- [ ] **Step 3: Implement**

```python
# server/response/__init__.py
"""Response shaping layer."""
from .policy import FinalResponse, ResponsePolicy

__all__ = ["FinalResponse", "ResponsePolicy"]
```

```python
# server/response/policy.py
"""ResponsePolicy: converts raw tool / LLM output into a FinalResponse.

Responsibilities:
- Use the tool's user-facing formatter for DIRECT success.
- Return an explicit failure message for tool failures (never fabricate).
- Strip only known filler prefixes from LLM output. Never rewrite content.
- Return a controlled fallback when the LLM produces empty output.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Literal

from server.intent.registry import ToolResult


@dataclass
class FinalResponse:
    text: str
    source: Literal[
        "direct_tool", "tool_then_llm", "llm_chat", "fallback", "policy"
    ]


DEFAULT_FORBIDDEN_PREFIXES: list[str] = [
    "Sure,",
    "Certainly.",
    "Certainly,",
    "Understood.",
    "Understood,",
    "Your request has been received.",
    "Processing...",
]


class ResponsePolicy:
    def __init__(self, forbidden_prefixes: list[str] | None = None) -> None:
        self._forbidden = (
            forbidden_prefixes
            if forbidden_prefixes is not None
            else DEFAULT_FORBIDDEN_PREFIXES
        )

    def apply_direct(
        self,
        spec_name: str,
        result: ToolResult,
        formatter: Callable[[ToolResult], str],
    ) -> FinalResponse:
        if result.status == "failure":
            return FinalResponse(
                text=f"I couldn't run {spec_name}. {result.error or 'Unknown error.'}",
                source="policy",
            )
        try:
            text = formatter(result).strip()
        except Exception:  # noqa: BLE001
            return FinalResponse(
                text=f"I couldn't format the {spec_name} result.",
                source="policy",
            )
        if not text:
            return FinalResponse(
                text=f"I couldn't produce a response from {spec_name}.",
                source="policy",
            )
        return FinalResponse(text=text, source="direct_tool")

    def apply_tool_then_llm(
        self, spec_name: str, result: ToolResult
    ) -> FinalResponse:
        if result.status == "failure":
            return FinalResponse(
                text=f"I couldn't run {spec_name}. {result.error or 'Unknown error.'}",
                source="policy",
            )
        return FinalResponse(text="", source="tool_then_llm")

    def apply_llm_chat(self, raw_text: str) -> FinalResponse:
        text = (raw_text or "").strip()
        if not text:
            return FinalResponse(
                text="I don't have anything to add.", source="fallback"
            )
        for prefix in self._forbidden:
            stripped = text.lstrip()
            if stripped.startswith(prefix):
                text = stripped[len(prefix):].lstrip(" ,.")
                if text:
                    text = text[0].upper() + text[1:]
                break
        return FinalResponse(text=text, source="llm_chat")
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/test_response_policy.py -v`
Expected: 6 PASSED

- [ ] **Step 5: Commit**

```bash
git add server/response tests/test_response_policy.py
git commit -m "feat: add ResponsePolicy for direct/tool/llm paths"
```

---

## Task 5: Memory retriever with cheap relevance gate

**Files:**
- Create: `server/memory/retriever.py`
- Test: `tests/test_memory_retriever.py`

**Interfaces:**
- Consumes: `MemoryManager` (existing `SQLiteMemoryManager`), `ConversationConfig`
- Produces:
  ```python
  class MemoryRetriever:
      def __init__(self, memory: MemoryManager, cfg: ConversationConfig) -> None: ...
      def retrieve_relevant(self, user_text: str, needs_memory: bool = False) -> list[str]: ...
  ```

- [ ] **Step 1: Write the failing test**

```python
# tests/test_memory_retriever.py
from dataclasses import dataclass
from server.memory.base import MemoryManager, MemoryRecord, MemoryType
from server.memory.retriever import MemoryRetriever


@dataclass
class _Cfg:
    max_relevant_memories: int = 4


class _Mem(MemoryManager):
    def __init__(self, items):
        self._items = items

    def store(self, record): ...
    def retrieve(self, query, limit=4):
        out = []
        for r in self._items:
            if query.lower() in r.value.lower():
                out.append(r)
        return out[:limit]

    def extract(self, turns): ...
    def consolidate(self, max_age_days=None): ...
    def prune(self, max_age_days=None): ...


def _rec(value, key="k", imp=0.9):
    return MemoryRecord(
        key=key, value=value, memory_type=MemoryType.CONVERSATION, importance=imp
    )


def test_trivial_greeting_skips_memory():
    mem = _Mem([_rec("user is building OS")])
    r = MemoryRetriever(mem, _Cfg())
    assert r.retrieve_relevant("hi") == []


def test_tell_joke_skips_memory():
    mem = _Mem([_rec("user is building OS")])
    r = MemoryRetriever(mem, _Cfg())
    assert r.retrieve_relevant("tell me a joke") == []


def test_relevant_query_returns_memories():
    mem = _Mem([_rec("user is building OS, a voice assistant")])
    r = MemoryRetriever(mem, _Cfg())
    out = r.retrieve_relevant("what project am I working on?")
    assert len(out) == 1
    assert "OS" in out[0]


def test_needs_memory_force_fetches_even_trivial():
    mem = _Mem([_rec("OS project")])
    r = MemoryRetriever(mem, _Cfg())
    out = r.retrieve_relevant("hi", needs_memory=True)
    assert len(out) == 1
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/test_memory_retriever.py -v`
Expected: FAIL with `ModuleNotFoundError`

- [ ] **Step 3: Implement**

```python
# server/memory/retriever.py
"""MemoryRetriever: cheap relevance gate + delegate to MemoryManager."""
from __future__ import annotations

import re

from config import ConversationConfig
from .base import MemoryManager


_TRIVIAL_PATTERNS = [
    r"^\s*(hi|hello|hey|yo|hiya)\s*[.!?]?\s*$",
    r"^\s*(how\s+are\s+you|how'?s\s+it\s+going)\s*[.!?]?\s*$",
    r"^\s*(thanks|thank\s+you|thx|ty)\s*[.!?]?\s*$",
    r"^\s*tell\s+me\s+a\s+joke\s*[.!?]?\s*$",
    r"^\s*(good\s+morning|good\s+night|good\s+evening)\s*[.!?]?\s*$",
]

_TRIVIAL_RE = re.compile("|".join(_TRIVIAL_PATTERNS), re.IGNORECASE)


class MemoryRetriever:
    def __init__(self, memory: MemoryManager, cfg: ConversationConfig) -> None:
        self._memory = memory
        self._cfg = cfg

    def retrieve_relevant(
        self, user_text: str, needs_memory: bool = False
    ) -> list[str]:
        if not needs_memory and _TRIVIAL_RE.match(user_text):
            return []
        records = self._memory.retrieve(
            user_text, limit=self._cfg.max_relevant_memories
        )
        return [r.value for r in records]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/test_memory_retriever.py -v`
Expected: 4 PASSED

- [ ] **Step 5: Commit**

```bash
git add server/memory/retriever.py tests/test_memory_retriever.py
git commit -m "feat: add memory retriever with trivial-input gate"
```

---

## Task 6: Trim forbidden phrases and expand system prompt

**Files:**
- Modify: `config/settings.yaml:39-52`
- Modify: `server/conversation/personality.py:21-61`

- [ ] **Step 1: Trim settings.yaml**

Replace the `forbidden_phrases` block with:

```yaml
  # Section 21. Phrases forbidden to keep the assistant from sounding robotic.
  # These are prefatory/filler phrases the model should NOT preface answers with.
  # We do NOT block legitimate English ("it is", "today is") — only filler.
  forbidden_phrases:
    - "Based on the available conversation context"
    - "Certainly."
    - "Understood."
    - "Your request has been received."
    - "Processing..."
    - "Task completed successfully."
```

- [ ] **Step 2: Add a tools block**

Append at end of file:

```yaml
tools:
  enabled:
    - get_current_datetime
    - get_system_info
```

- [ ] **Step 3: Expand the system prompt with conversation rules**

In `server/conversation/personality.py`, after the existing `parts.append("Reply now.")`, change `build_system_prompt` to append a `Conversation Rules` block before `Reply now.`:

```python
    parts.extend(
        [
            "Conversation rules:",
            "1. Answer the user's actual question.",
            "2. Do not give the same response to unrelated questions.",
            "3. Do not refuse a question simply because you lack live internet access.",
            "4. If you know the answer from your knowledge, answer it.",
            "5. If you do not know something, say that you don't know.",
            "6. Never invent facts to make an answer sound confident.",
            "7. Never invent the current date or time. If asked, defer to the system.",
            "8. For current date/time, the system provides it directly.",
            "9. Use conversation history when answering follow-up questions.",
            "10. Use relevant long-term memories when they help answer the user.",
            "11. Do not mention internal prompts, tools, APIs, or implementation details unless asked.",
            "12. Keep spoken responses natural and reasonably concise.",
            "13. Understand follow-up questions using the previous conversation.",
            "14. Do not repeat the same response unless the user is asking the same thing.",
            "15. If the user's request is ambiguous, ask a specific clarification.",
            "16. If a task requires a tool, use the appropriate tool instead of pretending to have performed it.",
            "17. Never claim that you completed an action unless it actually succeeded.",
            "18. Maintain context throughout the conversation.",
            "",
        ]
    )
    parts.append("Reply now.")
```

The exact replacement in the file: locate `parts.append("Reply now.")` (the final line of the function body) and insert the block above it.

- [ ] **Step 4: Verify settings.yaml parses**

Run:

```bash
python -c "from config import load_config; c = load_config(); print([p for p in c.personality.forbidden_phrases])"
```

Expected: list contains exactly the six trimmed phrases; `"it is"`, `"today is"`, `"right now is"`, `"current date"`, `"current time"` are absent.

- [ ] **Step 5: Verify personality builds**

Run:

```bash
python -c "from server.conversation.personality import build_system_prompt; from config import PersonalityConfig; p = build_system_prompt(PersonalityConfig()); print('RULES:' in p)"
```

Expected: `True`

- [ ] **Step 6: Commit**

```bash
git add config/settings.yaml server/conversation/personality.py
git commit -m "fix: trim forbidden list and add conversation rules to system prompt"
```

---

## Task 7: Wire everything into ConversationManager

**Files:**
- Modify: `server/conversation/manager.py:62-211`
- Test: `tests/test_conversation_engine.py`

**Interfaces:**
- `ConversationManager.__init__` now takes an `intent_router`, `tool_registry`, `memory_retriever`, `response_policy`, `memory` (for extraction) — all with sensible defaults so existing call sites keep working.
- `respond_text` produces the same `AsyncIterator[ChatChunk]` shape.

- [ ] **Step 1: Write the failing integration test (offline, no Ollama)**

```python
# tests/test_conversation_engine.py
import asyncio
import re

from config import load_config
from server.conversation.manager import ConversationManager
from server.conversation.context import build_context_messages
from server.conversation.personality import build_system_prompt
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.tools.datetime_tool import (
    DATETIME_SPEC,
    format_datetime,
    get_current_datetime,
)
from server.tools.system_info_tool import (
    SYSTEM_INFO_SPEC,
    format_system_info,
    get_system_info,
)
from server.response.policy import ResponsePolicy


def _mgr():
    cfg = load_config()
    router = IntentRouter()
    reg = ToolRegistry()
    reg.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    reg.register(SYSTEM_INFO_SPEC, get_system_info, format_system_info)
    policy = ResponsePolicy(
        forbidden_prefixes=cfg.personality.forbidden_phrases
    )
    return ConversationManager(cfg, intent_router=router, tool_registry=reg, response_policy=policy)


async def _collect(text: str) -> str:
    m = _mgr()
    parts = []
    async for c in m.respond_text(text):
        parts.append(c.delta)
    return "".join(parts).strip()


def test_time_query_returns_clock_string():
    out = asyncio.run(_collect("what time is it?"))
    assert re.match(r"^It's \d{1,2}:\d{2} (AM|PM) on .+", out), out


def test_date_query_returns_clock_string():
    out = asyncio.run(_collect("what's today's date?"))
    assert re.match(r"^It's \d{1,2}:\d{2} (AM|PM) on .+", out), out


def test_system_info_stub():
    out = asyncio.run(_collect("battery"))
    assert "System info" in out or "stub" in out or "isn't wired" in out


def test_history_appends_user_and_assistant():
    m = _mgr()
    asyncio.run(_collect("hi"))
    asyncio.run(_collect("what time is it?"))
    assert len(m.history) >= 4


def test_personality_contains_conversation_rules():
    cfg = load_config()
    p = build_system_prompt(cfg.personality)
    assert "Conversation rules:" in p
    assert "1. Answer the user's actual question." in p
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/test_conversation_engine.py -v`
Expected: FAIL — `ConversationManager` signature mismatch, or new params not yet honored.

- [ ] **Step 3: Modify ConversationManager**

Replace the entire body of `server/conversation/manager.py` with:

```python
"""Conversation Manager — central orchestrator."""
from __future__ import annotations

import asyncio
import enum
import logging
import time
from dataclasses import dataclass
from pathlib import Path
from typing import AsyncIterator

from config import Config
from ..llm.base import ChatChunk, Message
from ..llm.router import ModelRouter
from ..memory.base import MemoryManager
from ..memory.retriever import MemoryRetriever
from ..tools.datetime_tool import (
    DATETIME_SPEC,
    format_datetime,
    get_current_datetime,
)
from ..tools.system_info_tool import (
    SYSTEM_INFO_SPEC,
    format_system_info,
    get_system_info,
)
from ..utils import PerfTrace
from ..intent.registry import ExecutionMode, ToolRegistry
from ..intent.router import Intent, IntentRouter
from ..response.policy import ResponsePolicy
from .context import build_context_messages
from .personality import build_system_prompt


log = logging.getLogger("os.conversation")


class ConversationState(str, enum.Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    SPEECH_DETECTED = "SPEECH_DETECTED"
    TRANSCRIBING = "TRANSCRIBING"
    USER_FINISHED = "USER_FINISHED"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"
    INTERRUPTED = "INTERRUPTED"
    READY = "READY"


@dataclass
class TurnResult:
    text: str
    state: ConversationState
    perf: PerfTrace


def _default_registry() -> ToolRegistry:
    reg = ToolRegistry()
    reg.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    reg.register(SYSTEM_INFO_SPEC, get_system_info, format_system_info)
    return reg


class ConversationManager:
    """The brain's conductor."""

    def __init__(
        self,
        cfg: Config,
        router: ModelRouter | None = None,
        *,
        intent_router: IntentRouter | None = None,
        tool_registry: ToolRegistry | None = None,
        memory_retriever: MemoryRetriever | None = None,
        response_policy: ResponsePolicy | None = None,
        memory: MemoryManager | None = None,
    ) -> None:
        self.cfg = cfg
        self.state: ConversationState = ConversationState.IDLE
        self.history: list[Message] = []
        self.router = router or ModelRouter.from_config(
            base_url=cfg.llm.base_url,
            model=cfg.llm.model,
            timeout_sec=float(cfg.llm.request_timeout_sec),
        )
        self.intent_router = intent_router or IntentRouter()
        self.tool_registry = tool_registry or _default_registry()
        self.response_policy = response_policy or ResponsePolicy(
            forbidden_prefixes=cfg.personality.forbidden_phrases
        )
        self.memory_retriever = memory_retriever
        self.memory = memory
        self._perf_sink = Path(cfg.logging.perf_file)

    def set_state(self, s: ConversationState) -> None:
        if self.state == s:
            return
        log.debug("state %s -> %s", self.state.value, s.value)
        self.state = s

    def reset(self) -> None:
        self.history.clear()
        self.state = ConversationState.IDLE

    async def health(self) -> bool:
        return await self.router.health()

    # ---------- Phase 1: text conversation ------------------------------------

    async def respond_text(self, user_text: str) -> AsyncIterator[ChatChunk]:
        perf = PerfTrace(self._perf_sink)
        perf.mark("turn_start:text")

        user_text = user_text.strip()
        if not user_text:
            return

        decision = self.intent_router.classify(user_text)
        self.history.append(Message(role="user", content=user_text, ts=time.time()))

        if decision.intent == Intent.TOOL_CALL and decision.tool_name:
            yield from self._handle_tool(decision.tool_name, user_text, perf)
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        if decision.intent == Intent.TASK:
            fr = self.response_policy.apply_llm_chat(
                "I'll handle tasks in a later phase."
            )
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
            yield ChatChunk(delta=fr.text, done=True)
            self.set_state(ConversationState.READY)
            perf.mark("turn_end:text")
            perf.flush("text_turn")
            return

        # LLM_CHAT
        yield from self._handle_llm_chat(user_text, perf)

    def _handle_tool(self, tool_name: str, user_text: str, perf: PerfTrace):
        try:
            spec, _handler, formatter = self.tool_registry.get(tool_name)
        except KeyError:
            fr = self.response_policy.apply_llm_chat("")
            yield ChatChunk(delta=fr.text, done=True)
            return

        if spec.requires_memory and self.memory_retriever is not None:
            self.memory_retriever.retrieve_relevant(user_text, needs_memory=True)

        self.set_state(ConversationState.THINKING)
        result = self.tool_registry.execute(tool_name)
        perf.mark("tool_executed")

        if spec.execution_mode == ExecutionMode.DIRECT and formatter is not None:
            fr = self.response_policy.apply_direct(tool_name, result, formatter)
        else:
            fr = self.response_policy.apply_tool_then_llm(tool_name, result)

        self.history.append(Message(role="assistant", content=fr.text, ts=time.time()))
        self.set_state(ConversationState.SPEAKING)
        yield ChatChunk(delta=fr.text, done=True)
        self.set_state(ConversationState.READY)

    def _handle_llm_chat(self, user_text: str, perf: PerfTrace):
        memories: list[str] = []
        if self.memory_retriever is not None:
            memories = self.memory_retriever.retrieve_relevant(user_text)

        sys_prompt = build_system_prompt(self.cfg.personality)
        messages = build_context_messages(
            self.history[:-1],
            conversation_cfg=self.cfg.conversation,
            system_prompt=sys_prompt,
            relevant_memories=memories,
            task_context="",
        )
        messages.append(self.history[-1])

        client = self.router.client_for("conversation")
        self.set_state(ConversationState.THINKING)

        full_parts: list[str] = []
        self.set_state(ConversationState.SPEAKING)
        try:
            streamed = client.chat_stream(
                messages,
                temperature=self.cfg.llm.temperature,
                max_tokens=self.cfg.llm.max_tokens,
                stop=self.cfg.llm.stop or None,
                perf=perf,
            )
        except Exception as e:  # noqa: BLE001
            log.exception("LLM stream init failed: %s", e)
            fr = self.response_policy.apply_llm_chat("")
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
            yield ChatChunk(delta=fr.text, done=True)
            self.set_state(ConversationState.READY)
            return

        try:
            for chunk in asyncio.run_asyncio_sync_iter(streamed):
                if chunk.delta:
                    full_parts.append(chunk.delta)
                    yield chunk
                if chunk.done:
                    break
        except Exception as e:  # noqa: BLE001
            log.exception("LLM stream failed: %s", e)
            fr = self.response_policy.apply_llm_chat("")
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
            yield ChatChunk(delta=fr.text, done=True)
            self.set_state(ConversationState.READY)
            return

        full = "".join(full_parts).strip()
        fr = self.response_policy.apply_llm_chat(full)
        if fr.text and (not self.history or self.history[-1].content != fr.text):
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
        self.set_state(ConversationState.READY)
        perf.mark("turn_end:text")
        perf.flush("text_turn")

    async def respond_text_collected(self, user_text: str) -> TurnResult:
        perf = PerfTrace(self._perf_sink)
        perf.mark("turn_start:text_collected")
        out: list[str] = []
        async for chunk in self.respond_text(user_text):
            out.append(chunk.delta)
        text = "".join(out).strip()
        perf.mark("turn_end:text_collected")
        perf.flush("text_turn_collected")
        return TurnResult(text=text, state=self.state, perf=perf)

    # ---------- Phase 5+ hooks -------------------------------------------------

    def interrupt(self) -> None:
        self.set_state(ConversationState.INTERRUPTED)
        log.info("barge-in requested (no TTS to stop in Phase 1 yet)")

    def begin_listen(self) -> None:
        self.set_state(ConversationState.LISTENING)

    def speech_detected(self) -> None:
        self.set_state(ConversationState.SPEECH_DETECTED)

    def transcribing(self) -> None:
        self.set_state(ConversationState.TRANSCRIBING)

    def user_finished(self) -> None:
        self.set_state(ConversationState.USER_FINISHED)
```

**Note on `run_asyncio_sync_iter`:** the streaming client returns an async iterator. In Phase 1 the conversation loop runs in an existing event loop, so we must iterate the async generator *without* blocking. Replace the `asyncio.run_asyncio_sync_iter(streamed)` block with a synchronous-style `for chunk in streamed:` loop wrapped via `run_in_executor`-style consumption. The cleanest implementation is to make `_handle_llm_chat` itself `async` and `yield` directly. **Adopt this corrected form:**

Replace `_handle_llm_chat` with:

```python
    async def _handle_llm_chat(self, user_text: str, perf: PerfTrace):
        memories: list[str] = []
        if self.memory_retriever is not None:
            memories = self.memory_retriever.retrieve_relevant(user_text)

        sys_prompt = build_system_prompt(self.cfg.personality)
        messages = build_context_messages(
            self.history[:-1],
            conversation_cfg=self.cfg.conversation,
            system_prompt=sys_prompt,
            relevant_memories=memories,
            task_context="",
        )
        messages.append(self.history[-1])

        client = self.router.client_for("conversation")
        self.set_state(ConversationState.THINKING)

        full_parts: list[str] = []
        self.set_state(ConversationState.SPEAKING)
        try:
            async for chunk in client.chat_stream(
                messages,
                temperature=self.cfg.llm.temperature,
                max_tokens=self.cfg.llm.max_tokens,
                stop=self.cfg.llm.stop or None,
                perf=perf,
            ):
                if chunk.delta:
                    full_parts.append(chunk.delta)
                    yield chunk
                if chunk.done:
                    break
        except Exception as e:  # noqa: BLE001
            log.exception("LLM stream failed: %s", e)
            fr = self.response_policy.apply_llm_chat("")
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
            yield ChatChunk(delta=fr.text, done=True)
            self.set_state(ConversationState.READY)
            return

        full = "".join(full_parts).strip()
        fr = self.response_policy.apply_llm_chat(full)
        if fr.text and (not self.history or self.history[-1].content != fr.text):
            self.history.append(
                Message(role="assistant", content=fr.text, ts=time.time())
            )
        self.set_state(ConversationState.READY)
        perf.mark("turn_end:text")
        perf.flush("text_turn")
```

Change `respond_text` to `await` it:

```python
        # LLM_CHAT
            async for chunk in self._handle_llm_chat(user_text, perf):
                yield chunk
            return
```

So the bottom of `respond_text` becomes:

```python
        # LLM_CHAT
        async for chunk in self._handle_llm_chat(user_text, perf):
            yield chunk
```

Also make `_handle_tool` `async`:

```python
    async def _handle_tool(self, tool_name: str, user_text: str, perf: PerfTrace):
        ...
        yield ChatChunk(delta=fr.text, done=True)
```

And in `respond_text`, replace `yield from self._handle_tool(...)` with:

```python
        async for chunk in self._handle_tool(decision.tool_name, user_text, perf):
            yield chunk
```

- [ ] **Step 4: Run new integration tests**

Run: `python -m pytest tests/test_conversation_engine.py -v`
Expected: 5 PASSED (the test_time_query, test_date_query, test_system_info_stub, test_history_appends_user_and_assistant, test_personality_contains_conversation_rules).

- [ ] **Step 5: Run the full unit suite**

Run: `python -m pytest tests/ -v`
Expected: all unit tests (test_intent_router, test_tool_registry, test_datetime_tool, test_response_policy, test_memory_retriever, test_conversation_engine) pass.

- [ ] **Step 6: Commit**

```bash
git add server/conversation/manager.py tests/test_conversation_engine.py
git commit -m "feat: wire router, tool registry, memory, response policy into manager"
```

---

## Task 8: CLI smoke check

**Files:**
- Read: `cli.py` (no modification expected)

- [ ] **Step 1: Run `cli.py` in a non-interactive smoke**

We can't feed stdin here, so instead simulate two turns programmatically:

```bash
python -c "
import asyncio
from cli import amain
import sys
class A: pass
a = A(); a.model = None; a.reset = False
# Override input to feed scripted turns, then exit
import builtins
inputs = iter(['what time is it?', '/quit'])
builtins.input = lambda prompt='': next(inputs)
sys.exit(asyncio.run(amain(a)))
"
```

Expected: prints `It's H:MM AM/PM on <weekday>, <month> DD, YYYY (TZ).` then exits 0.

- [ ] **Step 2: Verify no httpx INFO lines**

```bash
python -c "
import asyncio
from cli import amain
import sys, builtins
class A: pass
a = A(); a.model = None; a.reset = False
inputs = iter(['hi', '/quit'])
builtins.input = lambda prompt='': next(inputs)
asyncio.run(amain(a))
" 2>err.log
grep -i httpx err.log || echo 'OK: no httpx lines'
```

Expected: `OK: no httpx lines`.

- [ ] **Step 3: Run the live acceptance check (only when Ollama is up)**

Skip this step if Ollama isn't running locally. Otherwise:

```bash
python verify_fixes.py
```

Expected: each of the four turns returns a non-empty, distinct response.

- [ ] **Step 4: Commit (no code changes expected)**

If `cli.py` had no changes, skip this step. If a small change was needed (e.g. import path), commit it:

```bash
git add cli.py
git commit -m "chore: cli smoke adjustments if any"
```

---

## Self-Review

- Spec coverage: router ✓ (Task 1), registry + formatters ✓ (Task 2), datetime tool ✓ (Task 3), ResponsePolicy ✓ (Task 4), memory retriever ✓ (Task 5), forbidden trim + system prompt rules ✓ (Task 6), ConversationManager wiring ✓ (Task 7), CLI smoke ✓ (Task 8).
- Placeholder scan: no TBD/TODO/fill-in. Step 3 of Task 7 has a NOTE block that explains the async iteration correction inline; no abstract instructions remain.
- Type consistency: `RouteDecision.intent` / `tool_name` used identically in Tasks 1 and 7. `ToolResult.status/mode/data/error` consistent across Tasks 2, 3, 4, 7. `FinalResponse.text/source` consistent in Tasks 4 and 7. `MemoryRetriever.retrieve_relevant` signature consistent in Tasks 5 and 7.
- One internal note: Task 7 contains a mid-step correction converting `_handle_llm_chat` and `_handle_tool` to `async` so `async for` works correctly inside an already-running loop. This is necessary for correctness and is documented inline.