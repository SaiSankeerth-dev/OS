"""Memory skill tools — rewritten for explicit commands (Memory Phase Day 2).

Uses the new server/memory/manager.py (not StateStore events).
No LLM involved. Deterministic parsing.

Response formats (never lie about what happened):
- Store: "Saved: <exact text>. (key: <key>). Say 'forget <key>' to remove."
- Update: "Updated <key>: <old> → <new>."
- Secret: say so, nothing saved.
- Recall: list with dates, or "nothing matches."
- Forget: show matches, ask if multiple, say exactly what was removed.
"""
from __future__ import annotations

import re
import time
from datetime import datetime

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.memory.manager import MemoryManager


MEMORY_SAVE_SPEC = ToolSpec(
    name="memory_save",
    description="Save to memory. Usage: remember my deploy branch is os-10x",
    execution_mode=ExecutionMode.DIRECT,
)

MEMORY_RECALL_SPEC = ToolSpec(
    name="memory_recall",
    description="Recall from memory. Usage: what do you remember about deploy",
    execution_mode=ExecutionMode.DIRECT,
)

MEMORY_FORGET_SPEC = ToolSpec(
    name="memory_forget",
    description="Forget from memory. Usage: forget deploy branch",
    execution_mode=ExecutionMode.DIRECT,
)


# Key derivation: "<subject> is/are/= <value>" → subject as key
_KEY_PATTERN = re.compile(
    r"^\s*(.+?)\s+(?:is|are|=)\s+(.+?)\s*$",
    re.IGNORECASE,
)


def _derive_key(text: str) -> tuple[str, str]:
    """Two-tier key derivation. Returns (key, value).

    Tier 1: "<subject> is/are/= <value>" → (subject, value)
    Tier 2: free-text → (slug, full text)
    """
    m = _KEY_PATTERN.match(text.strip())
    if m:
        subject = m.group(1).strip().lower()
        value = m.group(2).strip()
        # Clean subject: remove "my", "the", etc. for cleaner keys
        subject = re.sub(r"^(my|the|a|an)\s+", "", subject)
        key = re.sub(r"[^a-z0-9]+", "_", subject).strip("_")
        return key or "note", value
    # Tier 2: slug from first words
    words = re.findall(r"\b\w+\b", text.lower())[:4]
    key = "_".join(words) if words else "note"
    return key, text.strip()


def _fmt_date(ts: float) -> str:
    return datetime.fromtimestamp(ts).strftime("%Y-%m-%d")


# Pending confirmation state for multi-match forget (2-min expiry)
_pending_forget: dict[str, tuple[list[str], float]] = {}


def make_tools(memory_manager: MemoryManager | None = None):
    mgr = memory_manager or MemoryManager()

    def memory_save(note: str = "", **kwargs) -> ToolResult:
        note = (note or "").strip()
        if not note:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error="nothing to save",
            )
        key, value = _derive_key(note)
        # Check if updating (existing active key)
        existing = mgr.recall(key)
        try:
            mgr.store(key, value, source="chat")
        except ValueError as e:
            # Secret rejected
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error=str(e),
            )
        if existing:
            text = f"Updated {key}: {existing.value} → {value}."
        else:
            text = f"Saved: {value}. (key: {key}). Say \"forget {key}\" to remove."
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={"text": text, "key": key},
        )

    def memory_recall(query: str = "", **kwargs) -> ToolResult:
        query = (query or "").strip()
        if not query:
            # List all
            mems = mgr.list_active(limit=20)
            if not mems:
                return ToolResult(
                    status="success",
                    mode=ExecutionMode.DIRECT,
                    data={"text": "Nothing in memory yet."},
                )
            lines = [f"- {m.key}: {m.value} ({_fmt_date(m.created_at)})" for m in mems]
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={"text": "Remembered:\n" + "\n".join(lines)},
            )
        # Try exact key first, then search
        exact = mgr.recall(query)
        if exact:
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={
                    "text": f"{exact.key}: {exact.value} ({_fmt_date(exact.created_at)})"
                },
            )
        results = mgr.search(query, limit=5)
        if not results:
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={"text": f"Nothing matches '{query}'."},
            )
        lines = [
            f"- {m.key}: {m.value} ({_fmt_date(m.created_at)})" for m in results
        ]
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={"text": "Found:\n" + "\n".join(lines)},
        )

    def memory_forget(query: str = "", session_id: str = "default", **kwargs) -> ToolResult:
        query = (query or "").strip()
        if not query:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error="say what to forget, e.g. 'forget deploy branch'",
            )
        # Check pending confirmation
        if session_id in _pending_forget:
            keys, expiry = _pending_forget[session_id]
            if time.time() > expiry:
                del _pending_forget[session_id]
                return ToolResult(
                    status="failure",
                    mode=ExecutionMode.DIRECT,
                    error="Confirmation expired. Say 'forget <what>' again.",
                )
            # User is confirming — query should be a number
            if query.isdigit():
                idx = int(query) - 1
                if 0 <= idx < len(keys):
                    key = keys[idx]
                    del _pending_forget[session_id]
                    n = mgr.forget(key)
                    return ToolResult(
                        status="success",
                        mode=ExecutionMode.DIRECT,
                        data={"text": f"Forgot '{key}' ({n} memories removed)."},
                    )
            # Not a valid choice — cancel
            del _pending_forget[session_id]
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error="Cancelled. Say 'forget <what>' to try again.",
            )

        # Find matches
        exact = mgr.recall(query)
        if exact:
            n = mgr.forget(query)
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={"text": f"Forgot '{query}' ({n} memories removed)."},
            )
        results = mgr.search(query, limit=5)
        if not results:
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={"text": f"Nothing matches '{query}'. Nothing deleted."},
            )
        if len(results) == 1:
            key = results[0].key
            n = mgr.forget(key)
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={"text": f"Forgot '{key}' ({n} memories removed)."},
            )
        # Multiple matches — ask which
        keys = [r.key for r in results]
        _pending_forget[session_id] = (keys, time.time() + 120)  # 2-min expiry
        lines = [f"{i+1}. {r.key}: {r.value[:60]}" for i, r in enumerate(results)]
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={
                "text": (
                    f"Multiple matches for '{query}':\n"
                    + "\n".join(lines)
                    + "\nReply with the number to forget, or anything else to cancel."
                ),
                "awaiting_confirmation": True,
            },
        )

    return {
        "memory_save": (MEMORY_SAVE_SPEC, memory_save),
        "memory_recall": (MEMORY_RECALL_SPEC, memory_recall),
        "memory_forget": (MEMORY_FORGET_SPEC, memory_forget),
    }
