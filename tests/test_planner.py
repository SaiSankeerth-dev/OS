"""Planner skill tests."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import asyncio
from server.intent.router import IntentRouter, Intent
from server.planner.models import Plan, PlanStatus, Step, StepStatus
from server.planner.templates import match_template, plan_then_chain
from server.planner.executor import PlanExecutor
from server.tools.planner_tool import (
    plan, plan_run, plan_list,
    PLAN_SPEC, PLAN_RUN_SPEC, PLAN_LIST_SPEC,
    get_plan,
)
from server.intent.registry import ExecutionMode


def _route(text: str):
    return IntentRouter().classify(text)


# --- Intent routing -----------------------------------------------------------

def test_route_plan_trip():
    d = _route("plan my trip to Goa")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "plan"


def test_route_plan_list():
    d = _route("plan list")
    assert d.tool_name == "plan_list"


def test_route_run_plan():
    d = _route("run plan abc123")
    assert d.tool_name == "plan_run"


def test_route_do_then():
    d = _route("do remind me to buy milk then show my github repos")
    assert d.tool_name == "plan"


def test_route_morning_briefing():
    d = _route("morning briefing")
    assert d.tool_name == "plan"


# --- Templates -----------------------------------------------------------------

def test_then_chain():
    title, steps = plan_then_chain(
        "do remind me to buy milk then show my github repos")
    assert len(steps) == 2
    assert steps[0].tool == "__route__"
    assert "buy milk" in steps[0].description


def test_match_trip():
    result = match_template("plan my trip to Goa")
    assert result is not None
    title, steps = result
    assert "Goa" in title
    assert len(steps) == 3


def test_match_morning():
    result = match_template("morning briefing")
    assert result is not None
    title, steps = result
    assert len(steps) == 3


def test_match_none():
    assert match_template("what is the weather") is None


# --- Plan tool ------------------------------------------------------------------

def test_plan_trip_proposal():
    r = plan(task="plan my trip to Goa")
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    assert "Goa" in r.data["title"]
    assert "plan_id" in r.data
    assert "action_args" in r.data


def test_plan_list():
    plan(task="plan my trip to Goa")
    r = plan_list()
    assert r.status == "success"
    assert "Goa" in r.data["display"]


def test_plan_run_draft():
    r = plan(task="plan my trip to Goa")
    pid = r.data["plan_id"]
    r2 = plan_run(task=f"run plan {pid}")
    assert r2.status == "success"
    assert r2.data["plan_id"] == pid
    assert "Goa" in r2.data["draft"]


def test_plan_run_missing():
    r = plan_run(task="run plan nonexistent")
    assert r.status == "failure"


# --- Executor ---------------------------------------------------------------------

def test_executor_success():
    async def fake_runner(tool, args):
        return f"ran {tool}"

    def fake_router(text):
        return ("echo_tool", {})

    async def go():
        p = Plan(title="Test", steps=[
            Step(description="Step 1", tool="tool1", args={}),
            Step(description="Step 2", tool="__route__",
                 args={"text": "do something"}),
        ])
        ex = PlanExecutor(tool_runner=fake_runner,
                          intent_router=fake_router)
        await ex.execute_plan(p)
        return p

    p = asyncio.run(go())
    assert p.status == PlanStatus.DONE
    assert all(s.status == StepStatus.DONE for s in p.steps)


def test_executor_halts_on_failure():
    async def failing_runner(tool, args):
        if tool == "bad":
            raise ValueError("boom")
        return "ok"

    async def go():
        p = Plan(title="Test", steps=[
            Step(description="Good", tool="good", args={}),
            Step(description="Bad", tool="bad", args={}),
            Step(description="Never", tool="never", args={}),
        ])
        ex = PlanExecutor(tool_runner=failing_runner)
        await ex.execute_plan(p)
        return p

    p = asyncio.run(go())
    assert p.status == PlanStatus.FAILED
    assert p.steps[0].status == StepStatus.DONE
    assert p.steps[1].status == StepStatus.FAILED
    assert p.steps[2].status == StepStatus.PENDING  # never ran


def test_executor_report():
    async def fake_runner(tool, args):
        return "ok"

    async def go():
        p = Plan(title="Test Plan", steps=[
            Step(description="S1", tool="t1", args={}),
        ])
        ex = PlanExecutor(tool_runner=fake_runner)
        await ex.execute_plan(p)
        return ex.report(p)

    report = asyncio.run(go())
    assert "Done" in report
    assert "Test Plan" in report


def test_plan_summary():
    p = Plan(title="T", steps=[
        Step(description="A", tool="x", args={},
             status=StepStatus.DONE),
        Step(description="B", tool="y", args={},
             status=StepStatus.PENDING),
    ])
    s = p.summary()
    assert "1/2 done" in s
    assert "● 1. A" in s
    assert "○ 2. B" in s


def test_permissions():
    from server.supervisor.permissions import ToolPermission, ToolPolicy
    p = ToolPermission()
    policy, _ = p.check("plan")
    assert policy == ToolPolicy.ALLOW
    policy, _ = p.check("plan_run")
    assert policy == ToolPolicy.NEEDS_APPROVAL
