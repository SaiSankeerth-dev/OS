"""Memory skill tools: save and recall notes.

Local-only. Notes are stored as kind="memory" events in the StateStore
(SQLite) - no cloud, no embeddings, no cost. Recall is keyword search;
good enough for a first memory and honest about it.
"""
from __future__ import annotations

import json

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.state.store import StateStore


MEMORY_SAVE_SPEC = ToolSpec(
    name="memory_save",
    description="Save a note to long-term memory. Usage: remember this.",
    execution_mode=ExecutionMode.DIRECT,
)

MEMORY_RECALL_SPEC = ToolSpec(
    name="memory_recall",
    description="Recall saved notes matching a query.",
    execution_mode=ExecutionMode.DIRECT,
)

MEMORY_FORGET_SPEC = ToolSpec(
    name="memory_forget",
    description=(
        "Forget saved notes matching a query. "
        "Usage: forget what I told you about the launch code."
    ),
    execution_mode=ExecutionMode.DIRECT,
)


_MEMORY_STOPWORDS = frozenset(
    "the a an and or of to in on for with is are was were be as at by "
    "it its this that these those i you we they he she me my your "
    "what when where which who how do does did".split()
)


def make_tools(state_store: StateStore | None = None):
    store = state_store or StateStore()

    def memory_save(note: str = "", **kwargs) -> ToolResult:
        note = (note or "").strip()
        if not note:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error="nothing to save",
            )
        store.log_event(
            "memory", "memory_skill", json.dumps({"note": note})
        )
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={"note": note},
        )

    def _search_notes(query: str) -> list[tuple[int, str]]:
        """Keyword search over memory notes. Returns (event_id, note)."""
        # Keyword search: any significant word may hit. This keeps
        # "what do you remember about launch code" finding a note that
        # says "my launch code is 1234".
        words = [
            w for w in query.lower().split()
            if len(w) >= 3 and w not in _MEMORY_STOPWORDS
        ] or [query.lower()]
        hits: list[tuple[int, str]] = []
        seen: set[str] = set()
        for word in words[:6]:
            for event in store.search_events("memory", word, limit=5):
                try:
                    note = json.loads(event["data"])["note"]
                except (KeyError, ValueError):
                    continue
                if note not in seen:
                    seen.add(note)
                    hits.append((event["id"], note))
        return hits[:5]

    def memory_recall(query: str = "", **kwargs) -> ToolResult:
        query = (query or "").strip()
        if not query:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error="nothing to search for",
            )
        hits = _search_notes(query)
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={"query": query, "notes": [note for _, note in hits]},
        )

    def memory_forget(query: str = "", **kwargs) -> ToolResult:
        """Phase 12: delete the notes a recall would have found."""
        query = (query or "").strip()
        if not query:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error="nothing to forget",
            )
        hits = _search_notes(query)
        if not hits:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error=f"nothing remembered about '{query}'",
            )
        for event_id, _note in hits:
            store.delete_event(event_id)
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={
                "query": query,
                "deleted": [note for _, note in hits],
            },
        )

    def format_memory_save(result: ToolResult) -> str:
        if result.status != "success":
            return "I couldn't save that."
        return f"Saved: {result.data['note']}"

    def format_memory_recall(result: ToolResult) -> str:
        if result.status != "success":
            return "I couldn't search memory."
        notes = result.data["notes"]
        if not notes:
            return f"I don't remember anything about '{result.data['query']}'."
        return "Here's what I remember:\n- " + "\n- ".join(notes)

    def format_memory_forget(result: ToolResult) -> str:
        if result.status != "success":
            return f"I couldn't forget that - {result.error or 'nothing matched'}."
        deleted = result.data["deleted"]
        n = len(deleted)
        lines = "\n- ".join(deleted)
        return f"Forgot {n} note{'s' if n != 1 else ''}:\n- {lines}"

    return [
        (MEMORY_SAVE_SPEC, memory_save, format_memory_save),
        (MEMORY_RECALL_SPEC, memory_recall, format_memory_recall),
        (MEMORY_FORGET_SPEC, memory_forget, format_memory_forget),
    ]
