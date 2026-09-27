"""JARVIS terminal presentation: quiet, conversational, friendly.

Pure presentation layer — no behavior. Safe to import anywhere.
The style goal is a calm chat, not a sci-fi cockpit: a minimal boot,
clear you/jarvis framing, markdown-formatted answers, and gentle
panels for approvals and suggestions.

With `rich` installed and stdout a TTY you get markdown rendering,
a subtle thinking indicator, and soft panels. Without rich (or piped
output) everything degrades to plain text — same functions, no crash.
"""
from __future__ import annotations

import sys
import time

try:
    from rich.console import Console
    from rich.live import Live
    from rich.markdown import Markdown
    from rich.panel import Panel
    from rich.text import Text

    _RICH = True
except ImportError:  # pragma: no cover
    _RICH = False

_console = Console() if _RICH else None

# Kept for compatibility; the banner no longer shows the big art.
ARC_REACTOR = "( arc reactor )"


def rich_available() -> bool:
    return bool(_RICH and _console is not None and sys.stdout.isatty())


def banner_lines() -> list[str]:
    return [
        "  ◉ JARVIS — at your service, sir.",
        '  Try "draft a linkedin post about shipping early"',
        '  or "remember that my launch code is 1234".',
        "",
    ]


def print_banner(animate: bool = False) -> None:
    """Minimal boot banner. The `animate` arg is kept for compatibility."""
    if rich_available():
        assert _console is not None
        _console.print()
        line = Text()
        line.append("  ◉ ", style="bold bright_cyan")
        line.append("JARVIS", style="bold")
        line.append(" — at your service, sir.", style="")
        _console.print(line)
        _console.print(
            Text(
                '  Try "draft a linkedin post about shipping early"\n'
                '  or "remember that my launch code is 1234".',
                style="dim",
            )
        )
        _console.print()
    else:
        for line in banner_lines():
            print(line)


def boot_sequence(checks: list[tuple[str, bool, str]] | None = None) -> None:
    """Short static boot lines. Fast — no theatrics."""

    def _line(label: str, ok: bool, detail: str = "") -> str:
        mark = "✓" if ok else "✗"
        core = f"  {mark} {label}"
        if detail:
            core += f" — {detail}"
        return core

    print("  Initializing JARVIS…")
    for label, ok, detail in checks or []:
        print(_line(label, ok, detail))
    print("  At your service, sir.\n")


def hud(prefix: str, text: str) -> str:
    """Format a JARVIS HUD status line."""
    return f"  {prefix} {text}"


def begin_thinking(message: str = "thinking"):
    """Subtle spinner until the first token arrives.

    Returns a rich Status, or None when animation is unavailable.
    Caller must .stop() it (safe to call twice).
    """
    if not rich_available():
        return None
    assert _console is not None
    return _console.status(f"[dim]{message}…", spinner="dots")


# --------------------------------------------------------------------------
# Streaming, Muse-style: live markdown while tokens arrive, then a final
# structured render (approval panels, heads-up panels, markdown body).
# --------------------------------------------------------------------------


def _split_notes(full: str) -> tuple[str, list[str]]:
    """Pull trailing 'Heads up: ...' notes off the turn text."""
    parts = full.split("\n\nHeads up: ")
    main = parts[0].strip()
    notes = [p.strip() for p in parts[1:] if p.strip()]
    return main, notes


def _looks_like_approval(text: str) -> bool:
    low = text.lower()
    return ("approve" in low and "reject" in low) or "approve and post" in low


class StreamRenderer:
    """Live markdown stream; finish() renders the final structured view."""

    def __init__(self, label: str = "jarvis") -> None:
        assert _console is not None
        self._console = _console
        self._label = label
        self._last_update = 0.0
        head = Text()
        head.append(f"{label} › ", style="bold bright_cyan")
        self._console.print(head, end="")
        self._live = Live(
            Markdown(""), console=self._console, refresh_per_second=8
        )
        self._live.start()

    def update(self, text: str) -> None:
        now = time.time()
        if now - self._last_update < 0.1:
            return
        self._last_update = now
        self._live.update(Markdown(text))

    def finish(self, full: str) -> None:
        full = full.strip()
        self._live.stop()
        main, notes = _split_notes(full)
        if main:
            if _looks_like_approval(main):
                self._console.print(
                    Panel(
                        Markdown(main),
                        title="Approval needed",
                        border_style="yellow",
                        padding=(1, 2),
                    )
                )
            else:
                self._console.print(Markdown(main))
        for note in notes:
            self._console.print(
                Panel(
                    note,
                    title="Heads up",
                    border_style="blue",
                    padding=(0, 2),
                    expand=False,
                )
            )
        self._console.print()


def start_stream(label: str = "jarvis"):
    """Begin a streaming render. Returns None when rich/TTY unavailable."""
    if not rich_available():
        return None
    return StreamRenderer(label=label)
