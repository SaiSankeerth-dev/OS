"""UI tests: the conversational terminal degrades safely.

In this sandbox stdout is not a TTY, so every rich path must fall
back to plain static text without crashing.
"""
import io
from contextlib import redirect_stdout

from server import jarvis_ui as ui


def test_banner_is_quiet_and_helpful():
    lines = ui.banner_lines()
    blob = "\n".join(lines)
    assert "JARVIS" in blob
    assert "draft a linkedin post" in blob  # suggests what to try
    buf = io.StringIO()
    with redirect_stdout(buf):
        ui.print_banner()
    assert "JARVIS" in buf.getvalue()


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
    assert ui.begin_thinking() is None


def test_stream_returns_none_without_tty():
    assert ui.start_stream() is None


def test_split_notes():
    main, notes = ui._split_notes(
        "Here's the draft.\n\nHeads up: one thing.\n\nHeads up: another."
    )
    assert main == "Here's the draft."
    assert notes == ["one thing.", "another."]


def test_approval_detection():
    assert ui._looks_like_approval(
        "Here's the draft:\n\nhello\n\nApprove and post this exact text? (yes/no)"
    )
    assert ui._looks_like_approval("waiting on your approval - say 'approve' or 'reject'")
    assert not ui._looks_like_approval("Saved: my launch code is 1234")
