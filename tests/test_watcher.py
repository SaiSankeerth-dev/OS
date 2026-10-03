"""Phase 13 tests: proactive watcher.

Locked rule: watchers may only suggest. Every test below pins that -
the watcher reads state and writes its own suggestion bookkeeping,
nothing else.
"""
import asyncio
import json
import time

from config import load_config
from server.approvals import ApprovalStore, PendingApproval, content_hash
from server.conversation.manager import ConversationManager, _default_registry
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent
from server.watcher import Watcher


def _offline_agent() -> SupervisorAgent:
    return SupervisorAgent(base_url="http://127.0.0.1:9")


def _stores(tmp_path):
    state = StateStore(tmp_path / "s.db")
    approvals = ApprovalStore(tmp_path / "a.db")
    return state, approvals


def _watcher(tmp_path, **kw):
    state, approvals = _stores(tmp_path)
    kw.setdefault("state_store", state)
    kw.setdefault("approval_store", approvals)
    kw.setdefault("nag_after_sec", 600)
    return Watcher(**kw), state, approvals


def _pending_old(draft: str = "stale draft") -> PendingApproval:
    p = PendingApproval(
        skill="linkedin",
        input_text="draft it",
        draft=draft,
        approved_hash=content_hash(draft),
        run_id="run-1",
    )
    p.created_ts = time.time() - 3600  # an hour old
    return p


def test_quiet_when_nothing_to_say(tmp_path):
    w, _, _ = _watcher(tmp_path)
    assert w.check() == []
    assert w.unseen() == []


def test_aging_pending_suggests(tmp_path):
    w, _, approvals = _watcher(tmp_path)
    approvals.save_pending(_pending_old())
    found = w.check()
    assert len(found) == 1
    assert found[0].kind == "aging_pending"
    assert "approval" in found[0].text


def test_fresh_pending_stays_quiet(tmp_path):
    w, _, approvals = _watcher(tmp_path, nag_after_sec=7200)
    p = _pending_old()
    p.created_ts = time.time()  # just queued
    approvals.save_pending(p)
    assert w.check() == []


def test_expired_approvals_suggest(tmp_path):
    w, _, approvals = _watcher(tmp_path)
    approvals.log("linkedin", "in", "draft", "EXPIRED")
    found = w.check()
    kinds = [s.kind for s in found]
    assert "expired_approvals" in kinds


def test_failure_cluster_suggests(tmp_path):
    w, state, _ = _watcher(tmp_path, min_failures=2)
    for i in range(2):
        state.log_event(
            "lifecycle",
            "supervisor",
            json.dumps(
                {
                    "run_id": f"r{i}",
                    "stage": "REMEMBER",
                    "detail": "tool failed: boom",
                }
            ),
        )
    found = w.check()
    assert any(s.kind == "recent_failures" for s in found)


def test_single_failure_stays_quiet(tmp_path):
    w, state, _ = _watcher(tmp_path, min_failures=2)
    state.log_event(
        "lifecycle",
        "supervisor",
        json.dumps(
            {"run_id": "r1", "stage": "REMEMBER", "detail": "tool failed: x"}
        ),
    )
    assert w.check() == []


def test_cooldown_dedupes(tmp_path):
    w, _, approvals = _watcher(tmp_path, cooldown_sec=86400)
    approvals.save_pending(_pending_old())
    first = w.check()
    assert len(first) == 1
    # Same state, second check: no repeat within the cooldown.
    assert w.check() == []


def test_watcher_never_mutates_user_state(tmp_path):
    w, state, approvals = _watcher(tmp_path)
    approvals.save_pending(_pending_old())
    state.log_event("memory", "memory_skill", json.dumps({"note": "x"}))
    n_pending_before = len(approvals.load_pending())
    n_events_before = len(state.get_events(limit=1000))
    w.check()
    # Pending queue untouched, no lifecycle/tool events fabricated,
    # memory notes untouched. Only suggestion rows were written.
    assert len(approvals.load_pending()) == n_pending_before
    assert len(state.get_events(limit=1000)) == n_events_before
    assert state.get_events("memory", limit=10)[0]["data"] == json.dumps(
        {"note": "x"}
    )


def test_manager_surfaces_suggestion_once(tmp_path):
    state = StateStore(tmp_path / "s.db")
    approvals = ApprovalStore(tmp_path / "a.db")
    approvals.save_pending(_pending_old())
    m = ConversationManager(
        load_config(),
        state_store=state,
        approval_store=approvals,
        supervisor=Supervisor(
            _default_registry(state), agent=_offline_agent()
        ),
    )

    async def go(text):
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    out1 = asyncio.run(go("hello"))
    assert "Heads up" in out1
    assert "approval" in out1
    # Second turn: the suggestion was marked seen - no nagging.
    out2 = asyncio.run(go("hello again"))
    assert "Heads up" not in out2


def test_watcher_disabled_stays_silent(tmp_path):
    cfg = load_config()
    cfg.watcher.enabled = False
    state = StateStore(tmp_path / "s.db")
    approvals = ApprovalStore(tmp_path / "a.db")
    approvals.save_pending(_pending_old())
    m = ConversationManager(
        load_config(),
        state_store=state,
        approval_store=approvals,
        supervisor=Supervisor(
            _default_registry(state), agent=_offline_agent()
        ),
    )
    m.cfg.watcher.enabled = False

    async def go(text):
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    out = asyncio.run(go("hello"))
    assert "Heads up" not in out
    assert cfg is not None  # config loads with the watcher section
