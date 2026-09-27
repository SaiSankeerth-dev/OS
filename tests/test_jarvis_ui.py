"""UI polish tests: the animated terminal degrades safely.

In this sandbox stdout is not a TTY, so every animated path must fall
back to plain static text without crashing.
"""
import io
from contextlib import redirect_stdout

from server import jarvis_ui as ui


def test_reactor_cells_cover_core_and_ring():
    cells = ui._reactor_cells(0.0)
    chars = {c for c, _ in cells.values()}
    assert "◉" in chars or "●" in chars or "○" in chars  # core
    assert "◈" in chars  # energy ring
    assert len(cells) > 100


def test_static_banner_renders_plain():
    lines = ui.banner_lines()
    assert any("J.A.R.V.I.S." in ln for ln in lines)
    buf = io.StringIO()
    with redirect_stdout(buf):
        ui.print_banner(animate=False)
    assert "J.A.R.V.I.S." in buf.getvalue()


def test_boot_sequence_plain_without_tty():
    buf = io.StringIO()
    with redirect_stdout(buf):
        ui.boot_sequence([("memory lattice", True, "sqlite")])
    out = buf.getvalue()
    assert "memory lattice" in out
    assert "At your service, sir." in out


def test_hud_plain():
    assert "CORE" in ui.hud("CORE", "neural core online")


def test_thinking_returns_none_without_tty():
    # No TTY here -> no spinner object, caller prints the prompt itself.
    assert ui.begin_thinking() is None
