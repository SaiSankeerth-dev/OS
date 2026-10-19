---
name: computer
description: Natural-language desktop control. Instant actions run immediately; complex tasks use an AI agent with screen vision.
version: 1.0.0
status: active
---

# Computer Skill

## Purpose
Lets OS control the desktop from plain language. Common tasks are
instant (no AI needed); complex tasks use cua-agent (20k stars, MIT)
with local Ollama — the agent sees the screen and moves the mouse
and keyboard like a human.

## Available Tools
- `computer_task(task)` - run a desktop task (NEEDS APPROVAL)

## Instant Actions (no LLM, free, immediate)
- `take a screenshot` → saves to /tmp/os_screenshot.png
- `lock screen` / `lock` → locks the session
- `volume up` / `volume down` → ±5%
- `mute` / `unmute` → toggles

## Agentic Tasks (cua-agent + Ollama, needs display)
- `open calculator and type 2+2`
- `open files and create a folder called test`
- Anything the deterministic actions don't cover

## Safety
- Always NEEDS_APPROVAL before touching the desktop.
- Instant actions show exactly what they'll do.
- The full agent shows each step as it works.
- No display (headless server) → fails honestly with a clear message.
- Everything is local and free: Ollama + cua-agent, no API keys.

## Requirements
- A graphical desktop (works on your laptop, not on headless servers)
- Ollama running with qwen3:8b (or another vision-capable model)
- `pip install "cua-agent[omni]"` (one-time)
