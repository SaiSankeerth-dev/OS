"""Unit tests for IntentRouter."""
from server.intent.router import IntentRouter, Intent, RouteDecision


def _r() -> IntentRouter:
    return IntentRouter()


def test_time_question_is_tool_call():
    d = _r().classify("what time is it?")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_current_datetime"


def test_date_question_is_tool_call():
    d = _r().classify("what's today's date?")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_current_datetime"


def test_bare_today_is_tool_call():
    d = _r().classify("today?")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_current_datetime"


def test_python_question_is_llm_chat():
    d = _r().classify("what is Python?")
    assert d.intent == Intent.LLM_CHAT
    assert d.tool_name is None


def test_battery_is_tool_call():
    d = _r().classify("battery")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_system_info"


def test_cpu_usage_is_tool_call():
    d = _r().classify("cpu usage")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "get_system_info"


def test_greeting_is_llm_chat():
    d = _r().classify("hi")
    assert d.intent == Intent.LLM_CHAT


def test_classify_strips_whitespace():
    d = _r().classify("   what time is it   ")
    assert d.intent == Intent.TOOL_CALL