"""Phase 4 tests: Pydantic AI supervisor.

All tests run without Ollama: the SupervisorAgent is constructed with
pydantic-ai's TestModel, and the agent paths are best-effort with
rule-based fallbacks anyway.
"""
import asyncio

import pytest
from pydantic_ai.models.test import TestModel

from config import load_config
from server.approvals.gate import ApprovalStore
from server.conversation.manager import ConversationManager
from server.intent.registry import (
    ExecutionMode,
    ToolRegistry,
    ToolResult,
    ToolSpec,
)
from server.state.store import StateStore
from server.supervisor import (
    LifecycleStage,
    LifecycleTracker,
    ScopeGuard,
    SupervisedResult,
    Supervisor,
    SupervisorAgent,
    ToolPermission,
    ToolPolicy,
)


def _test_agent() -> SupervisorAgent:
    return SupervisorAgent(model=TestModel())


def _registry() -> ToolRegistry:
    reg = ToolRegistry()

    def draft_post(idea: str = "") -> ToolResult:
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={"draft": f"Draft about {idea}"},
        )

    def now() -> ToolResult:
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={"date": "Sunday, September 27, 2026",
                  "time": "06:00 PM", "timezone": "IST"},
        )

    reg.register(
        ToolSpec(
            name="linkedin_draft",
            description="draft a linkedin post",
            execution_mode=ExecutionMode.DIRECT,
        ),
        draft_post,
        formatter=lambda r: r.data["draft"],
    )
    reg.register(
        ToolSpec(
            name="get_current_datetime",
            description="current time",
            execution_mode=ExecutionMode.DIRECT,
        ),
        now,
        formatter=lambda r: r.data["time"],
    )
    return reg


def _supervisor(**kw) -> Supervisor:
    kw.setdefault("agent", _test_agent())
    return Supervisor(_registry(), **kw)


def _run(coro):
    return asyncio.run(coro)


# ---- scope guard --------------------------------------------------------

def test_disabled_skill_rejected_with_code():
    s = _supervisor(scope_guard=ScopeGuard(disabled_skills=("linkedin",)))
    res = _run(s.run_tool("linkedin_draft", {"idea": "x"}, "draft it"))
    assert res.status == "rejected"
    assert res.code == "SKILL_DISABLED"


def test_unknown_tool_out_of_scope():
    s = _supervisor()
    res = _run(s.run_tool("send_email", {}, "send an email"))
    assert res.status == "rejected"
    assert res.code == "OUT_OF_SCOPE"


def test_denied_tool_not_allowed():
    perms = ToolPermission({"linkedin_draft": ToolPolicy.DENIED})
    s = _supervisor(permissions=perms)
    res = _run(s.run_tool("linkedin_draft", {"idea": "x"}, "draft it"))
    assert res.status == "rejected"
    assert res.code == "TOOL_NOT_ALLOWED"


# ---- approval flow ------------------------------------------------------

def test_needs_approval_tool_waits():
    s = _supervisor()
    res = _run(s.run_tool("linkedin_draft", {"idea": "hackathon"}, "draft it"))
    assert res.status == "waiting_approval"
    assert res.code == "APPROVAL_REQUIRED"
    assert res.needs_approval
    assert res.tool_result is not None
    assert res.tool_result.status == "success"


def test_allow_tool_runs_straight_through():
    s = _supervisor()
    res = _run(s.run_tool("get_current_datetime", {}, "what time is it"))
    assert res.status == "ok"
    assert res.tool_result.data["time"] == "06:00 PM"


def test_complete_approved_runs_execute_verify_remember():
    s = _supervisor()
    first = _run(s.run_tool("linkedin_draft", {"idea": "x"}, "draft it"))
    published = []
    done = _run(
        s.complete_approved(first.run_id, "linkedin_draft",
                            lambda: published.append("stub-post") or "posted")
    )
    assert done.status == "ok"
    assert published == ["stub-post"]
    stages = s.tracker.stages_for(first.run_id)
    for expected in ("APPROVE", "EXECUTE", "VERIFY", "REMEMBER"):
        assert expected in stages


def test_reject_approved_run_closes_lifecycle():
    s = _supervisor()
    first = _run(s.run_tool("linkedin_draft", {"idea": "x"}, "draft it"))
    s.reject_approved_run(first.run_id, "linkedin_draft")
    assert "REMEMBER" in s.tracker.stages_for(first.run_id)


# ---- lifecycle ----------------------------------------------------------

def test_lifecycle_stages_recorded_in_order():
    s = _supervisor()
    res = _run(s.run_tool("get_current_datetime", {}, "time?"))
    stages = s.tracker.stages_for(res.run_id)
    assert stages[0] == "NOTICE"
    assert "SUGGEST" in stages
    assert "EXECUTE" in stages
    assert "VERIFY" in stages
    assert stages[-1] == "REMEMBER"


def test_lifecycle_events_persisted_to_state_store(tmp_path):
    store = StateStore(tmp_path / "s.db")
    s = _supervisor(state_store=store)
    res = _run(s.run_tool("get_current_datetime", {}, "time?"))
    events = store.get_events(kind="lifecycle")
    run_events = [e for e in events if res.run_id in e["data"]]
    assert len(run_events) >= 4


# ---- agent fallbacks ----------------------------------------------------

def test_agent_unreachable_falls_back_without_hanging():
    agent = SupervisorAgent(base_url="http://127.0.0.1:9")  # nothing here
    args = {"idea": "x"}
    assert _run(agent.refine_args("t", "text", args)) == args
    verdict = _run(agent.verify("t", args, "some outcome"))
    assert verdict.passed is True
    assert "fallback" in verdict.note


def test_agent_testmodel_path_does_not_crash():
    agent = _test_agent()
    out = _run(agent.refine_args("linkedin_draft", "draft it", {"idea": "x"}))
    assert isinstance(out, dict) and "idea" in out
    verdict = _run(agent.verify("linkedin_draft", {"idea": "x"}, "draft!"))
    assert isinstance(verdict.passed, bool)


# ---- manager integration -------------------------------------------------

def _collect(m: ConversationManager, text: str) -> str:
    async def go():
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    return asyncio.run(go())


def test_manager_rejects_disabled_skill(tmp_path):
    from server.conversation.manager import _default_registry

    cfg = load_config()
    m = ConversationManager(
        cfg,
        approval_store=ApprovalStore(tmp_path / "a.db"),
        supervisor=Supervisor(
            _default_registry(),
            scope_guard=ScopeGuard(disabled_skills=("linkedin",)),
            agent=_test_agent(),
        ),
    )
    out = _collect(m, "draft a linkedin post about my hackathon win")
    assert "SKILL_DISABLED" in out


def test_manager_full_approval_lifecycle(tmp_path):
    from server.conversation.manager import _default_registry

    cfg = load_config()
    store = StateStore(tmp_path / "s.db")
    sup = Supervisor(
        _default_registry(),
        approval_store=ApprovalStore(tmp_path / "a.db"),
        state_store=store,
        agent=_test_agent(),
    )
    m = ConversationManager(
        cfg,
        approval_store=ApprovalStore(tmp_path / "a.db"),
        supervisor=sup,
    )
    out = _collect(m, "draft a linkedin post about my hackathon win")
    assert "Here's the draft" in out
    assert "Approve and post this exact text?" in out
    out2 = _collect(m, "yes")
    assert "Would post to LinkedIn now" in out2
    events = store.get_events(kind="lifecycle")
    stages = {e["data"] for e in events}
    assert any("APPROVE" in d for d in stages)
    assert any("REMEMBER" in d for d in stages)


def test_supervisor_status_shape():
    st = _supervisor().status()
    assert set(st) == {
        "agent_model",
        "disabled_skills",
        "tools",
        "lifecycle_stages",
    }
    assert len(st["lifecycle_stages"]) == 11
