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
from datetime import datetime, timezone
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
# Job handler stubs (will be wired to real services)
# ---------------------------------------------------------------------------

async def _morning_plan() -> dict[str, Any]:
    """Morning plan job: synthesize today's priorities."""
    log.info("[Scheduler] Running morning_plan")
    # TODO: Wire to real calendar, gmail, commitment, deadline services
    return {
        "job": "morning_plan",
        "status": "completed",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actions": ["calendar_read", "gmail_scan", "commitment_check", "deadline_scan"],
    }


async def _email_scan() -> dict[str, Any]:
    """Email scan job: check for new emails and extract commitments."""
    log.info("[Scheduler] Running email_scan")
    return {
        "job": "email_scan",
        "status": "completed",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


async def _deadline_check() -> dict[str, Any]:
    """Deadline check job: scan approaching deadlines."""
    log.info("[Scheduler] Running deadline_check")
    return {
        "job": "deadline_check",
        "status": "completed",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


async def _approval_nag() -> dict[str, Any]:
    """Approval nag job: remind about pending approvals."""
    log.info("[Scheduler] Running approval_nag")
    return {
        "job": "approval_nag",
        "status": "completed",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


async def _watcher_eval() -> dict[str, Any]:
    """Watcher evaluation job: run watcher rules."""
    log.info("[Scheduler] Running watcher_eval")
    return {
        "job": "watcher_eval",
        "status": "completed",
        "timestamp": datetime.now(timezone.utc).isoformat(),
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

    async def run_job_now(self, job_name: str) -> dict[str, Any]:
        """Manually trigger a job immediately."""
        for cfg in self._jobs_config:
            if cfg["name"] == job_name:
                handler = JOB_HANDLERS.get(cfg["handler"])
                if handler:
                    result = await handler()
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
