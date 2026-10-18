"""Fix 5: Unified Multi-DB SQLite Manager (`server/db/unified_master.py`).

Consolidates the 5 fragmented SQLite stores (`os_state`, `om`, `octop_checkpoints`,
`dashboard`, `scheduler_jobs`) under a single WAL-mode connection manager with
cross-domain ACID transactions via SQLite `ATTACH DATABASE` or unified schemas.
"""
from __future__ import annotations

import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Dict, Iterator, Optional


class UnifiedMasterDB:
    """Thread-safe WAL-mode SQLite manager providing cross-store ACID transactions."""

    def __init__(self, master_path: str | Path = ":memory:", attached_stores: Optional[Dict[str, str]] = None) -> None:
        self.master_path = str(master_path)
        self._lock = threading.RLock()
        self.conn = sqlite3.connect(self.master_path, check_same_thread=False, isolation_level=None)
        self.conn.row_factory = sqlite3.Row
        self._configure_pragmas()
        if attached_stores:
            for alias, db_file in attached_stores.items():
                self.attach_store(alias, db_file)

    def _configure_pragmas(self) -> None:
        cur = self.conn.cursor()
        cur.execute("PRAGMA journal_mode=WAL;")
        cur.execute("PRAGMA synchronous=NORMAL;")
        cur.execute("PRAGMA busy_timeout=10000;")
        cur.execute("PRAGMA foreign_keys=ON;")

    def attach_store(self, schema_alias: str, db_path: str) -> None:
        with self._lock:
            self.conn.execute(f"ATTACH DATABASE ? AS {schema_alias}", (db_path,))

    @contextmanager
    def atomic(self) -> Iterator[sqlite3.Cursor]:
        """Cross-store ACID transaction context manager with automatic rollback on failure."""
        with self._lock:
            cur = self.conn.cursor()
            cur.execute("BEGIN IMMEDIATE")
            try:
                yield cur
                cur.execute("COMMIT")
            except Exception:
                cur.execute("ROLLBACK")
                raise

    def execute(self, sql: str, params: tuple = ()) -> sqlite3.Cursor:
        with self._lock:
            return self.conn.execute(sql, params)

    def close(self) -> None:
        with self._lock:
            self.conn.close()


_master_instance: Optional[UnifiedMasterDB] = None
_master_instance_lock = threading.Lock()


def get_unified_master_db(base_dir: str | Path = "data") -> UnifiedMasterDB:
    """Retrieve or initialize the global UnifiedMasterDB with all 5 stores attached."""
    global _master_instance
    with _master_instance_lock:
        if _master_instance is None:
            base = Path(base_dir)
            base.mkdir(parents=True, exist_ok=True)
            attached: Dict[str, str] = {}
            for name in ["os_state", "om", "octop_checkpoints", "dashboard", "scheduler_jobs"]:
                p = base / f"{name}.db"
                if not p.exists():
                    p.touch()
                attached[name] = str(p.resolve())
            _master_instance = UnifiedMasterDB(
                master_path=str((base / "master.db").resolve()),
                attached_stores=attached,
            )
        return _master_instance

