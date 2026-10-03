---
name: memory
description: Saves and recalls notes in local SQLite memory.
version: 1.1.0
status: active
---

# Memory Skill

## Purpose
Provides long-term memory consolidation and retrieval for OS.

## Interface
- `extract_memories(conversation_turns: list[str]) -> list[MemoryRecord]`
- `retrieve_memories(query: str, limit: int = 4) -> list[MemoryRecord]`
- `consolidate() -> int` - affected memories
- `memory_save(note)` / `memory_recall(query)` / `memory_forget(query)` -
  save, recall, and delete notes in local SQLite memory (Phase 12).

## Heuristics
- Extract preferences, projects, names, important facts
- Deduplicate by key, keep highest importance
- Re-score recently mentioned memories
- Prune low-importance old memories

## Integration
- Called by ConversationManager after each turn
- Stores into SQLiteMemoryManager
- Used by Context builder when user refers to past