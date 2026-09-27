---
name: system
description: Local system info (CPU, memory, disk). Read-only.
version: 1.0.0
status: active
---

# System Skill

## Purpose
Answers "system info" style questions from local OS counters.

## Available Tools
- `get_system_info()` - registered in the tool registry, implemented
  in server/tools/system_info_tool.py

## Safety
- Read-only. No arguments, no side effects, no network.
