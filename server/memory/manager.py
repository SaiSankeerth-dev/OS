"""Memory manager — rewritten for explicit commands (Memory Phase).

Design decisions (Day 1 audit):
- KEEP: SQLite file-backed storage (proven pattern from old code).
- REWRITE: Schema with status (active|historical|forgotten) and source.
- REWRITE: FTS5 full-text search (no embeddings, works without Ollama).
- REMOVE: Auto-extract from chat (never auto-save; only explicit commands).
- REMOVE: consolidate(), expires_at (unused complexity).
- ADD: forget() with targeted delete, status transitions on update.

Security:
- Never store secrets (API keys, tokens, passwords) — rejected with warning.
- Retrieved memory is DATA, never instructions (wrapped in <memory> tags).
"""
from __future__ import annotations

import re
import sqlite3
import time
from dataclasses import dataclass, field
from pathlib import Path


# Patterns that look like secrets — refuse to store these.
_SECRET_PATTERNS = [
    re.compile(r"\b(sk-|ghp_|gho_|xox[bap]-|AKIA)[A-Za-z0-9_\-]{10,}", re.I),
    re.compile(r"\b(api[_-]?key|secret|password|token)\s*[:=]\s*\S{8,}", re.I),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
]


def _looks_like_secret(text: str) -> bool:
    """Check if text contains something that looks like a secret."""
    return any(p.search(text) for p in _SECRET_PATTERNS)


@dataclass
class Memory:
    key: str
    value: str
    status: str = "active"  # active | historical | forgotten
    source: str = ""  # which conversation/session
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)


class MemoryManager:
    """Explicit-command memory. No auto-save, no LLM needed."""

    def __init__(self, db_path: str | Path = "data/memory.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            # Main table
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS memories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key TEXT NOT NULL,
                    value TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'active',
                    source TEXT NOT NULL DEFAULT '',
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL
                )
                """
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_memories_key ON memories(key)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_memories_status ON memories(status)"
            )
            # FTS5 for text search (no embeddings needed)
            conn.execute(
                """
                CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts
                USING fts5(key, value, content='memories', content_rowid='id')
                """
            )
            # Triggers to keep FTS in sync
            conn.execute(
                """
                CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories
                BEGIN
                    INSERT INTO memories_fts(rowid, key, value)
                    VALUES (new.id, new.key, new.value);
                END
                """
            )
            conn.execute(
                """
                CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories
                BEGIN
                    INSERT INTO memories_fts(memories_fts, rowid, key, value)
                    VALUES ('delete', old.id, old.key, old.value);
                END
                """
            )
            conn.execute(
                """
                CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories
                BEGIN
                    INSERT INTO memories_fts(memories_fts, rowid, key, value)
                    VALUES ('delete', old.id, old.key, old.value);
                    INSERT INTO memories_fts(rowid, key, value)
                    VALUES (new.id, new.key, new.value);
                END
                """
            )
            conn.commit()
        finally:
            conn.close()

    def store(self, key: str, value: str, source: str = "") -> Memory:
        """Store a memory. If key exists, old becomes 'historical'.

        Raises ValueError if the value looks like a secret.
        """
        if _looks_like_secret(value):
            raise ValueError(
                "Refusing to store: value looks like a secret "
                "(API key, token, or password). OS never stores secrets in memory."
            )
        if _looks_like_secret(key):
            raise ValueError("Refusing to store: key looks like a secret.")

        now = time.time()
        conn = sqlite3.connect(self.db_path)
        try:
            # Mark existing active as historical
            conn.execute(
                "UPDATE memories SET status='historical', updated_at=? "
                "WHERE key=? AND status='active'",
                (now, key),
            )
            # Insert new active
            cur = conn.execute(
                "INSERT INTO memories (key, value, status, source, created_at, updated_at) "
                "VALUES (?, ?, 'active', ?, ?, ?)",
                (key, value, source, now, now),
            )
            conn.commit()
            return Memory(
                key=key, value=value, status="active",
                source=source, created_at=now, updated_at=now,
            )
        finally:
            conn.close()

    def recall(self, key: str) -> Memory | None:
        """Get the active memory for an exact key."""
        conn = sqlite3.connect(self.db_path)
        try:
            row = conn.execute(
                "SELECT key, value, status, source, created_at, updated_at "
                "FROM memories WHERE key=? AND status='active' "
                "ORDER BY updated_at DESC LIMIT 1",
                (key,),
            ).fetchone()
            if not row:
                return None
            return Memory(
                key=row[0], value=row[1], status=row[2], source=row[3],
                created_at=row[4], updated_at=row[5],
            )
        finally:
            conn.close()

    def search(self, query: str, limit: int = 5) -> list[Memory]:
        """Full-text search over active memories."""
        conn = sqlite3.connect(self.db_path)
        try:
            rows = conn.execute(
                """
                SELECT m.key, m.value, m.status, m.source, m.created_at, m.updated_at
                FROM memories_fts f
                JOIN memories m ON m.id = f.rowid
                WHERE f.memories_fts MATCH ? AND m.status='active'
                ORDER BY rank LIMIT ?
                """,
                (query, limit),
            ).fetchall()
            return [
                Memory(
                    key=r[0], value=r[1], status=r[2], source=r[3],
                    created_at=r[4], updated_at=r[5],
                )
                for r in rows
            ]
        finally:
            conn.close()

    def forget(self, key: str) -> int:
        """Mark active memories for key as 'forgotten'. Returns count."""
        now = time.time()
        conn = sqlite3.connect(self.db_path)
        try:
            cur = conn.execute(
                "UPDATE memories SET status='forgotten', updated_at=? "
                "WHERE key=? AND status='active'",
                (now, key),
            )
            conn.commit()
            return cur.rowcount
        finally:
            conn.close()

    def history(self, key: str) -> list[Memory]:
        """Get all versions (active + historical) for a key."""
        conn = sqlite3.connect(self.db_path)
        try:
            rows = conn.execute(
                "SELECT key, value, status, source, created_at, updated_at "
                "FROM memories WHERE key=? AND status IN ('active', 'historical') "
                "ORDER BY updated_at DESC",
                (key,),
            ).fetchall()
            return [
                Memory(
                    key=r[0], value=r[1], status=r[2], source=r[3],
                    created_at=r[4], updated_at=r[5],
                )
                for r in rows
            ]
        finally:
            conn.close()

    def list_active(self, limit: int = 50) -> list[Memory]:
        """List all active memories."""
        conn = sqlite3.connect(self.db_path)
        try:
            rows = conn.execute(
                "SELECT key, value, status, source, created_at, updated_at "
                "FROM memories WHERE status='active' "
                "ORDER BY updated_at DESC LIMIT ?",
                (limit,),
            ).fetchall()
            return [
                Memory(
                    key=r[0], value=r[1], status=r[2], source=r[3],
                    created_at=r[4], updated_at=r[5],
                )
                for r in rows
            ]
        finally:
            conn.close()
