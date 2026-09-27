"""JARVIS terminal presentation: animated arc-reactor boot + HUD.

Pure presentation layer — no behavior. Safe to import anywhere.

With `rich` installed and stdout a TTY you get the full show:
  - animated arc-reactor boot (pulsing core, rotating energy ring)
  - animated boot checklist
  - "thinking" spinner while the first token streams in
Without rich (or piped output) everything degrades to plain static
text — the same public functions, no animation, no crash.
"""
from __future__ import annotations

import math
import sys
import time

try:
    from rich.console import Console
    from rich.live import Live
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
    from rich.text import Text

    _RICH = True
except ImportError:  # pragma: no cover
    _RICH = False

_CYAN = "\033[96m"
_DIM = "\033[2m"
_BOLD = "\033[1m"
_RESET = "\033[0m"

_console = Console() if _RICH else None


def rich_available() -> bool:
    return bool(_RICH and _console is not None and sys.stdout.isatty())


# --------------------------------------------------------------------------
# Arc reactor — drawn mathematically so it can animate.
# --------------------------------------------------------------------------

_W, _H = 37, 17
_CX, _CY = 18.0, 8.0


def _reactor_cells(t: float) -> dict[tuple[int, int], tuple[str, float]]:
    """(x, y) -> (char, intensity 0..1) for animation time t."""
    cells: dict[tuple[int, int], tuple[str, float]] = {}
    for y in range(_H):
        for x in range(_W):
            dx, dy = (x - _CX) * 0.5, (y - _CY) * 1.0
            d = math.hypot(dx, dy)
            ang = math.atan2(dy, dx)

            # Outer energy ring — segments chase around it.
            if abs(d - 8.0) < 0.6:
                seg = int((ang + t * 2.4) / (math.pi / 6)) % 12
                if seg % 3 == 0:
                    cells[(x, y)] = ("◈", 0.95)
                else:
                    cells[(x, y)] = ("○", 0.55)
            # Inner coil ring.
            elif abs(d - 5.4) < 0.45:
                cells[(x, y)] = ("·", 0.35)
            # Rotating spokes between core and coil.
            elif 2.8 < d < 7.4:
                rel = (ang - t * 1.2) % (math.pi / 3)
                if rel < 0.10:
                    cells[(x, y)] = ("│", 0.5)
            # Pulsing core.
            if d < 2.3:
                pulse = 0.5 + 0.5 * math.sin(t * 4.0)
                ch = "●" if pulse > 0.66 else ("◉" if pulse > 0.33 else "○")
                cells[(x, y)] = (ch, 0.65 + 0.35 * pulse)
    return cells


def _intensity_style(i: float) -> str:
    if i >= 0.9:
        return "bold white"
    if i >= 0.7:
        return "bright_cyan"
    if i >= 0.5:
        return "cyan"
    return "blue"


def _reactor_text(t: float) -> "Text":
    cells = _reactor_cells(t)
    out = Text(justify="center")
    for y in range(_H):
        for x in range(_W):
            ch, inten = cells.get((x, y), (" ", 0.0))
            if ch == " ":
                out.append(" ")
            else:
                out.append(ch, style=_intensity_style(inten))
        if y < _H - 1:
            out.append("\n")
    return out


def _reactor_plain() -> str:
    cells = _reactor_cells(0.0)
    lines = []
    for y in range(_H):
        lines.append(
            "".join(cells.get((x, y), (" ", 0.0))[0] for x in range(_W)).rstrip()
        )
    return "\n".join(lines).strip("\n")


# Static art kept for compatibility (plain environments, logs).
ARC_REACTOR = _reactor_plain()


def banner_lines() -> list[str]:
    """Arc-reactor art + title lines, colorized for TTYs."""
    art = ARC_REACTOR
    if sys.stdout.isatty():
        art = f"{_CYAN}{ARC_REACTOR}{_RESET}"
    title = "J.A.R.V.I.S."
    subtitle = "Just A Rather Very Intelligent System"
    if sys.stdout.isatty():
        title = f"{_BOLD}{_CYAN}{title}{_RESET}"
        subtitle = f"{_DIM}{subtitle}{_RESET}"
    return [art, "", f"  {title}", f"  {subtitle}", ""]


def print_banner(animate: bool = True) -> None:
    """Boot banner. Animated arc reactor when rich + TTY, else static."""
    if animate and rich_available():
        assert _console is not None
        duration, fps = 2.0, 12
        start = time.time()
        with Live(
            _reactor_text(0.0),
            console=_console,
            refresh_per_second=fps,
            transient=True,
        ) as live:
            while (t := time.time() - start) < duration:
                live.update(_reactor_text(t))
                time.sleep(1 / fps)
        # Settle on the final frame, then the title card.
        _console.print(_reactor_text(duration), justify="center")
        _console.print()
        _console.print(
            Text("J.A.R.V.I.S.", style="bold bright_cyan", justify="center")
        )
        _console.print(
            Text(
                "Just A Rather Very Intelligent System",
                style="dim",
                justify="center",
            )
        )
        _console.print()
    else:
        for line in banner_lines():
            print(line)


def boot_sequence(checks: list[tuple[str, bool, str]] | None = None) -> None:
    """Iron-Man-style system boot. Animated checklist when rich + TTY."""

    def _line(label: str, ok: bool, detail: str = "") -> str:
        mark = "online" if ok else "OFFLINE"
        core = f"  [ {label:<14} ] {mark}"
        if detail:
            core += f"  {detail}"
        if sys.stdout.isatty():
            color = _CYAN if ok else "\033[91m"
            core = f"{color}{core}{_RESET}"
        return core

    steps = [
        ("power", True, ""),
        ("neural core", True, ""),
    ] + [(label, ok, detail) for label, ok, detail in (checks or [])]

    if rich_available():
        assert _console is not None
        _console.print(Text("  Initializing JARVIS…", style="bold cyan"))
        with Progress(
            SpinnerColumn("dots2", style="cyan"),
            TextColumn("[cyan]{task.description}"),
            BarColumn(bar_width=24, complete_style="cyan"),
            console=_console,
            transient=True,
        ) as progress:
            task = progress.add_task("boot", total=len(steps))
            for label, ok, detail in steps:
                time.sleep(0.22)
                mark = "[green]online[/green]" if ok else "[red]OFFLINE[/red]"
                progress.update(
                    task,
                    advance=1,
                    description=f"{label:<16} {mark}  {detail}",
                )
        _console.print(Text("  At your service, sir.", style="bold bright_cyan"))
        _console.print()
        return

    print("  Initializing JARVIS...")
    for label, ok, detail in steps:
        print(_line(label, ok, detail))
    print()
    greeting = "At your service, sir."
    if sys.stdout.isatty():
        greeting = f"{_BOLD}{_CYAN}{greeting}{_RESET}"
    print(f"  {greeting}\n")


def hud(prefix: str, text: str) -> str:
    """Format a JARVIS HUD status line."""
    line = f"  {prefix} {text}"
    if sys.stdout.isatty():
        line = f"{_CYAN}  {prefix}{_RESET} {text}"
    return line


def begin_thinking(message: str = "JARVIS is thinking"):
    """Start a spinner shown until the first token arrives.

    Returns a rich Status, or None when animation is unavailable.
    Caller must .stop() it (safe to call twice).
    """
    if not rich_available():
        return None
    assert _console is not None
    return _console.status(f"[cyan]{message}…", spinner="dots2")
