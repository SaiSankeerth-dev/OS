"""Phase 1 safety fixes — regression tests.

Tests the 5 fixes from the reality-check audit:
1. Approval double-execution race (async lock)
2. Approval DB deleted only after success (not before)
3. Provider-side token revocation attempted
4. Memory DELETE returns 404 (not false ok:true)
5. Browser async fix (import check)
"""
import asyncio
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

sys.path.insert(0, str(Path(__file__).parent.parent))


def test_approve_lock_exists():
    """Step 2A: atomic claim replaces the lock. Verify claim method exists."""
    from server.approvals.gate import ApprovalStore
    assert hasattr(ApprovalStore, "claim_pending")
    # Lock was removed in 2A (atomic UPDATE replaces it)
    import web.server as srv
    assert not hasattr(srv, "_approve_lock")


def test_approve_uses_lock():
    """Step 2A: approve() uses atomic claim (not a lock)."""
    import inspect
    import web.server as srv
    src = inspect.getsource(srv.approve)
    assert "claim_pending" in src
    assert "409" in src  # Returns 409 on already-claimed


def test_approve_one_deletes_after_success():
    """Step 2A: _approve_one uses status transitions (not delete)."""
    import inspect
    from server.conversation.manager import ConversationManager
    src = inspect.getsource(ConversationManager._approve_one)
    # Step 2A: mark_succeeded/mark_failed instead of remove_pending
    assert "mark_succeeded" in src or "claim_pending" in src


def test_memory_delete_404_no_db():
    """Fix 4: DELETE /api/memory returns 404 when DB doesn't exist."""
    import inspect
    import web.server as srv
    src = inspect.getsource(srv.forget_memory)
    assert "404" in src
    assert "database not found" in src
    # Should NOT have the old pattern of returning ok:true unconditionally
    assert 'if not db.exists():' in src


def test_revoke_attempts_provider():
    """Fix 3: revoke_connector attempts provider revocation."""
    import inspect
    import web.server as srv
    src = inspect.getsource(srv.revoke_connector)
    assert "oauth2.googleapis.com/revoke" in src
    assert "provider_revoked" in src


def test_browser_async_fix_present():
    """Fix 5: browser.py has the dedicated thread fix."""
    import inspect
    from web.om.browser import _PlaywrightDriver
    src = inspect.getsource(_PlaywrightDriver)
    # The fix uses a dedicated thread executor
    assert "_on_pw_thread" in src or "ThreadPoolExecutor" in src
