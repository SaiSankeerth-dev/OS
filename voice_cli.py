"""JARVIS voice CLI: run the real voice pipeline on real hardware.

Run:
    python voice_cli.py
    python voice_cli.py --list-devices
    python voice_cli.py --model qwen3:14b

Pipeline (all from config/settings.yaml, voice: section):
    mic (sounddevice) -> NlmsAEC -> Silero VAD -> faster-whisper STT
        -> ConversationManager (Ollama) -> PocketTTS -> speaker (sounddevice)

Automatic barge-in is on: speaking while JARVIS talks interrupts it.

Note: this needs a machine with a microphone and speaker. On a headless
VM there is no audio hardware; use --list-devices to confirm.
"""
from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config  # noqa: E402
from server.conversation import ConversationManager  # noqa: E402
from server.jarvis_ui import boot_sequence, hud, print_banner  # noqa: E402
from server.llm.router import ModelRouter  # noqa: E402
from server.routing import LayaRouter  # noqa: E402
from server.utils import setup_logging  # noqa: E402


log = logging.getLogger("os.voice_cli")


def _list_devices() -> int:
    try:
        from server.voice.audio_io import list_audio_devices
    except Exception as exc:  # pragma: no cover - hardware path
        print(f"  ! {exc}")
        return 2
    try:
        devices = list_audio_devices()
    except RuntimeError as exc:
        print(f"  ! {exc}")
        return 2
    print("Audio devices:")
    for i, d in enumerate(devices):
        direction = []
        if d["max_input_channels"] > 0:
            direction.append("in")
        if d["max_output_channels"] > 0:
            direction.append("out")
        print(f"  [{i}] {d['name']} ({'/'.join(direction) or 'none'})")
    return 0


async def amain(args: argparse.Namespace) -> int:
    if args.list_devices:
        return _list_devices()

    cfg = load_config()
    if args.model:
        cfg.llm.model = args.model
    setup_logging(level=cfg.logging.level, file_path=cfg.logging.file)

    print_banner()
    print(f"  JARVIS voice initializing... model={cfg.llm.model} | provider={cfg.llm.provider}")
    router = ModelRouter.from_config(
        base_url=cfg.llm.base_url,
        model=cfg.llm.model,
        timeout_sec=float(cfg.llm.request_timeout_sec),
    )
    mgr = ConversationManager(cfg, router, fast_router=LayaRouter())
    ok = await mgr.health()
    if not ok:
        print(f"  ! Could not reach Ollama at {cfg.llm.base_url}. Is it running?")
        return 2
    print(hud("CORE", f"neural core online ({cfg.llm.model})"))

    try:
        from server.voice.factory import build_voice_engine
    except Exception as exc:  # pragma: no cover - hardware path
        print(f"  ! {exc}")
        return 2
    try:
        engine = build_voice_engine(mgr, cfg)
    except RuntimeError as exc:
        print(f"  ! {exc}")
        return 2

    boot_sequence(
        [
            ("audio in", True, f"{cfg.voice.sample_rate_in} Hz mic"),
            ("audio out", True, f"{cfg.voice.sample_rate_out} Hz speaker"),
            ("vad", True, f"{cfg.voice.vad_backend}"),
            ("aec", True, f"{cfg.voice.aec}"),
            ("stt", True, f"faster-whisper {cfg.voice.stt_model}"),
            ("tts", True, f"{cfg.voice.tts_engine}"),
        ]
    )

    print("  Speak, sir. Talk over me to interrupt. Ctrl+C to power down.\n")
    try:
        await engine.start_listening()
    except KeyboardInterrupt:
        print("\nPowering down. Good day, sir.")
    finally:
        await engine.stop()
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="JARVIS — real voice pipeline")
    ap.add_argument("--model", help="override Ollama model (e.g. qwen3:14b)")
    ap.add_argument(
        "--list-devices", action="store_true", help="print audio devices and exit"
    )
    args = ap.parse_args()
    try:
        return asyncio.run(amain(args))
    except KeyboardInterrupt:
        print("\nPowering down. Good day, sir.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
