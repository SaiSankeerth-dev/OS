from server.intent.registry import ExecutionMode, ToolResult
from server.tools.datetime_tool import (
    DATETIME_SPEC,
    format_datetime,
    get_current_datetime,
)


def test_spec_metadata():
    assert DATETIME_SPEC.name == "get_current_datetime"
    assert DATETIME_SPEC.execution_mode == ExecutionMode.DIRECT


def test_get_returns_success_with_required_fields():
    r = get_current_datetime()
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    for key in ("date", "time", "timezone", "iso"):
        assert key in r.data and r.data[key]


def test_format_contains_date_and_time():
    r = get_current_datetime()
    s = format_datetime(r)
    assert r.data["time"] in s
    assert r.data["date"] in s


def test_format_starts_with_it_is():
    r = get_current_datetime()
    assert format_datetime(r).startswith("It's ")