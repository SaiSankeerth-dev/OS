# OS Current Component Map

Comprehensive mapping of all existing architectural components in `D:\OS`.

## 1. Backend Core Subsystems (`server/`)

| Directory / Module | Role | Key Classes / Functions | Status |
|---|---|---|---|
| `server/conversation/` | Conversational state machine & turn manager | `ConversationManager`, `ConversationState`, `ConversationContext` | Active & working with Ollama |
| `server/routing/` | Ultra-fast classifier using Laya model | `LayaRouter`, `checkpoint_cached()`, `laya_available()` | Implemented, CPU non-autoregressive (<100ms) with fallback |
| `server/intent/` | Regex pattern matching & tool registry | `IntentRouter`, `ToolRegistry`, `ToolSpec`, `ToolResult` | Working for deterministic intents |
| `server/supervisor/` | Safety pipeline & lifecycle engine | `Supervisor`, `ScopeGuard`, `ToolPermission`, `verify_tool_result` | Deterministic verification of tool outcomes |
| `server/approvals/` | Human-in-the-loop approval gating | `ApprovalStore`, `PendingApproval`, `content_hash` | Hash-bound approval verification |
| `server/state/` | Local SQLite state store | `StateStore`, `Task`, `TaskEvent`, `Session` | Working with rollback history |
| `server/memory/` | Semantic/episodic memory | `SQLiteMemoryManager`, `MemoryRetriever`, relevance gate | SQLite persistence at `memory/os_memory.db` |
| `server/teams/` | Multi-agent supervisor & worker dispatch | `Supervisor`, `WorkerAgent`, `TeamRegistry` | Working phased execution |
| `server/mcpbus/` | Model Context Protocol bridge | `McpBus`, `McpClient`, stdio subprocess servers | Standard MCP JSON-RPC bridge |
| `server/voice/` | Physical/synthetic voice pipeline | `SoundDeviceAudioInput/Output`, `NlmsAEC`, `SileroVAD`, `StreamingSTT` | Implemented; real Whisper/PocketTTS |
| `server/tts/` | Text-to-speech synthesis | `PocketTTSModel`, `AlbaVoice`, `pcm_stream` | Verified intelligible 24kHz audio |
| `server/watcher/` | Proactive background watchers | `WatcherEngine`, proactive suggestions table | Background polling & suggestion generation |
| `server/permissions/` | Permission scopes and boundaries | `PermissionSet`, tool authorization policies | Code-enforced permissions |
| `server/personality/` | JARVIS persona definitions | Prompt builder, style traits, forbidden filler phrases | System prompt assembler |
| `server/llm/` | Model communication router | `ModelRouter`, `OllamaClient`, token streaming | Streaming async client |

---

## 2. Connectors & Integrations (`web/connectors/`)

15 honest service adapters with zero fake mocks:
1. `google_calendar`: List, create, and delete calendar events.
2. `gmail`: Search emails, send emails (approval-gated).
3. `google_sheets`: Read ranges, append rows.
4. `google_drive`: Search files, download, upload.
5. `youtube`: Search videos, get channel statistics.
6. `github`: Search repos/issues, create issues, create pull requests.
7. `notion`: Query database, create page.
8. `telegram`: Send messages via bot token.
9. `slack`: Post chat messages to channels.
10. `discord`: Send channel webhook messages.
11. `spotify`: Play, pause, current track.
12. `whatsapp`: Send message via WhatsApp Cloud API.
13. `linkedin`: Create/publish post.
14. `x_twitter`: Post tweets (notifies when paid tier is required).
15. `instagram`: Publish photo posts.

Credential Vault (`web/connectors/vault.py`): Encrypted credentials stored locally at rest.

---

## 3. OpenMuse Port (`web/om/`)

| File | Purpose | Status |
|---|---|---|
| `web/om/computer.py` | Isolated Linux / local sandbox execution with command receipts | Working (receipts: stdout, stderr, exit code) |
| `web/om/browser.py` | Persistent Playwright browser sessions with console takeover | Working (with Chromium & HTTP fallback) |
| `web/om/activity.py` | Durable task runs: plans, checkpoints, leases, pause/resume, retry sweeper | Working with exponential backoff daemon |
| `web/om/ideas.py` | Evidence-backed ideas (new -> accepted/edited/dismissed) | Working |
| `web/om/goals.py` | Goals and milestones tracker | Working |
| `web/om/documents.py` | PDF parsing, OCR with Tesseract/pdftoppm, field inspection, form filling | Working |
| `web/om/finance.py` | CSV spending analysis & category totals | Working |
| `web/om/threads.py` | Main and side conversation threads | Working |
| `web/om/notify.py` | Durable notification inbox with Telegram push integration | Working |
| `web/om/mailrules.py` | Automatic Gmail scanning based on rules -> creates ideas with evidence | Working |

---

## 4. Entrypoints

1. `cli.py`: Text conversation REPL with live streaming and HUD formatting; `cli.py dashboard` starts the web dashboard.
2. `os_cli.py`: CLI testing all phases, connectors, and tools.
3. `voice_cli.py`: Voice mode with microphone capture, AEC, VAD, STT, LLM, TTS, speaker, and barge-in.
4. `web/server.py`: FastAPI server running at `http://localhost:3000` hosting API and vanilla web dashboard.
