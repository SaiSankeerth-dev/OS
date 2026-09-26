"""JARVIS terminal presentation: arc-reactor boot banner and HUD lines.

Pure presentation layer — no behavior. Safe to import anywhere.
Colors degrade gracefully when stdout is not a TTY.
"""
from __future__ import annotations

import sys

_CYAN = "\033[96m"
_DIM = "\033[2m"
_BOLD = "\033[1m"
_RESET = "\033[0m"


def _colorize(text: str) -> str:
    if not sys.stdout.isatty():
        return text
    return text


ARC_REACTOR = r"""
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
""".strip("\n")


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


def print_banner() -> None:
    for line in banner_lines():
        print(line)


def boot_sequence(checks: list[tuple[str, bool, str]] | None = None) -> None:
    """Print Iron-Man-style system boot lines.

    checks: list of (label, ok, detail) shown after the core boot lines.
    """
    def _line(label: str, ok: bool, detail: str = "") -> str:
        mark = "online" if ok else "OFFLINE"
        core = f"  [ {label:<14} ] {mark}"
        if detail:
            core += f"  {detail}"
        if sys.stdout.isatty():
            color = _CYAN if ok else "\033[91m"
            core = f"{color}{core}{_RESET}"
        return core

    print("  Initializing JARVIS...")
    print(_line("power", True))
    print(_line("neural core", True))
    if checks:
        for label, ok, detail in checks:
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
