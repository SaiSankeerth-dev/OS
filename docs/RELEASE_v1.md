# OS v1.0.0 — Foundation Release

The stable local-first foundation. Everything below runs on your own
machine at ₹0/$0: local Ollama models, SQLite, no paid APIs, no cloud.

## What's in (15 locked phases)

0. Approval gate + LinkedIn draft skills — the milestone that started it
1. Local LLM wiring (Ollama default, llama.cpp optional)
2. Conversation engine + intent routing (Laya fast layer)
3. Tool calling via the MCP tool bus (disabled by default)
4. Supervisor pipeline: draft → show → approve → execute
5. Dynamic agent teams (plan → parallel workers → verify → merge)
6. SKILL.md skills (5 skills: calculator, memory, datetime, system info, LinkedIn)
7. Scope guard — disabled skills are REJECTED, fail closed
8. 4 personalities (tone only, no tool access)
9. Permission engine — allow / ask / deny per skill
10. Approval queue + timeouts + audit trail (`os approvals`)
11. Deterministic verification — a "success" with nothing verifiable fails
12. SQLite memory/state — approvals and memory survive restarts; `memory_forget`
13. Proactive watcher — suggests, never acts (`os watch`)
14. End-to-end integration test proving it all works together
15. This release cut

## The one journey v1 guarantees

voice/text → team or tool → draft → approval → execution →
verification → memory. Nothing external ever runs without your exact
approval, and nothing unverifiable is ever presented as fact.

## Safety rules that are locked

- Never trust an agent's "done" claim; verify deterministically.
- Changed content invalidates an approval (exact-content hash).
- Expired approvals execute nothing (fail closed).
- Watchers may only suggest.
- No unrestricted shell access.
- Secrets are never echoed, logged, or saved.

## Deferred (not in v1)

- Browser / computer autonomy — intentionally after the foundation.
- Real external tools (email send, file writes, web). All current tools
  are local preparation/draft tools. Before any side-effectful external
  tool is added, approval-mode handlers must be refactored so they run
  only *after* approval (currently acceptable only because every tool
  is local preparation).

## Known limitations

- End-to-end *voice* conversation is unverified on real hardware; see
  `HARDWARE_TEST.md`.
- `pocket-tts` real-model tests need the optional voice package; they
  fail in environments without it (pre-existing, unrelated to v1).
- In this sandbox, `*PROXY*` env vars must be unset before running the
  test suite (bracketed IPv6 in `no_proxy` breaks httpx).
- The model backend is a stub away: point `llm.base_url` at your local
  Ollama and v1 comes alive.

## Quick start

```bash
pip install -e .
os doctor        # environment diagnostics
os start         # text chat with JARVIS
os voice         # voice mode (needs mic + speaker)
os approvals     # approval history
os watch         # proactive watcher suggestions
os test          # full test suite
```

Tests: 281 passed, 5 skipped, 2 pre-existing environment failures
(pocket_tts, missing optional package).
