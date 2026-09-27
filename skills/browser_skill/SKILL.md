---
name: browser
description: Web browsing and computer use. Deferred until the safety foundation is proven.
version: 0.1.0
status: planned
---

# Browser Skill

## Purpose
Provides controlled browser/content inspection capabilities.

## Available Tools
- `get_current_page() -> str` - summarize current page
- `find_on_page(query: str) -> list[dict]` - search page content
- `get_selected_text() -> str` - get user-selected text

## Safety
- No arbitrary URL navigation without approval
- Content sanitization before LLM injection
- Privacy: no personal data extraction

## Integration
- Part of ContextAwareness subsystem
- Feeds into LLM context as "current screen/browser content"
- Controlled via /tools execute browser:* commands