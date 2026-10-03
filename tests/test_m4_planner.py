"""Test Suite for Milestone 4: Planning + Replanning.

Enforces:
1. Fundamental Invariant: DEADLINE != PLAN DATE (deadlines remain 100% untouched).
2. Calendar busy intervals (10:00-11:00, 14:00-16:00) are carved out and never overlapped.
3. Topological dependency ordering: Task C depends on Task B -> Task B must execute before Task C.
4. Automatic replanning when new calendar event arrives, preserving existing busy slots + new event.
5. Exclusion of WAITING/BLOCKED tasks.
6. Deadline risk detection in why_now operational rationale.
"""
from datetime import date, datetime, timedelta, timezone
import pytest

from server.domain.entities import Dependency, Task
from server.domain.enums import DependencyStatus, DependencyType, TaskStatus
from server.planner.engine import CalendarEventSlot, PlannerEngine, TimeSlot
from server.db.database import get_db
from server.db.repositories.core import (
    DependencyRepository,
    PlanRepository,
    TaskRepository,
)


@pytest.fixture
def clean_db():
    db = get_db()
    with db.transaction() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO users (id, email, display_name, created_at, updated_at) "
            "VALUES ('test_planner_user', 'planner@local.os', 'Planner User', datetime('now'), datetime('now'))"
        )
        conn.execute("DELETE FROM plan_items WHERE plan_id IN (SELECT id FROM plans WHERE user_id = 'test_planner_user')")
        conn.execute("DELETE FROM plans WHERE user_id = 'test_planner_user'")
        conn.execute("DELETE FROM dependencies WHERE user_id = 'test_planner_user'")
        conn.execute("DELETE FROM tasks WHERE user_id = 'test_planner_user'")
    yield db
    with db.transaction() as conn:
        conn.execute("DELETE FROM plan_items WHERE plan_id IN (SELECT id FROM plans WHERE user_id = 'test_planner_user')")
        conn.execute("DELETE FROM plans WHERE user_id = 'test_planner_user'")
        conn.execute("DELETE FROM dependencies WHERE user_id = 'test_planner_user'")
        conn.execute("DELETE FROM tasks WHERE user_id = 'test_planner_user'")


@pytest.fixture
def planner(clean_db):
    return PlannerEngine()


def test_realistic_planning_and_replanning_scenario(clean_db, planner):
    """Exact test specification from user:
    Task A: deadline -> Oct 10, duration -> 2h (120 min)
    Task B: deadline -> Oct 8, duration -> 1h (60 min)
    Task C: depends on B, duration -> 1.5h (90 min)
    Calendar: 10:00-11:00 busy, 14:00-16:00 busy
    Generate plan -> new event arrives -> replan -> deadlines untouched.
    """
    user_id = "test_planner_user"
    target_date = date(2026, 10, 5)

    task_repo = TaskRepository(clean_db)
    dep_repo = DependencyRepository(clean_db)

    # 1. Create Tasks with strict external deadlines
    deadline_b = datetime(2026, 10, 8, 17, 0, tzinfo=timezone.utc)
    deadline_a = datetime(2026, 10, 10, 17, 0, tzinfo=timezone.utc)

    task_b = Task(
        user_id=user_id,
        title="Task B: Prep Materials",
        estimated_duration_minutes=60,
        deadline=deadline_b,
        priority=2,
        status=TaskStatus.OPEN,
    )
    task_repo.create(task_b)

    task_a = Task(
        user_id=user_id,
        title="Task A: Big Feature Dev",
        estimated_duration_minutes=120,
        deadline=deadline_a,
        priority=1,
        status=TaskStatus.OPEN,
    )
    task_repo.create(task_a)

    task_c = Task(
        user_id=user_id,
        title="Task C: Review Materials (Depends on B)",
        estimated_duration_minutes=90,
        deadline=deadline_a,
        priority=3,
        status=TaskStatus.OPEN,
    )
    task_repo.create(task_c)

    # Task C depends on Task B
    dep = Dependency(
        user_id=user_id,
        task_id=task_c.id,
        depends_on_task_id=task_b.id,
        dependency_type=DependencyType.TASK,
        status=DependencyStatus.PENDING,
    )
    dep_repo.create(dep)

    # 2. Define Initial Busy Calendar Slots
    # Day starts at 09:00 UTC
    # 10:00-11:00 busy
    # 14:00-16:00 busy
    slot_10_11 = CalendarEventSlot(
        title="Morning Standup",
        start=datetime(2026, 10, 5, 10, 0, tzinfo=timezone.utc),
        end=datetime(2026, 10, 5, 11, 0, tzinfo=timezone.utc),
    )
    slot_14_16 = CalendarEventSlot(
        title="Client Workshop",
        start=datetime(2026, 10, 5, 14, 0, tzinfo=timezone.utc),
        end=datetime(2026, 10, 5, 16, 0, tzinfo=timezone.utc),
    )
    initial_busy = [slot_10_11, slot_14_16]

    # 3. Generate Initial Daily Plan
    plan, items = planner.create_daily_plan(
        user_id, target_date=target_date, calendar_busy_slots=initial_busy
    )

    assert len(items) == 3

    # Check dependency invariant: Task B must be scheduled before Task C
    item_map = {it.task_id: it for it in items}
    item_b = item_map[task_b.id]
    item_c = item_map[task_c.id]
    item_a = item_map[task_a.id]

    # Task B ends BEFORE Task C starts!
    assert item_b.scheduled_end <= item_c.scheduled_start, (
        f"Dependency violated: Task B ({item_b.scheduled_start}..{item_b.scheduled_end}) "
        f"must end before Task C starts ({item_c.scheduled_start}..{item_c.scheduled_end})"
    )

    # Check calendar busy invariant: No task may overlap with 10:00-11:00 or 14:00-16:00
    for it in items:
        t_slot = TimeSlot(it.scheduled_start, it.scheduled_end)
        assert not t_slot.overlaps(TimeSlot(slot_10_11.start, slot_10_11.end)), (
            f"Task {it.task_id} overlaps with busy slot 10:00-11:00!"
        )
        assert not t_slot.overlaps(TimeSlot(slot_14_16.start, slot_14_16.end)), (
            f"Task {it.task_id} overlaps with busy slot 14:00-16:00!"
        )

    # 4. Check Deadline Immutability: tasks in DB still have exact same deadlines
    db_task_b = task_repo.get(task_b.id, user_id)
    db_task_a = task_repo.get(task_a.id, user_id)
    assert db_task_b.deadline == deadline_b
    assert db_task_a.deadline == deadline_a

    # 5. New Calendar Event Arrives creating a conflict:
    # A new urgent meeting is booked at 09:00 - 10:00 UTC (where Task B was originally scheduled)
    new_event = CalendarEventSlot(
        title="Emergency Sync",
        start=datetime(2026, 10, 5, 9, 0, tzinfo=timezone.utc),
        end=datetime(2026, 10, 5, 10, 0, tzinfo=timezone.utc),
    )

    # Replan!
    new_plan, new_items = planner.replan_on_conflict(
        user_id,
        target_date=target_date,
        conflicting_event=new_event,
        existing_busy_slots=initial_busy,
    )

    assert len(new_items) == 3

    # All 3 calendar events (09-10, 10-11, 14-16) must now be respected!
    for it in new_items:
        t_slot = TimeSlot(it.scheduled_start, it.scheduled_end)
        assert not t_slot.overlaps(TimeSlot(new_event.start, new_event.end))
        assert not t_slot.overlaps(TimeSlot(slot_10_11.start, slot_10_11.end))
        assert not t_slot.overlaps(TimeSlot(slot_14_16.start, slot_14_16.end))

    # Dependency invariant still holds after replanning
    replan_map = {it.task_id: it for it in new_items}
    assert replan_map[task_b.id].scheduled_end <= replan_map[task_c.id].scheduled_start

    # External deadlines remain strictly untouched after replanning!
    replan_task_b = task_repo.get(task_b.id, user_id)
    replan_task_a = task_repo.get(task_a.id, user_id)
    assert replan_task_b.deadline == deadline_b
    assert replan_task_a.deadline == deadline_a


def test_waiting_and_blocked_tasks_are_excluded(clean_db, planner):
    """Tasks in WAITING or BLOCKED status must never be scheduled."""
    user_id = "test_planner_user"
    task_repo = TaskRepository(clean_db)

    task_blocked = Task(
        user_id=user_id,
        title="Blocked Task",
        estimated_duration_minutes=60,
        status=TaskStatus.BLOCKED,
    )
    task_repo.create(task_blocked)

    task_waiting = Task(
        user_id=user_id,
        title="Waiting Task",
        estimated_duration_minutes=60,
        status=TaskStatus.WAITING,
    )
    task_repo.create(task_waiting)

    plan, items = planner.create_daily_plan(user_id, target_date=date(2026, 10, 5))
    assert len(items) == 0


def test_deadline_risk_flagging(clean_db, planner):
    """If scheduled end exceeds deadline, deadline_risk is flagged in why_now."""
    user_id = "test_planner_user"
    task_repo = TaskRepository(clean_db)

    # Task deadline is 09:30 AM, but duration is 60 min (starts 09:00 -> ends 10:00)
    tight_deadline = datetime(2026, 10, 5, 9, 30, tzinfo=timezone.utc)
    task = Task(
        user_id=user_id,
        title="Overdue Task",
        estimated_duration_minutes=60,
        deadline=tight_deadline,
        status=TaskStatus.OPEN,
    )
    task_repo.create(task)

    plan, items = planner.create_daily_plan(user_id, target_date=date(2026, 10, 5))
    assert len(items) == 1
    why_now = items[0].why_now
    assert why_now["deadline_risk"] is True
    assert why_now["overdue_by_minutes"] == 30
    assert "WARNING" in why_now["rationale"]
