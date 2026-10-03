---
name: calc
description: Safe arithmetic evaluation. No code execution.
version: 1.0.0
status: active
---

# Calculator Skill

## Purpose
Evaluates plain arithmetic expressions like `2+3*4` or `(15% of 240)`.

## Available Tools
- `calc(expression: str)` - parses with `ast`, evaluates only numbers
  and basic operators (+ - * / // % ** and parentheses).

## Safety
- The expression is parsed, never `eval`'d. Names, attribute access,
  and function calls are rejected - `__import__('os')` cannot run.
- Pure computation: no network, no filesystem, no side effects.
- Local and instant, so the supervisor grants it ALLOW directly.
