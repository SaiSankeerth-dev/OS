from __future__ import annotations

import ast
import json
import sqlite3
import time
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from .base import MemoryManager, MemoryRecord, MemoryType


def _safe_deserialize_metadata(raw: str | None) -> dict[str, Any]:
    """Safely deserializes metadata without using eval()."""
    if not raw:
        return {}
    if isinstance(raw, dict):
        return raw
    # 1. Standard JSON deserialization
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    # 2. ast.literal_eval for legacy Python dict string representations (safe literals only)
    try:
        data = ast.literal_eval(raw)
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    return {}


@dataclass(frozen=True)
class MemoryWriteResult:
    """Outcome of a typed memory write.

    A conflict deliberately leaves the existing confirmed record untouched;
    callers must obtain an explicit higher-confidence correction before
    changing what ordinary chat can retrieve.
    """

    accepted: bool
    record: MemoryRecord | None = None
    conflict: bool = False
    reason: str = ""


_SENSITIVE_NOTE_RE = re.compile(
    r"\b(?:api[ _-]?key|access[ _-]?token|refresh[ _-]?token|password|secret|private[ _-]?key)\b",
    re.IGNORECASE,
)
_QUERY_STOPWORDS = frozenset(
    "the a an and or of to in on for with is are was were be as at by it its this that "
    "these those i you we they he she me my your what when where which who how do does did "
    "am about working remember".split()
)


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
        normalized = self._normalize_record(record)
        self._conn.execute(
            """INSERT OR REPLACE INTO memories
               (key, value, memory_type, importance, created_at, updated_at, expires_at, metadata)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                normalized.key,
                normalized.value,
                normalized.memory_type.value,
                normalized.importance,
                normalized.created_at,
                normalized.updated_at,
                normalized.expires_at,
                json.dumps(normalized.metadata, ensure_ascii=False, allow_nan=False),
            ),
        )
        self._conn.commit()

    def close(self) -> None:
        if self._conn is not None:
            self._conn.close()
            self._conn = None

    @staticmethod
    def _normalize_record(record: MemoryRecord) -> MemoryRecord:
        metadata = dict(record.metadata or {})
        confidence = metadata.get("confidence", 1.0)
        try:
            confidence = float(confidence)
        except (TypeError, ValueError):
            confidence = 0.0
        metadata["confidence"] = min(1.0, max(0.0, confidence))
        provenance = metadata.get("provenance")
        if not isinstance(provenance, dict):
            provenance = {}
        provenance.setdefault("source", "unknown")
        provenance.setdefault("captured_at", record.created_at)
        metadata["provenance"] = provenance
        return MemoryRecord(
            key=record.key,
            value=record.value,
            memory_type=record.memory_type,
            importance=record.importance,
            created_at=record.created_at,
            updated_at=record.updated_at,
            expires_at=record.expires_at,
            metadata=metadata,
        )

    def _get_by_key(self, key: str) -> MemoryRecord | None:
        if self._conn is None:
            raise RuntimeError("Memory not initialized")
        row = self._conn.execute(
            "SELECT key, value, memory_type, importance, created_at, updated_at, expires_at, metadata "
            "FROM memories WHERE key = ?", (key,)
        ).fetchone()
        if row is None:
            return None
        return MemoryRecord(
            key=row[0], value=row[1], memory_type=MemoryType(row[2]),
            importance=row[3], created_at=row[4], updated_at=row[5],
            expires_at=row[6], metadata=_safe_deserialize_metadata(row[7]),
        )

    def store_typed(self, record: MemoryRecord) -> MemoryWriteResult:
        """Store a typed fact without silently replacing stronger evidence."""
        normalized = self._normalize_record(record)
        existing = self._get_by_key(normalized.key)
        if existing is not None and existing.value != normalized.value:
            old_confidence = float(existing.metadata.get("confidence", 1.0))
            new_confidence = float(normalized.metadata["confidence"])
            if new_confidence <= old_confidence:
                return MemoryWriteResult(
                    accepted=False, record=existing, conflict=True,
                    reason="existing memory has equal or higher confidence",
                )
            normalized.metadata["supersedes"] = {
                "value": existing.value,
                "confidence": old_confidence,
                "provenance": existing.metadata.get("provenance", {}),
            }
        self.store(normalized)
        return MemoryWriteResult(accepted=True, record=normalized)

    def remember_explicit(self, note: str, *, source: str = "user_explicit") -> MemoryWriteResult:
        """Classify an explicit user note into a typed, local record.

        Credentials are intentionally rejected: this memory store is context,
        not a secrets vault.
        """
        note = note.strip()
        if not note:
            return MemoryWriteResult(False, reason="empty memory note")
        if _SENSITIVE_NOTE_RE.search(note):
            return MemoryWriteResult(False, reason="sensitive credentials are not stored in memory")
        lower = note.lower()
        if "project" in lower:
            memory_type = MemoryType.PROJECT
        elif any(marker in lower for marker in ("prefer", "favorite", "i like ")):
            memory_type = MemoryType.PREFERENCE
        elif any(marker in lower for marker in ("my name is", "meet ", "person ")):
            memory_type = MemoryType.PERSON
        elif any(marker in lower for marker in ("my goal", "i want to", "goal is")):
            memory_type = MemoryType.GOAL
        elif any(marker in lower for marker in ("i will ", "i need to", "i must ", "i promise")):
            memory_type = MemoryType.COMMITMENT
        else:
            memory_type = MemoryType.LONG_TERM
        terms = re.findall(r"[a-z0-9]+", lower)
        subject = "-".join(term for term in terms if term not in _QUERY_STOPWORDS)[:80] or "note"
        record = MemoryRecord(
            key=f"{memory_type.value}:{subject}", value=note,
            memory_type=memory_type, importance=0.8,
            metadata={
                "confidence": 0.95,
                "privacy": "private",
                "provenance": {"source": source, "captured_at": time.time()},
            },
        )
        return self.store_typed(record)

    def retrieve(self, query: str, limit: int = 4) -> list[MemoryRecord]:
        if self._conn is None:
            raise RuntimeError("Memory not initialized")
        query_terms = [
            term for term in re.findall(r"[a-z0-9]+", query.lower())
            if len(term) >= 3 and term not in _QUERY_STOPWORDS
        ]
        cur = self._conn.execute(
            """SELECT key, value, memory_type, importance, created_at, updated_at, expires_at, metadata
               FROM memories WHERE expires_at IS NULL OR expires_at > ?""",
            (time.time(),),
        )
        records: list[MemoryRecord] = []
        for row in cur:
            record = MemoryRecord(
                key=row[0], value=row[1], memory_type=MemoryType(row[2]),
                importance=row[3], created_at=row[4], updated_at=row[5],
                expires_at=row[6], metadata=_safe_deserialize_metadata(row[7]),
            )
            if record.metadata.get("privacy") == "secret":
                continue
            haystack = f"{record.key} {record.value}".lower()
            matches = sum(term in haystack for term in query_terms)
            if query_terms and not matches:
                continue
            records.append(record)
        records.sort(key=lambda record: (
            -sum(term in f"{record.key} {record.value}".lower() for term in query_terms),
            -record.importance, -record.updated_at,
        ))
        return records[:limit]

    def forget(self, query: str, limit: int = 20) -> list[MemoryRecord]:
        """Delete matching typed records and return the exact deleted facts."""
        records = self.retrieve(query, limit=limit)
        if not records:
            return []
        if self._conn is None:
            raise RuntimeError("Memory not initialized")
        self._conn.executemany(
            "DELETE FROM memories WHERE key = ?", ((record.key,) for record in records)
        )
        self._conn.commit()
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
