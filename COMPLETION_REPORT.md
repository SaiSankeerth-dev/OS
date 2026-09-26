# OS Voice Completion Report — 2026-09-26

## Plain summary

OS's voice pipeline is now real. The microphone/speaker code, echo
canceller, voice-activity detector, speech-to-text, text-to-speech, and
automatic barge-in are all implemented and tested — **119 tests pass**
(up from 71), including a real PocketTTS voice speaking intelligible audio
and a real Whisper model transcribing it back word-perfect. The one thing
not proven here is sound coming out of / into physical hardware: this VM
has no mic, no speaker, and no PortAudio, so live audio I/O is
hardware-gated to your laptop (checklist in `HARDWARE_TEST.md`).

- **Tests:** 119 passed, 0 skipped (was 71 passed). All 71 original tests
  still pass untouched.
- **What's real now:** sounddevice I/O, NLMS echo cancellation (21.5 dB
  echo reduction on synthetic echo), Silero VAD, faster-whisper streaming
  STT, PocketTTS synthesis, VAD-triggered auto barge-in, device/rate config.
- **What's hardware-gated:** actual mic capture and speaker playback
  (needs PortAudio + audio devices — one command: `voice_cli.py`).
- **Kept as-is:** ConversationManager, IntentRouter, ToolRegistry, memory,
  all skills. No gold-plating.

## What was built

### 1. Real audio I/O — `server/voice/audio_io.py`
- `SoundDeviceAudioInput`: callback-based `sounddevice.InputStream`, bounded
  queue, async `read_chunk()`, configurable rate/channels/chunk/device.
- `SoundDeviceAudioOutput`: persistent `OutputStream`, PCM16 playback, and a
  **speaker-reference ring buffer** that feeds the AEC.
- Device selection by index or name substring; `list_audio_devices()`.
- Without sounddevice/PortAudio, constructors raise a clear error naming the
  exact install command — never an obscure traceback. (Verified: on this VM
  it reports `PortAudio library not found` with the `apt install` hint.)

### 2. Real echo cancellation — `server/voice/aec.py` (custom)
- `NlmsAEC`: NumPy normalized least-mean-squares adaptive FIR filter.
- Synthetic test (mic = delayed/attenuated copy of speaker ref): **21.5 dB
  ERLE** — echo RMS fell from ~4015 to ~337 after adaptation.
- Near-end speech (not in the reference) survives cancellation — verified by
  checking the 440 Hz tone is still dominant after AEC.
- Safe no-op when nothing has been played yet; `reset()` supported.
- `PassthroughAEC` kept for comparison/debugging (`voice.aec` switch).

### 3. Real VAD — `server/voice/vad.py`
- Silero VAD (`silero_vad` + torch) loads and runs; `backend` property
  reports `"silero"` or `"energy"`.
- Verified: speech-like signal detected, fresh silence and quiet noise
  rejected. Energy fallback kept for machines without torch.

### 4. Streaming STT — `server/voice/stt.py`
- Lazy faster-whisper loading with explicit `last_error()` / `is_ready()`.
- VAD-gated streaming: collects speech chunks, flushes an utterance on
  end-silence or max-segment length, transcribes the segment.
- **Verified with the real `tiny` model** (CPU, int8): loads in ~97 s first
  run, transcribes PCM bytes via a temp WAV. Segmentation logic tested with
  a stubbed model (2 utterances → 2 transcripts, leading silence ignored,
  trailing speech flushed).

### 5. Honest PocketTTS — `server/tts/pocket.py`
- Lazy loading; `is_ready()` true only with a real model; failures raise
  `RuntimeError` with the cause — **no more silent fake-silence fallback**.
- Uses PocketTTS 3.3's intended path: `TTSModel.load_model()` (default
  `language="english"`) auto-falls-back from the gated weights to the public
  non-voice-cloning weights, plus the predefined `"alba"` voice
  (`get_state_for_audio_prompt("alba")`). `POCKET_TTS_VOICE` overrides the
  voice (name or wav path); `POCKET_TTS_CONFIG` allows a custom offline config.
- **Verified end-to-end 2026-09-26**: real weights synthesize intelligible
  speech — "The weather is nice today." transcribed back **word-perfect** by
  real faster-whisper `tiny` (full TTS→STT roundtrip test).
- Lesson learned during verification: pointing a custom config at the raw
  weight files produces speech-like but unintelligible audio — the predefined
  voice state is required. The engine now uses the correct path by default.
- **7 TTS tests pass** (honesty + real synthesis + real roundtrip).

### 6. Automatic barge-in — `server/voice/engine.py`
- While SPEAKING, a background monitor reads mic chunks (AEC → VAD);
  N consecutive speech chunks (`voice.barge_in_chunks`, default 4) trigger
  `interrupt()` — no button, no external call.
- `interrupt()` now ungates the mic and stops playback. Fixed during this
  work: output-stop deadlock (lock no longer held across await), abort vs.
  close separation on the output stream, and AEC reference resampling to the
  input rate.

### 7. Wiring & config
- `config/settings.yaml` gained a full `voice:` section (devices, rates,
  VAD/AEC/STT/TTS knobs); `config/local.yaml` overrides it.
- `server/voice/factory.py`: `build_voice_engine(cm, cfg)` assembles the
  whole real pipeline from config — one call.
- `voice_cli.py`: `python voice_cli.py` runs it; `--list-devices` probes
  hardware. `server/voice/pipecat_runner.py` now reads rates from config
  instead of hardcoding them.

## OpenJarvis attribution

Studied https://github.com/open-jarvis/OpenJarvis (Apache-2.0) as requested.
Adapted patterns (marked in code comments): lazy audio/model imports,
actionable dependency errors, sounddevice stream style, lazy model loading
with explicit backend error state. **Custom OS work:** NLMS AEC, Silero
wrapper + energy fallback, VAD-gated utterance segmentation, automatic
barge-in, config plumbing, factory/CLI. No dedicated Silero-VAD or barge-in
implementation was found in OpenJarvis's speech code, so those are OS's own.
Skills layer intentionally left alone (no gold-plating).

## Verification evidence (all 2026-09-26, this VM)

| Claim | Evidence |
|---|---|
| 119 tests pass | `pytest tests/ -q` → 119 passed, 0 skipped |
| AEC 21.5 dB ERLE | `test_nlms_cancels_synthetic_echo` (synthetic echo pair) |
| Silero VAD works | `test_silero_*` — real `silero_vad` model, speech/silence/noise |
| Whisper tiny works | real model download + `stt.transcribe(pcm_bytes)` returns text |
| PocketTTS works | real public weights → "The weather is nice today." synthesized; `is_ready()` true |
| TTS→STT roundtrip | TTS audio fed to real Whisper `tiny` transcribes back word-perfect (`test_real_tts_to_stt_roundtrip`) |
| Barge-in logic | `test_auto_barge_in_interrupts_playback` (interrupt fired, back to LISTENING); silence does not trigger |
| sounddevice honesty | `list_audio_devices()` → clear PortAudio error on this VM |

## Known limitations / follow-ups

1. **Live mic/speaker untested** — no hardware here. Run `HARDWARE_TEST.md`
   on the laptop.
2. **PocketTTS voice**: the engine uses the predefined `"alba"` voice via
   `POCKET_TTS_VOICE` (name or wav path). The public non-voice-cloning weights
   are used automatically — no HF login needed. Accepting the gated terms at
   huggingface.co/kyutai/pocket-tts unlocks the voice-cloning weights instead.
3. **STT accuracy**: `tiny` is fast but weak; default config uses `small`.
   First `small` load downloads ~244 MB.
4. **Barge-in needs mic+speaker on the same machine** (AEC reference is
   local); Bluetooth latency weakens cancellation.
5. The `no_proxy` env quirk on this VM (bracketed IPv6 entries) breaks
   `huggingface_hub`'s httpx client; worked around with a sanitized
   `no_proxy` for downloads. Unlikely to affect a laptop, noted in case.

## Files changed

- `server/voice/audio_io.py`, `server/voice/aec.py`, `server/voice/vad.py`,
  `server/voice/stt.py`, `server/voice/engine.py`, `server/voice/factory.py`
  (new), `server/voice/pipecat_runner.py`, `server/tts/pocket.py`,
  `config/__init__.py`, `config/settings.yaml`, `voice_cli.py` (new),
  `pyproject.toml`, `AUDIT_REPORT.md`, `HARDWARE_TEST.md` (new),
  `COMPLETION_REPORT.md` (new)
- `tests/`: 7 new files, 48 new tests; no existing test modified
  (one pre-existing test was already relying on a `ChatChunk(done=True)`
  TypeError being swallowed — left as-is since it passes).

## Sandbox links

- [COMPLETION_REPORT.md](sandbox://workspace/os/OS/COMPLETION_REPORT.md)
- [HARDWARE_TEST.md](sandbox://workspace/os/OS/HARDWARE_TEST.md)
- [AUDIT_REPORT.md](sandbox://workspace/os/OS/AUDIT_REPORT.md)
- [voice_cli.py](sandbox://workspace/os/OS/voice_cli.py)
- [server/voice/factory.py](sandbox://workspace/os/OS/server/voice/factory.py)
