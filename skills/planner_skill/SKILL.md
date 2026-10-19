---
name: planner
description: Multi-step task plans. Propose, approve, execute. JARVIS-style.
version: 1.0.0
status: active
---

# Planner Skill

## Purpose
Turns "do this whole thing for me" into structured multi-step plans.
Propose first, execute on approval, report like JARVIS.

## Available Tools
- `plan(text)` - propose a plan (DIRECT, shows steps for review)
- `plan_run(plan_id)` - execute a plan (NEEDS_APPROVAL)
- `plan_list()` - show plans (DIRECT)

## Examples
- `plan my trip to Goa` → 3-step trip plan
- `morning briefing` → reminders + PRs + date
- `do remind me to buy milk then show my github repos` → chained steps
- `run plan <id>` → execute after you approve
- `plan list` → see all plans

## How It Works
1. You describe the goal in normal language
2. OS proposes a structured plan with numbered steps
3. You approve (or cancel)
4. OS runs each step in order, stops honestly on failure
5. JARVIS-style report: "Done. All 3 steps complete."

## Safety
- Plans are proposals until you say "run plan <id>"
- Each step's tools keep their own approval policies
- Failures halt the plan; OS reports what succeeded and what didn't
- Never pretends a failed step succeeded
