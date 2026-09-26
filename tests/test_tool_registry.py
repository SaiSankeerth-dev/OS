import asyncio
from server.intent.registry import (
    ExecutionMode,
    ToolRegistry,
    ToolResult,
    ToolSpec,
)


def _spec(name="t", mode=ExecutionMode.DIRECT, requires_memory=False):
    return ToolSpec(
        name=name,
        description=f"test {name}",
        execution_mode=mode,
        requires_memory=requires_memory,
    )


def _handler_ok(**kwargs):
    return ToolResult(status="success", mode=ExecutionMode.DIRECT, data={"x": 1})


def _handler_fail(**kwargs):
    return ToolResult(
        status="failure", mode=ExecutionMode.DIRECT, data={}, error="boom"
    )


def _formatter(result: ToolResult) -> str:
    return f"value={result.data['x']}"


def test_register_and_get():
    reg = ToolRegistry()
    reg.register(_spec(), _handler_ok, _formatter)
    spec, handler, fmt = reg.get("t")
    assert spec.name == "t"
    assert handler is _handler_ok
    assert fmt is _formatter


def test_get_missing_raises():
    reg = ToolRegistry()
    try:
        reg.get("nope")
    except KeyError:
        return
    raise AssertionError("expected KeyError")


def test_execute_success_returns_result():
    reg = ToolRegistry()
    reg.register(_spec(), _handler_ok, _formatter)
    result = reg.execute("t")
    assert result.status == "success"
    assert result.data == {"x": 1}


def test_execute_failure_returns_result():
    reg = ToolRegistry()
    reg.register(_spec(), _handler_fail, _formatter)
    result = reg.execute("t")
    assert result.status == "failure"
    assert result.error == "boom"


def test_execute_handler_exception_becomes_failure():
    def bad(**kw):
        raise RuntimeError("kaboom")

    reg = ToolRegistry()
    reg.register(_spec(), bad, _formatter)
    result = reg.execute("t")
    assert result.status == "failure"
    assert "kaboom" in (result.error or "")


def test_names_returns_registered():
    reg = ToolRegistry()
    reg.register(_spec("a"), _handler_ok, _formatter)
    reg.register(_spec("b"), _handler_ok, _formatter)
    assert set(reg.names()) == {"a", "b"}