---
name: datetime
description: Current date and time. Read-only, local.
version: 1.0.0
status: active
---

# Datetime Skill

## Purpose
Answers "what time is it" style questions from the local clock.

## Available Tools
- `get_current_datetime()` - registered in the tool registry, implemented
  in server/tools/datetime_tool.py

## Safety
- Read-only. No arguments, no side effects, no network.
