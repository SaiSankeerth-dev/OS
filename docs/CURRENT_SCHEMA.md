# OS Current Schema Audit

This document records the exact state of all persistent databases and tables in `D:\OS` prior to the architecture upgrade.

## 1. Existing Database Stores

### Database 1: `data/os_state.db` (`server/state/store.py`)
- **`tasks`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `title`: TEXT NOT NULL
  - `status`: TEXT NOT NULL DEFAULT 'PENDING'
  - `payload`: TEXT NOT NULL DEFAULT '{}'
  - `created_at`: TEXT NOT NULL
  - `updated_at`: TEXT NOT NULL
- **`task_events`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `task_id`: INTEGER NOT NULL REFERENCES tasks(id)
  - `ts`: TEXT NOT NULL
  - `old_status`: TEXT
  - `new_status`: TEXT NOT NULL
  - `note`: TEXT NOT NULL DEFAULT ''
- **`events`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `ts`: TEXT NOT NULL
  - `kind`: TEXT NOT NULL
  - `source`: TEXT NOT NULL DEFAULT ''
  - `data`: TEXT NOT NULL DEFAULT '{}'
- **`sessions`**:
  - `id`: TEXT PRIMARY KEY
  - `updated_at`: TEXT NOT NULL
  - `state`: TEXT NOT NULL DEFAULT '{}'
- **`approvals`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `ts`: TEXT NOT NULL
  - `skill`: TEXT NOT NULL
  - `input`: TEXT NOT NULL
  - `draft`: TEXT NOT NULL
  - `content_hash`: TEXT NOT NULL
  - `status`: TEXT NOT NULL
- **`suggestions`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `ts`: TEXT NOT NULL
  - `kind`: TEXT NOT NULL
  - `text`: TEXT NOT NULL
  - `seen`: INTEGER NOT NULL DEFAULT 0

### Database 2: `data/approvals.db` (`server/approvals/gate.py`)
- **`runs`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `ts`: TEXT NOT NULL
  - `skill`: TEXT NOT NULL
  - `input`: TEXT NOT NULL
  - `draft`: TEXT NOT NULL
  - `content_hash`: TEXT NOT NULL
  - `status`: TEXT NOT NULL
- **`pending`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `skill`: TEXT NOT NULL
  - `input`: TEXT NOT NULL
  - `draft`: TEXT NOT NULL
  - `approved_hash`: TEXT NOT NULL
  - `run_id`: TEXT NOT NULL DEFAULT ''
  - `created_ts`: REAL NOT NULL

### Database 3: `data/dashboard.db` (`web/store.py`)
- **`connector_state`**:
  - `connector_id`: TEXT PRIMARY KEY
  - `state`: TEXT NOT NULL DEFAULT 'available' (available, granted, connected, setup_error, denied)
  - `scopes`: TEXT NOT NULL DEFAULT '[]'
  - `health_msg`: TEXT NOT NULL DEFAULT ''
  - `health_at`: REAL NOT NULL DEFAULT 0
  - `last_used_at`: REAL NOT NULL DEFAULT 0
  - `updated_at`: REAL NOT NULL DEFAULT 0
- **`connector_credentials`**:
  - `cred_group`: TEXT PRIMARY KEY
  - `label`: TEXT NOT NULL DEFAULT ''
  - `secret`: TEXT NOT NULL DEFAULT '' (encrypted)
  - `updated_at`: REAL NOT NULL DEFAULT 0
- **`connector_settings`**:
  - `connector_id`: TEXT PRIMARY KEY
  - `settings`: TEXT NOT NULL DEFAULT '{}'
  - `updated_at`: REAL NOT NULL DEFAULT 0
- **`connector_actions`**:
  - `id`: TEXT PRIMARY KEY
  - `connector_id`: TEXT NOT NULL
  - `action`: TEXT NOT NULL
  - `label`: TEXT NOT NULL
  - `summary`: TEXT NOT NULL
  - `params`: TEXT NOT NULL DEFAULT '{}'
  - `status`: TEXT NOT NULL DEFAULT 'pending'
  - `result`: TEXT NOT NULL DEFAULT ''
  - `created_at`: REAL NOT NULL
  - `updated_at`: REAL NOT NULL

### Database 4: `data/om.db` (`web/om/store.py`)
- **`activity_runs`**:
  - `id`: TEXT PRIMARY KEY
  - `plan`: TEXT NOT NULL DEFAULT ''
  - `status`: TEXT NOT NULL DEFAULT 'planned'
  - `checkpoint`: TEXT NOT NULL DEFAULT '{}'
  - `lease_owner`: TEXT NOT NULL DEFAULT ''
  - `lease_until`: REAL NOT NULL DEFAULT 0
  - `retry_policy`: TEXT NOT NULL DEFAULT '{}'
  - `retry_count`: INTEGER NOT NULL DEFAULT 0
  - `created_at`: REAL NOT NULL
  - `updated_at`: REAL NOT NULL
- **`activity_events`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `run_id`: TEXT NOT NULL
  - `event`: TEXT NOT NULL
  - `payload`: TEXT NOT NULL DEFAULT '{}'
  - `ts`: REAL NOT NULL
- **`ideas`**:
  - `id`: TEXT PRIMARY KEY
  - `title`: TEXT NOT NULL
  - `summary`: TEXT NOT NULL
  - `evidence`: TEXT NOT NULL DEFAULT '{}'
  - `status`: TEXT NOT NULL DEFAULT 'new' (new, accepted, edited, dismissed)
  - `created_at`: REAL NOT NULL
  - `updated_at`: REAL NOT NULL
- **`goals`**:
  - `id`: TEXT PRIMARY KEY
  - `title`: TEXT NOT NULL
  - `description`: TEXT NOT NULL DEFAULT ''
  - `status`: TEXT NOT NULL DEFAULT 'active'
  - `created_at`: REAL NOT NULL
  - `updated_at`: REAL NOT NULL
- **`milestones`**:
  - `id`: TEXT PRIMARY KEY
  - `goal_id`: TEXT NOT NULL REFERENCES goals(id)
  - `title`: TEXT NOT NULL
  - `done`: INTEGER NOT NULL DEFAULT 0
  - `due_at`: REAL NOT NULL DEFAULT 0
- **`threads`**:
  - `id`: TEXT PRIMARY KEY
  - `name`: TEXT NOT NULL
  - `archived`: INTEGER NOT NULL DEFAULT 0
  - `created_at`: REAL NOT NULL
  - `updated_at`: REAL NOT NULL
- **`thread_messages`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `thread_id`: TEXT NOT NULL REFERENCES threads(id)
  - `role`: TEXT NOT NULL
  - `content`: TEXT NOT NULL
  - `ts`: REAL NOT NULL
- **`notifications`**:
  - `id`: TEXT PRIMARY KEY
  - `title`: TEXT NOT NULL
  - `body`: TEXT NOT NULL
  - `source`: TEXT NOT NULL DEFAULT ''
  - `read`: INTEGER NOT NULL DEFAULT 0
  - `created_at`: REAL NOT NULL

### Database 5: `memory/os_memory.db` (`server/memory/sqlite_impl.py`)
- **`memories`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `ts`: TEXT NOT NULL
  - `key`: TEXT NOT NULL
  - `value`: TEXT NOT NULL
  - `category`: TEXT NOT NULL DEFAULT 'general'
  - `confidence`: REAL NOT NULL DEFAULT 1.0
  - `source`: TEXT NOT NULL DEFAULT 'conversation'

---

## 2. Gaps Addressed by Unified OS Domain Schema

1. **Commitments**: Currently missing as a first-class entity. Commitments were loosely modeled as either tasks or ideas.
2. **Deadlines vs Scheduled Dates**: Current tasks only have `created_at` and `updated_at`. There is no separation between external immutable deadlines and planner-scheduled execution windows.
3. **Explicit Dependencies**: Dependencies were not formally represented in relational tables; tasks could not block on people, approvals, or external events.
4. **SourceEvents Bus**: Each connector/subsystem had separate ad-hoc storage; universal ingestion with stable external IDs and idempotency hashing was missing.
5. **Postcondition Verification**: Verification results were handled in memory or ad-hoc test assertions; the persistent domain model lacked a dedicated `verification_results` entity.
