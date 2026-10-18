# OS verification log

Last updated: 2026-10-18

| Time | Command or check | Exit / outcome | Relevant evidence |
| --- | --- | --- | --- |
| Baseline | `git status --short` and targeted diffs | Read-only | Substantial pre-existing dirty tree, including source, test, generated bundle, wallpaper, and audit-artifact changes; preserved. |
| Baseline | `npm run build` in `frontend` | 0 | TypeScript and Vite completed; 1,939 modules transformed. This predates Phase 1 source changes. |
| Baseline | `python -m pytest tests/test_approvals.py tests/test_verification.py tests/test_browser_agent_execution.py tests/test_docker_virtual_computer.py -q -rA` | 1 (sandbox) | 21 errors and 8 failures because Playwright could not create Windows subprocess pipes (`PermissionError: [WinError 5]`). Do not interpret as behavior regressions. |
| Baseline | Same focused Python command with host permission | No final exit code captured | Runs emitted progress dots only before the execution wrapper stopped returning final summary; this is unverified, not passed. |
| Phase 1 | In-app browser connection | Blocked | Browser connector returned `No browser is available`; no computed-style or screenshot claim is made. |
| Phase 1 | Post-change `npm run build` in `frontend` (host permission) | 0 | TypeScript and Vite completed; fresh static entry references `index-Cd2k1n0s.css`. |
| Phase 1 | Static contrast calculation | 0 | Light muted/placeholder `#5e6d85` on composited `#fdfdfe`: **5.16:1**. Dark muted `#aab8ca` / placeholder `#b9c5d4` on `#0c0f16`: **9.51:1 / 10.95:1**. Light/dark primary: **15.39:1 / 18.32:1**. |
| Phase 1 | `python scripts/verify_theme_visibility.py` (host permission; local server PID 33116) | 0 | Browser typed the Ask OS composer, toggled the application theme, opened Command Palette, asserted text/caret/placeholder/focus styles, and wrote `phase1-browser-report.json`, `phase1-light-chat-focus.png`, `phase1-dark-chat-focus.png`, and `phase1-dark-command-palette-focus.png`. No console errors or failed requests. |
| Phase 2 | `docker exec os-virtual-desktop sh -c ...` (read-only host inspection) | 0 | Container reports `DISPLAY=:1`; `feh`, Openbox, tint2, x11vnc, Xvfb, and all five curated image files are present. This proves runtime prerequisites, not that the route reports application truthfully. |
| Phase D-1 | `python -m pytest tests/test_phase_d_memory.py tests/test_memory_retriever.py tests/test_memory_state.py -q` (host execution) | 0 | 20 passed. Covers typed/provenanced restart recall, relevance, expiry/privacy exclusion, conflict behavior, typed-mirror deletion, legacy note lifecycle, and ordinary-chat context injection. |
| Phase D-1 compatibility | `python -m pytest tests/test_phase_a_trust.py -q` | 0 | 8 passed. The safe SQLite metadata regression continues to pass after the typed-memory extension. |
| Phase D-1 combined invocation | `python -m pytest tests/test_phase_a_trust.py tests/test_phase_d_memory.py tests/test_memory_retriever.py tests/test_memory_state.py -q` | BLOCKED | `test_phase_a_trust.py` leaves an active event loop in this Windows/Pytest environment; later legacy tests using `asyncio.run()` then fail with `RuntimeError`. Each focused gate above passes in a fresh supported invocation. This is not counted as a combined pass. |
