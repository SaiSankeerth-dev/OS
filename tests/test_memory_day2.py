"""Memory Day 2: acceptance tests for deterministic commands.

1. remember -> new conversation recalls exact value
2. update -> old is historical, recall returns new
3. forget -> search returns nothing (including FTS)
4. false triggers don't write
5. secret refused, nothing stored
6. multi-match forget asks first
7. (manual) chat without Ollama
"""
import sys
import tempfile
from pathlib import Path
from unittest.mock import MagicMock
import importlib.util

sys.path.insert(0, str(Path(__file__).parent.parent))

from server.memory.manager import MemoryManager

# Load memory_skill tools via importlib (skills aren't a package)
_skill_path = Path(__file__).parent.parent / "skills" / "memory_skill" / "tools.py"
_spec = importlib.util.spec_from_file_location("memory_skill_tools", _skill_path)
_skill_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_skill_mod)
make_tools = _skill_mod.make_tools
_derive_key = _skill_mod._derive_key


def _make_tools():
    tmp = tempfile.mktemp(suffix=".db")
    mgr = MemoryManager(db_path=tmp)
    tools = make_tools(mgr)
    return tools, mgr, tmp


def test_remember_and_recall():
    """1. remember saves; new 'conversation' (new manager) recalls exact."""
    tools, mgr, tmp = _make_tools()
    try:
        save_fn = tools["memory_save"][1]
        result = save_fn(note="my deploy branch is os-10x")
        assert result.status == "success"
        assert "os-10x" in result.data["text"]
        assert "deploy_branch" in result.data["key"]

        # New conversation = new manager instance, same DB
        from server.memory.manager import MemoryManager as MM2
        mgr2 = MM2(db_path=tmp)
        recalled = mgr2.recall("deploy_branch")
        assert recalled is not None
        assert recalled.value == "os-10x"
    finally:
        Path(tmp).unlink(missing_ok=True)


def test_update_marks_historical():
    """2. Second statement updates; old is historical, recall returns new."""
    tools, mgr, tmp = _make_tools()
    try:
        save_fn = tools["memory_save"][1]
        save_fn(note="my deploy branch is os-10x")
        result = save_fn(note="my deploy branch is main")
        assert "Updated" in result.data["text"]
        assert "os-10x → main" in result.data["text"]

        recalled = mgr.recall("deploy_branch")
        assert recalled.value == "main"  # New value

        hist = mgr.history("deploy_branch")
        statuses = [h.status for h in hist]
        assert "historical" in statuses  # Old preserved
        old = [h for h in hist if h.status == "historical"][0]
        assert old.value == "os-10x"
    finally:
        Path(tmp).unlink(missing_ok=True)


def test_forget_clears_fts():
    """3. Forget removes; search returns nothing (FTS clean)."""
    tools, mgr, tmp = _make_tools()
    try:
        save_fn = tools["memory_save"][1]
        forget_fn = tools["memory_forget"][1]
        save_fn(note="my deploy branch is os-10x")

        # Verify searchable before
        assert len(mgr.search("os-10x")) == 1

        result = forget_fn(query="deploy_branch")
        assert result.status == "success"
        assert "Forgot" in result.data["text"]

        # Search returns nothing (including FTS)
        assert len(mgr.search("os-10x")) == 0
        assert mgr.recall("deploy_branch") is None
    finally:
        Path(tmp).unlink(missing_ok=True)


def test_false_triggers():
    """4. These phrases must NOT trigger memory writes."""
    import re
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from server.intent.router import DEFAULT_PATTERNS, Intent

    false_triggers = [
        "I remember when this broke",
        "don't forget to run tests",
        "I don't remember the password",
    ]
    for phrase in false_triggers:
        matched = False
        for pattern, intent, tool in DEFAULT_PATTERNS:
            if tool in ("memory_save", "memory_recall", "memory_forget"):
                if pattern.match(phrase):
                    matched = True
                    break
        assert not matched, f"FALSE TRIGGER: '{phrase}' matched memory pattern"

    # "remember to X" SHOULD match (it's a memory per the plan)
    matched = False
    for pattern, intent, tool in DEFAULT_PATTERNS:
        if tool == "memory_save" and pattern.match("remember to check logs"):
            matched = True
            break
    assert matched, "'remember to check logs' should match (it's a memory)"


def test_secret_refused():
    """5. Secret-looking input refused, nothing stored."""
    tools, mgr, tmp = _make_tools()
    try:
        save_fn = tools["memory_save"][1]
        result = save_fn(note="my api key is sk-1234567890abcdefghij")
        assert result.status == "failure"
        assert "secret" in result.error.lower()

        # Nothing stored
        assert len(mgr.list_active()) == 0
    finally:
        Path(tmp).unlink(missing_ok=True)


def test_multi_match_asks_first():
    """6. Multi-match forget asks, deletes nothing until answered."""
    tools, mgr, tmp = _make_tools()
    try:
        save_fn = tools["memory_save"][1]
        forget_fn = tools["memory_forget"][1]
        save_fn(note="deploy branch is os-10x")
        save_fn(note="deploy server is prod-1")
        save_fn(note="deploy time is morning")

        # Forget with ambiguous query
        result = forget_fn(query="deploy", session_id="test123")
        assert result.status == "success"
        assert "Multiple matches" in result.data["text"]
        assert result.data.get("awaiting_confirmation") is True

        # Nothing deleted yet
        assert len(mgr.list_active()) == 3

        # Answer with number
        result2 = forget_fn(query="2", session_id="test123")
        assert "Forgot" in result2.data["text"]
        assert len(mgr.list_active()) == 2
    finally:
        Path(tmp).unlink(missing_ok=True)


def test_key_derivation():
    """Key derivation tiers."""
    # Tier 1: subject is/are value
    k, v = _derive_key("my deploy branch is os-10x")
    assert k == "deploy_branch", f"got {k}"
    assert v == "os-10x"

    k, v = _derive_key("the server = prod-1")
    assert k == "server"
    assert v == "prod-1"

    # Tier 2: free text slug
    k, v = _derive_key("buy milk tomorrow morning")
    assert k == "buy_milk_tomorrow_morning"
    assert v == "buy milk tomorrow morning"
