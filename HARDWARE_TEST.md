# OS Voice — Hardware Test Checklist

The voice pipeline was built and verified with **synthetic audio** on a VM
that has **no microphone, no speaker, and no PortAudio**. Everything that
could be proven without hardware was proven (see `COMPLETION_REPORT.md`).
This checklist is for running the real thing on a laptop.

## 0. Prerequisites (laptop)

```bash
# System audio library (Debian/Ubuntu; macOS/Windows ship their own)
sudo apt install libportaudio2

# Python deps (inside the OS venv)
pip install -e ".[voice]"
# CPU torch (default from PyPI is fine):
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

Ollama must be running with a model pulled:

```bash
ollama serve
ollama pull qwen3:14b   # or set llm.model in config/local.yaml
```

## 1. Confirm audio devices are visible

```bash
cd ~/workspace/os/OS
python voice_cli.py --list-devices
```

Expected: a numbered list with at least one input ("in") and one output
("out") device. If you see

> `sounddevice is installed but the PortAudio system library could not be loaded...`

install `libportaudio2` (step 0). If the list is empty, the OS sees no audio
hardware — nothing else will work until that is fixed.

## 2. Pick devices (optional)

Edit `config/local.yaml` (create it if missing):

```yaml
voice:
  input_device: "USB Microphone"   # substring match, or an integer index
  output_device: "Speakers"
  sample_rate_in: 16000
  sample_rate_out: 24000
```

Omit the keys to use system defaults.

## 3. First voice run

```bash
python voice_cli.py
```

What should happen:

1. `Ollama: healthy` prints.
2. Say **"hello"** — OS should reply out loud within a few seconds.
3. **Barge-in test:** while OS is speaking, say **"stop stop stop"** loudly.
   OS must cut off mid-sentence and go back to listening.
4. **Echo test:** play music on the laptop speakers and talk at the same
   time. Your speech should still be understood (NLMS AEC is cancelling the
   speaker echo); without AEC you would hear OS transcribe its own voice.

## 4. What to listen/look for

| Check | Healthy sign | If broken |
|---|---|---|
| Mic capture | OS responds to speech | check `input_device`, mic permissions |
| VAD | short pauses don't cut you off; long silence ends your turn | tune `voice.vad_threshold` (0.3–0.7) |
| AEC echo | OS doesn't transcribe its own speech | set `voice.aec: passthrough` to compare |
| Barge-in | talking over OS interrupts it | lower `voice.barge_in_chunks` (min 2) |
| TTS voice | clear speech, correct words | check `POCKET_TTS_CONFIG`/`POCKET_TTS_VOICE` |
| Latency | first reply < ~5 s on CPU | use `stt_model: tiny`, smaller LLM |

## 5. Model downloads (one-time, automatic)

On first run the following download automatically (cached afterwards):

- faster-whisper `small` (~244 MB) → `~/.cache/huggingface`
- Silero VAD (~2 MB) → torch hub cache
- PocketTTS public non-voice-cloning weights (~219 MB) → `~/.cache/huggingface`.
  The default `kyutai/pocket-tts` weights are gated (HF login + accepted terms);
  the engine automatically falls back to the public weights, so **no login or
  manual download is needed**. (If you accept the gated terms instead, `huggingface-cli
  login` unlocks the voice-cloning weights.)
- PocketTTS voice: predefined `"alba"` (default). Override with
  `POCKET_TTS_VOICE` (another predefined name or a local `.wav`); fully offline
  setups can point `POCKET_TTS_CONFIG` at a custom YAML with local weight paths.

Note: if model downloads fail with `httpx.InvalidURL: Invalid port`, your
`no_proxy`/`NO_PROXY` env var contains bracketed IPv6 entries (e.g. `[::1]`)
that break `huggingface_hub`'s HTTP client. Workaround for the download only:

```bash
no_proxy="localhost,127.0.0.1" NO_PROXY="localhost,127.0.0.1" python voice_cli.py
```

## 6. Known limitations

- **No GPU required**, but first-token latency is CPU-bound. `tiny` STT +
  a small Ollama model is the fastest combo.
- Barge-in needs the mic and speaker on the **same machine** (AEC reference
  comes from the local output stream). Bluetooth headsets add latency that
  can weaken echo cancellation.
- PocketTTS sometimes logs `Maximum generation length reached without EOS`
  on long sentences — audio is still produced; splitting replies into short
  sentences (the default) avoids it.

## 7. Quick synthetic self-test (no hardware needed)

```bash
cd ~/workspace/os/OS
TMPDIR=~/workspace/os/.tmp ../.venv/bin/python -m pytest tests/ -q
```

118 tests should pass; 1 skipped (real-mic test). This validates AEC
(21.5 dB ERLE on synthetic echo), Silero VAD, STT segmentation, TTS honesty,
auto barge-in logic, and config plumbing without any audio hardware.
