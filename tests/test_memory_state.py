"""Phase 12 tests: SQLite memory/state.

- The approval queue survives a restart (persisted in ApprovalStore).
- Expired items are pruned fail-closed on restore, never executed.
- memory_forget deletes saved notes end to end.
"""
import asyncio
import time

from config import load_config
from server.approvals import ApprovalStore, PendingApproval, content_hash
from server.approvals.gate import ApprovalStore as GateStore
from server.conversation.manager import ConversationManager, _default_registry
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent
from server.supervisor.verifier import verify_tool_result
from server.intent.registry import ExecutionMode, ToolResult


def _offline_agent() -> SupervisorAgent:
    return SupervisorAgent(base_url="http://127.0.0.1:9")


def _manager(tmp_path, **kw) -> ConversationManager:
    store = StateStore(tmp_path / "s.db")
    kw.setdefault("state_store", store)
    kw.setdefault(
        "approval_store", ApprovalStore(tmp_path / "approvals.db")
    )
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


def _pending(draft: str = "draft one", skill: str = "linkedin") -> PendingApproval:
    return PendingApproval(
        skill=skill,
        input_text="make a draft",
        draft=draft,
        approved_hash=content_hash(draft),
        run_id="run-1",
    )


# ---- approval queue persistence -------------------------------------------


def test_queue_survives_restart(tmp_path):
    m1 = _manager(tmp_path)
    m1._enqueue_pending(_pending("draft one"))
    m1._enqueue_pending(_pending("draft two"))
    assert len(m1._pending) == 2

    # A fresh manager on the same DB = a restart.
    m2 = _manager(tmp_path)
    assert [p.draft for p in m2._pending] == ["draft one", "draft two"]
    assert all(p.pending_id for p in m2._pending)


def test_approved_after_restart_still_executes(tmp_path):
    m1 = _manager(tmp_path)
    m1._enqueue_pending(_pending("draft one"))
    m2 = _manager(tmp_path)
    out = _collect(m2, "approve")
    assert "stub" in out.lower() or "post" in out.lower()
    assert not m2._pending
    # The row is gone - approving twice can't re-execute.
    assert GateStore(tmp_path / "approvals.db").load_pending() == []


def test_expired_items_pruned_on_restore(tmp_path):
    store = ApprovalStore(tmp_path / "approvals.db")
    old = _pending("stale draft")
    old.created_ts = time.time() - 7200  # 2h old, timeout is 1800s
    store.save_pending(old)

    m = _manager(tmp_path)
    assert m._pending == []  # pruned fail-closed on restore
    assert store.load_pending() == []
    statuses = [r["status"] for r in store.recent(limit=5)]
    assert "EXPIRED" in statuses


def test_reject_removes_persisted_row(tmp_path):
    m = _manager(tmp_path)
    m._enqueue_pending(_pending("draft one"))
    out = _collect(m, "reject")
    assert "discarded" in out.lower()
    assert GateStore(tmp_path / "approvals.db").load_pending() == []


def test_queue_full_refusal_does_not_persist(tmp_path):
    cfg_kwargs = {}
    m = _manager(tmp_path, **cfg_kwargs)
    m.cfg.approvals.max_pending = 1
    assert m._enqueue_pending(_pending("draft one"))
    assert not m._enqueue_pending(_pending("draft two"))
    assert len(GateStore(tmp_path / "approvals.db").load_pending()) == 1


def test_hash_still_binds_after_restore(tmp_path):
    m1 = _manager(tmp_path)
    p = _pending("original draft")
    m1._enqueue_pending(p)
    # Tamper with the persisted draft (simulates mutation after show).
    conn_path = tmp_path / "approvals.db"
    import sqlite3

    conn = sqlite3.connect(conn_path)
    conn.execute(
        "UPDATE pending SET draft = ? WHERE id = ?",
        ("tampered draft", p.pending_id),
    )
    conn.commit()
    conn.close()

    m2 = _manager(tmp_path)
    out = _collect(m2, "approve")
    assert "changed since I showed it" in out


# ---- memory_forget ---------------------------------------------------------


def test_forget_deletes_notes_end_to_end(tmp_path):
    m = _manager(tmp_path)
    out = _collect(m, "remember that my launch code is 1234")
    assert "Saved" in out
    out = _collect(m, "what do you remember about launch code")
    assert "1234" in out
    out = _collect(m, "forget what I told you about the launch code")
    assert "Forgot 1 note" in out
    assert "1234" in out  # reports what it deleted
    out = _collect(m, "what do you remember about launch code")
    assert "don't remember anything" in out


def test_forget_with_no_match_fails_cleanly(tmp_path):
    m = _manager(tmp_path)
    out = _collect(m, "forget what I told you about mars")
    assert "couldn't" in out.lower()
    assert "mars" in out


def test_forget_verifier_contract():
    ok = ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={"query": "x", "deleted": ["note one"]},
    )
    assert verify_tool_result("memory_forget", {}, ok).passed
    empty = ToolResult(
        status="success", mode=ExecutionMode.DIRECT, data={"deleted": []}
    )
    r = verify_tool_result("memory_forget", {}, empty)
    assert not r.passed


def test_router_routes_forget(tmp_path):
    from server.intent.router import IntentRouter, Intent

    r = IntentRouter()
    d = r.classify("forget my launch code")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "memory_forget"
    assert "launch code" in d.args["query"]
