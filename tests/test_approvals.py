"""Phase 10 tests: approval queue, timeouts, and the audit trail.

The single pending-approval slot becomes a FIFO queue with lazy
expiry, "approve all" / "reject all" decisions, and a read-only
history view (voice + CLI). Exact-content protection (content_hash)
is preserved per queued item.
"""
import asyncio
import time

from config import load_config
from server.approvals.gate import ApprovalStore, PendingApproval
from server.conversation.manager import ConversationManager, _default_registry
from server.intent.router import Intent, IntentRouter
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent


def _offline_agent() -> SupervisorAgent:
    return SupervisorAgent(base_url="http://127.0.0.1:9")


def _manager(tmp_path, **kw) -> ConversationManager:
    store = StateStore(tmp_path / "s.db")
    kw.setdefault("state_store", store)
    kw.setdefault("approval_store", ApprovalStore(tmp_path / "a.db"))
    kw.setdefault(
        "supervisor",
        Supervisor(_default_registry(store), agent=_offline_agent()),
    )
    return ConversationManager(load_config(), **kw)


def _collect(m: ConversationManager, text: str) -> str:
    async def go():
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    return asyncio.run(go())


def _draft(m: ConversationManager, idea: str) -> str:
    return _collect(m, f"draft a linkedin post about {idea}")


def _statuses(m: ConversationManager) -> list[str]:
    return [e["status"] for e in m._approval_store.recent(50)]


# ---- queue ---------------------------------------------------------------


def test_pending_queue_is_fifo(tmp_path):
    m = _manager(tmp_path)
    _draft(m, "shipping a retry system")
    _draft(m, "surviving an on-call rotation")
    assert len(m._pending) == 2

    first = _collect(m, "approve")
    assert "[stub] Would post to LinkedIn" in first
    assert len(m._pending) == 1  # oldest approved, newest still waiting

    second = _collect(m, "approve")
    assert "[stub] Would post to LinkedIn" in second
    assert m._pending == []
    assert _statuses(m).count("PUBLISHED_STUB") == 2


def test_approve_all_drains_queue(tmp_path):
    m = _manager(tmp_path)
    _draft(m, "shipping a retry system")
    _draft(m, "surviving an on-call rotation")
    out = _collect(m, "approve all")
    assert m._pending == []
    assert _statuses(m).count("PUBLISHED_STUB") == 2
    assert "Would post to LinkedIn" in out


def test_reject_all_drains_queue(tmp_path):
    m = _manager(tmp_path)
    _draft(m, "shipping a retry system")
    _draft(m, "surviving an on-call rotation")
    _collect(m, "reject all")
    assert m._pending == []
    assert _statuses(m).count("REJECTED_BY_USER") == 2


def test_reject_one_leaves_rest_waiting(tmp_path):
    m = _manager(tmp_path)
    _draft(m, "shipping a retry system")
    _draft(m, "surviving an on-call rotation")
    out = _collect(m, "reject")
    assert len(m._pending) == 1
    assert "more waiting" in out


def test_queue_full_refuses_newest(tmp_path):
    m = _manager(tmp_path)
    m.cfg.approvals.max_pending = 1
    _draft(m, "shipping a retry system")
    out = _draft(m, "surviving an on-call rotation")
    assert "queue is full" in out
    assert len(m._pending) == 1  # the first draft is still the one held


# ---- expiry ---------------------------------------------------------------


def test_expired_pending_is_pruned_fail_closed(tmp_path):
    m = _manager(tmp_path)
    m.cfg.approvals.timeout_sec = 1
    _draft(m, "shipping a retry system")
    assert len(m._pending) == 1
    m._pending[0].created_ts = time.time() - 60  # force expiry

    out = _collect(m, "approve")
    assert m._pending == []
    assert "expired" in out.lower()
    assert "EXPIRED" in _statuses(m)
    # The draft was never published.
    assert "PUBLISHED_STUB" not in _statuses(m)


def test_pending_approval_expired_predicate():
    p = PendingApproval(
        skill="linkedin", input_text="x", draft="y", approved_hash="z"
    )
    assert not p.expired(3600)
    p.created_ts = time.time() - 7200
    assert p.expired(3600)


def test_config_defaults(tmp_path):
    cfg = load_config()
    assert cfg.approvals.timeout_sec == 1800
    assert cfg.approvals.max_pending == 10


# ---- audit trail -----------------------------------------------------------


def test_recent_returns_newest_first(tmp_path):
    store = ApprovalStore(tmp_path / "a.db")
    store.log("linkedin", "idea one", "draft one", "SHOWN")
    store.log("linkedin", "idea two", "draft two", "PUBLISHED_STUB")
    rows = store.recent(10)
    assert [r["input"] for r in rows] == ["idea two", "idea one"]
    assert rows[0]["status"] == "PUBLISHED_STUB"


def test_recent_limit(tmp_path):
    store = ApprovalStore(tmp_path / "a.db")
    for i in range(5):
        store.log("linkedin", f"idea {i}", f"draft {i}", "SHOWN")
    assert len(store.recent(3)) == 3


def test_what_did_i_approve_voice(tmp_path):
    m = _manager(tmp_path)
    _draft(m, "shipping a retry system")
    _collect(m, "approve")
    out = _collect(m, "what did I approve")
    assert "linkedin" in out.lower()
    assert "publish" in out.lower()


def test_show_approval_history_voice(tmp_path):
    m = _manager(tmp_path)
    out = _collect(m, "show approval history")
    assert "approval" in out.lower()


def test_router_routes_history_intent():
    r = IntentRouter()
    assert r.classify("what did I approve").intent == Intent.APPROVALS
    assert r.classify("show approval history").intent == Intent.APPROVALS
    assert r.classify("approval history").intent == Intent.APPROVALS


def test_approvals_cli_exits_zero(tmp_path, capsys):
    import os_cli

    code = os_cli.cmd_approvals(type("A", (), {"limit": 5})())
    assert code == 0
    out = capsys.readouterr().out
    assert "approval" in out.lower() or "|" in out
