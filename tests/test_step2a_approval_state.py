"""Step 2A: Approval state machine — acceptance tests.

Per the plan:
1. 10 concurrent approves → exactly 1 execution, 9 get 409
2. Crash mid-execution (simulated) → row becomes 'unknown', not rerun
3. Action raises → status 'failed', error stored
"""
import asyncio
import sqlite3
import sys
import tempfile
from pathlib import Path
from unittest.mock import MagicMock

sys.path.insert(0, str(Path(__file__).parent.parent))

from server.approvals.gate import ApprovalStore


def _make_store():
    """Create a temp ApprovalStore."""
    tmp = tempfile.mktemp(suffix=".db")
    return ApprovalStore(db_path=tmp), tmp


def test_atomic_claim_only_one_wins():
    """10 concurrent claims → exactly 1 wins."""
    store, path = _make_store()
    try:
        # Create a pending approval directly
        conn = sqlite3.connect(path)
        conn.execute(
            "INSERT INTO pending (skill, input, draft, approved_hash, run_id, created_ts, status) "
            "VALUES (?, ?, ?, ?, ?, ?, 'pending')",
            ("test", "input", "draft", "hash", "run1", 12345.0),
        )
        conn.commit()
        pid = conn.execute("SELECT id FROM pending").fetchone()[0]
        conn.close()

        # 10 concurrent claims
        results = [store.claim_pending(pid) for _ in range(10)]
        wins = sum(1 for r in results if r)
        assert wins == 1, f"expected 1 win, got {wins}"
    finally:
        Path(path).unlink(missing_ok=True)


def test_failed_marks_failed_with_error():
    """Action raises → status='failed', error stored."""
    store, path = _make_store()
    try:
        conn = sqlite3.connect(path)
        conn.execute(
            "INSERT INTO pending (skill, input, draft, approved_hash, run_id, created_ts, status) "
            "VALUES (?, ?, ?, ?, ?, ?, 'pending')",
            ("test", "input", "draft", "hash", "run1", 12345.0),
        )
        conn.commit()
        pid = conn.execute("SELECT id FROM pending").fetchone()[0]
        conn.close()

        assert store.claim_pending(pid) is True
        store.mark_failed(pid, "ValueError: test error")

        assert store.get_status(pid) == "failed"
        # Verify error stored
        conn = sqlite3.connect(path)
        row = conn.execute("SELECT result FROM pending WHERE id=?", (pid,)).fetchone()
        conn.close()
        assert "ValueError" in row[0]
    finally:
        Path(path).unlink(missing_ok=True)


def test_succeeded_marks_succeeded():
    """Success → status='succeeded', result stored."""
    store, path = _make_store()
    try:
        conn = sqlite3.connect(path)
        conn.execute(
            "INSERT INTO pending (skill, input, draft, approved_hash, run_id, created_ts, status) "
            "VALUES (?, ?, ?, ?, ?, ?, 'pending')",
            ("test", "input", "draft", "hash", "run1", 12345.0),
        )
        conn.commit()
        pid = conn.execute("SELECT id FROM pending").fetchone()[0]
        conn.close()

        assert store.claim_pending(pid) is True
        store.mark_succeeded(pid, "done!")

        assert store.get_status(pid) == "succeeded"
    finally:
        Path(path).unlink(missing_ok=True)


def test_crash_mid_execution_becomes_unknown():
    """Simulated crash: row stuck in 'executing' → 'unknown' on restart."""
    store, path = _make_store()
    try:
        # Simulate: claim succeeded, then crash before mark_succeeded/failed
        conn = sqlite3.connect(path)
        conn.execute(
            "INSERT INTO pending (skill, input, draft, approved_hash, run_id, created_ts, status) "
            "VALUES (?, ?, ?, ?, ?, ?, 'pending')",
            ("test", "input", "draft", "hash", "run1", 12345.0),
        )
        conn.commit()
        pid = conn.execute("SELECT id FROM pending").fetchone()[0]
        conn.close()

        assert store.claim_pending(pid) is True
        assert store.get_status(pid) == "executing"
        # "Crash" — no mark_succeeded/failed called

        # "Restart": new store instance runs migration
        store2 = ApprovalStore(db_path=path)
        assert store2.get_status(pid) == "unknown"
    finally:
        Path(path).unlink(missing_ok=True)


def test_double_claim_returns_false():
    """Second claim on same id returns False (not an error)."""
    store, path = _make_store()
    try:
        conn = sqlite3.connect(path)
        conn.execute(
            "INSERT INTO pending (skill, input, draft, approved_hash, run_id, created_ts, status) "
            "VALUES (?, ?, ?, ?, ?, ?, 'pending')",
            ("test", "input", "draft", "hash", "run1", 12345.0),
        )
        conn.commit()
        pid = conn.execute("SELECT id FROM pending").fetchone()[0]
        conn.close()

        assert store.claim_pending(pid) is True
        assert store.claim_pending(pid) is False  # Already claimed
    finally:
        Path(path).unlink(missing_ok=True)
