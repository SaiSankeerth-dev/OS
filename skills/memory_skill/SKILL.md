# Memory Skill

## Purpose
Provides long-term memory consolidation and retrieval for OS.

## Interface
- `extract_memories(conversation_turns: list[str]) -> list[MemoryRecord]`
- `retrieve_memories(query: str, limit: int = 4) -> list[MemoryRecord]`
- `consolidate() -> int` - affected memories

## Heuristics
- Extract preferences, projects, names, important facts
- Deduplicate by key, keep highest importance
- Re-score recently mentioned memories
- Prune low-importance old memories

## Integration
- Called by ConversationManager after each turn
- Stores into SQLiteMemoryManager
- Used by Context builder when user refers to past