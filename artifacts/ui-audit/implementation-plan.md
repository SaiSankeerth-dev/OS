# OS implementation plan

Last updated: 2026-10-18

| Phase | Priority | Dependency | Scope | Acceptance status |
| --- | --- | --- | --- | --- |
| 0. Baseline | High | None | Preserve dirty tree; rerun focused tests and build | In progress |
| 1. Theme and text visibility | Highest | 0 | Shared tokens, Ask OS composer, Command Palette | Verified (focused scope) |
| 2. Truthful wallpaper | High | 0 | Desktop command/result, asset availability, UI state | Not started |
| 3. Task verification and approvals | High | 0 | Postconditions, evidence, approval payload/expiry/replay | Not started |
| 4. Accessibility and interaction | High | 1 | Semantic controls, labels, modal focus, keyboard flows | Not started |
| 5. Desktop architecture | Medium | 2, 3 | Canonical runtime, health, input, screenshot contracts | Not started |
| 6. Regression matrix | High | 1-5 | Views, themes, widths, inputs, dialogs, errors, release evidence | Not started |

Rules: preserve pre-existing changes; only call a phase verified after its stated acceptance evidence is recorded; a build is not a user-outcome proof.

Phase 1 evidence: `python scripts/verify_theme_visibility.py` exits 0 against the local dashboard and writes `phase1-browser-report.json` plus focused light/dark screenshots. The remaining baseline Python group is separately blocked and is not covered by this phase status.
