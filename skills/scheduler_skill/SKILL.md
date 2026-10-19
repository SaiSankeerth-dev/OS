---
name: scheduler
description: Reminders. Set one-time or daily recurring reminders, list them, cancel them.
version: 1.0.0
status: active
---

# Scheduler Skill

## Purpose
User-facing reminders. "Remind me to X at Y" — OS remembers and notifies.

## Available Tools
- `schedule_reminder(text)` - parse and schedule (DIRECT, no approval)
- `list_reminders()` - show pending (DIRECT)
- `cancel_reminder(id)` - cancel by ID (DIRECT)

## Examples
- `remind me to call mom at 6pm` → one-time
- `remind me to drink water every day at 9am` → daily recurring
- `remind me in 30 minutes to check the oven` → relative
- `remind me tomorrow at 9am to send the email` → tomorrow
- `what reminders do I have` → list
- `cancel reminder abc123` → cancel

## Safety
- DIRECT execution: reminders are harmless, user explicitly asked.
- Times in the past roll to tomorrow (no silent firing).
- Overdue reminders (>1h) are skipped on restart, not fired late.
- All local: SQLite + APScheduler, no external services, ₹0.

## Persistence
Reminders survive restarts (SQLite). The scheduler loads pending
jobs on boot and reschedules them.
