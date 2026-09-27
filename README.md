# J.A.R.V.I.S.

**Just A Rather Very Intelligent System** — a local-first, voice-first AI assistant that runs on your own machine. No cloud required.

```
                 .-=========-.
              _.-'  .-""-.  '-._
            .'   .'        '.   '.
           /    /   .--.     \    \
          |    |   ( ◉  )     |    |
          |    |    '--'      |    |
           \    \   .--.     /    /
            '.   '.        .'   .'
              '-._  '-..-'  _.-'
                  '-=====-'
```

> "At your service, sir."

## What it does

Talk to it. It listens, thinks, and talks back — entirely on-device except the LLM, which runs on your local Ollama.

```
mic → echo cancellation → voice activity detection → speech-to-text
    → conversation engine (intent routing · tools · memory · Ollama)
    → sentence buffering → text-to-speech → speaker
```

Talk over it mid-sentence and it stops — automatic barge-in is always on.

## Quick start

```bash
# 1. Python env + deps
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-voice.txt   # mic/speaker/STT/TTS/VAD

# 2. Local LLM
ollama serve
ollama pull qwen3:8b

# 3a. Text mode
python cli.py

# 3b. Voice mode (needs mic + speaker)
python voice_cli.py
python voice_cli.py --list-devices   # check your audio hardware
```

## Web dashboard — the OS that does things

One command, then open **http://localhost:3000**:

```bash
docker compose up        # builds once, keeps your data in a volume
# …or without Docker:
pip install ".[dashboard,google]"
python cli.py dashboard --port 3000
```

Chat does real work through connectors: *"schedule a meeting tomorrow at 4"*
creates a real Google Calendar event, *"send this to GitHub"* opens a real
issue. Reads run immediately; **every write asks your approval first** —
in chat, and again in the approval rail. Nothing is "connected" until it
passes a live health check, and credentials are encrypted on disk.

- **Settings ▦ → Connectors** — Connected / Available groups, search, per-service
  setup guides, OAuth sign-in, test & revoke. Like the mock, but everything works.
- **Defaults per connector** — default GitHub repo, Slack channel, Notion parent, spreadsheet.
- **MCP bridge** — every connected service is also an MCP tool at `POST /mcp`
  (`initialize`, `tools/list`, `tools/call`); write tools return a pending
  approval instead of executing.
- **Honest free tier** — GitHub, Notion, Telegram, Slack, Discord bots, Google
  OAuth apps and YouTube search all have free paths; X posting needs a paid API
  tier and says so.

Google connectors need a one-time [Google Cloud OAuth client](https://console.cloud.google.com/apis/credentials)
(desktop app, redirect `http://localhost:3000/api/connectors/google/oauth/callback` —
the setup guide inside the app walks you through it).

## The pipeline, stage by stage

| Stage | Component | File |
|---|---|---|
| Microphone capture | sounddevice input stream, selectable device | `server/voice/audio_io.py` |
| Echo cancellation | NLMS adaptive filter (~21 dB reduction) | `server/voice/aec.py` |
| Voice activity detection | Silero VAD (energy fallback) | `server/voice/vad.py` |
| Speech → text | faster-whisper, VAD-gated streaming | `server/voice/stt.py` |
| Conversation | state machine + intent router + tools + memory + Ollama | `server/conversation/` |
| Sentence buffering | abbreviation/decimal-aware splitter | `server/voice/` |
| Text → speech | PocketTTS | `server/tts/pocket.py` |
| Speaker playback | sounddevice output stream | `server/voice/audio_io.py` |
| Barge-in | VAD watchdog interrupts playback on speech | `server/voice/engine.py` |

Assemble the whole thing from config with one call:

```python
from server.voice.factory import build_voice_engine
engine = build_voice_engine(conversation_manager, config)
```

## Configuration

Everything lives in `config/settings.yaml` (`config/local.yaml` overrides it, gitignored):

```yaml
personality:
  name: JARVIS
voice:
  input_device: null      # null = default; or match by name / index
  output_device: null
  sample_rate_in: 16000
  sample_rate_out: 24000
  vad_backend: silero
  aec: nlms
  barge_in_chunks: 4
  stt_model: small
  tts_engine: pocket-tts
```

## Personality

JARVIS is precise, unfailingly polite, and dry-witted. He addresses you as "sir", keeps spoken replies to a few sentences, never uses robotic filler, and never breaks character. Forbidden-phrase scrubbing and the full trait list are in `config/settings.yaml` → `personality:`.

## Tests

```bash
pytest tests/ -q     # 119 tests, all passing
```

Includes a real TTS→STT roundtrip: PocketTTS synthesizes speech, faster-whisper transcribes it back word-perfect.

## Hardware validation

This repo was completed on a headless machine, so live mic/speaker I/O is validated via `HARDWARE_TEST.md` — a step-by-step checklist for your laptop.

## Docs

- `docs/RELEASE_v1.md` — v1.0.0 foundation release notes (what's in, what's deferred, known limitations)
- `AUDIT_REPORT.md` — full component audit with scores (74/100)
- `COMPLETION_REPORT.md` — what was built to complete the voice pipeline
- `HARDWARE_TEST.md` — laptop validation checklist

## Credits

Voice-pipeline patterns adapted from [OpenJarvis](https://github.com/open-jarvis/OpenJarvis) (Apache-2.0, Stanford Hazy Research) — see `COMPLETION_REPORT.md` for per-file attribution. Built by [Sai Sankeerth Voorugonda](https://github.com/SaiSankeerth-dev). MIT licensed.
