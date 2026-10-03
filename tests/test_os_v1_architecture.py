"""Comprehensive End-to-End Integration Test Suite for OS V1 Architecture.

Exercises the complete OS control plane invariants:
- Vertical Slice 1: Universal Ingestion Pipeline & Relational Linking (Observer -> Extractor -> Verifier -> Linker -> Commitment -> Task -> Home).
- Vertical Slice 2: Planner Schedule vs External Deadline Invariant & Conflict Replanning (Deadline immutable, plan dates shift).
- Vertical Slice 3: Policy, Cryptographic Argument-Bound Approvals & Independent Postcondition Verification.
- Vertical Slice 4: OpenCode Specialized Coding Worker in Isolated Sandbox.
- Vertical Slice 5: Dependency Graph Resolution & Automatic Unblocking.
- Vertical Slice 6: FastAPI REST Endpoints (v1).
"""
import shutil
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from adapters.opencode.adapter import OpenCodeAdapter
from adapters.opencode.verifier import OpenCodeVerifier
from adapters.opencode.workspace import WorkspaceManager
from server.ai.agent_router import AgentRouter
from server.api.v1.home import HomeQueryService
from server.db.database import DatabaseEngine
from server.db.repositories.core import (
    ActionApprovalRepository,
    ActivityRepository,
    CommitmentRepository,
    DependencyRepository,
    PlanRepository,
    SourceEventRepository,
    TaskRepository,
)
from server.db.repositories.world import WorldModelRepository
from server.domain.entities import (
    Action,
    SourceEvent,
)
from server.domain.enums import (
    ApprovalStatus,
    CommitmentStatus,
    DependencyType,
    RiskLevel,
    TaskStatus,
)
from server.domain.services.commitment_service import CommitmentService
from server.domain.services.task_service import TaskService
from server.execution.approval import (
    ApprovalEngine,
    ApprovalTamperedError,
    compute_arguments_hash,
)
from server.execution.completion import CompletionEngine
from server.execution.policy import PolicyDecision, PolicyEngine
from server.ingestion.context import ContextRetriever
from server.ingestion.linker import EntityLinker
from server.ingestion.pipeline import IngestionPipeline
from server.planner.engine import CalendarEventSlot, PlannerEngine
from web.server import app


@pytest.fixture
def temp_db():
    """Provides a fresh isolated SQLite database with schema initialized."""
    tmp_dir = tempfile.mkdtemp(prefix="os_test_db_")
    db_file = Path(tmp_dir) / "test_os.db"
    db = DatabaseEngine(db_file)
    yield db
    shutil.rmtree(tmp_dir, ignore_errors=True)


@pytest.fixture
def test_client():
    return TestClient(app)


# =============================================================================
# VERTICAL SLICE 1: Universal Ingestion Pipeline & Relational Linking
# =============================================================================
def test_vertical_slice_1_universal_ingestion(temp_db):
    """Verifies: SourceEvent -> Observer -> Extractor -> Verifier -> Linker -> Commitment -> Task -> Home."""
    user_id = "default_user"
    com_repo = CommitmentRepository(temp_db)
    task_repo = TaskRepository(temp_db)
    act_repo = ActivityRepository(temp_db)
    dep_repo = DependencyRepository(temp_db)
    event_repo = SourceEventRepository(temp_db)

    world_repo = WorldModelRepository(temp_db)
    com_service = CommitmentService(repo=com_repo, activity_repo=act_repo, world_repo=world_repo)
    task_service = TaskService(repo=task_repo, dep_repo=dep_repo, activity_repo=act_repo)
    linker = EntityLinker(world_repo=world_repo)
    context = ContextRetriever(world_repo=world_repo, commitment_repo=com_repo, task_repo=task_repo)

    pipeline = IngestionPipeline(
        event_repo=event_repo,
        context_retriever=context,
        linker=linker,
        commitment_service=com_service,
        task_service=task_service,
    )
    home_service = HomeQueryService(db=temp_db)

    # 1. Ingest an incoming email containing a commitment and deadline
    event = SourceEvent(
        source_id="gmail_connector",
        user_id=user_id,
        event_type="email.received",
        external_event_id="msg_test_arch_001",
        payload={
            "subject": "Urgent: Complete system architectural review by Friday",
            "body": "Hi Sai, please review and approve the new distributed architecture by Friday with Alice.",
        },
    )

    result = pipeline.process_event(event)

    assert result.status == "created", f"Pipeline rejected event: {result.reason}"
    assert result.commitment is not None
    assert "architectural review" in result.commitment.title.lower()
    assert result.commitment.status == CommitmentStatus.OPEN

    # Verify derived task
    assert result.task is not None
    assert result.task.commitment_id == result.commitment.id
    assert result.task.status == TaskStatus.OPEN

    # Verify home view reflects the new items
    home_view = home_service.get_home_view(user_id)
    assert len(home_view["upcoming_deadlines"]) >= 1
    assert any("architectural review" in d["title"].lower() for d in home_view["upcoming_deadlines"])

    # 2. Idempotency test: Re-ingesting the exact same event must not duplicate
    re_result = pipeline.process_event(event)
    assert re_result.status in ("duplicate", "rejected")

    # Ensure no duplicate commitment was created
    all_comms = com_repo.list_by_user(user_id)
    matching = [c for c in all_comms if "architectural review" in c.title.lower()]
    assert len(matching) == 1, "Duplicate commitment created on re-ingestion!"


# =============================================================================
# VERTICAL SLICE 2: Planner Schedule vs External Deadline Invariant
# =============================================================================
def test_vertical_slice_2_planner_schedule_vs_deadline_invariant(temp_db):
    """Verifies: External deadline is immutable; planner allocates plan dates and shifts on conflict without mutating deadline."""
    user_id = "default_user"
    task_repo = TaskRepository(temp_db)
    com_repo = CommitmentRepository(temp_db)
    plan_repo = PlanRepository(temp_db)
    act_repo = ActivityRepository(temp_db)
    dep_repo = DependencyRepository(temp_db)

    task_service = TaskService(repo=task_repo, dep_repo=dep_repo, activity_repo=act_repo)
    planner = PlannerEngine(
        task_repo=task_repo,
        commitment_repo=com_repo,
        plan_repo=plan_repo,
        activity_repo=act_repo,
    )

    # 1. Create a task with an external target deadline 3 days in the future
    immutable_deadline = datetime.now(timezone.utc) + timedelta(days=3)
    task = task_service.create_task(
        user_id=user_id,
        title="Finalize TRD Security Specifications",
        priority=80,
        estimated_duration_minutes=90,
        deadline=immutable_deadline,
    )

    # 2. Generate initial daily plan for today
    today = datetime.now(timezone.utc).date()
    plan, items = planner.create_daily_plan(user_id, target_date=today)

    assert len(items) >= 1
    scheduled_item = next(it for it in items if it.task_id == task.id)
    initial_start = scheduled_item.scheduled_start
    initial_end = scheduled_item.scheduled_end
    assert initial_start is not None
    assert initial_end is not None

    # INVARIANT CHECK: task.deadline remains strictly equal to immutable_deadline
    task_fresh = task_repo.get(task.id, user_id)
    assert task_fresh.deadline == immutable_deadline
    assert task_fresh.deadline != initial_start  # Deadline is external, start is scheduled

    # 3. Simulate a calendar conflict (e.g. an urgent meeting occupying the initial slot)
    conflict_slot = CalendarEventSlot(
        title="Emergency Leadership Sync",
        start=initial_start,
        end=initial_end,
    )
    replanned_plan, replanned_items = planner.replan_on_conflict(
        user_id=user_id,
        target_date=today,
        conflicting_event=conflict_slot,
    )

    # The task must be replanned to a new non-conflicting time window
    replanned_item = next(it for it in replanned_items if it.task_id == task.id)
    assert replanned_item.scheduled_start >= initial_end, "Task was not shifted past the conflicting meeting!"

    # CRUCIAL ARCHITECTURAL INVARIANT CHECK: External deadline is STILL completely unchanged
    task_after_replan = task_repo.get(task.id, user_id)
    assert task_after_replan.deadline == immutable_deadline, "Replan illegally mutated the external deadline!"
    assert replanned_item.why_now is not None


# =============================================================================
# VERTICAL SLICE 3: Policy, Cryptographic Argument-Bound Approvals & Verification
# =============================================================================
def test_vertical_slice_3_policy_crypto_approvals_verification(temp_db):
    """Verifies: Policy gate -> Hash bound approval -> Anti-tampering -> Independent postcondition verification."""
    user_id = "default_user"
    task_repo = TaskRepository(temp_db)
    dep_repo = DependencyRepository(temp_db)
    act_repo = ActivityRepository(temp_db)
    appr_repo = ActionApprovalRepository(temp_db)

    task_service = TaskService(repo=task_repo, dep_repo=dep_repo, activity_repo=act_repo)
    policy_engine = PolicyEngine(autonomy_level="balanced")
    approval_engine = ApprovalEngine(approval_repo=appr_repo, activity_repo=act_repo)
    completion_engine = CompletionEngine(task_service=task_service, task_repo=task_repo, activity_repo=act_repo)

    # 1. Create a task requiring external write
    task = task_service.create_task(
        user_id=user_id,
        title="Deploy Hotfix to Production",
        priority=95,
        estimated_duration_minutes=30,
    )

    raw_args = {"branch": "main", "force": False, "commit": "sha_12345"}
    action = Action(
        user_id=user_id,
        task_id=task.id,
        tool_name="git_push_production",
        risk_level=RiskLevel.HIGH,
        arguments=raw_args,
        arguments_hash=compute_arguments_hash(raw_args),
        idempotency_key="idemp_hotfix_001",
    )

    # 2. Policy check: HIGH risk must require approval
    decision = policy_engine.evaluate(action, user_id)
    assert decision.verdict == "REQUIRE_APPROVAL"

    # 3. Request approval and compute cryptographic argument hash
    action_rec, approval = approval_engine.request_approval(
        user_id=user_id,
        tool_name=action.tool_name,
        arguments=raw_args,
        task_id=task.id,
        risk_level=RiskLevel.HIGH,
    )
    assert approval.status == ApprovalStatus.PENDING
    assert approval.arguments_hash is not None

    # 4. Tamper Attack Test: Attempt to approve with modified parameters
    tampered_args = {"branch": "main", "force": True, "commit": "sha_evil"}
    with pytest.raises(ApprovalTamperedError):
        approval_engine.approve(approval.id, tampered_args, user_id)

    # 5. Legitimate Approval: Exact arguments match hash
    success = approval_engine.approve(approval.id, raw_args, user_id)
    assert success is True

    with temp_db.connection() as conn:
        row = conn.execute("SELECT status FROM approvals WHERE id = ?", (approval.id,)).fetchone()
        assert row is not None
        assert row["status"] == ApprovalStatus.APPROVED.value

    # 6. Completion Engine: Cannot complete without external receipt
    task_cand, verified, msg = completion_engine.request_completion(
        task_id=task.id,
        user_id=user_id,
        evidence_receipt=None,  # Missing proof
    )
    assert not verified, "Task should not be verified without proof"
    assert task_cand.status == TaskStatus.COMPLETION_CANDIDATE

    # Now provide valid external verification receipt
    task_comp, verified_ok, msg_ok = completion_engine.request_completion(
        task_id=task.id,
        user_id=user_id,
        evidence_receipt={"verified": True, "tests_passed": True, "exit_code": 0},
    )
    assert verified_ok is True
    assert task_comp.status == TaskStatus.COMPLETED


# =============================================================================
# VERTICAL SLICE 4: OpenCode Specialized Coding Worker in Sandbox
# =============================================================================
def test_vertical_slice_4_opencode_coding_worker_sandbox(temp_db):
    """Verifies: OpenCode sandboxed execution, code modification, and independent OS verification."""
    user_id = "default_user"
    sandbox_dir = tempfile.mkdtemp(prefix="opencode_test_sandbox_")

    try:
        ws_mgr = WorkspaceManager(base_workspace_root=Path(sandbox_dir))
        adapter = OpenCodeAdapter(workspace_manager=ws_mgr)
        world_repo = WorldModelRepository(temp_db)
        router = AgentRouter(opencode_adapter=adapter, world_repo=world_repo)

        # 1. Execute task via AgentRouter
        result = router.route_task(
            task_type="coding",
            instruction="Implement a math utility module with sum and multiply functions",
            user_id=user_id,
            parameters={
                "edits": {
                    "math_utils.py": "def add(a, b):\n    return a + b\n\ndef multiply(a, b):\n    return a * b\n",
                },
                "test_cmd": "python -c \"import math_utils; assert math_utils.add(2, 3) == 5\"",
            },
        )

        assert result["status"] == "SUCCEEDED"
        run_id = result["run_id"]
        assert run_id is not None

        # 2. Independent OS Verification (outside worker's own claim)
        run_data = adapter._runs[adapter._runs and list(adapter._runs.keys())[-1]]
        ws_path = run_data["workspace"]
        created_file = ws_path / "math_utils.py"
        assert created_file.exists()
        assert "def add(a, b):" in created_file.read_text(encoding="utf-8")

        verifier = OpenCodeVerifier()
        mock_exec_res = adapter.execute_sync(
            run_data["run_id"],
            edits={"math_utils.py": created_file.read_text(encoding="utf-8")},
            test_cmd="python -c \"import math_utils; assert math_utils.add(2, 3) == 5\"",
        )
        report = verifier.verify(mock_exec_res, ws_path)
        assert report.verified is True
        assert report.status == "VERIFIED"

        # 3. Check agent run recorded in DB
        with temp_db.connection() as conn:
            row = conn.execute("SELECT agent_type, status FROM agent_runs WHERE user_id = ?", (user_id,)).fetchone()
            assert row is not None
            assert row["agent_type"] == "coding"
            assert row["status"] == "SUCCEEDED"

    finally:
        shutil.rmtree(sandbox_dir, ignore_errors=True)


# =============================================================================
# VERTICAL SLICE 5: Dependency Graph Resolution & Automatic Unblocking
# =============================================================================
def test_vertical_slice_5_dependency_graph_resolution(temp_db):
    """Verifies: Task A blocks Task B -> Task B blocked -> Completing A resolves dependency -> B unblocks to OPEN."""
    user_id = "default_user"
    task_repo = TaskRepository(temp_db)
    dep_repo = DependencyRepository(temp_db)
    act_repo = ActivityRepository(temp_db)
    task_service = TaskService(repo=task_repo, dep_repo=dep_repo, activity_repo=act_repo)

    # 1. Create two tasks
    task_a = task_service.create_task(user_id=user_id, title="Task A: Generate Schema Migration")
    task_b = task_service.create_task(user_id=user_id, title="Task B: Run Data Migration")

    # 2. Add blocking dependency: Task A blocks Task B
    dep = task_service.add_dependency(
        user_id=user_id,
        task_id=task_b.id,
        depends_on_task_id=task_a.id,
        dependency_type=DependencyType.TASK,
        description="Cannot run migration before schema is generated",
    )

    fresh_b = task_repo.get(task_b.id, user_id)
    assert fresh_b.status == TaskStatus.WAITING, "Task B did not transition to WAITING"

    # 3. Resolve dependency (e.g. Task A completed)
    task_service.resolve_dependency(dep.id, user_id=user_id)

    # 4. Verify Task B is automatically unblocked
    unblocked_b = task_repo.get(task_b.id, user_id)
    assert unblocked_b.status == TaskStatus.OPEN, "Task B was not unblocked to OPEN"


# =============================================================================
# VERTICAL SLICE 6: FastAPI REST Endpoints (v1)
# =============================================================================
def test_vertical_slice_6_fastapi_endpoints(test_client):
    """Verifies HTTP responses for all /api/v1 routes."""
    # 1. Home view
    r = test_client.get("/api/v1/home")
    assert r.status_code == 200
    home_data = r.json()
    assert "now" in home_data
    assert "today_plan" in home_data
    assert "upcoming_deadlines" in home_data

    # 2. Commitments list and creation
    r = test_client.get("/api/v1/commitments")
    assert r.status_code == 200
    assert "commitments" in r.json()

    r = test_client.post(
        "/api/v1/commitments",
        json={"title": "Deliver Q4 Roadmap", "priority": 75},
    )
    assert r.status_code == 200
    assert r.json()["ok"] is True
    comm_id = r.json()["commitment"]["id"]

    # 3. Tasks list and creation
    r = test_client.post(
        "/api/v1/tasks",
        json={"title": "Draft Architecture Diagram", "commitment_id": comm_id, "priority": 70},
    )
    assert r.status_code == 200
    assert r.json()["ok"] is True
    task_id = r.json()["task"]["id"]

    # 4. Plan generation
    r = test_client.post("/api/v1/plan/generate")
    assert r.status_code == 200
    assert r.json()["ok"] is True

    # 5. Task completion via API with valid verification receipt
    r = test_client.post(
        f"/api/v1/tasks/{task_id}/complete",
        json={"receipt": {"verified": True, "verified_by": "http_test"}},
    )
    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert r.json()["verified"] is True
    assert r.json()["status"] == "COMPLETED"

    # 6. People & Projects
    r = test_client.get("/api/v1/people")
    assert r.status_code == 200

    r = test_client.get("/api/v1/projects")
    assert r.status_code == 200

    r = test_client.get("/api/v1/activity")
    assert r.status_code == 200
