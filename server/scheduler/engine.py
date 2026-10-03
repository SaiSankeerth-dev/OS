"""OS Background Scheduler — Durable Job Engine.

Enforces the user's architecture requirement:
  OS Scheduler → Durable Job Queue → Workers → OS World Model → Planner

Built on APScheduler AsyncIOScheduler for cron-like scheduling
with persistence via SQLite job store.

Default jobs (can be enabled/disabled via config):
  - morning_plan   — 08:00 daily → read calendar, gmail, commitments, deadlines
  - email_scan     — every 15 min → check for new emails → extract commitments
  - deadline_check — every hour → scan approaching deadlines → notifications
  - approval_nag   — every 10 min → nag pending approvals past timeout
  - watcher_eval   — every 30 min → evaluate watcher rules
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Callable, Optional

log = logging.getLogger("os.scheduler")


# ---------------------------------------------------------------------------
# Job definitions
# ---------------------------------------------------------------------------

# Default job configurations
DEFAULT_JOBS: list[dict[str, Any]] = [
    {
        "name": "morning_plan",
        "cron": "0 8 * * *",
        "handler": "server.scheduler.jobs.morning_plan",
        "enabled": True,
        "description": "Daily morning plan: read calendar, gmail, commitments, deadlines",
    },
    {
        "name": "email_scan",
        "cron": "*/15 * * * *",
        "handler": "server.scheduler.jobs.email_scan",
        "enabled": True,
        "description": "Scan for new emails, extract commitments",
    },
    {
        "name": "deadline_check",
        "cron": "0 * * * *",
        "handler": "server.scheduler.jobs.deadline_check",
        "enabled": True,
        "description": "Check approaching deadlines, send notifications",
    },
    {
        "name": "approval_nag",
        "cron": "*/10 * * * *",
        "handler": "server.scheduler.jobs.approval_nag",
        "enabled": True,
        "description": "Nag pending approvals past timeout",
    },
    {
        "name": "watcher_eval",
        "cron": "*/30 * * * *",
        "handler": "server.scheduler.jobs.watcher_eval",
        "enabled": True,
        "description": "Evaluate watcher rules",
    },
]


# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Real Job Handlers
# ---------------------------------------------------------------------------

async def _morning_plan(user_id: str = "default_user") -> dict[str, Any]:
    """Morning plan job: synthesize today's priorities into a daily schedule.

    Reads open tasks and commitments, carves busy calendar windows, runs
    PlannerEngine to generate today's active schedule, and logs an activity notification.
    """
    log.info("[Scheduler] Running morning_plan for user %s", user_id)
    from server.planner.engine import PlannerEngine
    from server.db.database import get_db
    from server.db.repositories.core import ActivityRepository
    from server.domain.entities import Activity
    from server.domain.enums import ActorType

    db = get_db()
    planner = PlannerEngine(db=db)
    act_repo = ActivityRepository(db=db)

    plan, items = planner.create_daily_plan(user_id=user_id)

    activity = Activity(
        user_id=user_id,
        actor_type=ActorType.OS,
        event_type="notification.morning_plan",
        entity_type="plan",
        entity_id=plan.id,
        summary=f"Morning briefing: {len(items)} tasks scheduled for today ({plan.plan_date})",
        metadata={
            "plan_id": plan.id,
            "plan_date": plan.plan_date,
            "scheduled_count": len(items),
            "task_ids": [it.task_id for it in items],
        },
    )
    act_repo.log(activity)

    return {
        "job": "morning_plan",
        "status": "completed",
        "plan_id": plan.id,
        "plan_date": plan.plan_date,
        "scheduled_count": len(items),
        "task_ids": [it.task_id for it in items],
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


async def _email_scan(user_id: str = "default_user") -> dict[str, Any]:
    """Email scan job: check for incoming email source events and extract commitments."""
    log.info("[Scheduler] Running email_scan for user %s", user_id)
    from server.db.database import get_db
    from server.db.repositories.core import SourceEventRepository, ActivityRepository
    from server.domain.entities import Activity
    from server.domain.enums import ActorType
    from server.ingestion.pipeline import IngestionPipeline

    db = get_db()
    event_repo = SourceEventRepository(db=db)
    act_repo = ActivityRepository(db=db)
    pipeline = IngestionPipeline(event_repo=event_repo)

    unprocessed = event_repo.get_unprocessed(user_id=user_id, limit=20)
    email_events = [
        ev for ev in unprocessed
        if "email" in ev.event_type.lower() or "gmail" in ev.source_id.lower()
    ]

    processed_count = 0
    extracted_commitments = []

    for ev in email_events:
        res = pipeline.process_event(ev)
        processed_count += 1
        if res.commitment:
            extracted_commitments.append({
                "commitment_id": res.commitment.id,
                "title": res.commitment.title,
                "deadline": res.commitment.deadline.isoformat() if res.commitment.deadline else None,
            })
            act_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.OS,
                    event_type="notification.email_commitment_extracted",
                    entity_type="commitment",
                    entity_id=res.commitment.id,
                    summary=f"Commitment extracted from email: '{res.commitment.title}'",
                    metadata={"source_event_id": ev.id, "subject": ev.payload.get("subject", "")},
                )
            )

    return {
        "job": "email_scan",
        "status": "completed",
        "scanned_count": len(email_events),
        "processed_count": processed_count,
        "extracted_count": len(extracted_commitments),
        "commitments": extracted_commitments,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


async def _deadline_check(user_id: str = "default_user", horizon_hours: int = 48) -> dict[str, Any]:
    """Deadline check job: scan approaching deadlines and detect risks."""
    log.info("[Scheduler] Running deadline_check for user %s (horizon=%dh)", user_id, horizon_hours)
    from server.db.database import get_db
    from server.db.repositories.core import TaskRepository, ActivityRepository
    from server.domain.entities import Activity
    from server.domain.enums import ActorType

    db = get_db()
    task_repo = TaskRepository(db=db)
    act_repo = ActivityRepository(db=db)

    now = datetime.now(timezone.utc)
    horizon = now + timedelta(hours=horizon_hours)

    open_tasks = task_repo.get_open_tasks(user_id)
    at_risk_tasks = []

    for t in open_tasks:
        if not t.deadline:
            continue
        dl = t.deadline if t.deadline.tzinfo else t.deadline.replace(tzinfo=timezone.utc)

        if dl <= horizon:
            is_overdue = dl < now
            hours_until = (dl - now).total_seconds() / 3600.0

            has_risk = False
            risk_reason = ""
            if is_overdue:
                has_risk = True
                risk_reason = f"Task is overdue by {int(-hours_until * 60)} minutes"
            elif t.scheduled_end:
                sched_end = t.scheduled_end if t.scheduled_end.tzinfo else t.scheduled_end.replace(tzinfo=timezone.utc)
                if sched_end > dl:
                    has_risk = True
                    risk_reason = f"Scheduled completion ({sched_end.isoformat()}) exceeds deadline ({dl.isoformat()})"
            else:
                has_risk = True
                risk_reason = f"Due in {int(hours_until)} hours but not scheduled"

            if has_risk:
                at_risk_tasks.append({
                    "id": t.id,
                    "title": t.title,
                    "deadline": dl.isoformat(),
                    "reason": risk_reason,
                    "priority": t.priority,
                })
                act_repo.log(
                    Activity(
                        user_id=user_id,
                        actor_type=ActorType.OS,
                        event_type="notification.deadline_alert",
                        entity_type="task",
                        entity_id=t.id,
                        summary=f"Deadline Alert: '{t.title}' - {risk_reason}",
                        metadata={"task_id": t.id, "deadline": dl.isoformat(), "reason": risk_reason},
                    )
                )

    return {
        "job": "deadline_check",
        "status": "completed",
        "at_risk_count": len(at_risk_tasks),
        "at_risk_tasks": at_risk_tasks,
        "timestamp": now.isoformat(),
    }


async def _approval_nag(user_id: str = "default_user", nag_after_seconds: int = 600) -> dict[str, Any]:
    """Approval nag job: remind user about aging pending approvals."""
    log.info("[Scheduler] Running approval_nag for user %s (threshold=%ds)", user_id, nag_after_seconds)
    from server.db.database import get_db
    from server.db.repositories.core import ActionApprovalRepository, ActivityRepository
    from server.domain.entities import Activity
    from server.domain.enums import ActorType

    db = get_db()
    repo = ActionApprovalRepository(db=db)
    act_repo = ActivityRepository(db=db)

    pending_pairs = repo.get_pending_approvals(user_id=user_id)
    now = datetime.now(timezone.utc)
    nagged = []

    for approval, action in pending_pairs:
        req_at = approval.requested_at if approval.requested_at.tzinfo else approval.requested_at.replace(tzinfo=timezone.utc)
        age_sec = (now - req_at).total_seconds()

        is_expired = False
        if approval.expires_at:
            exp = approval.expires_at if approval.expires_at.tzinfo else approval.expires_at.replace(tzinfo=timezone.utc)
            if now > exp:
                is_expired = True

        if age_sec >= nag_after_seconds and not is_expired:
            mins = int(age_sec // 60)
            summary = f"Reminder: '{action.tool_name}' has been waiting for approval for ~{mins} minutes."
            nagged.append({
                "approval_id": approval.id,
                "action_id": action.id,
                "tool_name": action.tool_name,
                "age_minutes": mins,
            })
            act_repo.log(
                Activity(
                    user_id=user_id,
                    actor_type=ActorType.OS,
                    event_type="notification.approval_nag",
                    entity_type="approval",
                    entity_id=approval.id,
                    summary=summary,
                    metadata={
                        "approval_id": approval.id,
                        "action_id": action.id,
                        "tool": action.tool_name,
                        "age_seconds": age_sec,
                    },
                )
            )

    return {
        "job": "approval_nag",
        "status": "completed",
        "pending_count": len(pending_pairs),
        "nagged_count": len(nagged),
        "nagged": nagged,
        "timestamp": now.isoformat(),
    }


async def _watcher_eval(user_id: str = "default_user") -> dict[str, Any]:
    """Watcher evaluation job: evaluate proactive watcher checks across DB state."""
    log.info("[Scheduler] Running watcher_eval for user %s", user_id)
    from server.db.database import get_db
    from server.db.repositories.core import ActionApprovalRepository, ActivityRepository
    from server.domain.entities import Activity
    from server.domain.enums import ActorType

    db = get_db()
    approval_repo = ActionApprovalRepository(db=db)
    act_repo = ActivityRepository(db=db)

    now = datetime.now(timezone.utc)
    suggestions: list[dict[str, Any]] = []

    # 1. Aging pending approvals
    pending = approval_repo.get_pending_approvals(user_id=user_id)
    aging = [
        (app, act) for app, act in pending
        if (now - (app.requested_at if app.requested_at.tzinfo else app.requested_at.replace(tzinfo=timezone.utc))).total_seconds() > 600
    ]
    if aging:
        n = len(aging)
        sug_text = (
            f"{n} action{'s' if n != 1 else ''} waiting for approval: "
            f"{', '.join(act.tool_name for _, act in aging[:3])}. Say 'approve' or 'reject' to proceed."
        )
        suggestions.append({"kind": "aging_approvals", "text": sug_text})

    # 2. Recent failed activities
    recent_acts = act_repo.list_recent(user_id=user_id, limit=50)
    failed_acts = [
        a for a in recent_acts
        if "fail" in a.event_type.lower() or "error" in a.event_type.lower()
    ]
    if len(failed_acts) >= 2:
        suggestions.append({
            "kind": "recent_failures",
            "text": f"{len(failed_acts)} recent system failures detected. Review activity logs.",
        })

    for s in suggestions:
        act_repo.log(
            Activity(
                user_id=user_id,
                actor_type=ActorType.OS,
                event_type="notification.watcher_suggestion",
                summary=s["text"],
                metadata=s,
            )
        )

    return {
        "job": "watcher_eval",
        "status": "completed",
        "suggestions_count": len(suggestions),
        "suggestions": suggestions,
        "timestamp": now.isoformat(),
    }


# Handler registry
JOB_HANDLERS: dict[str, Callable] = {
    "server.scheduler.jobs.morning_plan": _morning_plan,
    "server.scheduler.jobs.email_scan": _email_scan,
    "server.scheduler.jobs.deadline_check": _deadline_check,
    "server.scheduler.jobs.approval_nag": _approval_nag,
    "server.scheduler.jobs.watcher_eval": _watcher_eval,
}


# ---------------------------------------------------------------------------
# OSScheduler
# ---------------------------------------------------------------------------

class OSScheduler:
    """OS Background Scheduler using APScheduler.

    Usage:
        scheduler = OSScheduler()
        await scheduler.start()  # Starts all enabled default jobs
        ...
        await scheduler.stop()
    """

    def __init__(
        self,
        *,
        jobs: Optional[list[dict[str, Any]]] = None,
        job_store_path: str = "data/scheduler_jobs.db",
    ) -> None:
        self._jobs_config = jobs or DEFAULT_JOBS
        self._job_store_path = job_store_path
        self._scheduler = None
        self._running = False
        self._history: list[dict[str, Any]] = []

    def _get_scheduler(self):
        """Lazy-create the APScheduler instance."""
        if self._scheduler is None:
            try:
                from apscheduler.schedulers.asyncio import AsyncIOScheduler
                from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore

                jobstores = {
                    "default": SQLAlchemyJobStore(
                        url=f"sqlite:///{self._job_store_path}"
                    )
                }
                self._scheduler = AsyncIOScheduler(
                    jobstores=jobstores,
                    job_defaults={
                        "coalesce": True,
                        "max_instances": 1,
                        "misfire_grace_time": 300,
                    },
                )
            except ImportError:
                log.warning(
                    "APScheduler not installed. "
                    "Run: pip install apscheduler sqlalchemy"
                )
                # Create a minimal in-memory scheduler
                self._scheduler = _MinimalScheduler()
        return self._scheduler

    async def start(self) -> None:
        """Start the scheduler and register all enabled jobs."""
        scheduler = self._get_scheduler()

        for job_cfg in self._jobs_config:
            if not job_cfg.get("enabled", True):
                continue

            handler_path = job_cfg["handler"]
            handler = JOB_HANDLERS.get(handler_path)
            if handler is None:
                log.warning("No handler for job: %s", handler_path)
                continue

            cron = job_cfg["cron"]
            name = job_cfg["name"]

            try:
                parts = cron.split()
                if len(parts) == 5:
                    if isinstance(scheduler, _MinimalScheduler):
                        scheduler.add_job(name, cron, handler)
                    else:
                        from apscheduler.triggers.cron import CronTrigger
                        trigger = CronTrigger(
                            minute=parts[0],
                            hour=parts[1],
                            day=parts[2],
                            month=parts[3],
                            day_of_week=parts[4],
                        )
                        scheduler.add_job(
                            handler,
                            trigger,
                            id=name,
                            name=name,
                            replace_existing=True,
                        )
                    log.info("Registered job: %s [%s]", name, cron)
            except Exception as exc:
                log.error("Failed to register job %s: %s", name, exc)

        if isinstance(scheduler, _MinimalScheduler):
            log.info("OSScheduler started (minimal mode — APScheduler not installed)")
        else:
            scheduler.start()
            log.info("OSScheduler started with %d jobs", len(self._jobs_config))

        self._running = True

    async def stop(self) -> None:
        """Stop the scheduler gracefully."""
        if self._scheduler and not isinstance(self._scheduler, _MinimalScheduler):
            self._scheduler.shutdown(wait=False)
        self._running = False
        log.info("OSScheduler stopped")

    def is_running(self) -> bool:
        return self._running

    def list_jobs(self) -> list[dict[str, Any]]:
        """List all registered jobs and their status."""
        result = []
        for cfg in self._jobs_config:
            result.append({
                "name": cfg["name"],
                "cron": cfg["cron"],
                "enabled": cfg.get("enabled", True),
                "description": cfg.get("description", ""),
            })
        return result

    async def run_job_now(self, job_name: str, **kwargs) -> dict[str, Any]:
        """Manually trigger a job immediately with optional kwargs."""
        for cfg in self._jobs_config:
            if cfg["name"] == job_name:
                handler = JOB_HANDLERS.get(cfg["handler"])
                if handler:
                    result = await handler(**kwargs)
                    self._history.append({
                        "job": job_name,
                        "triggered": "manual",
                        "result": result,
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    })
                    return result
                raise ValueError(f"No handler for job: {job_name}")
        raise ValueError(f"Unknown job: {job_name}")

    def get_history(self, limit: int = 20) -> list[dict[str, Any]]:
        """Get recent job execution history."""
        return self._history[-limit:]


# ---------------------------------------------------------------------------
# Minimal fallback scheduler (when APScheduler is not installed)
# ---------------------------------------------------------------------------

class _MinimalScheduler:
    """Minimal scheduler that just records jobs but doesn't actually cron.

    Jobs can still be triggered manually via run_job_now().
    """

    def __init__(self):
        self._jobs: dict[str, dict] = {}

    def add_job(self, name: str, cron: str, handler: Callable) -> None:
        self._jobs[name] = {"cron": cron, "handler": handler}

    def start(self) -> None:
        pass

    def shutdown(self, wait: bool = True) -> None:
        pass
