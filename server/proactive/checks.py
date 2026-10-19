"""Proactive alerts: OS watches and warns you.

Checks:
- Reminders due soon (from scheduler)
- GitHub PRs needing attention (stale, no activity)
- Plans that failed and need review
- System health (disk space, etc.)

Runs on-demand via `check alerts` or on a schedule.
"""
from __future__ import annotations

import logging
import shutil
from dataclasses import dataclass, field
from datetime import datetime, timedelta

log = logging.getLogger(__name__)


@dataclass
class Alert:
    severity: str  # "info" | "warning" | "urgent"
    source: str    # "scheduler" | "github" | "planner" | "system"
    title: str
    detail: str = ""
    action: str = ""  # suggested command, e.g. "show my github PRs"
    created_at: str = field(
        default_factory=lambda: datetime.now().isoformat())


def check_reminders() -> list[Alert]:
    """Alert on reminders due in the next hour or overdue."""
    alerts = []
    try:
        from server.tools.scheduler_tool import get_scheduler
        sched = get_scheduler()
        reminders = sched.list_pending()
        now = datetime.now()
        for r in reminders:
            # r is a Reminder dataclass with run_at (timestamp)
            try:
                fire_at = datetime.fromtimestamp(r.run_at)
            except Exception:
                continue
            delta = (fire_at - now).total_seconds()
            if delta < 0 and delta > -3600:
                alerts.append(Alert(
                    severity="urgent",
                    source="scheduler",
                    title=f"Overdue: {r.task}",
                    detail=f"Was due at {fire_at.strftime('%H:%M')}",
                    action="show my reminders",
                ))
            elif 0 <= delta < 3600:
                mins = int(delta / 60)
                alerts.append(Alert(
                    severity="warning",
                    source="scheduler",
                    title=f"Due in {mins}m: {r.task}",
                    detail=f"Due at {fire_at.strftime('%H:%M')}",
                    action="show my reminders",
                ))
    except Exception as e:
        log.warning("Reminder check failed: %s", e)
    return alerts


def check_github_prs() -> list[Alert]:
    """Alert on stale PRs (no activity in 7+ days)."""
    alerts = []
    try:
        from server.tools.github_tool import _gh
        import json
        ok, out = _gh("pr", "list", "--author", "@me", "--limit", "10",
                      "--json", "number,title,updatedAt,repository")
        if not ok:
            return alerts
        prs = json.loads(out)
        now = datetime.now()
        for pr in prs:
            try:
                updated = datetime.fromisoformat(
                    pr["updatedAt"].replace("Z", "+00:00"))
                # Make now timezone-aware for comparison
                from datetime import timezone
                age = (datetime.now(timezone.utc) - updated).days
            except Exception:
                continue
            if age >= 7:
                repo = pr.get("repository", {}).get("name", "?")
                alerts.append(Alert(
                    severity="warning",
                    source="github",
                    title=f"Stale PR #{pr['number']}: {pr['title'][:50]}",
                    detail=f"No activity in {age} days ({repo})",
                    action="show my github PRs",
                ))
    except Exception as e:
        log.warning("GitHub PR check failed: %s", e)
    return alerts


def check_failed_plans() -> list[Alert]:
    """Alert on plans that failed and need review."""
    alerts = []
    try:
        from server.tools.planner_tool import _plans
        from server.planner.models import PlanStatus
        for pid, plan in _plans.items():
            if plan.status == PlanStatus.FAILED:
                alerts.append(Alert(
                    severity="warning",
                    source="planner",
                    title=f"Plan failed: {plan.title}",
                    detail=f"Stopped at step {plan.current_step + 1} "
                           f"of {plan.total_steps}",
                    action=f"plan list",
                ))
    except Exception as e:
        log.warning("Plan check failed: %s", e)
    return alerts


def check_system() -> list[Alert]:
    """Alert on system issues (disk space, etc.)."""
    alerts = []
    try:
        usage = shutil.disk_usage("/")
        pct = usage.used / usage.total * 100
        if pct > 90:
            alerts.append(Alert(
                severity="urgent",
                source="system",
                title=f"Disk space critical: {pct:.0f}% used",
                detail=f"{usage.free // (1024**3)}GB free",
                action="",
            ))
        elif pct > 80:
            alerts.append(Alert(
                severity="warning",
                source="system",
                title=f"Disk space low: {pct:.0f}% used",
                detail=f"{usage.free // (1024**3)}GB free",
                action="",
            ))
    except Exception as e:
        log.warning("System check failed: %s", e)
    return alerts


def check_all() -> list[Alert]:
    """Run all proactive checks. Returns sorted by severity."""
    alerts = []
    alerts.extend(check_reminders())
    alerts.extend(check_github_prs())
    alerts.extend(check_failed_plans())
    alerts.extend(check_system())
    # Sort: urgent first, then warning, then info
    order = {"urgent": 0, "warning": 1, "info": 2}
    alerts.sort(key=lambda a: order.get(a.severity, 3))
    return alerts
