"""Proactive alerts tests."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server.intent.router import IntentRouter, Intent
from server.proactive.checks import (
    check_all, check_reminders, check_system, check_failed_plans, Alert,
)
from server.tools.proactive_tool import (
    check_alerts, CHECK_ALERTS_SPEC,
)
from server.intent.registry import ExecutionMode


def _route(text: str):
    return IntentRouter().classify(text)


def test_route_check_alerts():
    d = _route("check alerts")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "check_alerts"


def test_check_alerts_runs():
    r = check_alerts()
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    assert "display" in r.data


def test_check_system():
    alerts = check_system()
    # Should not crash; may or may not have alerts
    assert isinstance(alerts, list)


def test_check_reminders():
    alerts = check_reminders()
    assert isinstance(alerts, list)


def test_check_all_sorted():
    alerts = check_all()
    # Urgent should come before warning
    severities = [a.severity for a in alerts]
    # Verify ordering: all urgents before warnings before infos
    order = {"urgent": 0, "warning": 1, "info": 2}
    indices = [order.get(s, 3) for s in severities]
    assert indices == sorted(indices)


def test_alert_dataclass():
    a = Alert(severity="warning", source="test", title="Test")
    assert a.severity == "warning"
    assert a.created_at  # auto-set


def test_spec():
    assert CHECK_ALERTS_SPEC.name == "check_alerts"
    assert CHECK_ALERTS_SPEC.execution_mode == ExecutionMode.DIRECT


def test_permissions():
    from server.supervisor.permissions import ToolPermission, ToolPolicy
    p = ToolPermission()
    policy, _ = p.check("check_alerts")
    assert policy == ToolPolicy.ALLOW
