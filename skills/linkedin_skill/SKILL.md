---
name: linkedin
description: Drafts LinkedIn posts from a rough idea. Never publishes on its own.
version: 1.0.0
status: active
---

# LinkedIn Skill

## Purpose
Drafts LinkedIn posts from a rough idea, in the "sai the builder" voice.
Never posts anything on its own.

## Available Tools
- `linkedin_draft(idea: str) -> draft` - registered as `linkedin_draft` in
  server/intent/registry.py, implemented in server/tools/linkedin_tool.py

## Safety
- DRAFT ONLY. This skill's own tool has no publish capability at all -
  publishing (currently a stub) lives in ConversationManager and only
  runs after the user's next turn approves the exact draft text.
- Approval is bound to a content hash (server/approvals/gate.py). If the
  draft changes after being shown, the approval is invalid and the post
  is refused, not silently sent.
- Scope: LinkedIn drafting only. This skill has no filesystem, browser,
  or shell access - it is not in-scope for anything outside drafting text.

## Integration
- Routed by server/intent/router.py (pattern: "draft/write a linkedin
  post about/on/for <idea>")
- Approval state lives on ConversationManager._pending_approval
- Every draft/approve/reject/publish is logged to data/approvals.db via
  server/approvals/gate.py::ApprovalStore
