"""Phase 7 tests: switchable personalities.

Tone only: switching personas must never change tool behavior, safety
decisions, or approval flows.
"""
import asyncio

import pytest

from config import load_config
from server.approvals.gate import ApprovalStore
from server.conversation.manager import ConversationManager, _default_registry
from server.conversation.personality import build_system_prompt
from server.intent.router import Intent, IntentRouter
from server.personality import PERSONAS, PersonalityManager
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent


def _offline_agent() -> SupervisorAgent:
    return SupervisorAgent(base_url="http://127.0.0.1:9")


def _collect(m: ConversationManager, text: str) -> str:
    async def go():
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    return asyncio.run(go())


def _manager(tmp_path, **kw) -> ConversationManager:
    store = StateStore(tmp_path / "s.db")
    kw.setdefault("state_store", store)
    kw.setdefault("approval_store", ApprovalStore(tmp_path / "a.db"))
    kw.setdefault(
        "supervisor",
        Supervisor(_default_registry(store), agent=_offline_agent()),
    )
    return ConversationManager(load_config(), **kw)


# ---- personas ---------------------------------------------------------------


def test_four_personas_defined():
    assert set(PERSONAS) == {"jarvis", "nova", "sage", "coach"}
    for p in PERSONAS.values():
        assert p.traits and p.confirm_template


def test_default_is_jarvis(tmp_path):
    pm = PersonalityManager(StateStore(tmp_path / "s.db"))
    assert pm.current_name == "jarvis"


def test_unknown_persona_rejected(tmp_path):
    pm = PersonalityManager(StateStore(tmp_path / "s.db"))
    with pytest.raises(ValueError):
        pm.set_persona("ultron")
    assert pm.current_name == "jarvis"


def test_persona_persists_across_instances(tmp_path):
    db = tmp_path / "s.db"
    PersonalityManager(StateStore(db)).set_persona("sage")
    pm2 = PersonalityManager(StateStore(db))
    assert pm2.current_name == "sage"


def test_persona_converts_to_prompt_config(tmp_path):
    pm = PersonalityManager(StateStore(tmp_path / "s.db"))
    pm.set_persona("coach")
    cfg = pm.to_config()
    assert cfg.name == "Coach"
    assert "blunt" in cfg.traits


def test_system_prompt_reflects_persona(tmp_path):
    pm = PersonalityManager(StateStore(tmp_path / "s.db"))
    jarvis_prompt = build_system_prompt(pm.to_config(PERSONAS["jarvis"]))
    sage_prompt = build_system_prompt(pm.to_config(PERSONAS["sage"]))
    assert "sir" in jarvis_prompt.lower()
    assert "terse" in sage_prompt.lower()
    assert jarvis_prompt != sage_prompt


# ---- intent -------------------------------------------------------------------


def test_persona_intent_routing():
    r = IntentRouter()
    for text, name in [
        ("switch to sage mode", "sage"),
        ("use nova personality", "nova"),
        ("activate coach", "coach"),
        ("be jarvis", "jarvis"),
    ]:
        d = r.classify(text)
        assert d.intent == Intent.PERSONA, text
        assert d.args == {"persona": name}, text


def test_persona_pattern_does_not_steal(tmp_path):
    r = IntentRouter()
    assert r.classify("switch to the new plan").intent != Intent.PERSONA
    assert r.classify("what time is it").intent != Intent.PERSONA


# ---- manager --------------------------------------------------------------------


def test_manager_switches_persona(tmp_path):
    m = _manager(tmp_path)
    out = _collect(m, "switch to sage mode")
    assert "Sage mode" in out
    assert m._personality.current_name == "sage"


def test_manager_switch_persists(tmp_path):
    m = _manager(tmp_path)
    _collect(m, "use nova personality")
    m2 = _manager(tmp_path)
    assert m2._personality.current_name == "nova"


def test_manager_unknown_persona_message(tmp_path):
    m = _manager(tmp_path)
    out = _collect(m, "switch to sage mode")  # valid first
    assert m._personality.current_name == "sage"
    # invalid names can't reach the branch (regex), so direct call:
    with pytest.raises(ValueError):
        m._personality.set_persona("ultron")


def test_persona_does_not_change_tool_output(tmp_path):
    m = _manager(tmp_path)
    before = _collect(m, "calculate 6*7")
    _collect(m, "switch to coach mode")
    after = _collect(m, "calculate 6*7")
    assert before == after == "6*7 = 42"


def test_persona_does_not_bypass_scope_guard(tmp_path):
    from server.supervisor.scope import ScopeGuard

    sup = Supervisor(
        _default_registry(StateStore(tmp_path / "s.db")),
        scope_guard=ScopeGuard(disabled_skills=("calc",)),
        agent=_offline_agent(),
    )
    m = ConversationManager(
        load_config(),
        approval_store=ApprovalStore(tmp_path / "a.db"),
        state_store=StateStore(tmp_path / "s.db"),
        supervisor=sup,
    )
    _collect(m, "switch to nova personality")
    out = _collect(m, "calculate 1+1")
    assert "can't do that" in out and "SKILL_DISABLED" in out


def test_persona_skips_laya(tmp_path):
    class LoudLaya:
        def route(self, text):
            raise AssertionError("Laya must not be consulted for PERSONA")

    m = ConversationManager(
        load_config(),
        approval_store=ApprovalStore(tmp_path / "a.db"),
        state_store=StateStore(tmp_path / "s.db"),
        fast_router=LoudLaya(),
        supervisor=Supervisor(
            _default_registry(StateStore(tmp_path / "s.db")),
            agent=_offline_agent()),
    )
    out = _collect(m, "switch to sage mode")
    assert "Sage mode" in out
