"""End-to-end test for Milestone 0: draft -> show -> approve/reject -> log.

Wired into the real ConversationManager/IntentRouter, not a standalone
script - this is the actual conversational path a user hits.
"""
import asyncio

from config import load_config
from server.approvals.gate import ApprovalStore
from server.conversation.manager import ConversationManager


def _mgr(tmp_path) -> ConversationManager:
    cfg = load_config()
    store = ApprovalStore(tmp_path / "approvals.db")
    return ConversationManager(cfg, approval_store=store)


async def _collect_into(m: ConversationManager, text: str) -> str:
    parts = []
    async for c in m.respond_text(text):
        parts.append(c.delta)
    return "".join(parts).strip()


def test_linkedin_draft_shows_exact_text_and_asks_for_approval(tmp_path):
    m = _mgr(tmp_path)
    out = asyncio.run(
        _collect_into(m, "draft a linkedin post about shipping a retry system")
    )
    assert "Approve and post this exact text?" in out
    assert len(m._pending) == 1
    assert m._pending[0].skill == "linkedin"


def test_approve_publishes_stub_and_clears_pending(tmp_path):
    m = _mgr(tmp_path)
    asyncio.run(_collect_into(m, "draft a linkedin post about a small bugfix"))
    out = asyncio.run(_collect_into(m, "yes"))
    assert "[stub] Would post to LinkedIn now" in out
    assert m._pending == []


def test_reject_discards_and_clears_pending(tmp_path):
    m = _mgr(tmp_path)
    asyncio.run(_collect_into(m, "draft a linkedin post about a small win"))
    out = asyncio.run(_collect_into(m, "no"))
    assert "discarded" in out.lower()
    assert m._pending == []


def test_content_changed_after_approval_is_refused_not_executed(tmp_path):
    m = _mgr(tmp_path)
    asyncio.run(_collect_into(m, "draft a linkedin post about a launch"))
    # Simulate the draft being mutated after it was shown to the user -
    # the hash must no longer match, and publish must be refused.
    m._pending[0].draft += " EDITED AFTER APPROVAL"
    out = asyncio.run(_collect_into(m, "yes"))
    assert "changed since I showed it" in out
    assert "[stub] Would post" not in out
    assert m._pending == []


def test_ambiguous_reply_keeps_pending_approval_alive(tmp_path):
    m = _mgr(tmp_path)
    asyncio.run(_collect_into(m, "draft a linkedin post about a demo day"))
    out = asyncio.run(_collect_into(m, "make it shorter"))
    assert "still got a draft waiting" in out
    assert len(m._pending) == 1  # nothing was silently dropped


def test_every_run_is_logged_to_sqlite(tmp_path):
    import sqlite3

    m = _mgr(tmp_path)
    asyncio.run(_collect_into(m, "draft a linkedin post about a code review tool"))
    asyncio.run(_collect_into(m, "yes"))

    conn = sqlite3.connect(tmp_path / "approvals.db")
    rows = conn.execute("SELECT status FROM runs ORDER BY id").fetchall()
    conn.close()
    statuses = [r[0] for r in rows]
    assert statuses == ["SHOWN", "PUBLISHED_STUB"]
