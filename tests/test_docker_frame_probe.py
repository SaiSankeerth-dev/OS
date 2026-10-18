"""Regression coverage for the desktop framebuffer health probe."""
from __future__ import annotations

import subprocess
from unittest.mock import patch

from server.computer.backends.docker_desktop import DockerDesktopBackend


def test_frame_probe_uses_a_unique_temporary_filename():
    backend = DockerDesktopBackend()
    completed = subprocess.CompletedProcess(args=[], returncode=0, stdout="70001\n", stderr="")

    with patch("server.computer.backends.docker_desktop.subprocess.run", return_value=completed) as run:
        ok, size, message = backend._check_frame_variance()

    command = run.call_args.args[0]
    probe = command[-1]
    assert "os-frame-check-$$.png" in probe
    assert "trap 'rm -f" in probe
    assert ".frame_check.png" not in probe
    assert ok is True
    assert size == 70001
    assert "active desktop" in message.lower()
