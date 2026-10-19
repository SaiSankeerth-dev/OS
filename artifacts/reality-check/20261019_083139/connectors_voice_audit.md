# Connectors, OAuth & Voice Audit — os-10x @ ff1e5af

**Scope:** Tasks K (Connectors/OAuth) and L (Voice). Read-only audit, no code modified.
**Date:** 2026-10-19. **Branch:** `os-10x` @ `ff1e5af` ("Batch B: real interactive browser").

---

## 1. Connector Inventory

**16 connectors** defined in `web/connectors/manifests.py` (`MANIFESTS` list):

| # | ID | Auth kind |
|---|----|-----------|
| 1 | google_calendar | google_oauth |
| 2 | gmail | google_oauth |
| 3 | google_sheets | google_oauth |
| 4 | google_drive | google_oauth |
| 5 | youtube | google_oauth |
| 6 | github | token (paste) |
| 7 | notion | token (paste) |
| 8 | telegram | token (paste) |
| 9 | slack | token (paste) |
| 10 | discord | token (paste) |
| 11 | spotify | oauth (spotify) |
| 12 | whatsapp | token / QR |
| 13 | linkedin | token (paste) |
| 14 | x | token (paste) |
| 15 | instagram | token (paste) |
| 16 | microsoft_outlook | microsoft_oauth |

(`web/connectors/manifests.py:24-396` — 16 `ConnectorManifest(id=...)` entries.)

---

## 2. Health Checks — REAL, not fake ✅

**Verdict: PASS.** Every adapter's `health_check` makes a live provider API call.

Evidence:
- Base contract requires it: `web/connectors/base.py:85-91` — docstring: *"Validate credentials against the LIVE service. Returns (ok, message). Must make a real network call — a connector is only 'connected' when this passes."*
- Google Calendar: `web/connectors/adapters.py:125-128` — calls `svc.calendarList().list(maxResults=1).execute()` against the real Google API.
- 16 `health_check` implementations found in `adapters.py` (lines 125–638), one per adapter.
- The dashboard only reports "connected" after this passes; the API status endpoint (`web/server.py:1410`) gates on it.

**What breaks without network/credentials:** health check raises `AdapterError` → connector shows honest failure state, never fake "connected".

---

## 3. OAuth Security

### 3.1 State parameter (CSRF) — SECURE ✅

- Callback: `web/server.py:741` — `state = secrets.token_urlsafe(16)` — cryptographically random per flow.
- Stored single-use: `web/server.py:743` — `_OAUTH_STATES[state] = {"cid": cid, "created": time.time()}` with comment "Random single-use state prevents CSRF on the callback (valid 10 min)."
- Validated on callback: `web/server.py:759-762` — pops state (single-use), rejects if missing or older than 600s with HTTP 400.
- Note: `web/connectors/oauth_google.py:43` has `state: str = "google"` as a *function-signature default*, but the real caller (`web/server.py:744-745`) always passes the random state. The default is never used in production flow. **Not a vulnerability**, but the default is misleading.

### 3.2 Token storage — ENCRYPTED ✅

- `web/connectors/vault.py:3` — "Secrets are encrypted with Fernet (AES-128-CBC + HMAC) before they touch disk."
- `vault.py:52-58` — `encrypt_dict`/`decrypt_dict` via Fernet; key from `~/.os-dashboard-key` file or `OS_DASHBOARD_KEY` env, else generated.
- Only the **refresh token** is stored (`oauth_google.py:56-62`); access tokens are short-lived and re-derived. Client secret stored alongside (needed for refresh) — encrypted at rest.

### 3.3 Minor: `postMessage` wildcard origin ⚠️ LOW

- `web/connectors/oauth_google.py` `SUCCESS_HTML` — `window.opener.postMessage({type:"oauth-done",...}, "*")`.
- Impact: any origin could *receive* the "oauth-done" message, but the message carries no secrets (just a completion signal). The dashboard listener (`ConnectorsView.tsx`) only refreshes connector state on receipt; it does not grant access. **Design concern, not exploitable.**

### 3.4 Revoke — LOCAL ONLY ⚠️ MEDIUM (honesty gap)

- `web/server.py:697-700` — `revoke_connector` calls `get_dash().revoke(cid, m.cred_group)` which only `DELETE`s rows from `connector_state` / `connector_settings` (`web/store.py:106-125`).
- **No call to provider revocation endpoints** (Google `https://oauth2.googleapis.com/revoke`, Microsoft equivalent).
- Consequence: after "revoke", the refresh token **remains valid at the provider** until the user manually revokes at myaccount.google.com/permissions. OS can no longer use it (deleted locally), so there is no ongoing unauthorized access *by OS* — but the credential is not dead provider-side.
- The UI toast (per prior audit) says "credentials deleted from vault" — honest wording. **No false claim found in current code**, but provider-side revocation is missing.

---

## 4. Voice Pipeline

### 4.1 Architecture — REAL, not a stub ✅

Full pipeline in `voice_cli.py:9-10` (docstring):
```
mic (sounddevice) → NlmsAEC → Silero VAD → faster-whisper STT
  → ConversationManager (Ollama) → PocketTTS → speaker (sounddevice)
```

Component evidence:
| Stage | File:line | Implementation |
|-------|-----------|----------------|
| Audio in/out | `server/voice/audio_io.py:81-93` | `sounddevice`; lazy import, raises `RuntimeError` with install hint if missing |
| AEC | `server/voice/factory.py:47-51` | `NlmsAEC` (real NLMS filter) or passthrough |
| VAD | `server/voice/vad.py` | Silero VAD |
| STT | `server/voice/stt.py:69-76` | `faster_whisper.WhisperModel` — real local Whisper |
| TTS | `server/tts/pocket.py:25` | `PocketTTSEngine`; `server/tts/mock.py` fallback |
| Brain | `voice_cli.py:75-80` | `ConversationManager` + `ModelRouter` (Ollama); **hard-requires Ollama reachable** (`voice_cli.py:77-80` returns exit 2 if not) |

### 4.2 What breaks without hardware

- **No microphone/speaker:** `build_voice_engine` raises `RuntimeError` (`server/voice/factory.py:21-23` docstring: "Raises RuntimeError with a clear message if audio hardware or a model is unavailable"). `voice_cli.py:88-91` catches it, prints the message, exits 2. **Fails loudly, not silently.**
- **No Ollama:** hard exit 2 before audio init (`voice_cli.py:77-80`). Voice is unusable without the model — by design (no cloud fallback, local-first).
- **Missing `sounddevice`/`faster-whisper`:** clear `RuntimeError` with pip install hint (`server/voice/audio_io.py:86-88`).
- **Mocks exist** for testing without hardware: `MockAudioInput`/`MockAudioOutput` (`server/voice/audio_io.py:45-64`), `MockTTS` (`server/tts/mock.py`), selectable via `tts_engine="mock"` (`server/voice/factory.py:81-85`). But `voice_cli.py` always builds the real engine — mocks are for tests, not a hardware-free voice mode.

### 4.3 Voice verdict

**Real pipeline, honestly gated.** Every stage is a genuine implementation (faster-whisper, Silero, PocketTTS, NLMS AEC). Missing dependencies or hardware produce clear errors, never silent fake voice. The tradeoff: **voice requires Ollama + microphone + speaker + ~4 Python packages** — a heavyweight setup that will fail on most machines out of the box, but it fails *honestly*.

---

## 5. Summary Scorecard

| Area | Verdict | Score |
|------|---------|-------|
| Connector health checks | Real live API calls per adapter | 9/10 |
| OAuth CSRF (state) | Random, single-use, expiring | 9/10 |
| Token storage | Fernet-encrypted at rest, refresh-token only | 8/10 |
| Provider-side revoke | **Missing** — local delete only | 5/10 |
| postMessage origin | Wildcard, but no secret leakage | 7/10 |
| Voice pipeline | Real STT/VAD/TTS/AEC, honest failures | 8/10 |
| Voice without hardware | Clear errors; mocks test-only | 7/10 |

**Strongest:** health checks and OAuth state handling are genuinely well done.
**Biggest gap:** no provider-side token revocation on disconnect.
