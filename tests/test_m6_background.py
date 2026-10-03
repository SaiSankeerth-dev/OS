"""Test Suite for Milestone 6: Background / Proactive Work.

Enforces real proactive background workflows:
1. morning_plan: Read tasks/calendar -> PlannerEngine -> daily plan + notification activity.
2. deadline_check: Find approaching deadlines -> evaluate risk -> log alerts.
3. email_scan: Fetch unprocessed email events -> IngestionPipeline -> commitments + notifications.
4. approval_nag: Scan aging pending approvals past threshold -> nag reminders.
5. watcher_eval: Proactive checks across state -> suggestions + activities.
6. OSScheduler: Job registration, manual trigger via run_job_now(), and execution history.
"""
from __future__ import annotations

import json
from datetime import date, datetime, timedelta, timezone
import pytest

from server.db.database import get_db
from server.db.repositories.core import (
    ActionApprovalRepository,
    ActivityRepository,
    PlanRepository,
    SourceEventRepository,
    TaskRepository,
)
from server.domain.entities import Action, Activity, Approval, SourceEvent, Task
from server.domain.enums import (
    ActionStatus,
    ActorType,
    ApprovalStatus,
    ProcessingStatus,
    RiskLevel,
    TaskStatus,
)
from server.scheduler.engine import (
    OSScheduler,
    _approval_nag,
    _deadline_check,
    _email_scan,
    _morning_plan,
    _watcher_eval,
)


@pytest.fixture
def clean_db():
    db = get_db()
    with db.transaction() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO users (id, email, display_name, created_at, updated_at) "
            "VALUES ('test_bg_user', 'background@local.os', 'Background User', datetime('now'), datetime('now'))"
        )
        conn.execute("DELETE FROM plan_items WHERE plan_id IN (SELECT id FROM plans WHERE user_id = 'test_bg_user')")
        conn.execute("DELETE FROM plans WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM tasks WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM commitments WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM source_events WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM activities WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM approvals WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM actions WHERE user_id = 'test_bg_user'")
    yield db
    with db.transaction() as conn:
        conn.execute("DELETE FROM plan_items WHERE plan_id IN (SELECT id FROM plans WHERE user_id = 'test_bg_user')")
        conn.execute("DELETE FROM plans WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM tasks WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM commitments WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM source_events WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM activities WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM approvals WHERE user_id = 'test_bg_user'")
        conn.execute("DELETE FROM actions WHERE user_id = 'test_bg_user'")


@pytest.mark.asyncio
async def test_morning_plan_workflow(clean_db):
    """morning_plan reads open tasks, runs planner, saves plan and logs notification."""
    task_repo = TaskRepository(clean_db)
    act_repo = ActivityRepository(clean_db)

    # Seed 2 open tasks
    task_repo.create(
        Task(
            user_id="test_bg_user",
            title="Prepare Quarterly Architecture Review",
            priority=8,
            estimated_duration_minutes=90,
            status=TaskStatus.OPEN,
        )
    )
    task_repo.create(
        Task(
            user_id="test_bg_user",
            title="Audit Security Logs",
            priority=5,
            estimated_duration_minutes=45,
            status=TaskStatus.OPEN,
        )
    )

    res = await _morning_plan(user_id="test_bg_user")
    assert res["status"] == "completed"
    assert res["scheduled_count"] == 2
    assert "plan_id" in res

    # Verify activity was logged
    acts = act_repo.list_recent(user_id="test_bg_user", limit=10)
    morning_acts = [a for a in acts if a.event_type == "notification.morning_plan"]
    assert len(morning_acts) == 1
    assert "Morning briefing: 2 tasks scheduled" in morning_acts[0].summary


@pytest.mark.asyncio
async def test_deadline_check_workflow(clean_db):
    """deadline_check finds approaching deadlines and flags overdue/risky tasks."""
    task_repo = TaskRepository(clean_db)
    act_repo = ActivityRepository(clean_db)
    now = datetime.now(timezone.utc)

    # 1. Overdue task
    task_repo.create(
        Task(
            user_id="test_bg_user",
            title="Overdue Client Deliverable",
            priority=10,
            deadline=now - timedelta(hours=2),
            status=TaskStatus.OPEN,
        )
    )

    # 2. Risky task: scheduled completion exceeds deadline
    task_repo.create(
        Task(
            user_id="test_bg_user",
            title="Risky Compliance Audit",
            priority=7,
            deadline=now + timedelta(hours=6),
            scheduled_end=now + timedelta(hours=8),
            status=TaskStatus.OPEN,
        )
    )

    # 3. Far-future task (outside horizon)
    task_repo.create(
        Task(
            user_id="test_bg_user",
            title="Next Month Roadmap",
            priority=3,
            deadline=now + timedelta(days=20),
            status=TaskStatus.OPEN,
        )
    )

    res = await _deadline_check(user_id="test_bg_user", horizon_hours=48)
    assert res["status"] == "completed"
    assert res["at_risk_count"] == 2

    titles = [t["title"] for t in res["at_risk_tasks"]]
    assert "Overdue Client Deliverable" in titles
    assert "Risky Compliance Audit" in titles
    assert "Next Month Roadmap" not in titles

    # Verify notifications logged
    acts = act_repo.list_recent(user_id="test_bg_user", limit=10)
    alert_acts = [a for a in acts if a.event_type == "notification.deadline_alert"]
    assert len(alert_acts) == 2


@pytest.mark.asyncio
async def test_email_scan_workflow(clean_db):
    """email_scan processes pending email source events into commitments."""
    event_repo = SourceEventRepository(clean_db)
    act_repo = ActivityRepository(clean_db)

    # Seed an unprocessed email event with commitment language
    email_body = (
        "Hi Alex, I will deliver the finalized quarterly roadmap to you by tomorrow 5pm. "
        "Best, Sarah"
    )
    ev = SourceEvent(
        source_id="gmail_work",
        user_id="test_bg_user",
        event_type="email.received",
        external_event_id="msg_quarterly_roadmap_001",
        payload={
            "subject": "Quarterly Roadmap Delivery",
            "from": "sarah@example.com",
            "body": email_body,
        },
        processing_status=ProcessingStatus.RECEIVED,
    )
    event_repo.save_event(ev)

    res = await _email_scan(user_id="test_bg_user")
    assert res["status"] == "completed"
    assert res["scanned_count"] >= 1
    assert res["processed_count"] >= 1

    # Check activity was logged
    acts = act_repo.list_recent(user_id="test_bg_user", limit=10)
    assert any(a.event_type.startswith("notification") or a.actor_type == ActorType.OS for a in acts)


@pytest.mark.asyncio
async def test_approval_nag_workflow(clean_db):
    """approval_nag reminds about approvals waiting longer than threshold."""
    approval_repo = ActionApprovalRepository(clean_db)
    act_repo = ActivityRepository(clean_db)
    now = datetime.now(timezone.utc)

    # Old action & approval (waiting 25 minutes ago)
    old_act = Action(
        user_id="test_bg_user",
        tool_name="send_vendor_payment",
        risk_level=RiskLevel.HIGH,
        arguments={"amount": 5000},
        arguments_hash="hash_old_1",
        status=ActionStatus.WAITING_APPROVAL,
        idempotency_key="key_old_1",
    )
    approval_repo.create_action(old_act)
    old_approval = Approval(
        action_id=old_act.id,
        user_id="test_bg_user",
        arguments_hash="hash_old_1",
        status=ApprovalStatus.PENDING,
        requested_at=now - timedelta(minutes=25),
        expires_at=now + timedelta(hours=1),
    )
    approval_repo.create_approval(old_approval)

    # Fresh action & approval (waiting 2 minutes ago)
    fresh_act = Action(
        user_id="test_bg_user",
        tool_name="deploy_hotfix",
        risk_level=RiskLevel.HIGH,
        arguments={"service": "api"},
        arguments_hash="hash_fresh_2",
        status=ActionStatus.WAITING_APPROVAL,
        idempotency_key="key_fresh_2",
    )
    approval_repo.create_action(fresh_act)
    fresh_approval = Approval(
        action_id=fresh_act.id,
        user_id="test_bg_user",
        arguments_hash="hash_fresh_2",
        status=ApprovalStatus.PENDING,
        requested_at=now - timedelta(minutes=2),
        expires_at=now + timedelta(hours=1),
    )
    approval_repo.create_approval(fresh_approval)

    # Nag with threshold 10 minutes (600s)
    res = await _approval_nag(user_id="test_bg_user", nag_after_seconds=600)
    assert res["status"] == "completed"
    assert res["pending_count"] == 2
    assert res["nagged_count"] == 1
    assert res["nagged"][0]["tool_name"] == "send_vendor_payment"

    # Verify nag activity logged
    acts = act_repo.list_recent(user_id="test_bg_user", limit=10)
    nag_acts = [a for a in acts if a.event_type == "notification.approval_nag"]
    assert len(nag_acts) == 1
    assert "send_vendor_payment" in nag_acts[0].summary


@pytest.mark.asyncio
async def test_watcher_eval_workflow(clean_db):
    """watcher_eval detects state conditions and generates suggestions."""
    approval_repo = ActionApprovalRepository(clean_db)
    act_repo = ActivityRepository(clean_db)
    now = datetime.now(timezone.utc)

    # Seed an aging approval
    act = Action(
        user_id="test_bg_user",
        tool_name="delete_staging_db",
        risk_level=RiskLevel.HIGH,
        arguments={"env": "staging"},
        arguments_hash="hash_del_staging",
        status=ActionStatus.WAITING_APPROVAL,
        idempotency_key="key_del_staging",
    )
    approval_repo.create_action(act)
    app = Approval(
        action_id=act.id,
        user_id="test_bg_user",
        arguments_hash="hash_del_staging",
        status=ApprovalStatus.PENDING,
        requested_at=now - timedelta(minutes=15),
        expires_at=now + timedelta(hours=1),
    )
    approval_repo.create_approval(app)

    # Seed 2 failed activities to trigger failure cluster check
    act_repo.log(
        Activity(
            user_id="test_bg_user",
            actor_type=ActorType.OS,
            event_type="action.failed",
            summary="API connection failed timeout",
        )
    )
    act_repo.log(
        Activity(
            user_id="test_bg_user",
            actor_type=ActorType.OS,
            event_type="action.failed",
            summary="Database lock timeout error",
        )
    )

    res = await _watcher_eval(user_id="test_bg_user")
    assert res["status"] == "completed"
    assert res["suggestions_count"] >= 1

    kinds = [s["kind"] for s in res["suggestions"]]
    assert "aging_approvals" in kinds or "recent_failures" in kinds

    # Verify suggestion activities logged
    acts = act_repo.list_recent(user_id="test_bg_user", limit=10)
    sug_acts = [a for a in acts if a.event_type == "notification.watcher_suggestion"]
    assert len(sug_acts) >= 1


@pytest.mark.asyncio
async def test_os_scheduler_lifecycle_and_run_job_now(clean_db):
    """OSScheduler lists registered jobs and can execute them on demand."""
    task_repo = TaskRepository(clean_db)
    task_repo.create(
        Task(
            user_id="test_bg_user",
            title="Scheduled Health Check",
            priority=5,
            status=TaskStatus.OPEN,
        )
    )

    scheduler = OSScheduler()
    jobs = scheduler.list_jobs()
    job_names = [j["name"] for j in jobs]
    assert "morning_plan" in job_names
    assert "email_scan" in job_names
    assert "deadline_check" in job_names
    assert "approval_nag" in job_names
    assert "watcher_eval" in job_names

    # Run morning plan via scheduler
    res = await scheduler.run_job_now("morning_plan", user_id="test_bg_user")
    assert res["status"] == "completed"
    assert res["scheduled_count"] >= 1

    history = scheduler.get_history()
    assert len(history) == 1
    assert history[0]["job"] == "morning_plan"
    assert history[0]["triggered"] == "manual"
