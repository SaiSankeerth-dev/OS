"""Tests for the agentic computer task (cua-agent integration).

Covers intent routing, deterministic actions, and the approval draft.
The live agent run needs a display + Ollama; not tested here.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server.computer.agentic import (
    try_deterministic, has_display, DETERMINISTIC_ACTIONS,
    ComputerResult, ComputerStep,
)
from server.intent.router import IntentRouter, Intent
from server.tools.agentic_computer_tool import (
    computer_task, COMPUTER_TASK_SPEC, format_computer_result,
)
from server.intent.registry import ExecutionMode


def _route(text: str):
    return IntentRouter().classify(text)


# --- Intent routing -------------------------------------------------------

def test_screenshot_routes():
    d = _route("take a screenshot")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "computer_task"
    assert d.args["task"] == "take a screenshot"


def test_bare_screenshot_routes():
    d = _route("screenshot")
    assert d.tool_name == "computer_task"


def test_open_calculator_routes():
    d = _route("open calculator")
    assert d.tool_name == "computer_task"


def test_lock_screen_routes():
    d = _route("lock the screen")
    assert d.tool_name == "computer_task"


def test_volume_up_routes():
    d = _route("volume up")
    assert d.tool_name == "computer_task"


def test_mute_routes():
    d = _route("mute")
    assert d.tool_name == "computer_task"


def test_play_still_browser():
    # "play lofi" is a browser task, not computer
    d = _route("play lofi")
    assert d.tool_name == "browser_task"


# --- Deterministic actions ------------------------------------------------

def test_deterministic_screenshot_no_tool():
    # No screenshot tool on this headless VM; should fail honestly
    r = try_deterministic("take a screenshot")
    # Either succeeds (tool found) or fails honestly (no tool)
    assert r is not None
    assert isinstance(r, ComputerResult)


def test_deterministic_no_match():
    r = try_deterministic("open calculator and type hello")
    assert r is None  # Not deterministic; needs the full agent


def test_deterministic_volume():
    r = try_deterministic("volume up")
    assert r is not None


def test_has_display_headless():
    # This VM is headless
    assert has_display() is False


def test_deterministic_actions_defined():
    for action in ("screenshot", "lock", "volume_up", "volume_down", "mute"):
        assert action in DETERMINISTIC_ACTIONS
        assert "command" in DETERMINISTIC_ACTIONS[action]
        assert "description" in DETERMINISTIC_ACTIONS[action]


# --- Tool draft -----------------------------------------------------------

def test_computer_task_draft():
    r = computer_task(task="take a screenshot")
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    assert "take a screenshot" in r.data["description"]
    assert r.data["instant"] is True  # deterministic


def test_computer_task_complex():
    r = computer_task(task="open calculator and type 2+2")
    assert r.status == "success"
    assert r.data["instant"] is False  # needs the agent


def test_computer_task_empty_fails():
    r = computer_task(task="   ")
    assert r.status == "failure"


def test_tool_spec():
    assert COMPUTER_TASK_SPEC.name == "computer_task"
    assert COMPUTER_TASK_SPEC.execution_mode == ExecutionMode.DIRECT


# --- Result formatting ----------------------------------------------------

def test_format_success():
    r = ComputerResult(
        success=True, summary="Screenshot saved → /tmp/os_screenshot.png",
        steps=[ComputerStep(n=1, action="screenshot")],
    )
    text = format_computer_result(r)
    assert "Screenshot saved" in text


def test_format_failure_no_display():
    r = ComputerResult(
        success=False,
        summary="No display available.",
        error="no_display",
    )
    text = format_computer_result(r)
    assert "No display" in text
    # Should NOT show the raw error code for known errors
    assert "no_display" not in text
