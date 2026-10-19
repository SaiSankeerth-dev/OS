"""Tests for the agentic browser task (browser-use integration).

Covers intent routing, task expansion, and the approval draft.
The live agent run needs Ollama + a browser; not tested here.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server.browser.agentic import expand_task, SITE_ALIASES, AgentResult, AgentStep
from server.intent.router import IntentRouter, Intent
from server.tools.agentic_browser_tool import (
    browser_task, BROWSER_TASK_SPEC, format_agentic_result,
)
from server.intent.registry import ExecutionMode


def _route(text: str):
    return IntentRouter().classify(text)


# --- Intent routing -------------------------------------------------------

def test_play_routes_to_browser_task():
    d = _route("play lofi hip hop")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "browser_task"
    assert d.args["task"] == "play lofi hip hop"


def test_play_on_youtube_routes():
    d = _route("play despacito on youtube")
    assert d.tool_name == "browser_task"


def test_bare_youtube_routes():
    d = _route("youtube")
    assert d.tool_name == "browser_task"
    assert d.args["task"] == "youtube"


def test_youtube_query_routes():
    d = _route("youtube lofi hip hop")
    assert d.tool_name == "browser_task"


def test_do_x_on_site_routes():
    d = _route("do search for browser-use on github")
    assert d.tool_name == "browser_task"


def test_normal_chat_not_hijacked():
    # "I play guitar" should NOT trigger the browser agent
    d = _route("I play guitar on weekends")
    assert d.tool_name != "browser_task"


def test_search_web_not_hijacked():
    d = _route("search the web for lofi music")
    assert d.tool_name == "web_search"


# --- Task expansion -------------------------------------------------------

def test_expand_play():
    t = expand_task("play lofi")
    assert "youtube.com" in t
    assert "lofi" in t
    assert "first video" in t.lower() or "first result" in t.lower()


def test_expand_bare_youtube():
    t = expand_task("youtube")
    assert t.strip() == "Go to https://www.youtube.com."


def test_expand_youtube_query():
    t = expand_task("youtube lofi hip hop")
    assert "youtube.com" in t
    assert "lofi hip hop" in t


def test_expand_site_alias():
    t = expand_task("github")
    assert t.strip() == "Go to https://github.com."


def test_site_aliases_cover_basics():
    for site in ("youtube", "gmail", "github", "google"):
        assert site in SITE_ALIASES


def test_expand_fallthrough():
    t = expand_task("book a flight from hyderabad to delhi")
    assert t == "book a flight from hyderabad to delhi"


# --- Tool draft -----------------------------------------------------------

def test_browser_task_draft_needs_approval():
    r = browser_task(task="play lofi")
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    assert "play lofi" in r.data["description"]
    assert "youtube" in r.data["expanded"].lower()


def test_browser_task_empty_fails():
    r = browser_task(task="   ")
    assert r.status == "failure"


def test_tool_spec_registered():
    assert BROWSER_TASK_SPEC.name == "browser_task"
    assert BROWSER_TASK_SPEC.execution_mode == ExecutionMode.DIRECT


# --- Result formatting ----------------------------------------------------

def test_format_success():
    r = AgentResult(
        success=True, summary="Playing lofi video.",
        steps=[AgentStep(n=1, action="go_to_url", detail="youtube.com"),
               AgentStep(n=2, action="click", detail="first video")],
        final_url="https://www.youtube.com/watch?v=abc",
    )
    text = format_agentic_result(r)
    assert "2 steps" in text
    assert "youtube.com/watch" in text
    assert "Playing lofi" in text


def test_format_failure():
    r = AgentResult(success=False, summary="Stopped early.",
                    steps=[], error="timeout")
    text = format_agentic_result(r)
    assert "Stopped" in text
    assert "timeout" in text
