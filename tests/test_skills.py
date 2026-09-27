"""Phase 6 tests: SKILL.md skill system + 5 skills.

Covers the loader (contracts, planned skills skipped, malformed skills
fail closed), the calc sandbox, the memory skill roundtrip, intent
routing, and supervisor scope/permission for the new tools.
"""
import asyncio
import json

import pytest

from config import load_config
from server.approvals.gate import ApprovalStore
from server.conversation.manager import ConversationManager, _default_registry
from server.intent.registry import ExecutionMode, ToolRegistry, ToolResult
from server.intent.router import Intent, IntentRouter
from server.skills import SkillLoader
from server.skills.loader import parse_skill_md
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent
from server.supervisor.permissions import ToolPermission, ToolPolicy
from server.supervisor.scope import ScopeGuard


def _offline_agent() -> SupervisorAgent:
    return SupervisorAgent(base_url="http://127.0.0.1:9")


# ---- loader ---------------------------------------------------------------


def test_discovers_all_skill_contracts():
    infos = {i.name: i for i in SkillLoader().discover()}
    for name in ("linkedin", "datetime", "system", "memory", "calc"):
        assert infos[name].status == "active", name
    assert infos["browser"].status == "planned"
    assert infos["files"].status == "planned"


def test_load_registers_active_tools_only(tmp_path):
    reg = ToolRegistry()
    store = StateStore(tmp_path / "s.db")
    loaded = SkillLoader().load(reg, state_store=store)
    names = {i.name for i in loaded}
    assert {"linkedin", "datetime", "system", "memory", "calc"} <= names
    assert "browser" not in names and "files" not in names
    for tool in ("linkedin_draft", "get_current_datetime", "get_system_info",
                 "memory_save", "memory_recall", "calc"):
        reg.get(tool)  # raises KeyError if missing


def test_parse_skill_md_malformed_falls_back():
    info = parse_skill_md("no frontmatter here", "weird_skill")
    assert info.name == "weird_skill"
    assert info.status == "planned"


def test_malformed_skill_dir_skipped(tmp_path):
    bad = tmp_path / "broken_skill"
    bad.mkdir()
    (bad / "SKILL.md").write_text(
        "---\nname: broken\ndescription: x\nversion: 1\nstatus: active\n---\n"
    )
    (bad / "tools.py").write_text("raise RuntimeError('boom')\n")
    reg = ToolRegistry()
    loaded = SkillLoader(str(tmp_path)).load(reg)
    assert all(i.name != "broken" for i in loaded)


# ---- calc ------------------------------------------------------------------


def _calc(expr: str) -> ToolResult:
    import importlib.util

    spec = importlib.util.spec_from_file_location(
        "calc_skill_test", "skills/calc_skill/tools.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.calc(expression=expr)


def test_calc_arithmetic():
    assert _calc("2+3*4").data["result"] == 14
    assert _calc("(2+3)*4").data["result"] == 20
    assert _calc("2**10").data["result"] == 1024
    assert _calc("7/2").data["result"] == 3.5


def test_calc_rejects_code_execution():
    for evil in ("__import__('os').system('id')", "open('/etc/passwd')",
                 "x + 1", "[1,2,3]", "1/0", "a" * 201):
        res = _calc(evil)
        assert res.status == "failure", evil


# ---- memory ------------------------------------------------------------------


def _memory_tools(tmp_path):
    import importlib.util

    path = "skills/memory_skill/tools.py"
    spec = importlib.util.spec_from_file_location("mem_skill_test", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.make_tools(StateStore(tmp_path / "mem.db"))


def test_memory_save_and_recall(tmp_path):
    entries = {e[0].name: e for e in _memory_tools(tmp_path)}
    save, recall = entries["memory_save"], entries["memory_recall"]
    r = save[1](note="my dog is Bruno")
    assert r.status == "success"
    r = recall[1](query="dog")
    assert r.status == "success"
    assert r.data["notes"] == ["my dog is Bruno"]
    assert "Bruno" in recall[2](r)


def test_memory_recall_no_hits(tmp_path):
    entries = {e[0].name: e for e in _memory_tools(tmp_path)}
    recall = entries["memory_recall"]
    r = recall[1](query="spaceship")
    assert r.data["notes"] == []
    assert "don't remember" in recall[2](r)


def test_memory_save_empty_rejected(tmp_path):
    entries = {e[0].name: e for e in _memory_tools(tmp_path)}
    assert entries["memory_save"][1](note="  ").status == "failure"


# ---- intent routing ------------------------------------------------------------


def test_intent_routes_new_tools():
    r = IntentRouter()
    d = r.classify("calculate 15*3")
    assert (d.intent, d.tool_name, d.args) == (
        Intent.TOOL_CALL, "calc", {"expression": "15*3"})
    d = r.classify("remember that my dog is Bruno")
    assert (d.intent, d.tool_name, d.args) == (
        Intent.TOOL_CALL, "memory_save", {"note": "my dog is Bruno"})
    d = r.classify("what do you remember about my dog")
    assert d.intent == Intent.TOOL_CALL and d.tool_name == "memory_recall"


def test_intent_does_not_steal_old_routes():
    r = IntentRouter()
    assert r.classify("what time is it").tool_name == "get_current_datetime"
    assert r.classify("draft a linkedin post about x").tool_name == \
        "linkedin_draft"
    assert r.classify("research x and then summarize").intent == Intent.TASK


# ---- supervisor ---------------------------------------------------------------


def test_new_tools_allowed_and_scoped(tmp_path):
    sup = Supervisor(_default_registry(StateStore(tmp_path / "s.db")),
                     agent=_offline_agent())
    for tool in ("calc", "memory_save", "memory_recall"):
        assert sup.permissions.check(tool)[0] == ToolPolicy.ALLOW
        assert sup.scope_guard.check(tool) is None


def test_disabled_memory_skill_rejected(tmp_path):
    sup = Supervisor(
        _default_registry(StateStore(tmp_path / "s.db")),
        scope_guard=ScopeGuard(disabled_skills=("memory",)),
        agent=_offline_agent(),
    )
    res = asyncio.run(sup.run_tool("memory_save", {"note": "x"}, "remember x"))
    assert res.code == "SKILL_DISABLED"


# ---- manager end to end ----------------------------------------------------------


def _collect(m: ConversationManager, text: str) -> str:
    async def go():
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    return asyncio.run(go())


def test_manager_calc_end_to_end(tmp_path):
    m = ConversationManager(
        load_config(),
        approval_store=ApprovalStore(tmp_path / "a.db"),
        state_store=StateStore(tmp_path / "s.db"),
        supervisor=Supervisor(
            _default_registry(StateStore(tmp_path / "s.db")),
            agent=_offline_agent()),
    )
    out = _collect(m, "calculate 15*3")
    assert "15*3 = 45" in out


def test_manager_memory_end_to_end(tmp_path):
    store = StateStore(tmp_path / "s.db")
    m = ConversationManager(
        load_config(),
        approval_store=ApprovalStore(tmp_path / "a.db"),
        state_store=store,
        supervisor=Supervisor(
            _default_registry(store), agent=_offline_agent()),
    )
    assert "Saved" in _collect(m, "remember that my launch code is 1234")
    out = _collect(m, "what do you remember about launch code")
    assert "1234" in out
