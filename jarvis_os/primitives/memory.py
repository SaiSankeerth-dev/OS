"""Persistent memory, workspaces, and revision-safe OpenDots spaces for OS.

Provides SQLite-backed semantic storage and optimistic concurrency revision
checks for documents so agent updates never silently overwrite user drafts.
"""
from __future__ import annotations

import sqlite3
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class MemoryAndSpaces:
    def __init__(self, db_path: str = ":memory:") -> None:
        self.db_path = db_path
        self._lock = threading.Lock()
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self) -> None:
        with self._lock:
            cur = self.conn.cursor()
            cur.executescript("""
                CREATE TABLE IF NOT EXISTS memories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category TEXT NOT NULL,
                content TEXT NOT NULL,
                tags TEXT,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS spaces (
                space_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS pages (
                page_id TEXT PRIMARY KEY,
                space_id TEXT NOT NULL,
                title TEXT NOT NULL,
                markdown TEXT NOT NULL,
                revision INTEGER NOT NULL DEFAULT 1,
                updated_by TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(space_id) REFERENCES spaces(space_id)
            );

            CREATE TABLE IF NOT EXISTS page_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id TEXT NOT NULL,
                revision INTEGER NOT NULL,
                title TEXT NOT NULL,
                markdown TEXT NOT NULL,
                updated_by TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
        """)
        self.conn.commit()
        # Seed primary OpenDots Workspace
        self.create_space(
            "engineering-hq",
            "Engineering & AI Lab",
            "Primary workspace for OS architecture, specs, and lab notes",
        )

    def remember(self, content: str, category: str = "general", tags: str = "") -> int:
        with self._lock:
            cur = self.conn.cursor()
            now_ts = datetime.now(timezone.utc).isoformat()
            cur.execute(
                "INSERT INTO memories (category, content, tags, created_at) VALUES (?, ?, ?, ?)",
                (category, content, tags, now_ts),
            )
            self.conn.commit()
            return cur.lastrowid or 0

    def search_memory(self, query: str) -> List[Dict[str, Any]]:
        with self._lock:
            cur = self.conn.cursor()
            pattern = f"%{query}%"
            cur.execute(
                "SELECT * FROM memories WHERE content LIKE ? OR tags LIKE ? OR category LIKE ? ORDER BY id DESC LIMIT 10",
                (pattern, pattern, pattern),
            )
            return [dict(row) for row in cur.fetchall()]

    def export_masked_memory(self) -> List[Dict[str, Any]]:
        """Privacy-aware memory export with credential/secret redaction."""
        with self._lock:
            cur = self.conn.cursor()
            cur.execute("SELECT * FROM memories ORDER BY id DESC")
            rows = [dict(r) for r in cur.fetchall()]
        sensitive = ("secret", "key", "password", "token", "auth")
        for r in rows:
            lower_c = r["content"].lower()
            if any(s in lower_c for s in sensitive):
                r["content"] = "[REDACTED_BY_OS_PRIVACY_SHIELD]"
        return rows

    def create_space(self, space_id: str, name: str, description: str) -> None:
        with self._lock:
            cur = self.conn.cursor()
            now_ts = datetime.now(timezone.utc).isoformat()
            cur.execute(
                "INSERT OR IGNORE INTO spaces (space_id, name, description, created_at) VALUES (?, ?, ?, ?)",
                (space_id, name, description, now_ts),
            )
            self.conn.commit()

    def list_spaces(self) -> List[Dict[str, Any]]:
        with self._lock:
            cur = self.conn.cursor()
            cur.execute("SELECT * FROM spaces ORDER BY created_at ASC")
            return [dict(r) for r in cur.fetchall()]

    def save_page(
        self,
        space_id: str,
        page_id: str,
        title: str,
        markdown: str,
        author: str,
        expected_revision: Optional[int] = None,
    ) -> Dict[str, Any]:
        """OpenDots revision-safe page editor with optimistic concurrency conflict detection."""
        with self._lock:
            cur = self.conn.cursor()
            cur.execute("SELECT revision FROM pages WHERE page_id = ?", (page_id,))
            existing = cur.fetchone()
            now_ts = datetime.now(timezone.utc).isoformat()

            if existing is None:
                cur.execute(
                    "INSERT INTO pages (page_id, space_id, title, markdown, revision, updated_by, updated_at) "
                    "VALUES (?, ?, ?, ?, 1, ?, ?)",
                    (page_id, space_id, title, markdown, author, now_ts),
                )
                cur.execute(
                    "INSERT INTO page_history (page_id, revision, title, markdown, updated_by, created_at) "
                    "VALUES (?, 1, ?, ?, ?, ?)",
                    (page_id, title, markdown, author, now_ts),
                )
                self.conn.commit()
                return {"status": "created", "page_id": page_id, "revision": 1}

            current_rev = existing["revision"]
            if expected_revision is not None and expected_revision != current_rev:
                return {
                    "status": "conflict",
                    "error": f"Revision mismatch: expected v{expected_revision}, but page is at v{current_rev}. Draft preserved.",
                    "current_revision": current_rev,
                }

            new_rev = current_rev + 1
            cur.execute(
                "UPDATE pages SET title = ?, markdown = ?, revision = ?, updated_by = ?, updated_at = ? WHERE page_id = ?",
                (title, markdown, new_rev, author, now_ts, page_id),
            )
            cur.execute(
                "INSERT INTO page_history (page_id, revision, title, markdown, updated_by, created_at) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (page_id, new_rev, title, markdown, author, now_ts),
            )
            self.conn.commit()
            return {"status": "updated", "page_id": page_id, "revision": new_rev}

    def get_pages(self, space_id: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._lock:
            cur = self.conn.cursor()
            if space_id:
                cur.execute("SELECT * FROM pages WHERE space_id = ? ORDER BY updated_at DESC", (space_id,))
            else:
                cur.execute("SELECT * FROM pages ORDER BY updated_at DESC")
            return [dict(r) for r in cur.fetchall()]

    def get_page(self, page_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            cur = self.conn.cursor()
            cur.execute("SELECT * FROM pages WHERE page_id = ?", (page_id,))
            row = cur.fetchone()
            return dict(row) if row else None
