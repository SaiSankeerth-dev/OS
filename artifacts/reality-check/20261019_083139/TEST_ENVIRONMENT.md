# OS Test Environment — Reality Check

**Date:** 2026-10-19
**Target:** `~/workspace/os/OS`, branch `os-10x`, commit `ff1e5af`

## Machine

- **OS:** Linux (VM)
- **Python:** 3.12.3
- **RAM:** Not measured (VM)
- **CPU:** Not measured (VM)

## Python Environment

**Venv:** `~/workspace/os-venv`
**Key packages:**
- fastapi, uvicorn, pydantic
- playwright 1.63.0
- httpx, pyyaml
- pytest

**Missing (causing test failures):**
- `mcp` (16 tests fail)
- `sounddevice`, audio libs (20 tests can't collect)
- TTS models (3 tests fail)
- tesseract bindings (2 tests fail)

## External Services

| Service | Status |
|---------|--------|
| Ollama (localhost:11434) | **Not running** — no model available |
| Docker | **Not installed** |
| Microphone/Speaker | **Not available** (VM) |
| Internet | Via proxy (curl works, Chromium fails) |
| Chromium | Cached (chromium-1248), but version mismatch with playwright 1.63.0 |

## Test Execution

### Baseline Test Suite
**Command:**
```bash
pytest tests/ -q -p no:cacheprovider --ignore=(20 voice/audio files)
```

**Result:** 336 passed, 23 failed, 2 skipped in 30.9s

**Failures (all missing dependencies):**
- 16× `test_mcp.py` — `ModuleNotFoundError: No module named 'mcp'`
- 2× `test_om_batch2.py` — OCR module missing
- 1× `test_om_phase1.py` — Playwright version mismatch
- 3× `test_pocket_tts.py` — TTS modules missing
- 1× `test_teams.py` — Module missing

**Not runnable:**
- 20 voice/audio test files — collection errors (missing `sounddevice`, etc.)

### Live API Tests (Port 3001)

**Server:** Started local tree on :3001 (GitHub clone on :3000 undisturbed)
**Tests:**
- `POST /api/chat` (no Ollama) → honest fallback message ✅
- `GET /api/tasks` → 200 with task list ✅
- `POST /api/tasks` → 200, task created (ID 35) ✅
- `DELETE /api/tasks/35` → (server killed before test)
- `GET /api/memory` → 200, `{"memories":[]}` ✅
- `DELETE /api/memory/nonexistent` → 200, `{"ok":true}` ❌ (false success)
- `POST /api/om/browsers` (localhost URL) → 422 "IP not public" ✅ (SSRF working)
- `POST /api/chat` ("open https://... in browser") → "OUT_OF_SCOPE" (scope check working)

### Browser Tests

**Playwright:** Launches Chromium OK (subagent verified)
**Version mismatch:** playwright 1.63.0 expects chromium_headless_shell-1243, cache has -1248
**Impact:** `available()` returns False, falls back to HTTP driver

## Tests Blocked or Skipped

| Test | Reason |
|------|--------|
| Voice E2E | No microphone/speaker hardware |
| Ollama chat | No Ollama running |
| Docker isolation | No Docker installed |
| Task C (durable tasks) | No task engine exists |
| Task H (scheduler) | No scheduler exists |
| Task B (memory store) | No write API, subsystem dead |
| Browser via chat | No Ollama for natural language |

## Commands Run

```bash
# Discovery
git branch --show-current; git log --oneline -3; git status --short
ls web/om/; ls server/

# Server (test instance)
python -c "from web.server import run; run(port=3001)" &

# API tests
curl -X POST http://127.0.0.1:3001/api/chat -d '{"message":"..."}'
curl http://127.0.0.1:3001/api/tasks
curl -X POST http://127.0.0.1:3001/api/tasks -d '{"title":"..."}'
curl http://127.0.0.1:3001/api/memory
curl -X DELETE http://127.0.0.1:3001/api/memory/nonexistent
curl -X POST http://127.0.0.1:3001/api/om/browsers -d '{"url":"http://127.0.0.1:8901/..."}'

# Test suite
pytest tests/ -q -p no:cacheprovider --ignore=(voice files)

# Cleanup
pkill test server; pkill http.server; rm test files
```

## Limitations

1. **No Ollama** — cannot test LLM-dependent paths (open chat, natural language tool invocation, memory via chat)
2. **No Docker** — cannot verify container isolation
3. **No audio hardware** — cannot test voice pipeline E2E
4. **Chromium version mismatch** — browser falls back to HTTP driver
5. **Read-only audit** — did not fix bugs, did not modify code

All limitations are documented. No test was marked PASS without evidence.
