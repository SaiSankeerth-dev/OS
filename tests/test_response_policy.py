from server.intent.registry import ExecutionMode, ToolResult
from server.response.policy import ResponsePolicy


def _ok(data=None):
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT, data=data or {"k": "v"}
    )


def _fail(err="boom"):
    return ToolResult(
        status="failure", mode=ExecutionMode.DIRECT, data={}, error=err
    )


def _fmt(r):
    return f"formatted({r.data['k']})"


def test_direct_success_uses_formatter():
    p = ResponsePolicy()
    fr = p.apply_direct("t", _ok({"k": "X"}), _fmt)
    assert fr.text == "formatted(X)"
    assert fr.source == "direct_tool"


def test_direct_failure_returns_explicit_error():
    p = ResponsePolicy()
    fr = p.apply_direct("t", _fail("nope"), _fmt)
    assert fr.source == "policy"
    assert "couldn't run" in fr.text
    assert "nope" in fr.text


def test_tool_then_llm_success_returns_marker():
    p = ResponsePolicy()
    fr = p.apply_tool_then_llm("t", _ok({"k": "v"}))
    assert fr.source == "tool_then_llm"


def test_llm_chat_strips_sure_prefix():
    p = ResponsePolicy(forbidden_prefixes=["Sure,", "Certainly."])
    fr = p.apply_llm_chat("Sure, here's the thing.")
    assert not fr.text.lower().startswith("sure,")


def test_llm_chat_keeps_legitimate_phrase():
    p = ResponsePolicy(forbidden_prefixes=["Sure,", "Certainly."])
    fr = p.apply_llm_chat("It is a programming language.")
    assert "It is" in fr.text


def test_llm_chat_empty_returns_fallback():
    p = ResponsePolicy()
    fr = p.apply_llm_chat("   ")
    assert fr.source == "fallback"
    assert fr.text.strip()

def test_llm_chat_empty_guides_user_without_dead_end():
    # When the model is unreachable, the fallback must say what works —
    # never the old "I don't have anything to add." dead end.
    p = ResponsePolicy()
    fr = p.apply_llm_chat("")
    assert fr.source == "fallback"
    assert "I don't have anything to add" not in fr.text
    assert "Ollama" in fr.text
    assert "draft a linkedin post" in fr.text
