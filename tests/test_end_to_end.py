"""Phase 14: end-to-end integration of the whole foundation.

One scripted journey through a real ConversationManager proving the
locked phases work together: draft -> approval -> execute -> verify ->
remember, plus the safety rails (scope, permissions, verification),
memory, restart survival, the watcher, and honest degradation when
the model is unreachable.

Voice itself is out of scope here: the sandbox has no mic/speaker,
and the hardware voice path is unverified on sai's laptop. The text
turns below are the same pipeline voice would feed.
"""
import asyncio
import time

from config import load_config
from server.approvals import ApprovalStore, PendingApproval, content_hash
from server.conversation.manager import ConversationManager, _default_registry
from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent
from server.supervisor.permissions import ToolPolicy


def _offline_agent() -> SupervisorAgent:
    return SupervisorAgent(base_url="http://127.0.0.1:9")


def _manager(tmp_path, **kw) -> ConversationManager:
    store = StateStore(tmp_path / "s.db")
    reg = _default_registry(store)

    def liar(**kwargs) -> ToolResult:
        return ToolResult(status="success", mode=ExecutionMode.DIRECT)

    reg.register(
        ToolSpec(
            name="liar",
            description="test tool that lies about success",
            execution_mode=ExecutionMode.DIRECT,
        ),
        liar,
        lambda r: "liar says done",
    )
    sup = Supervisor(reg, agent=_offline_agent())
    sup.scope_guard.register_tool("liar", "calc", ("calc:eval",))
    sup.permissions.set_policy("liar", ToolPolicy.ALLOW)

    kw.setdefault("state_store", store)
    kw.setdefault("approval_store", ApprovalStore(tmp_path / "a.db"))
    kw.setdefault("supervisor", sup)
    kw.setdefault("tool_registry", reg)
    return ConversationManager(load_config(), **kw)


def _say(m: ConversationManager, text: str) -> str:
    async def go():
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    return asyncio.run(go())


def _statuses(m: ConversationManager) -> list[str]:
    return [r["status"] for r in m._approval_store.recent(limit=20)]


def test_full_journey(tmp_path):
    m = _manager(tmp_path)

    # 1. Draft -> approval requested. Nothing published yet.
    out = _say(m, "draft a linkedin post about shipping early")
    assert "approve" in out.lower()
    assert len(m._pending) == 1
    assert "PUBLISHED_STUB" not in _statuses(m)

    # 2. Approve -> executes, verifies, remembers.
    out = _say(m, "approve")
    assert "post to LinkedIn" in out
    assert "PUBLISHED_STUB" in _statuses(m)
    assert not m._pending

    # 3. Second draft -> reject -> discarded, never published.
    _say(m, "draft a linkedin post about quitting")
    out = _say(m, "reject")
    assert "discarded" in out.lower()
    assert "REJECTED_BY_USER" in _statuses(m)

    # 4. Disabled skill is rejected with its code, fail closed.
    m._supervisor.scope_guard.disable_skill("linkedin")
    out = _say(m, "draft a linkedin post about focus")
    assert "SKILL_DISABLED" in out
    m._supervisor.scope_guard.enable_skill("linkedin")

    # 5. The lying tool's "done" is caught by deterministic verification.
    from server.utils import PerfTrace

    async def via_handle():
        parts = []
        async for c in m._handle_tool(
            "liar", "run the liar", PerfTrace(None), {}
        ):
            parts.append(c.delta)
        return "".join(parts)

    out = asyncio.run(via_handle())
    assert "couldn't verify" in out
    assert "liar says done" not in out

    # 6. Memory round trip: save -> recall -> forget -> gone.
    assert "Saved" in _say(m, "remember that my launch code is 1234")
    assert "1234" in _say(m, "what do you remember about launch code")
    out = _say(m, "forget the launch code")
    assert "Forgot 1 note" in out
    assert "don't remember anything" in _say(
        m, "what do you remember about launch code"
    )

    # 7. Restart: a waiting approval survives and still executes.
    _say(m, "draft a linkedin post about persistence")
    m2 = _manager(tmp_path)
    assert len(m2._pending) == 1
    out = _say(m2, "approve")
    assert "post to LinkedIn" in out

    # 8. Watcher: an aging approval earns one heads-up, never a nag.
    p = PendingApproval(
        skill="linkedin",
        input_text="draft it",
        draft="aging draft",
        approved_hash=content_hash("aging draft"),
        run_id="r9",
    )
    p.created_ts = time.time() - 700
    m2._approval_store.save_pending(p)
    m3 = _manager(tmp_path)
    out1 = _say(m3, "hello")
    assert "Heads up" in out1
    out2 = _say(m3, "hello again")
    assert "Heads up" not in out2

    # Clear the queue so the next turn is a fresh request.
    out = _say(m3, "reject")
    assert "discarded" in out.lower()

    # 9. Team task with no model: honest degradation, no fabrication.
    out = _say(m3, "research electric scooters and then compare prices")
    # Honest degradation: says it could not complete, fabricates nothing.
    assert out == "I couldn't complete that task - no verified results."
