# OS Architecture Migration Plan

This plan outlines how OS evolves into the complete Personal Operating System defined in the PRD and TRD while preserving all existing functionality.

## Core Migration Principles

1. **Non-destructive Extension**:
   Existing SQLite databases (`data/os_state.db`, `data/dashboard.db`, `data/approvals.db`, `data/om.db`, `memory/os_memory.db`) remain fully functional. The new unified domain architecture wraps and unifies these stores through a domain repository layer.

2. **Decoupled Architecture**:
   - OS owns the World Model, Commitments, Tasks, Deadlines, Dependencies, Evidence, Planning, Policy, Approvals, Verification, Provenance, and Replanning.
   - External agents and frameworks are specialized adapters:
     - `Laya`: Fast routing and classification (<100ms).
     - `OpenCode`: Specialized coding execution worker in an isolated workspace.
     - `Browser Use`: Browser automation worker.
     - `Researcher`: Multi-source research with structured citations.
     - `OpenMuse / OpenDots / OpenBot`: Durable background workers and computer execution.

3. **Incremental Milestones**:

### Milestone 1: Domain Core & Unified Models (`server/domain/`)
- Define first-class entities: `Commitment`, `Task`, `Goal`, `Project`, `Person`, `Dependency`, `Evidence`, `Plan`, `PlanItem`, `Action`, `Approval`, `VerificationResult`, `Activity`, `Memory`, `Source`, `SourceEvent`, `AgentRun`, `WorkflowRun`.
- Enforce strict separation between external immutable `deadline` and planner-controlled `scheduled_start`/`scheduled_end`.
- Implement `CommitmentService` and `TaskService` with deterministic state machines.

### Milestone 2: Universal Ingestion Pipeline (`server/ingestion/`)
- Normalize all incoming connector data into `SourceEvent` records.
- Implement `Observer` (rules + Laya) -> `Extractor` (typed Pydantic) -> `ContextRetriever` -> `Verifier` -> `Linker`.
- Guarantee idempotency via `source_id + external_event_id` unique constraints.

### Milestone 3: Deterministic Planner & Calendar (`server/planner/`)
- Implement constraint-based planner allocating work slots without altering external deadlines.
- Detect calendar conflicts and trigger automated replanning.
- Generate operational "Why now?" explanations.

### Milestone 4: Controlled Execution, Policy & Verification (`server/execution/`)
- Unify tool registry with risk tiers (`LOW`, `MEDIUM`, `HIGH`).
- Enforce policy gates (`ALLOW`, `DENY`, `REQUIRE_APPROVAL`).
- Cryptographically bind approvals to `tool + arguments_hash`.
- Enforce postcondition verification before marking actions succeeded or tasks completed.

### Milestone 5: OpenCode Adapter & Specialized Workers (`adapters/`)
- `adapters/opencode/`: Implement `CodingWorker` interface for repo inspection, bug fixing, test running, and diff reporting with independent OS verification.
- `adapters/browser/`: Connect browser execution worker.
- `adapters/research/`: Connect research agent with provenance.

### Milestone 6: Web Dashboard & Control Center Integration (`web/`)
- Implement REST API endpoints (`/api/v1/home`, `/api/v1/inbox`, `/api/v1/commitments`, `/api/v1/tasks`, `/api/v1/plan`, `/api/v1/people`, `/api/v1/projects`, `/api/v1/agents`, `/api/v1/activity`, `/api/v1/approvals`).
- Wire the dashboard UI so the user experiences one unified assistant.
