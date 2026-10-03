"""Memory subsystem.

Phase 2: SQLite memory manager.
Phase 3-5: memory retrieval, extraction.
Phase 6-10: full lifecycle.

Exports:
  SQLiteMemoryManager - Phase 2 backend
  MemoryRecord, MemoryType - data models
  MemoryManager - abstract base (server.memory.base)
"""
from pathlib import Path
import sys
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from .base import MemoryManager, MemoryRecord, MemoryType
from .sqlite_impl import SQLiteMemoryManager

__all__ = ["MemoryManager", "MemoryRecord", "MemoryType", "SQLiteMemoryManager"]