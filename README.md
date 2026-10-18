# OS — The Personal AI Operating System

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](pyproject.toml)
[![Frontend: React 18](https://img.shields.io/badge/frontend-React%2018%20%2B%20Tailwind-cyan.svg)](frontend/)
[![Architecture: Local-First](https://img.shields.io/badge/cloud-required%20none%20(%E2%82%B90)-purple.svg)](#)
[![Docker: Debian 12 Bookworm](https://img.shields.io/badge/docker-Debian%2012%20Virtual%20Desktop-orange.svg)](docker/)

**OS** is a persistent, local-first personal AI operating system designed to execute real work across your digital life. It pairs an Apple-inspired visual frontend with an authentic Linux Docker desktop, genuine Playwright CDP browser automation, an on-device voice pipeline, and a cryptographic approval safety engine.

Chat with OS via text or voice, command specialist agents, browse and interact with live web applications, run commands in an isolated Linux sandbox, or orchestrate 16 integrated digital connectors — **with every sensitive write operation gated by human approval**.

---

## Architecture & Subsystems

```
                                  +------------------------------------+
                                  |    OS Apple-Inspired Web UI        |
                                  |    (React 18, Vite, Tailwind CSS)  |
                                  +-----------------+------------------+
                                                    | HTTP & WebSockets
                                                    v
+---------------------------------------------------+---------------------------------------------------+
|                                        OS Core Backend (FastAPI)                                      |
+--------------------------+----------------------------+---------------------------+-------------------+
|  Virtual Computer Engine |   Cyber-HUD & Agent Teams  | Cryptographic SafeExecutor|  Connectors & MCP |
|  - Playwright CDP bridge |   - 5-stage execution DAG  | - SHA-256 parameter hash  |  - 16 production  |
|  - Dual-cursor arbiter   |   - Hardware profile specs | - Time-bounded expiration |    adapters       |
|  - Virtual AI keyboard   |   - Specialist agent team  | - Zero handler execution  |  - Fernet-vault   |
|  - Jailed subprocess lab |   - Intent router          |   on rejection/timeout    |  - MCP JSON-RPC   |
+--------------------------+----------------------------+---------------------------+-------------------+
            |                                                         |                       |
            v                                                         v                       v
+--------------------------+                               +--------------------+   +-------------------+
|   Docker Linux Desktop   |                               |  On-Device Voice   |   | External Services |
|  (Debian 12 Bookworm)    |                               | - NLMS AEC filter  |   | (Google, GitHub,  |
|  - Xvfb display server   |                               | - Silero VAD       |   |  Notion, Slack,   |
|  - Openbox 3.6 + tint2   |                               | - faster-whisper   |   |  Discord, etc.)   |
|  - Chromium on :9222 CDP |                               | - PocketTTS        |   |                   |
|  - noVNC HTML5 on :6080  |                               | - Real barge-in    |   |                   |
+--------------------------+                               +--------------------+   +-------------------+
```

---

## Key Capabilities

### 1. Dual-Cursor Virtual Computer & Linux Desktop
- **Authentic Linux Session**: Runs in an isolated Docker container (`Debian 12 Bookworm`) featuring a true X11 display (`:1`), Openbox 3.6 window manager, tint2 status panel, and Chromium with remote CDP debugging (`:9222`).
- **Interactive HTML5 Streaming**: Live low-latency stream streamed directly via websockify/noVNC on port `6080` without frontend mockups or fake wallpapers.
- **Dual-Cursor Takeover**: Distinguishes between human direct hardware input and the agent's glowing cyan cursor. Moving the mouse or pressing any key immediately pauses the AI agent and hands instant control to the user.
- **AI Virtual Keyboard**: Complete keyboard emulation enabling AI agents to type natively, navigate form fields, handle multi-line editors, and send shortcuts (`Ctrl+C`, `Enter`, `Tab`) into any active web or desktop window.
- **Isolated Developer Sandbox Lab**: Jailed workspace filesystem (`/workspace`) with scrubbed environment variables and a 30-second execution safety timeout.

### 2. Apple-Inspired Frontend Experience
- Designed with macOS Human Interface Guidelines in mind: restrained typography, subtle borders, frosted glass surfaces, and responsive light and dark appearances.
- **Global Command Palette (`⌘K` / `Ctrl+K`)**: Rapid navigation between views, system actions, and agent workflows.
- **Inspector Panel**: Collapsible side rail displaying dual-cursor coordinates, active execution backends, and system telemetry.
- **Accessible UI**: Full ARIA modal compliance, keyboard accessibility, and reduced-motion support.

### 3. Cyber-HUD & Dynamic 5-Stage Execution Pipeline
- Dynamic execution DAG: **Observation → Planning → Agent Coordination → Execution → Evidence Verification**.
- Real-time telemetry: Model latency tracking, token usage, hardware profile detection (CPU cores, RAM, GPU acceleration), and execution trace recording.
- Proactive GitHub Intelligence & Discovery: Discovers trending AI/automation repositories, generates multi-dimensional engineering quality scores, and queues research candidates.

### 4. Cryptographic Safety Engine (SafeExecutor)
- **Zero-Bypass Policy**: Read actions execute transparently; all state-changing writes (sending emails, modifying calendars, creating posts, deleting files, running shell scripts) produce a cryptographically bound `PendingApproval`.
- **SHA-256 Argument Hash Binding**: The approval card binds the exact target tool, argument payload, and content hash. Any runtime argument substitution, parameter tampering, or replay invalidates the approval immediately.
- **Audit & Evidence Trail**: Every execution records cryptographic receipts and postcondition evidence, available in the Activity view.

### 5. 16 Production Connectors (Zero Mocks)
Integrated with Fernet-encrypted vault storage, OAuth 2.0 flows, and live health verification:
- **Productivity**: Google Calendar, Gmail, Google Sheets, Google Drive, Notion
- **Developer**: GitHub, Custom MCP JSON-RPC APIs
- **Communication & Social**: Slack, Discord, Telegram, WhatsApp, LinkedIn, X (Twitter), YouTube, Spotify, Instagram

### 6. Full-Duplex On-Device Voice Pipeline
- Runs 100% locally with zero cloud dependencies:
  - **Capture**: `sounddevice` input stream with selectable device routing
  - **AEC**: NLMS adaptive acoustic echo cancellation (~21 dB reduction)
  - **VAD**: Silero VAD (voice activity detection)
  - **STT**: `faster-whisper` streaming transcription
  - **TTS**: `PocketTTS` low-latency synthesis
  - **Barge-In**: Automatic watchdog interrupts speech synthesis the moment user voice activity is detected.

---

## Quickstart

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **Docker**: Docker Desktop (optional, for Linux Virtual Computer)
- **Ollama**: (optional, for local LLM inference): `ollama serve && ollama pull qwen3:8b`

### Option A: Complete Docker Deployment

```bash
# Clone the repository
git clone https://github.com/SaiSankeerth-dev/OS.git
cd OS

# Start the full stack with Docker Compose
docker compose up -d
```
Open **http://localhost:3000** in your browser.

---

### Option B: Local Development Setup

#### 1. Backend & CLI Installation
```bash
# Create and activate Python virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies with dashboard and development tools
pip install -e ".[dashboard,dev,google]"
```

#### 2. Frontend Build
```bash
cd frontend
npm install
npm run build
cd ..
```
The compiled React production bundle is placed into `web/static/` and served directly by FastAPI.

#### 3. Launch OS Dashboard
```bash
python cli.py dashboard --port 3000
```
Visit **http://localhost:3000** to access the dashboard.

---

## Operational Commands & CLI

| Command | Purpose |
|---|---|
| `python cli.py dashboard --port 3000` | Start the FastAPI web server & dashboard |
| `python cli.py` | Interactive terminal assistant session |
| `python voice_cli.py` | Full-duplex voice session (requires microphone & speaker) |
| `python cli.py doctor` | Check environment, dependencies, audio devices, and Docker |
| `python cli.py init` | Initialize local databases, configuration, and secure vaults |

---

## Directory Structure

```
OS/
├── config/                 # System configuration and default profiles
│   └── settings.yaml       # Master settings (local.yaml for gitignored overrides)
├── docker/                 # Virtual computer container definition & startup scripts
│   ├── Dockerfile          # Debian 12 Bookworm + Xvfb + Openbox + Chromium
│   ├── supervisord.conf    # Process supervisor configuration
│   └── start-desktop.sh    # Container entrypoint and wallpaper setup
├── frontend/               # React 18 + TypeScript + Tailwind CSS UI
│   ├── src/
│   │   ├── components/     # Apple-inspired views, cards, modals, and navigation
│   │   ├── context/        # Global application state and telemetry providers
│   │   └── types/          # UI and API type definitions
│   └── vite.config.ts      # Vite build configuration (outputs to web/static/)
├── jarvis_os/              # Core runtime primitives, DAG router, and memory store
├── server/                 # Backend system services
│   ├── computer/           # Docker desktop backend, CDP browser harness, and sandbox
│   ├── intelligence/       # GitHub discovery, repo scoring, and research engine
│   ├── supervisor/         # SafeExecutor, approval engine, and evidence verification
│   └── voice/              # AEC, Silero VAD, Whisper STT, and PocketTTS bridge
├── web/                    # FastAPI HTTP application and WebSocket endpoints
│   ├── connectors/         # 16 service adapters, OAuth handlers, and Fernet vault
│   ├── routes_*.py         # Computer control, discovery, and HUD routes
│   └── static/             # Compiled production UI bundle served by FastAPI
└── tests/                  # Automated unit, integration, and E2E test suites
```

---

## Running Tests

Verify the system using the built-in test suites:

```bash
# 1. Run core backend, virtual computer, and approval tests
pytest tests/test_docker_virtual_computer.py tests/test_virtual_keyboard.py tests/test_approvals.py tests/test_connectors_v2.py -v

# 2. Run agent execution and virtual lab tests
pytest tests/test_browser_agent_execution.py tests/test_virtual_lab.py -v

# 3. Run Playwright UI interactive control validation
node scripts/verify-ui-controls.mjs
node scripts/verify-ui-interactions.mjs
```

---

## Safety & Security Guarantee

1. **Local-First Privacy**: No private user data, keystrokes, audio, or credentials ever leave your machine.
2. **Cryptographic Argument Tamper-Proofing**: State-changing writes are bound to a SHA-256 hash of their exact arguments.
3. **Encrypted Vault**: Credentials and OAuth access tokens are encrypted with Fernet symmetric encryption at rest (`cryptography`).
4. **Isolated Sandboxing**: Virtual computer and terminal scripts execute inside containerized or jailed process boundaries with scrubbed environment variables and hard timeouts.

---

## License

Released under the **MIT License**. Built with passion by [Sai Sankeerth Voorugonda](https://github.com/SaiSankeerth-dev).
