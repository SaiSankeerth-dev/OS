"""Phase 9 tests: user-facing permissions (allow / ask / deny per skill).

The user controls the supervisor's permission table at runtime, by voice
or CLI. Overrides persist in SQLite and take effect immediately.
"""
import asyncio

from config import load_config
from server.approvals.gate import ApprovalStore
from server.conversation.manager import ConversationManager, _default_registry
from server.intent.router import Intent, IntentRouter
from server.permissions import PermissionManager
from server.state.store import StateStore
from server.supervisor import Supervisor, SupervisorAgent
from server.supervisor.permissions import ToolPermission, ToolPolicy
from server.supervisor.scope import ScopeGuard


def _offline_agent() -> SupervisorAgent:
    return SupervisorAgent(base_url="http://127.0.0.1:9")


def _pm(tmp_path, **kw) -> PermissionManager:
    perms = kw.pop("perms", ToolPermission())
    scope = kw.pop("scope", ScopeGuard())
    return PermissionManager(perms, scope, StateStore(tmp_path / "s.db"))


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


# ---- PermissionManager --------------------------------------------------------


def test_defaults_match_builtin_table(tmp_path):
    pm = _pm(tmp_path)
    assert pm.policy_for_skill("calc") == ToolPolicy.ALLOW
    assert pm.policy_for_skill("linkedin") == ToolPolicy.NEEDS_APPROVAL
    assert pm.policy_for_skill("memory") == ToolPolicy.ALLOW
    assert pm.overrides() == {}


def test_set_skill_policy_applies_to_all_its_tools(tmp_path):
    perms = ToolPermission()
    pm = _pm(tmp_path, perms=perms)
    changed = pm.set_skill_policy("memory", ToolPolicy.DENIED)
    assert set(changed) == {"memory_save", "memory_recall", "memory_forget"}
    assert perms.check("memory_save")[0] == ToolPolicy.DENIED
    assert perms.check("memory_recall")[0] == ToolPolicy.DENIED
    assert pm.policy_for_skill("memory") == ToolPolicy.DENIED


def test_policy_persists_across_instances(tmp_path):
    db = tmp_path / "s.db"
    PermissionManager(
        ToolPermission(), ScopeGuard(), StateStore(db)
    ).set_skill_policy("calc", ToolPolicy.DENIED)
    pm2 = PermissionManager(ToolPermission(), ScopeGuard(), StateStore(db))
    assert pm2.policy_for_skill("calc") == ToolPolicy.DENIED
    assert pm2.overrides() == {"calc": ToolPolicy.DENIED}


def test_reset_skill_restores_default(tmp_path):
    pm = _pm(tmp_path)
    pm.set_skill_policy("calc", ToolPolicy.DENIED)
    pm.reset_skill("calc")
    assert pm.policy_for_skill("calc") == ToolPolicy.ALLOW
    assert pm.overrides() == {}


def test_reset_all_restores_everything(tmp_path):
    pm = _pm(tmp_path)
    pm.set_skill_policy("calc", ToolPolicy.DENIED)
    pm.set_skill_policy("linkedin", ToolPolicy.ALLOW)
    pm.reset_all()
    assert pm.overrides() == {}
    assert pm.policy_for_skill("calc") == ToolPolicy.ALLOW
    assert pm.policy_for_skill("linkedin") == ToolPolicy.NEEDS_APPROVAL


def test_resolve_skill_friendly_names(tmp_path):
    pm = _pm(tmp_path)
    assert pm.resolve_skill("calculator") == "calc"
    assert pm.resolve_skill("the calculator") == "calc"
    assert pm.resolve_skill("LinkedIn") == "linkedin"
    assert pm.resolve_skill("system info") == "system"
    assert pm.resolve_skill("hyperspace drive") is None


def test_resolve_skill_mcp_server(tmp_path):
    scope = ScopeGuard()
    scope.register_tool("mcp__echo__add", "mcp_echo", ("mcp:echo:add",))
    pm = _pm(tmp_path, scope=scope)
    assert pm.resolve_skill("echo server") == "mcp_echo"
    assert pm.resolve_skill("echo") == "mcp_echo"


def test_table_lists_skills_with_policies(tmp_path):
    pm = _pm(tmp_path)
    rows = {r["skill"]: r for r in pm.table()}
    assert rows["calc"]["policy"] == "allow"
    assert rows["linkedin"]["policy"] == "ask"
    assert rows["calc"]["custom"] is False
    pm.set_skill_policy("calc", ToolPolicy.DENIED)
    rows = {r["skill"]: r for r in pm.table()}
    assert rows["calc"]["policy"] == "deny"
    assert rows["calc"]["custom"] is True


# ---- router -------------------------------------------------------------------


def test_router_classifies_permission_intents():
    r = IntentRouter()
    d = r.classify("always allow the calculator")
    assert d.intent == Intent.PERMISSION
    assert d.args["action"] == "allow" and d.args["target"] == "calculator"
    d = r.classify("ask me before linkedin")
    assert d.args["action"] == "ask" and d.args["target"] == "linkedin"
    d = r.classify("require approval for memory")
    assert d.args["action"] == "ask" and d.args["target"] == "memory"
    d = r.classify("deny the calculator")
    assert d.args["action"] == "deny" and d.args["target"] == "calculator"
    d = r.classify("block linkedin")
    assert d.args["action"] == "deny"
    d = r.classify("show my permissions")
    assert d.args["action"] == "show"
    d = r.classify("what are my permissions?")
    assert d.args["action"] == "show"
    d = r.classify("reset permissions")
    assert d.args["action"] == "reset"


# ---- voice end to end -----------------------------------------------------------


def test_voice_allow_and_deny(tmp_path):
    m = _manager(tmp_path)
    out = _collect(m, "deny the calculator")
    assert "denied" in out and "calc" in out
    # Denied skill: the supervisor rejects before executing.
    out = _collect(m, "calculate 2+2")
    assert "TOOL_NOT_ALLOWED" in out
    out = _collect(m, "always allow the calculator")
    assert "without asking" in out
    out = _collect(m, "calculate 2+2")
    assert "4" in out


def test_voice_unknown_skill_changes_nothing(tmp_path):
    m = _manager(tmp_path)
    out = _collect(m, "allow the hyperspace drive")
    assert "don't know a skill" in out
    assert m._permissions.overrides() == {}


def test_voice_ask_mode_holds_for_confirmation(tmp_path):
    m = _manager(tmp_path)
    _collect(m, "ask me before the calculator")
    out = _collect(m, "calculate 2+2")
    # Result shown, but held for confirmation - no silent pass-through.
    assert "4" in out and "approval" in out
    out = _collect(m, "approve")
    assert "Approved" in out


def test_voice_ask_mode_reject_discards(tmp_path):
    m = _manager(tmp_path)
    _collect(m, "ask me before the calculator")
    _collect(m, "calculate 3+3")
    out = _collect(m, "reject")
    assert "discarded" in out


def test_voice_show_and_reset(tmp_path):
    m = _manager(tmp_path)
    _collect(m, "deny linkedin")
    out = _collect(m, "show permissions")
    assert "linkedin: deny" in out and "*" in out
    out = _collect(m, "reset permissions")
    assert "reset" in out.lower()
    assert m._permissions.overrides() == {}


def test_voice_deny_linkedin_blocks_draft(tmp_path):
    m = _manager(tmp_path)
    _collect(m, "deny linkedin")
    out = _collect(m, "draft a linkedin post about focus")
    assert "TOOL_NOT_ALLOWED" in out


def test_voice_permission_survives_restart(tmp_path):
    db = tmp_path / "s.db"
    m = _manager(tmp_path)
    _collect(m, "deny the calculator")
    # New manager on the same database: the override is still there.
    m2 = _manager(tmp_path)
    assert m2._permissions.policy_for_skill("calc") == ToolPolicy.DENIED
    out = _collect(m2, "calculate 2+2")
    assert "TOOL_NOT_ALLOWED" in out
