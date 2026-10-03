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

## Free-local batch (2026-09-30, same day)

Closed the cheapest OpenMuse gaps with ₹0, local-only tools:

- **Browser console takeover**: per-session JS console + page-error capture (Playwright `console`/`pageerror` listeners, capped at 200 entries), new `GET /api/om/browsers/{sid}/console`, "⌨ Console" button in the Browser tab.
- **Browser PDF download**: `page.pdf()` export, new `GET /api/om/browsers/{sid}/pdf`, "🖨 PDF" button downloads the file.
- **OCR for scanned PDFs**: Tesseract 5 + poppler `pdftoppm` (both installed locally). `page_text` falls back to OCR when a page has no embedded text; responses carry `source: "embedded"|"ocr"` and `ocr_available`. UI shows an "(read with OCR)" note.
- **Telegram push**: `NotifyService.notify(..., telegram=True)` also pushes via the existing Telegram connector (bot token from the credential vault). `GET /api/om/notifications/telegram-status` reports connection state; Inbox tab has a Telegram status line + "Send test" card. Only fires on the user's explicit click.
- **Bug fix found by this batch**: `get_browser()` created a new `BrowserService` (and a new Chromium) per HTTP request, leaking browsers and making console state useless across requests. Routes now share one process-wide `BrowserService` (`_browser()` in `web/om/routes.py`).

Verification:

- `tests/test_om_batch2.py`: 10 passed (console 404/200, real console.log capture + %PDF export via Playwright, OCR toolchain present, blank-page pipeline, rendered-text OCR read, embedded-text source, scanned fallback, telegram not-configured graceful, inbox save unaffected, telegram wiring via stub adapter).
- 10 live HTTP route checks: all passed (console 200/schema/404, pdf 200/%PDF/404, doc upload, page_text source+ocr_available, info ocr_available, telegram-status schema, notify+telegram graceful, unread count).
- Headless Chromium UI check: new buttons (Console, PDF, Telegram status/send) present, zero page errors.
- `tests/test_om_phase1.py::test_browser_session_lifecycle_http` fails in this sandbox both before and after the change (egress-proxy URL parsing in the HTTP fallback path) — pre-existing environment issue, not a regression.

## Batch 3: PWA + retry engine + mail rules (2026-10-02)

- **PWA**: `manifest.webmanifest` + `sw.js` (static assets cached, `/api/*` never cached) + generated icons (192/512/apple-touch). Dashboard is installable via "Add to Home Screen"; works over home Wi-Fi. Note: the full auto install prompt needs HTTPS — over plain-HTTP LAN, manual add-to-homescreen still opens it app-like.
- **Retry engine**: runs accept `retry_policy: {max_retries, backoff_s}`; on failure the next retry is scheduled with exponential backoff and a daemon sweeper thread (started in `web/server.py run()`) moves due runs back to running. Budget exhaustion is logged as an event. Manual `POST /activity/runs/retry-sweep` also available. UI: new-run prompt accepts `3x60` format; run cards show `🔁 count/max · next in Ns`.
- **Mail rules** (`web/om/mailrules.py`): user-defined keyword rules scan Gmail via the existing connector/vault creds and create *idea drafts* (status "new") with the email as evidence — accept/edit/dismiss flow already exists. Seen (rule, email) pairs are remembered (no duplicates). Starter rules + scan button + rule manager in the Activity tab. Read-only on mail; only fires on user click.
- **Bug fixes found while building**: (1) `transition()` returned the stale row after scheduling a retry — now re-reads; (2) the sweeper function was briefly inserted mid-class, swallowing `_event` — moved to module level.

Verification (2026-10-02):

- `tests/test_om_batch3.py`: 12 passed (manifest/icons/sw assets, retry schedule/backoff/sweep/exhaustion/sweeper idempotence, rule CRUD/validation/seed idempotence, gmail-status disconnected, scan 503 without gmail, scan→idea with evidence + dedupe via stub adapter).
- 14 live HTTP route checks: all passed (mail-rules CRUD/seed/scan, retry create/fail/schedule/sweep, 4 PWA static assets).
- Headless Chromium UI check: mail card renders, Gmail status shows, seed/scan buttons work, zero page errors.
- No regressions in `test_om_phases2_6.py` + `test_om_batch3.py` (the 5 `test_om_batch2.py` OCR failures in this fresh VM are the missing tesseract binary — code unchanged since they passed 2026-09-30; install with `sudo apt install tesseract-ocr`).

## Real internet for the assistant (2026-10-02)

The chat could not touch the real internet: no search tool, no page reader,
and the supervisor blocked anything unregistered. Now:

- **`web_search` tool** (`server/tools/websearch_tool.py`): free DuckDuckGo search, no API key. Primary: DDG html results; fallback: DDG Instant Answer API (used automatically when DDG rate-limits the html endpoint). Read-only, 1–8 results, 20s timeout.
- **`web_read` tool** (`server/tools/webread_tool.py`): fetch any http(s) URL, return title + up to 8000 chars of text. Read-only; page content is data, never instructions.
- **Skills**: `skills/websearch_skill/` and `skills/webread_skill/` (SKILL.md contracts, `status: active`), auto-loaded by the SkillLoader.
- **Intent routing** (Laya, no LLM needed): "search the web for X" / "google X" / "look up X" → `web_search`; "read/open/fetch <url>" → `web_read`.
- **Supervisor**: both tools registered in scope (`web:search`, `web:read`) with `ALLOW` policy — read-only, no external effect, no approval needed.

Verified end-to-end through `ConversationManager` with NO language model:
"search the web for Python programming language" → live DDG results;
"read https://example.com" → live page text. Tool commands work even while
Ollama is down; open chat still needs `ollama pull qwen3:8b` on sai's machine
(this VM has ~676MB RAM free — a model cannot run here).

- `tests/test_web_internet.py`: 14 passed (live search, live read, bad URLs, skill registration, 7 intent patterns, no false positives on datetime/memory, supervisor allow).
"""""""""