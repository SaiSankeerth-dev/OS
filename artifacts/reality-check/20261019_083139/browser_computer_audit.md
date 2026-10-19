# Browser & Computer Control — Reality-Check Audit

- **Target:** `~/workspace/os/OS`, branch `os-10x`, commit `ff1e5af`
  ("Batch B: real interactive browser (+ Batch A close-out)")
- **Working tree:** DIRTY — `web/om/browser.py` has **uncommitted changes**
  (45 insertions) implementing the Playwright dedicated-thread fix;
  `logs/perf.jsonl` also modified (pre-existing, unrelated).
- **Auditor:** read-only subagent. No application code modified.
- **Date:** 2026-10-19. **Environment:** Python 3.12.3, playwright 1.63.0,
  Chromium cache has `chromium-1248` + `chromium_headless_shell-1248`
  (full chrome binary present; headless-shell-1243 expected by the
  installed playwright is MISSING), **no Docker**, no Ollama.

Evidence levels used below: **S** = static inspection (file:line),
**R** = runtime tested by this auditor (read-only, disposable fixtures).

---

## 1. Browser driver — real or fake?

**Verdict: REAL browser implementation (Playwright/Chromium), with an
honest HTTP fallback. Not a stub, not a mock.**

| Claim | Evidence | Level |
|---|---|---|
| Real Playwright driver exists | `web/om/browser.py:126` `class _PlaywrightDriver` — launches real Chromium via `playwright.sync_api`, one context per session (`_page`, line ~300) | S |
| Interactive actions implemented | `click/fill/type_text/press/select/wait_for/elements/describe` all drive real Playwright page objects with read-back evidence (`browser.py:340-430`) | S |
| HTTP fallback is honestly labeled | `_HttpDriver` raises 503 "needs Playwright/Chromium installed" on every interactive action (`browser.py:520-570`); `BrowserService._view` reports `"engine": "http"` vs `"playwright"` (`browser.py:600`) | S |
| Chromium actually launches | **R:** full `chrome` binary from `chromium-1248` launched headless, `about:blank` loaded OK | R |
| Playwright package ↔ browser version mismatch | **R:** `available()` returns **False** in this environment because playwright 1.63.0 wants `chromium_headless_shell-1243`, cache has `-1248`. Code degrades correctly (`self._ok=False` → HTTP fallback). Environment issue, not a code bug. | R |

## 2. Async-context bug (known issue) — fixed?

**Verdict: FIXED in the working tree (uncommitted). Root cause confirmed
by reproduction.**

- **Root cause (R):** calling `playwright.sync_api` inside a running
  asyncio loop raises *"It looks like you are using Playwright Sync API
  inside the asyncio loop."* — reproduced directly.
- **Fix (S):** every public `_PlaywrightDriver` method is decorated with
  `@_on_pw_thread`, hopping to a dedicated single-thread
  `ThreadPoolExecutor` (`browser.py:150-175`, uncommitted diff). Internal
  helpers (`_page`, `_act`, `_evidence`, `_attach_console`,
  `_proxy_config`) are correctly left undecorated (decorating them would
  self-deadlock the 1-worker executor).
- **Fix verified (R):** `sync_playwright().start()` via the driver's
  `_run` from inside `asyncio.run()` → **"started-ok"** on the `os-pw`
  thread. Without the hop it fails (see above).
- **Caveat:** the fix is **uncommitted** (`git status` shows
  `M web/om/browser.py`). The committed `ff1e5af` tree still has the bug.
- **Minor leak (S):** decorated `shutdown()` closes pages/browser/
  `pw.stop()` but never calls `self._exec.shutdown()` — each
  `BrowserService` leaks its `os-pw` thread on shutdown. (Calling it from
  inside the worker would deadlock, so skipping is the safe choice, but
  the leak is real for tests that create many drivers.)
- **Minor race (S):** `BrowserService.close()` (`browser.py:~900`)
  calls decorated `self._pw.close(sid)` (PW thread) then
  `self._pw._console.pop(sid, None)` on the **caller** thread while
  `console_logs` reads `self._console` on the PW thread. No lock. Low
  impact (dict pop vs read) but unsynchronized.

## 3. Interactive control (click/type) — does it actually work?

**Verdict: IMPLEMENTED and wired; runtime end-to-end not re-proven here
(browser binary mismatch), but the Batch B acceptance test on the prior
VM passed (open→read→elements→click→verified nav→screenshot).**

| Aspect | Evidence | Level |
|---|---|---|
| Actions validate inputs | `_validate_interaction`: selector ≤500 chars, text ≤10000, key allowlist, timeout 1–60s; raises `BrowserError`, never silent (`browser.py:60-90`) | S |
| Read-back evidence, not assumed | `fill`/`type_text`/`select` read `page.input_value()` after acting; every action returns `{url, title, selector, …}` (`browser.py:360-400`) | S |
| Actions NOT exposed as raw HTTP | `web/om/routes.py` has **no** routes for click/fill/type/press/select — only read/screenshot/console/pdf/navigate. Interaction goes through `server/tools/browser_tool.py` as NEEDS_APPROVAL **draft-only** tools; execution only via `BrowserService.perform_action()` in the approval-completion path (`browser_tool.py:192-230`, `browser.py:870-895`) | S |
| Unknown action kinds fail closed | `perform_action` raises 422 for unknown `kind` or missing `session_id` (`browser.py:890`) | S |

## 4. Stale sessions — can a dead browser masquerade as active?

**Verdict: NO. Stale handling is correct and was runtime-verified.**

- **(S)** `_ensure_live_page` (`browser.py:~640`): if Playwright is
  available and `sid not in self._live`, it marks the SQLite row
  `"stale"`, raises `BrowserError(410)`, and — critically — does **not**
  clobber the stored URL.
- **(R)** Simulated post-restart state (persisted row, empty `_live`
  set): `read()` → **HTTP 410** "Browser session went stale…",
  row status → `"stale"`, URL preserved intact
  (`https://example.com/real-page` not overwritten).
- **(R)** When Playwright is unavailable, `_ensure_live_page` is a
  deliberate no-op and `read()` falls back to stateless HTTP fetch of the
  persisted URL — no masquerading possible (it really fetches).
- `is_live()` tracks only pages opened **in this process**
  (`browser.py:~270`); `close()` discards from `_live`
  (`browser.py:~440`).

## 5. SSRF / URL policy

**Verdict: enforced at runtime, verified.**

- **(S)** `create()` and `open()`/`navigate()` call `_check_url_allowed`
  → `_url_blocked` from `server.tools.webread_tool`
  (`browser.py:20-24`, `610`, `630`).
- **(R)** `svc.create("http://127.0.0.1:3000/api/me")`,
  `"http://169.254.169.254/"`, `"http://10.0.0.1/"` → all **blocked,
  HTTP 422** ("IP … is not public"). Nothing was fetched.
- Note: `_HttpDriver.read` itself does not re-check (relies on the
  service-layer gate); all entry points funnel through `create`/`open`.

## 6. Computer / terminal — jailed or escapable?

**Verdict: cwd-jailed + env-scrubbed in local mode, HONESTLY labeled as
not container-isolated. Full isolation only with Docker (absent here).**

| Aspect | Evidence | Level |
|---|---|---|
| Two modes, honest reporting | `mode()` → `"docker"` iff `shutil.which("docker")`; `snapshot()` in local mode returns `"Local sandbox (cwd-jailed, not container-isolated). Install Docker for full isolation."` (`computer.py:100-130`) | S+R (mode `local` confirmed) |
| Docker mode is genuinely locked down | `--network none --read-only --cap-drop ALL --security-opt no-new-privileges --memory 512m --pids-limit 128`, runs as `1000:1000` (`computer.py:200-225`) | S (cannot runtime-test: no Docker) |
| File-API path traversal blocked | `_workspace_path_local` resolves + containment-checks (`computer.py:290-300`); **R:** `read_file("/etc/passwd")`, `"/workspace/../../etc/passwd"`, `"/"` → blocked (404/422); `execute` cwd `"…/…/etc"` → blocked | R |
| **Shell is NOT filesystem-jailed in local mode** | **R:** `execute("cat /etc/passwd \| head -1")` → **succeeded**, returned `root:` line. The jail covers the *working directory* and the *file API* only; the shell runs as the OS user with normal filesystem read access. This matches the documented design ("same as their terminal") and is disclosed in `snapshot()`, so: **labeled limitation, not a hidden hole** — but any caller treating local mode as a security boundary would be wrong. | R |
| Env scrubbed | `_scrub_env` keeps only PATH/HOME/LANG/etc. **R:** `env \| grep -iE 'AWS\|TOKEN\|SECRET\|KEY'` → empty | R |
| Timeouts + output caps | `COMMAND_TIMEOUT=30`, `OUTPUT_LIMIT=128KB`, `timeout` wrapper in docker mode (`computer.py:30-40`, `320-350`) | S |
| Restart reconciliation honest | `_reconcile` marks rows still `running` as `interrupted` with "Outcome unknown; inspect the workspace before retrying" (`computer.py:250-265`) | S |
| Idempotency keys | `execute(..., idempotency_key=…)` returns prior receipt instead of re-running; mismatched command → 409 (`computer.py:305-320`) | S |
| Single-flight lease | `_acquire` 409s when busy, 180s lease (`computer.py:270-285`) | S |

## 7. Missing-dependency behavior — honest or fake?

| Dependency | Behavior | Honest? |
|---|---|---|
| Playwright/Chromium broken (this env) | `available()`→False; reads fall back to HTTP fetch; interactive actions → **503**; engine labeled `"http"` in session views | **Yes** |
| Docker absent | `mode()`→`"local"`; snapshot discloses non-isolation; `start()` in local mode is a no-op returning snapshot | **Yes** |
| Proxy env | `_proxy_config()` honors `HTTPS_PROXY`/`no_proxy` for Chromium (which ignores them natively) (`browser.py:180-215`) | Yes (can't runtime-test: no working browser launch here) |

## 8. Scores (capability: X/10)

- **Browser automation (real Chromium): 7/10** — real driver, read-back
  evidence, approval-gated interaction, stale/SSRF handling all verified;
  −3 for the uncommitted async fix, the pw-version env mismatch, and the
  `os-pw` thread leak on `shutdown()`.
- **Stale-session honesty: 9/10** — 410 + `"stale"` + URL preserved,
  runtime-verified.
- **Computer isolation (local): 5/10** — cwd+file-API jailing, env
  scrubbing, timeouts, idempotency all real; −5 because the shell itself
  is not filesystem-jailed (documented and disclosed, but a caller
  assuming containment would be wrong). Docker mode (untestable here)
  would score 8+.
- **Missing-dependency honesty: 9/10** — 503s, engine labels, and
  snapshot disclosures are all truthful; no fake "active" states found.

## 9. Open issues / recommendations (no fixes applied per audit rules)

1. **Commit the uncommitted Playwright-thread fix** (`web/om/browser.py`
   working-tree changes) — the committed tree still deadlocks/fails in
   FastAPI async handlers. Add the async-context regression test first
   (child of the fix).
2. **Pin playwright browser versions in CI/dev setup** — playwright
   1.63.0 vs cached `chromium-1248` mismatch silently disables the real
   browser in this environment.
3. **Shut down or reuse the `os-pw` executor** — `shutdown()` leaks one
   thread per `BrowserService`; consider a process-wide singleton driver
   (routes already use a process-wide `BrowserService` via `_browser()`).
4. **Synchronize `_console` access** in `BrowserService.close()` vs
   `console_logs` (minor race).
5. **Document local-mode computer limits at the call site** — the
   snapshot message is honest, but tool/skill callers should see the
   "cwd-jailed only" caveat where `execute()` is invoked.
