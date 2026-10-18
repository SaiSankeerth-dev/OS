---
name: github_repo_research
description: Scoped GitHub repository research skill for OS V3. Gathers real repository evidence, verifies architecture relevance, inspects dependencies and security, and produces an audited research report.
version: 1.0.0
status: active
---

# GitHub Repository Research Skill

## Purpose
Enables OS's Research Agent to investigate prospective GitHub repositories, inspect their implementation and code quality, evaluate direct architectural relevance to OS, and produce verifiable research reports with independent claim review.

## 7-Step Verified Workflow
1. **Step A — Discover**: Identify candidate repositories matching configured topics and trajectory thresholds.
2. **Step B — Verify Identity & Activity**: Confirm canonical URL, maintainer, active commits, release cadence, and distinguish official projects from unmaintained forks.
3. **Step C — Investigate Implementation**: Fetch and analyze README, tree structure, package manifests (`package.json`, `pyproject.toml`, `requirements.txt`), entrypoints, and test suites.
4. **Step D — Assess Engineering Quality**:
   - Installation complexity
   - Documentation thoroughness
   - Maintainability & test coverage
   - Dependency health & supply-chain safety
   - License compatibility (Permissive vs Copyleft/Proprietary)
5. **Step E — Determine Relevance to OS**:
   - Map against active OS goals and capability gaps
   - Classify proposed action: `adopt`, `integrate_part`, `learn_from`, `monitor`, `reject`
6. **Step F — Produce Evidence-Backed Report**:
   - Executive summary
   - Why it matters now
   - Technical capabilities
   - Limitations and resource constraints
7. **Step G — Independent Verification**:
   - Separate verification step to challenge promotional claims and verify documented claims against actual repository code.

## Scoped Boundaries & Security
- Read-only network requests strictly limited to repository endpoints.
- All file writes jailed to `data/lab/{slug}` or memory artifacts.
- No arbitrary host shell execution without explicit approval.
- Enforced by `server.intelligence.scope_guard.ScopeGuard`.
