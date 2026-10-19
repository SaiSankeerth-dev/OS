"""Scheduler tools: reminders.

`schedule_reminder(text)` parses "remind me to X at Y" and schedules it.
`list_reminders()` shows pending reminders.
`cancel_reminder(id)` cancels one.

All DIRECT (no approval needed — reminders are harmless; the user asked
for them explicitly).
"""
from __future__ import annotations

from datetime import datetime

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.scheduler.service import SchedulerService, parse_reminder

# Singleton; web/server.py calls .start() on boot.
_service: SchedulerService | None = None


def get_scheduler() -> SchedulerService:
    global _service
    if _service is None:
        _service = SchedulerService()
    return _service


def schedule_reminder(text: str = "", **kwargs) -> ToolResult:
    parsed = parse_reminder(text or "")
    if not parsed:
        return ToolResult(
            status="failure", mode=ExecutionMode.DIRECT,
            error="I couldn't understand the time. Try 'remind me to call mom at 6pm' "
                  "or 'remind me in 30 minutes to check the oven'.",
        )
    task, run_at, recurring = parsed
    r = get_scheduler().schedule(task, run_at, recurring)
    when = datetime.fromtimestamp(run_at).strftime("%I:%M %p, %b %d")
    rec = " (repeats daily)" if recurring else ""
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={
            "id": r.id, "text": task, "run_at": run_at,
            "recurring": recurring,
            "display": f"Reminder set: \"{task}\" at {when}{rec}. (id: {r.id})",
        },
    )


def format_schedule_reminder(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't set reminder."
    return result.data["display"]


SCHEDULE_REMINDER_SPEC = ToolSpec(
    name="schedule_reminder",
    description="Set a reminder. Usage: remind me to call mom at 6pm",
    execution_mode=ExecutionMode.DIRECT,
)


def list_reminders(**kwargs) -> ToolResult:
    reminders = get_scheduler().list_pending()
    if not reminders:
        return ToolResult(
            status="success", mode=ExecutionMode.DIRECT,
            data={"display": "No reminders set."},
        )
    lines = []
    for r in reminders:
        when = datetime.fromtimestamp(r.run_at).strftime("%I:%M %p, %b %d")
        rec = " (daily)" if r.recurring else ""
        lines.append(f"- \"{r.text}\" at {when}{rec} (id: {r.id})")
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"display": "Your reminders:\n" + "\n".join(lines)},
    )


def format_list_reminders(result: ToolResult) -> str:
    return result.data.get("display", "No reminders.")


LIST_REMINDERS_SPEC = ToolSpec(
    name="list_reminders",
    description="List pending reminders. Usage: what reminders do I have",
    execution_mode=ExecutionMode.DIRECT,
)


def cancel_reminder(reminder_id: str = "", **kwargs) -> ToolResult:
    rid = (reminder_id or "").strip()
    if not rid:
        return ToolResult(
            status="failure", mode=ExecutionMode.DIRECT,
            error="Which reminder? Say 'what reminders do I have' to see IDs.",
        )
    if get_scheduler().cancel(rid):
        return ToolResult(
            status="success", mode=ExecutionMode.DIRECT,
            data={"display": f"Cancelled reminder {rid}."},
        )
    return ToolResult(
        status="failure", mode=ExecutionMode.DIRECT,
        error=f"No pending reminder with id '{rid}'.",
    )


def format_cancel_reminder(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't cancel."
    return result.data["display"]


CANCEL_REMINDER_SPEC = ToolSpec(
    name="cancel_reminder",
    description="Cancel a reminder by ID. Usage: cancel reminder abc123",
    execution_mode=ExecutionMode.DIRECT,
)


SCHEDULER_TOOLS = [
    (SCHEDULE_REMINDER_SPEC, schedule_reminder, format_schedule_reminder),
    (LIST_REMINDERS_SPEC, list_reminders, format_list_reminders),
    (CANCEL_REMINDER_SPEC, cancel_reminder, format_cancel_reminder),
]
