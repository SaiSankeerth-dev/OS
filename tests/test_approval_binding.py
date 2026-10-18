"""Batch A close-out: a bare "yes"/"no" must never pick the oldest of
several pending approvals. The user picks by number ("approve 2") or
explicitly says "approve all".
"""
import asyncio

from config import load_config
from server.approvals.gate import ApprovalStore, PendingApproval, content_hash
from server.conversation.manager import ConversationManager


def _mgr(tmp_path) -> ConversationManager:
    cfg = load_config()
    store = ApprovalStore(tmp_path / "approvals.db")
    return ConversationManager(cfg, approval_store=store)


def _linkedin_pending(text: str) -> PendingApproval:
    draft = f"draft about {text}"
    return PendingApproval(
        skill="linkedin", input_text=text, draft=draft,
        approved_hash=content_hash(draft),
    )


async def _collect(m: ConversationManager, text: str) -> str:
    parts = []
    async for c in m.respond_text(text):
        parts.append(c.delta)
    return "".join(parts).strip()


def _two_pending(m: ConversationManager):
    m._pending.append(_linkedin_pending("alpha"))
    m._pending.append(_linkedin_pending("beta"))


def test_bare_yes_with_two_pending_approves_nothing(tmp_path):
    m = _mgr(tmp_path)
    _two_pending(m)
    out = asyncio.run(_collect(m, "yes"))
    assert len(m._pending) == 2  # nothing consumed
    assert "won't guess" in out
    assert "approve 2" in out


def test_approve_2_picks_the_second(tmp_path):
    m = _mgr(tmp_path)
    _two_pending(m)
    out = asyncio.run(_collect(m, "approve 2"))
    assert "[stub] Would post to LinkedIn now" in out
    assert "beta" in out  # the second one ran
    assert len(m._pending) == 1
    assert "alpha" in m._pending[0].input_text  # the first one waits


def test_approve_out_of_range_asks_again(tmp_path):
    m = _mgr(tmp_path)
    _two_pending(m)
    out = asyncio.run(_collect(m, "approve 9"))
    assert len(m._pending) == 2
    assert "no item 9" in out


def test_bare_no_with_two_pending_rejects_nothing(tmp_path):
    m = _mgr(tmp_path)
    _two_pending(m)
    out = asyncio.run(_collect(m, "no"))
    assert len(m._pending) == 2
    assert "won't guess" in out


def test_reject_1_rejects_the_first(tmp_path):
    m = _mgr(tmp_path)
    _two_pending(m)
    out = asyncio.run(_collect(m, "reject 1"))
    assert "discarded" in out.lower()
    assert len(m._pending) == 1
    assert "beta" in m._pending[0].input_text


def test_bare_yes_with_one_pending_still_works(tmp_path):
    m = _mgr(tmp_path)
    m._pending.append(_linkedin_pending("solo"))
    out = asyncio.run(_collect(m, "yes"))
    assert "[stub] Would post to LinkedIn now" in out
    assert m._pending == []
