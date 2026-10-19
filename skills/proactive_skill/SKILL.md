---
name: proactive
description: Proactive alerts. OS watches and warns you about what needs attention.
version: 1.0.0
status: active
---

# Proactive Skill

## Purpose
OS doesn't just wait for commands — it watches for things you should know about.

## Available Tools
- `check_alerts()` - run all checks (DIRECT)

## Examples
- `check alerts` → reminders due soon, stale PRs, failed plans, low disk

## Checks
- **Reminders**: due in next hour or overdue
- **GitHub**: PRs with no activity in 7+ days
- **Plans**: failed plans needing review
- **System**: disk space critical/low

## Safety
- Read-only. Never acts, only reports.
- Say the suggested command to handle each alert.
