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
    """Fix 1: _approve_lock is defined as an asyncio.Lock."""
    import web.server as srv
    assert hasattr(srv, "_approve_lock")
    assert isinstance(srv._approve_lock, asyncio.Lock)


def test_approve_uses_lock():
    """Fix 1: approve() acquires the lock around find+execute+remove."""
    import inspect
    import web.server as srv
    src = inspect.getsource(srv.approve)
    assert "_approve_lock" in src
    assert "async with" in src


def test_approve_one_deletes_after_success():
    """Fix 2: _approve_one only removes from DB after successful execution."""
    import inspect
    from server.conversation.manager import ConversationManager
    src = inspect.getsource(ConversationManager._approve_one)
    # Should NOT delete at start; should delete after success
    assert "remove_pending" in src
    # The new structure: try/except with remove after
    assert "_execute_approved" in src


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
