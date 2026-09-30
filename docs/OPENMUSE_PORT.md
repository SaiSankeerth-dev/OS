# OpenMuse → OS feature port

Source: https://github.com/CopilotKit/openmuse (MIT License,
© 2026 OpenMuse contributors). See `docs/OPENMUSE_ATTRIBUTION.md`.

OS stays local-first, ₹0/$0, no required paid APIs. Anything that needed a
paid service in OpenMuse (CopilotKit Intelligence models, APNs/FCM push,
hosted Render infra) gets a local equivalent or an honest "not ported" note.

## Feature matrix (completed 2026-09-30)

| # | OpenMuse feature | OS before port | Port plan |
|---|---|---|---|
| 1 | Streamed chat (SSE), stop/retry | WORKING (`/api/chat` SSE) | — |
| 2 | Inline tool/artifact cards in chat | PARTIAL (execution info, no cards) | Kept as-is — run cards available in Activity view |
| 3 | Persistent browser sessions + manual takeover | MISSING | Phase 1 — browser panel |
| 4 | Isolated Linux computer, bounded bash/python/node/git | MISSING | Phase 1 — computer service (Docker when present, local sandbox otherwise) |
| 5 | Command receipts (stdout/stderr/exit/truncated) | MISSING | Phase 1 |
| 6 | Persistent workspace files + text editing | MISSING | Phase 1 |
| 7 | Durable delegated tasks: plans, checkpoints, leases, pause/resume/cancel/retry | MISSING (tasks CRUD only) | Phase 2 — activity runs |
| 8 | Ideas with source evidence: accept/edit/dismiss | MISSING | Phase 2 — ideas |
| 9 | Goals + milestones, recurring watches, retry/backoff | PARTIAL (watchers exist) | Phase 2 — goals & milestones |
| 10 | PDF upload / view / form fill / export | PARTIAL (upload only) | Phase 4 — documents |
| 11 | CSV finance summaries | MISSING | Phase 3 — finance |
| 12 | Gmail/Calendar: saved drafts, reviewed versions | WORKING (OAuth connectors, approval-gated sends) | — |
| 13 | Editable identity + forgettable memory | WORKING (`/api/memory`) | — |
| 14 | Durable notification inbox, source-linked alerts | MISSING | Phase 6 — inbox |
| 15 | Main/side threads: rename/archive/restore/replay | MISSING | Phase 5 — threads |
| 16 | Connector capability catalogue | WORKING (15 adapters) | — |

Not ported (incompatible with ₹0 / local-first): CopilotKit cloud models,
device push (APNs/FCM), per-person cloud VM orchestration, hosted deploy
targets. The notification inbox is in-app (OpenMuse's own fallback).

## Module layout (new code)

```
web/om/
  __init__.py        package marker + attribution note
  store.py           SQLite store (data/om.db): all tables for the port
  computer.py        Docker-or-local sandbox computer w/ receipts + workspace files
  browser.py         persistent browser sessions (Playwright or HTTP fallback)
  activity.py        durable runs: plans, checkpoints, leases, pause/resume/cancel/retry
  ideas.py           source-backed ideas: new → accepted / edited / dismissed
  goals.py           goals + milestones (watches stay in existing watcher module)
  finance.py         CSV spending analysis (ported from OpenMuse analyzeSpending)
  documents.py       PDF library: inspect fields, fill, export (pypdf, local)
  threads.py         main/side chat threads: rename / archive / restore / replay
  notifications.py   durable inbox, source-linked, restart reconciliation
  routes.py          FastAPI router, all /api/om/* endpoints
```

## Safety rules for the port

- The computer is the user's own sandbox (their machine / their Docker).
  Commands there run without an approval card — same as their terminal.
- Anything that leaves the machine (email, messages, posts, purchases)
  keeps the existing approval gate: exact content + hash, lifecycle run,
  rejection/expiry = zero handler calls, no silent retry of uncertain writes.
- PDF / web / email content is treated as data, never as instructions.
- Browser/computer autonomy stays manual/visible: the dashboard shows
  sessions and receipts; the agent does not drive them on its own.

## Verification (2026-09-30)

- `tests/test_om_phase1.py`: 14 passed (computer + browser backends).
- `tests/test_om_phases2_6.py`: 13 passed (activity runs/ideas/goals, finance CSV, PDF fill, threads, notifications).
- 21 HTTP route checks via FastAPI TestClient: all passed (create/transition/step/pause/bad-transition/events, idea accept→goal, milestone done, finance upload/summary, PDF upload/info/fill/download, thread replay/archive/restore, notification read/unread-count).
- Headless Chromium against the live dashboard: all 7 new tabs render with real data, zero JS console errors; full UI round-trip verified (new thread → send message → message appears).
- Broader OS regression suite: see commit message.
