---
name: browser
description: Interactive web browsing with Playwright: navigate, click, type, inspect, and take screenshots.
version: 1.0.0
status: active
capabilities:
  - web_navigation
  - page_inspection
  - click_interaction
  - text_entry
  - screenshot_capture
allowed_tools:
  - browser_navigate
  - browser_inspect
  - browser_click
  - browser_type
  - browser_screenshot
---

# Browser Skill

## Purpose
Provides interactive web navigation, inspection, and manipulation capabilities through Playwright and Chromium.

## Available Tools
- `browser_navigate(url: str, session_id: str)`: Navigate to a public webpage with SSRF safety checks.
- `browser_inspect(session_id: str)`: Inspect the current page title, URL, visible text, and interactive elements.
- `browser_click(target: str, session_id: str)`: Click an element by text or selector.
- `browser_type(text: str, target: str, session_id: str)`: Type into an input element.
- `browser_screenshot(session_id: str)`: Capture a screenshot of the current page.

## Safety & Security
- Strict SSRF protection: loopback, RFC 1918 private subnets, link-local, and cloud metadata (169.254.169.254) are rejected.
- Form submissions and destructive actions (payment, deletion) require user approval.
- High-risk actions generate action receipts with timestamps, status codes, and URLs.