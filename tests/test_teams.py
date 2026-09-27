"""Phase 5 tests: dynamic agent teams.

No Ollama needed: workers are injected as deterministic stubs via
worker_factory, and the supervisor agent uses an unreachable URL so
every LLM step exercises its rule-based fallback.
"""
import asyncio

import pytest

from config import load_config
from server.approvals.gate import ApprovalStore
from server.conversation.manager import ConversationManager, _default_registry
from server.intent.router import Intent, IntentRouter
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent
from server.supervisor.agent import build_model
from server.teams import Team, TeamResult, WorkerAgent
from server.teams.team import MAX_WORKERS


def _offline_agent() -> SupervisorAgent:
    return SupervisorAgent(base_url="http://127.0.0.1:9")  # nothing here


class _StubWorker:
    """Deterministic stand-in for WorkerAgent."""

    def __init__(self, subtask: str, output: str = ""):
        self.subtask = subtask
        self._output = output or f"result for {subtask}"

    async def run(self) -> str:
        return self._output


def _team(outputs: dict[str, str] | None = None, **kw) -> Team:
    outputs = outputs or {}

    def factory(subtask: str):
        return _StubWorker(subtask, outputs.get(subtask, ""))

    kw.setdefault("agent", _offline_agent())
    kw.setdefault("worker_factory", factory)
    return Team(**kw)


def _run(coro):
    return asyncio.run(coro)


# ---- intent routing -----------------------------------------------------

def test_task_pattern_matches_multistep():
    r = IntentRouter()
    d = r.classify("research solar panels and then summarize the pros and cons")
    assert d.intent == Intent.TASK
    d = r.classify("plan my week: gym and also deep work blocks")
    assert d.intent == Intent.TASK


def test_task_pattern_does_not_steal_simple_requests():
    r = IntentRouter()
    assert r.classify("what time is it").intent != Intent.TASK
    assert r.classify("hello there").intent != Intent.TASK
    assert r.classify("draft a linkedin post about x").intent != Intent.TASK


# ---- planning ------------------------------------------------------------

def test_plan_falls_back_to_single_task_offline():
    team = _team()
    assert _run(team.plan("do the thing")) == ["do the thing"]


def test_plan_caps_at_max_workers():
    team = _team(max_workers=2)
    # plan fallback returns 1; cap is enforced in execute() - simulate
    # a 5-task plan going through execute.
    outs = _run(team.execute([f"task {i}" for i in range(5)]))
    assert len(outs) == 2


# ---- execution ------------------------------------------------------------

def test_execute_runs_workers_in_parallel():
    seen: list[str] = []

    class Slow(_StubWorker):
        async def run(self):
            seen.append(self.subtask)
            await asyncio.sleep(0.05)
            return await super().run()

    team = Team(agent=_offline_agent(),
                worker_factory=lambda s: Slow(s))
    outs = _run(team.execute(["alpha task", "beta task"]))
    assert len(outs) == 2
    assert set(seen) == {"alpha task", "beta task"}


def test_execute_timeout_marks_no_result():
    class Hang(_StubWorker):
        async def run(self):
            await asyncio.sleep(30)
            return "never"

    team = Team(agent=_offline_agent(), worker_timeout=0.05,
                worker_factory=lambda s: Hang(s))
    outs = _run(team.execute(["slow subtask here"]))
    assert outs == ["[no result: slow subtask here]"]


def test_cancel_stops_the_team():
    team = _team()
    team.cancel()
    res = _run(team.run("anything"))
    assert res.status == "cancelled"


# ---- verification ----------------------------------------------------------

def test_verify_accepts_ontopic_result():
    team = _team()
    assert team.verify("research solar panel costs",
                       "solar panel costs fell 80% in ten years") is True


def test_verify_rejects_offtopic_and_empty():
    team = _team()
    assert team.verify("research solar panel costs", "the weather is nice") is False
    assert team.verify("research solar panel costs", "") is False
    assert team.verify("research solar panel costs", "[no result: x]") is False
    assert team.verify("research solar panel costs",
                       "[worker fallback: no model]") is False


# ---- synthesis ---------------------------------------------------------------

def test_synthesize_falls_back_to_join_offline():
    team = _team()
    text = _run(team.synthesize("goal", [("a", "AAA"), ("b", "BBB")]))
    assert "AAA" in text and "BBB" in text


def test_synthesize_single_result_passthrough():
    team = _team()
    assert _run(team.synthesize("goal", [("a", "only")])) == "only"


def test_synthesize_no_verified():
    team = _team()
    text = _run(team.synthesize("goal", []))
    assert "couldn't complete" in text


# ---- full team run ------------------------------------------------------------

def test_full_run_ok_with_stub_workers():
    team = _team({
        "research solar panel costs": "solar panel costs fell 80 percent",
        "list three installers": "installers: sunny, bright, volt",
    })
    # Bypass plan (offline fallback = single task) by running pieces.
    res = _run(team.run("research solar"))
    assert res.status in ("ok", "partial")
    assert res.verified >= 1


def test_worker_isolation_no_tools_registered():
    w = WorkerAgent("do x", model=None, base_url="http://127.0.0.1:9")
    agent = w._worker()
    toolset = agent._function_toolset
    tools = getattr(toolset, "tools", None)
    assert tools == {}  # workers cannot call tools, period


# ---- supervisor integration -----------------------------------------------------

def test_supervisor_run_team_lifecycle(tmp_path):
    store = StateStore(tmp_path / "s.db")
    sup = Supervisor(_default_registry(), state_store=store,
                     agent=_offline_agent())
    # Inject stub workers through a team wired to this supervisor's agent.
    # run_team does `from ..teams import Team`, so patch the package attr.
    import server.teams as teams_pkg

    orig_team = teams_pkg.Team

    class WiredTeam(orig_team):
        def __init__(self, **kw):
            kw["agent"] = sup.agent
            kw["worker_factory"] = (
                lambda s: _StubWorker(s, f"solar result about {s}")
            )
            super().__init__(**kw)

    teams_pkg.Team = WiredTeam
    try:
        res = _run(sup.run_team("research solar panels"))
    finally:
        teams_pkg.Team = orig_team
    assert res.status in ("ok", "partial")
    assert res.run_id
    events = store.get_events(kind="lifecycle")
    stages = [__import__("json").loads(e["data"])["stage"]
              for e in events if res.run_id in e["data"]]
    for expected in ("NOTICE", "SUGGEST", "EXECUTE", "VERIFY", "REMEMBER"):
        assert expected in stages


# ---- manager integration ----------------------------------------------------------

def _collect(m: ConversationManager, text: str) -> str:
    async def go():
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    return asyncio.run(go())


def test_manager_task_branch_runs_team(tmp_path):
    cfg = load_config()

    class TeamSupervisor(Supervisor):
        async def run_team(self, user_text, **kw):
            return TeamResult(status="ok", text="merged team answer",
                              subtasks=["a"], verified=1, run_id="r1")

    m = ConversationManager(
        cfg,
        approval_store=ApprovalStore(tmp_path / "a.db"),
        supervisor=TeamSupervisor(_default_registry(), agent=_offline_agent()),
    )
    out = _collect(m, "research solar panels and then summarize the pros")
    assert "merged team answer" in out
    assert "later phase" not in out


def test_manager_skips_laya_for_task_intent(tmp_path):
    cfg = load_config()

    class LoudLaya:
        def route(self, text):
            raise AssertionError("Laya must not be consulted for TASK")

    class TeamSupervisor(Supervisor):
        async def run_team(self, user_text, **kw):
            return TeamResult(status="ok", text="team did it", run_id="r1")

    m = ConversationManager(
        cfg,
        approval_store=ApprovalStore(tmp_path / "a.db"),
        fast_router=LoudLaya(),
        supervisor=TeamSupervisor(_default_registry(), agent=_offline_agent()),
    )
    out = _collect(m, "research solar panels and then summarize the pros")
    assert "team did it" in out
