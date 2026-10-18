"""Quota-Aware Background Scheduler for Computer-Control Tasks.

Schedules and executes browser and computer tasks around known AI rate limits and
quotas. Persists task checkpoints, delays blocked tasks until quota resets, and
resumes execution from the exact paused step without duplicating work.
"""
from __future__ import annotations

import heapq
import logging
import threading
import time
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional

from server.computer.rate_limits import RateLimitsTracker, get_rate_limits_tracker
from server.computer.task_loop import BoundedTaskExecutor, TaskPlan, get_bounded_task_executor

log = logging.getLogger("os.computer.scheduler")


@dataclass(order=True)
class QueuedTask:
    priority: int
    scheduled_time: float
    task_id: str = field(compare=False)
    provider: str = field(compare=False, default="openai")
    model: str = field(compare=False, default="default")
    status: str = field(compare=False, default="queued")  # queued, waiting_quota, running, completed, failed
    reason: str = field(compare=False, default="")


class QuotaAwareScheduler:
    """Schedules computer-use workflows respecting provider rate limits and checkpoints."""

    def __init__(
        self,
        rate_tracker: Optional[RateLimitsTracker] = None,
        task_executor: Optional[BoundedTaskExecutor] = None,
    ) -> None:
        self.tracker = rate_tracker or get_rate_limits_tracker()
        self.executor = task_executor or get_bounded_task_executor()
        self._queue: List[QueuedTask] = []
        self._tasks_by_id: Dict[str, QueuedTask] = {}
        self._lock = threading.Lock()
        self._running = False
        self._worker_thread: Optional[threading.Thread] = None

    def enqueue_task(
        self,
        task_id: str,
        priority: int = 5,
        provider: str = "openai",
        model: str = "default",
        delay_sec: float = 0.0,
    ) -> QueuedTask:
        """Enqueue a task plan for quota-aware execution."""
        scheduled_time = time.time() + delay_sec
        item = QueuedTask(
            priority=priority,
            scheduled_time=scheduled_time,
            task_id=task_id,
            provider=provider.lower(),
            model=model.lower(),
            status="queued",
        )
        with self._lock:
            heapq.heappush(self._queue, item)
            self._tasks_by_id[task_id] = item
        log.info(f"Enqueued task '{task_id}' (priority={priority}, provider={provider}:{model})")
        return item

    def get_status(self) -> Dict[str, Any]:
        """Return dashboard metrics: queue size, waiting quota tasks, and active limits."""
        with self._lock:
            now = time.time()
            queued = [t for t in self._tasks_by_id.values() if t.status == "queued"]
            waiting = [t for t in self._tasks_by_id.values() if t.status == "waiting_quota"]
            running = [t for t in self._tasks_by_id.values() if t.status == "running"]

            return {
                "active_workers": 1 if self._running else 0,
                "queued_count": len(queued),
                "waiting_quota_count": len(waiting),
                "running_count": len(running),
                "active_cooldowns": self.tracker.list_active_cooldowns(),
                "tasks": [
                    {
                        "task_id": t.task_id,
                        "priority": t.priority,
                        "status": t.status,
                        "provider": t.provider,
                        "model": t.model,
                        "scheduled_time": t.scheduled_time,
                        "resumes_in_seconds": max(0.0, t.scheduled_time - now),
                        "reason": t.reason,
                    }
                    for t in self._tasks_by_id.values()
                ],
            }

    def tick(self) -> Optional[str]:
        """Execute one scheduling cycle. Inspects top-priority eligible tasks."""
        with self._lock:
            if not self._queue:
                return None

            now = time.time()
            # Peek top task
            top = self._queue[0]
            if top.scheduled_time > now:
                # Not yet due
                return None

            item = heapq.heappop(self._queue)

        # Check quota availability
        if not self.tracker.is_available(item.provider, item.model):
            cd = self.tracker.get_active_cooldown(item.provider, item.model)
            delay = cd.remaining_seconds if cd else 60.0
            item.status = "waiting_quota"
            item.scheduled_time = time.time() + delay
            item.reason = f"Provider '{item.provider}:{item.model}' in cooldown"
            with self._lock:
                heapq.heappush(self._queue, item)
            log.warning(f"Task '{item.task_id}' delayed by {delay:.1f}s due to quota cooldown.")
            return None

        # Execute task steps from checkpoint
        item.status = "running"
        try:
            plan = self.executor.checkpoints.load(item.task_id)
            if not plan:
                item.status = "failed"
                item.reason = "Plan not found in checkpoint store"
                return None

            # Execute until completed, waiting for approval, or paused
            while plan.status in ("pending", "running") and plan.current_step_index < len(plan.steps):
                step = self.executor.execute_next_step(item.task_id)
                if step.status in ("waiting_approval", "waiting_human", "failed"):
                    break

            plan = self.executor.checkpoints.load(item.task_id)
            if plan:
                item.status = plan.status
                item.reason = plan.error_summary or ""

            return item.task_id
        except Exception as e:
            item.status = "failed"
            item.reason = str(e)
            log.error(f"Execution error on scheduled task '{item.task_id}': {e}")
            return None

    def start(self, poll_interval: float = 1.0) -> None:
        """Start the background scheduler worker loop."""
        if self._running:
            return
        self._running = True

        def _loop():
            while self._running:
                try:
                    self.tick()
                except Exception as e:
                    log.error(f"Scheduler tick error: {e}")
                time.sleep(poll_interval)

        self._worker_thread = threading.Thread(target=_loop, daemon=True, name="quota_scheduler")
        self._worker_thread.start()
        log.info("Quota-aware computer scheduler started.")

    def stop(self) -> None:
        self._running = False
        if self._worker_thread and self._worker_thread.is_alive():
            self._worker_thread.join(timeout=2.0)
        log.info("Quota-aware computer scheduler stopped.")


_GLOBAL_SCHEDULER: Optional[QuotaAwareScheduler] = None


def get_quota_scheduler() -> QuotaAwareScheduler:
    global _GLOBAL_SCHEDULER
    if _GLOBAL_SCHEDULER is None:
        _GLOBAL_SCHEDULER = QuotaAwareScheduler()
    return _GLOBAL_SCHEDULER
