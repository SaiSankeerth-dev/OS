"""Phase 11 tests: deterministic verification of tool outcomes.

Locked rule: never trust a "done" claim. Every executed tool result
is checked against a structural contract; a success with nothing
verifiable FAILS and is never presented as fact.
"""
import asyncio

from config import load_config
from server.approvals.gate import ApprovalStore
from server.conversation.manager import ConversationManager, _default_registry
from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent
from server.supervisor.verifier import verify_tool_result


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


def _ok(data: dict | None = None) -> ToolResult:
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT, data=data or {}
    )


# ---- verifier unit checks -------------------------------------------------


def test_calc_contract_accepts_numeric():
    r = verify_tool_result(
        "calc", {}, _ok({"expression": "2+2", "result": 4})
    )
    assert r.passed


def test_calc_contract_rejects_missing_result():
    r = verify_tool_result("calc", {}, _ok({"expression": "2+2"}))
    assert not r.passed
    assert "numeric" in r.note


def test_calc_contract_rejects_bool_result():
    r = verify_tool_result(
        "calc", {}, _ok({"expression": "1==1", "result": True})
    )
    assert not r.passed


def test_linkedin_draft_contract():
    assert verify_tool_result(
        "linkedin_draft", {}, _ok({"draft": "hello", "idea": "x"})
    ).passed
    r = verify_tool_result(
        "linkedin_draft", {}, _ok({"draft": "   ", "idea": "x"})
    )
    assert not r.passed
    r = verify_tool_result(
        "linkedin_draft", {}, _ok({"draft": "x" * 3001, "idea": "x"})
    )
    assert not r.passed


def test_memory_contracts():
    assert verify_tool_result(
        "memory_save", {}, _ok({"note": "buy milk"})
    ).passed
    assert not verify_tool_result(
        "memory_save", {}, _ok({"note": ""})
    ).passed
    # Zero hits is legitimate - the contract is the shape.
    assert verify_tool_result(
        "memory_recall", {}, _ok({"query": "q", "notes": []})
    ).passed
    assert not verify_tool_result(
        "memory_recall", {}, _ok({"query": "q"})
    ).passed


def test_datetime_and_system_contracts():
    assert verify_tool_result(
        "get_current_datetime", {},
        _ok({"date": "Monday", "time": "10:00 AM"}),
    ).passed
    assert not verify_tool_result(
        "get_current_datetime", {}, _ok({"date": "Monday"})
    ).passed
    assert verify_tool_result(
        "get_system_info", {},
        _ok({"cpu_percent": 1.0, "memory_percent": 2.0}),
    ).passed
    assert not verify_tool_result(
        "get_system_info", {}, _ok({"cpu_percent": 1.0})
    ).passed


def test_tool_failure_never_verifies():
    bad = ToolResult(
        status="failure", mode=ExecutionMode.DIRECT, error="boom"
    )
    r = verify_tool_result("calc", {}, bad)
    assert not r.passed
    assert "boom" in r.note


def test_success_with_nothing_fails():
    # The core lie this phase exists to catch.
    r = verify_tool_result("calc", {}, _ok({}))
    assert not r.passed
    r = verify_tool_result("some_unknown_tool", {}, _ok({}))
    assert not r.passed
    assert "nothing" in r.note


def test_mcp_tool_requires_payload():
    assert verify_tool_result(
        "mcp__echo__echo", {}, _ok({"text": "hi"})
    ).passed
    r = verify_tool_result("mcp__echo__echo", {}, _ok({}))
    assert not r.passed


# ---- pipeline gating -------------------------------------------------------


def _lying_registry(tmp_path):
    store = StateStore(tmp_path / "s.db")
    reg = _default_registry(store)

    def liar(**kwargs) -> ToolResult:
        # Claims success, returns nothing. Classic "done" lie.
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
    return reg, store


def _lying_supervisor(tmp_path):
    """Supervisor whose registry contains a tool that lies about success."""
    from server.supervisor.permissions import ToolPolicy

    reg, store = _lying_registry(tmp_path)
    sup = Supervisor(reg, agent=_offline_agent())
    # The liar is a local test tool under the calc skill's scope,
    # explicitly allowed so it reaches the verifier.
    sup.scope_guard.register_tool("liar", "calc", ("calc:eval",))
    sup.permissions.set_policy("liar", ToolPolicy.ALLOW)
    return sup, reg, store


def test_pipeline_fails_unverifiable_success(tmp_path):
    sup, reg, store = _lying_supervisor(tmp_path)
    res = asyncio.run(sup.run_tool("liar", {}, "run the liar"))
    assert res.status == "failed"
    assert res.verification_failed
    assert "verify" in res.message.lower()


def test_pipeline_still_passes_honest_tools(tmp_path):
    store = StateStore(tmp_path / "s.db")
    sup = Supervisor(_default_registry(store), agent=_offline_agent())
    res = asyncio.run(
        sup.run_tool("calc", {"expression": "2+2"}, "calculate 2+2")
    )
    assert res.status == "ok"
    assert not res.verification_failed


def test_manager_never_presents_unverified_result(tmp_path):
    from server.utils import PerfTrace

    sup, reg, store = _lying_supervisor(tmp_path)
    m = ConversationManager(
        load_config(),
        state_store=store,
        approval_store=ApprovalStore(tmp_path / "a.db"),
        supervisor=sup,
        tool_registry=reg,
    )

    async def go():
        parts = []
        async for c in m._handle_tool(
            "liar", "run the liar", PerfTrace(None), {}
        ):
            parts.append(c.delta)
        return "".join(parts)

    out = asyncio.run(go())
    assert "couldn't verify" in out
    assert "liar says done" not in out  # the lie is never presented


def test_manager_reports_verification_failure(tmp_path):
    from server.intent.router import IntentRouter

    sup, reg, store = _lying_supervisor(tmp_path)
    # Call the pipeline directly: the liar's "done" must not verify.
    res = asyncio.run(sup.run_tool("liar", {}, "run the liar"))
    assert res.status == "failed"
    assert "couldn't verify" in res.message


def test_complete_approved_rejects_empty_outcome(tmp_path):
    store = StateStore(tmp_path / "s.db")
    sup = Supervisor(_default_registry(store), agent=_offline_agent())
    res = asyncio.run(
        sup.complete_approved("run-1", "linkedin_draft", lambda: "   ")
    )
    assert res.status == "failed"
    assert res.verification_failed
