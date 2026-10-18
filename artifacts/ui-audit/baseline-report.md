# OS visual fidelity audit — baseline

Captured 2026-10-18 from `http://127.0.0.1:3000` at 1536 × 1024. These findings compare each live view with its corresponding panel in the supplied reference, rather than comparing either image as a collage.

| View | Current state | Largest discrepancy | Severity | Likely source | Baseline score |
| --- | --- | --- | --- | --- | ---: |
| Overview | Useful, live dashboard with task, connector, browser, plan, and watcher data | Dark cyber theme, condensed/monospace labels, and an oversized top chrome differ from the bright, calm dashboard reference | High | `index.css`, `Topbar.tsx`, `Sidebar.tsx`, `HomeView.tsx` | 48 |
| Ask OS | Functional streaming chat with suggestions and safe composer | Conversation is confined to a narrow dark column with too much unused canvas and the composer is visually secondary | High | `ChatCanvas.tsx`, `index.css` | 42 |
| Discovery | Real GitHub discovery feed and truthful empty state | It is a repository-scanning surface instead of a searchable skills catalogue; no fabricated skills will be added | Medium | `DiscoveryView.tsx` | 40 |
| Tasks | Functional task list and filters | Rows are visually heavy, repetitive, and overly dark; hierarchy is weaker than the light compact reference list | High | `TasksView.tsx`, shared tokens | 50 |
| Computer browser | Real browser controls and backend telemetry | Inspector consumes too much width; cyber terminal treatment dominates the work surface | Critical | `ComputerView.tsx`, shared tokens | 45 |
| Computer desktop | Truthful degraded desktop state with recovery controls | Same dark shell plus a large inspector; backend reports a real degraded service rather than a desktop stream | High | `ComputerView.tsx` | 43 |
| Computer terminal | Real sandbox command runner and workspace | The mode scrolls the page to a partially clipped surface and the browser remains above it; terminal is not the principal work area | Critical | `ComputerView.tsx` | 40 |
| Connections | Real connector states and OAuth/configure actions | Dense dark cards and red unavailable rows do not match the airy reference integration list | High | `ConnectorsView.tsx`, shared tokens | 52 |
| Activity | Truthful approvals/evidence surface | Empty state is clear, but the page has excessive empty dark space and less compact structure than reference | Medium | `ActivityView.tsx`, shared tokens | 54 |
| Settings | Functional memory/workers/policy settings | Narrow content wrapper, dark tokens, and information-density mismatch with reference preference groups | High | `SettingsView.tsx`, shared tokens | 46 |
| Cyber HUD (extra) | Existing accessible page | Deliberately cyber-styled and not represented in reference; it will remain distinct rather than being falsely mapped to a reference panel | Low | `HudView.tsx` | N/A |

## Shared root causes

1. **Critical — theme/token mismatch.** `index.css` defaults the app to near-black surfaces with green/cyan glow. The reference’s baseline is a light, blue-accented desktop interface with subtle elevation.
2. **High — shell density.** `Topbar.tsx` is 64 px high and `Sidebar.tsx` uses a 240 px desktop rail. Their dark, high-contrast framing overwhelms the content.
3. **High — constrained content canvases.** `ChatCanvas.tsx` and `SettingsView.tsx` use `max-w-5xl`, creating unused space at desktop widths.
4. **Critical — Computer proportions.** `ComputerView.tsx` uses a 2:1 grid, putting one-third of available width into the always-open telemetry/inspector rail. The terminal mode also scrolls to, rather than replacing, the work surface.
5. **Medium — reference-feature mismatch.** Discovery is backed by a real GitHub candidate API, not a skills/template catalogue. It should keep its honest data model; visual treatment may align, but reference-only cards must not be invented.

## Runtime observations

- All sidebar routes rendered. No React page exception was observed.
- Browser/desktop/terminal surfaces are connected to real endpoints. At capture time the Linux desktop correctly reported **degraded** (black-frame detection); it was not masked.
- The browser console reported two existing static-resource 404s: `Failed to load resource` and `Couldn't fetch package.json`. They are recorded in `baseline/capture-report.json`.

## Proposed targeted corrections

1. Replace shared light/dark semantic tokens and reduce glow/shadow treatment; default to light while preserving the theme toggle.
2. Refine topbar, sidebar, cards, and primary actions with the reference’s compact Apple-like proportions and blue selection/action affordances.
3. Give chat and settings a wider desktop canvas; keep real data and interaction handlers unchanged.
4. Rebalance Computer toward its live viewport, add a collapsible inspector, and make the sandbox terminal the explicit principal mode without replacing live components.
5. Capture the same pages again, generate side-by-side and difference evidence, then run build and behavioral checks.
