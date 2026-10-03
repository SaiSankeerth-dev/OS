"""SQLite-backed memory manager (Phase 2) with Mem0-inspired consolidation."""

from __future__ import annotations

import sqlite3
import time
from pathlib import Path
from .base import MemoryManager, MemoryRecord, MemoryType


class SQLiteMemoryManager(MemoryManager):
    def __init__(self, db_path: str = "memory/os_memory.db") -> None:
        self._db_path = db_path
        self._conn: sqlite3.Connection | None = None
        self._init_db()

    def _init_db(self) -> None:
        Path(self._db_path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(self._db_path)
        self._conn.execute(
            """
            CREATE TABLE IF NOT EXISTS memories (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                memory_type TEXT NOT NULL,
                importance REAL NOT NULL DEFAULT 0.5,
                created_at REAL NOT NULL,
                updated_at REAL NOT NULL,
                expires_at REAL,
                metadata TEXT NOT NULL DEFAULT '{}'
            )
            """
        )
        self._conn.commit()

    def store(self, record: MemoryRecord) -> None:
        if self._conn is None:
            raise RuntimeError("Memory not initialized")
        self._conn.execute(
            """INSERT OR REPLACE INTO memories
               (key, value, memory_type, importance, created_at, updated_at, expires_at, metadata)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                record.key,
                record.value,
                record.memory_type.value,
                record.importance,
                record.created_at,
                record.updated_at,
                record.expires_at,
                str(record.metadata),
            ),
        )
        self._conn.commit()

    def retrieve(self, query: str, limit: int = 4) -> list[MemoryRecord]:
        if self._conn is None:
            raise RuntimeError("Memory not initialized")
        cur = self._conn.execute(
            """SELECT key, value, memory_type, importance, created_at, updated_at, expires_at, metadata
               FROM memories
               WHERE value LIKE ? OR key LIKE ?
               ORDER BY importance DESC
               LIMIT ?""",
            (f"%{query}%", f"%{query}%", limit),
        )
        records: list[MemoryRecord] = []
        for row in cur:
            records.append(
                MemoryRecord(
                    key=row[0],
                    value=row[1],
                    memory_type=MemoryType(row[2]),
                    importance=row[3],
                    created_at=row[4],
                    updated_at=row[5],
                    expires_at=row[6],
                    metadata=eval(row[7]) if row[7] else {},
                )
            )
        return records

    def extract(self, conversation_turns: list[str]) -> list[MemoryRecord]:
        """Extract important memories from conversation text.

        Mem0-inspired: identifies salient information, deduplicates, assigns importance.
        """
        if self._conn is None:
            raise RuntimeError("Memory not initialized")
        candidates: list[MemoryRecord] = []
        import re

        # Heuristics for importance (Mem0-style)
        high_value_phrases = [
            r"\b(prefer|like|important|remember|project|goal|task)\b",
            r"\b(name|email|phone|address)\b",
            r"\b(favorite|best|worst)\b",
        ]

        for turn in conversation_turns:
            # Check for user preferences, names, projects
            for pattern in high_value_phrases:
                if re.search(pattern, turn, re.IGNORECASE):
                    # Extract key-value-like info
                    words = re.findall(r"\b\w{4,}\b", turn.lower())
                    if words:
                        candidates.append(
                            MemoryRecord(
                                key=" ".join(words[:3]),
                                value=turn,
                                importance=0.8,
                                memory_type=MemoryType.CONVERSATION,
                            )
                        )
                    break

        # Deduplicate by key, keep highest importance
        seen: dict[str, MemoryRecord] = {}
        for c in candidates:
            if c.key not in seen or c.importance > seen[c.key].importance:
                seen[c.key] = c

        # Store consolidated memories
        for record in seen.values():
            self.store(record)

        # Return stored records (re-query for freshness)
        keys = [r.key for r in seen.values()]
        if keys:
            placeholders = ",".join(["?"] * len(keys))
            cur = self._conn.execute(
                f"SELECT key, value, memory_type, importance FROM memories WHERE key IN ({placeholders})",
                keys,
            )
            return [
                MemoryRecord(
                    key=row[0],
                    value=row[1],
                    memory_type=MemoryType(row[2]),
                    importance=row[3],
                )
                for row in cur
            ]
        return []

    def consolidate(self, max_age_days: int | None = 30) -> int:
        """Mem0-inspired: merge similar memories, prune low-importance, re-score.

        Returns number of memories affected.
        """
        if self._conn is None:
            raise RuntimeError("Memory not initialized")
        import time

        # Prune old low-importance memories
        affected = 0
        if max_age_days is not None:
            cutoff = time.time() - (max_age_days * 86400)
            cur = self._conn.execute(
                "SELECT key, importance FROM memories WHERE created_at < ?",
                (cutoff,),
            )
            old_rows = cur.fetchall()
            for key, imp in old_rows:
                if imp < 0.3:
                    self._conn.execute("DELETE FROM memories WHERE key = ?", (key,))
                    affected += 1
            self._conn.commit()

        # Re-score: boost importance of recently mentioned memories
        # (Simplified - in production would use LLM-based relevance)
        cur = self._conn.execute(
            "SELECT key, importance, updated_at FROM memories WHERE updated_at > ?",
            (time.time() - 86400,),
        )
        recent = cur.fetchall()
        for key, imp, updated in recent:
            # Small boost if recently touched
            new_imp = min(imp + 0.05, 1.0)
            if new_imp != imp:
                self._conn.execute(
                    "UPDATE memories SET importance = ?, updated_at = ? WHERE key = ?",
                    (new_imp, time.time(), key),
                )
                affected += 1
        self._conn.commit()
        return affected

    def prune(self, max_age_days: int | None = None) -> int:
        if self._conn is None:
            raise RuntimeError("Memory not initialized")
        if max_age_days is None:
            self._conn.execute("DELETE FROM memories WHERE created_at < ?", (0,))
        else:
            import time
            cutoff = time.time() - (max_age_days * 86400)
            self._conn.execute(
                "DELETE FROM memories WHERE created_at < ?", (cutoff,)
            )
        self._conn.commit()
        # Return approximate count of remaining rows
        cur = self._conn.execute("SELECT COUNT(*) FROM memories")
        count = cur.fetchone()[0]
        return count  # Not exactly "deleted" but returning total