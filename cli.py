"""JARVIS CLI: text REPL conversing with JARVIS via Ollama.

Run:
    python cli.py
    python cli.py --model qwen3:14b
    python cli.py --reset

Features:
  - Streams tokens to the terminal as they arrive (low first-token latency).
  - Perf trace lines (Section 37) live in logs/perf.jsonl.
  - Type /help, /state, /reset, /quit.
"""
from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from pathlib import Path

# Make the package paths importable when running this file directly.
ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config  # noqa: E402
from server.conversation import ConversationManager, ConversationState  # noqa: E402
from server.jarvis_ui import hud, print_banner  # noqa: E402
from server.llm.router import ModelRouter  # noqa: E402
from server.routing import LayaRouter  # noqa: E402
from server.utils import setup_logging  # noqa: E402


log = logging.getLogger("os.cli")


def state_glyph(s: ConversationState) -> str:
    return {
        ConversationState.IDLE: "IDLE",
        ConversationState.LISTENING: "LISTENING",
        ConversationState.SPEECH_DETECTED: "SPEECH_DETECTED",
        ConversationState.TRANSCRIBING: "TRANSCRIBING",
        ConversationState.USER_FINISHED: "USER_FINISHED",
        ConversationState.THINKING: "THINKING",
        ConversationState.SPEAKING: "SPEAKING",
        ConversationState.INTERRUPTED: "INTERRUPTED",
        ConversationState.READY: "READY",
    }.get(s, "IDLE")


async def amain(args: argparse.Namespace) -> int:
    cfg = load_config()
    if args.model:
        cfg.llm.model = args.model
    setup_logging(level=cfg.logging.level, file_path=cfg.logging.file)

    router = ModelRouter.from_config(
        base_url=cfg.llm.base_url,
        model=cfg.llm.model,
        timeout_sec=float(cfg.llm.request_timeout_sec),
    )
    mgr = ConversationManager(cfg, router, fast_router=LayaRouter())

    print_banner()
    print(f"  JARVIS initializing... model={cfg.llm.model} | provider={cfg.llm.provider}")
    ok = await mgr.health()
    if not ok:
        print(f"  ! Could not reach Ollama at {cfg.llm.base_url}. Is it running?")
        print(f"  ! Try: ollama serve   (and ensure '{cfg.llm.model}' is pulled)")
        return 2
    print(hud("CORE", f"neural core online ({cfg.llm.model})"))
    print(hud("SYS", "all systems nominal. At your service, sir."))
    print("  Type /help for commands. Ctrl+C or /quit to exit.\n")

    if args.reset:
        mgr.reset()
        print("(history reset)\n")

    while True:
        try:
            user = await asyncio.to_thread(input, "you › ")
        except (EOFError, KeyboardInterrupt):
            print()
            break
        user = user.strip()
        if not user:
            continue
        if user.lower() in ("/quit", "/exit", "/q"):
            break
        if user.lower() == "/help":
            print("  /help       this list")
            print("  /state      show conversation state")
            print("  /reset      clear conversation history")
            print("  /quit       exit")
            continue
        if user.lower() == "/state":
            print(f"  state: {mgr.state.value}")
            continue
        if user.lower() == "/reset":
            mgr.reset()
            print("  (history reset)")
            continue

        # --- Conversational output, Muse-style: quiet framing, live
        # markdown while tokens stream, structured finish (panels for
        # approvals and heads-ups). Plain text when rich/TTY missing.
        from server import jarvis_ui as ui  # noqa: E402

        thinking = ui.begin_thinking()
        stream = None
        buf: list[str] = []
        try:
            async for chunk in mgr.respond_text(user):
                if not chunk.delta:
                    continue
                if thinking is not None:
                    thinking.stop()
                    thinking = None
                if stream is None:
                    stream = ui.start_stream()
                    if stream is None:
                        print("jarvis › ", end="", flush=True)
                buf.append(chunk.delta)
                if stream is not None:
                    stream.update("".join(buf))
                else:
                    print(chunk.delta, end="", flush=True)
            if stream is None:
                print()
        except Exception as e:
            print(f"\n  [error: {type(e).__name__}]\n")
            log.exception("respond_text failed")
        finally:
            if thinking is not None:
                thinking.stop()
            if stream is not None:
                stream.finish("".join(buf))
            continue

    print("Powering down. Good day, sir.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="JARVIS — text conversation")
    ap.add_argument("--model", help="override Ollama model (e.g. qwen3:14b)")
    ap.add_argument("--reset", action="store_true", help="start with empty history")
    ap.add_argument(
        "command",
        nargs="?",
        choices=["dashboard"],
        help="'dashboard' starts the web UI",
    )
    ap.add_argument("--port", type=int, default=3000, help="dashboard port")
    ap.add_argument("--host", default="127.0.0.1", help="dashboard host")
    args = ap.parse_args()
    if args.command == "dashboard":
        import os as _os

        # Data paths (data/...) are relative: run from the repo root so the
        # dashboard shares the CLI's databases.
        _os.chdir(_os.path.dirname(_os.path.abspath(__file__)))
        from web.server import run as run_dashboard

        run_dashboard(port=args.port, host=args.host)
        return 0
    try:
        return asyncio.run(amain(args))
    except KeyboardInterrupt:
        print("\nBye.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())