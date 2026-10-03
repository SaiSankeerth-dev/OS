"""Tests for real-internet tools: web search, web read, intent routing."""
import pytest

from server.intent.registry import ExecutionMode
from server.intent.router import Intent, IntentRouter
from server.skills.loader import SkillLoader
from server.tools.webread_tool import format_web_read, web_read
from server.tools.websearch_tool import format_web_search, web_search


# ---------------- tool units ----------------
def test_web_search_live():
    r = web_search(query="Python programming language")
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    assert len(r.data["results"]) >= 1
    assert r.data["results"][0]["url"].startswith("http")
    text = format_web_search(r)
    assert "Python" in text


def test_web_search_empty():
    r = web_search(query="   ")
    assert r.status == "failure"


def test_web_read_live():
    r = web_read(url="https://example.com")
    assert r.status == "success"
    assert "Example Domain" in r.data["text"]
    assert format_web_read(r).startswith('"Example Domain"')


def test_web_read_bad_url():
    assert web_read(url="not a url").status == "failure"
    assert web_read(url="ftp://x.com").status == "failure"


# ---------------- skills load ----------------
def test_skills_register():
    loader = SkillLoader()
    from server.intent.registry import ToolRegistry
    reg = ToolRegistry()
    infos = loader.load(reg)
    names = {i.name for i in infos}
    assert "websearch" in names and "webread" in names
    assert "web_search" in reg.names() and "web_read" in reg.names()


# ---------------- supervisor gates ----------------
def test_supervisor_allows_internet_tools():
    from server.supervisor.permissions import ToolPermission, ToolPolicy
    from server.supervisor.scope import ScopeGuard
    sg = ScopeGuard()
    assert sg.check("web_search") is None
    assert sg.check("web_read") is None
    tp = ToolPermission()
    assert tp.check("web_search")[0] == ToolPolicy.ALLOW
    assert tp.check("web_read")[0] == ToolPolicy.ALLOW


# ---------------- intent routing ----------------
@pytest.mark.parametrize("text,tool,arg", [
    ("search the web for monsoon in Hyderabad", "web_search", "monsoon in Hyderabad"),
    ("search for cheap laptops", "web_search", "cheap laptops"),
    ("google quantum computing", "web_search", "quantum computing"),
    ("look up the capital of France", "web_search", "the capital of France"),
    ("read https://example.com", "web_read", "https://example.com"),
    ("open https://example.com/docs", "web_read", "https://example.com/docs"),
    ("fetch this page: https://example.com", "web_read", "https://example.com"),
])
def test_internet_intents(text, tool, arg):
    d = IntentRouter().classify(text)
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == tool
    key = {"web_search": "query", "web_read": "url"}[tool]
    assert d.args[key] == arg


def test_no_false_positives():
    r = IntentRouter()
    assert r.classify("what time is it").tool_name == "get_current_datetime"
    assert r.classify("remember that I like coffee").tool_name == "memory_save"
