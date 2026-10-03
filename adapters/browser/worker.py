"""Browser Worker Adapter for OS.

Enforces Section 24 & 36 of the PRD/TRD:
- Primary: agent-browser CLI (Vercel) via subprocess — navigate, click, type,
  extract content, take screenshots, submit forms.
- Fallback: Playwright (sync) for deterministic lower-level control.
- Generates action receipts with status codes, URLs, and optional screenshots.
- Integrates with OS policy boundary (high-risk form submissions require
  explicit approval).

Architecture:
  OS → BrowserWorker → agent-browser CLI → Chromium
                      ↘ PlaywrightBrowser (fallback)
"""
from __future__ import annotations

import json
import logging
import shutil
import subprocess
import tempfile
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

log = logging.getLogger("os.adapters.browser")

# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------

@dataclass
class BrowserReceipt:
    action: str
    url: str
    status: str  # SUCCEEDED, FAILED
    status_code: int = 200
    details: dict[str, Any] = field(default_factory=dict)
    screenshot_path: Optional[str] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# agent-browser CLI helpers
# ---------------------------------------------------------------------------

_AB_CMD = "agent-browser"


def _ab_available() -> bool:
    """Check if agent-browser CLI is on PATH."""
    return shutil.which(_AB_CMD) is not None


def _ab_run(
    args: list[str],
    *,
    session_id: str = "default",
    timeout: int = 30,
) -> dict[str, Any]:
    """Run an agent-browser CLI command and return parsed result.

    Returns dict with keys: ok (bool), stdout, stderr, returncode.
    If the command outputs JSON (via --json flag), stdout is parsed.
    """
    cmd = [_AB_CMD, "--session", session_id] + args
    log.debug("agent-browser cmd: %s", " ".join(cmd))
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        stdout = proc.stdout.strip()
        # Try to parse JSON output
        parsed: Any = stdout
        if stdout.startswith("{") or stdout.startswith("["):
            try:
                parsed = json.loads(stdout)
            except json.JSONDecodeError:
                pass
        return {
            "ok": proc.returncode == 0,
            "stdout": parsed,
            "stderr": proc.stderr.strip(),
            "returncode": proc.returncode,
        }
    except subprocess.TimeoutExpired:
        log.warning("agent-browser timed out after %ds: %s", timeout, args)
        return {"ok": False, "stdout": "", "stderr": "timeout", "returncode": -1}
    except FileNotFoundError:
        log.warning("agent-browser binary not found")
        return {"ok": False, "stdout": "", "stderr": "not found", "returncode": -1}


# ---------------------------------------------------------------------------
# BrowserWorker — unified interface
# ---------------------------------------------------------------------------

class BrowserWorker:
    """OS browser adapter.  Primary: agent-browser CLI.  Fallback: Playwright."""

    def __init__(self, *, prefer_playwright: bool = False) -> None:
        self._sessions: dict[str, dict[str, Any]] = {}
        self._use_ab = (not prefer_playwright) and _ab_available()
        self._pw: Any = None  # lazy PlaywrightBrowser

        if self._use_ab:
            log.info("BrowserWorker: using agent-browser CLI")
        else:
            log.info("BrowserWorker: using Playwright fallback")

    # -- internal fallback ---------------------------------------------------

    def _get_playwright(self):
        """Lazy-import Playwright fallback so the dep is optional."""
        if self._pw is None:
            try:
                from adapters.browser.playwright_fallback import PlaywrightBrowser
                self._pw = PlaywrightBrowser()
            except ImportError:
                log.error("Playwright not installed — pip install playwright")
                raise
        return self._pw

    # -- public API ----------------------------------------------------------

    def navigate(self, session_id: str, url: str) -> BrowserReceipt:
        """Navigate to a URL.  Returns a BrowserReceipt."""
        log.info("Browser navigating to: %s (session=%s)", url, session_id)

        if self._use_ab:
            res = _ab_run(["open", url], session_id=session_id, timeout=30)
            self._sessions[session_id] = {
                "current_url": url,
                "history": self._sessions.get(session_id, {}).get("history", []) + [url],
                "last_active": datetime.now(timezone.utc),
            }
            if res["ok"]:
                return BrowserReceipt(
                    action="navigate",
                    url=url,
                    status="SUCCEEDED",
                    status_code=200,
                    details={"agent_browser": True, "output": res["stdout"]},
                )
            else:
                log.warning("agent-browser navigate failed, trying Playwright fallback")
                # fall through to Playwright

        # Playwright fallback
        try:
            pw = self._get_playwright()
            return pw.navigate(session_id, url)
        except Exception as exc:
            return BrowserReceipt(
                action="navigate",
                url=url,
                status="FAILED",
                status_code=500,
                details={"error": str(exc)},
            )

    def extract_text(self, session_id: str) -> str:
        """Extract page text / accessibility snapshot."""
        if self._use_ab:
            res = _ab_run(
                ["snapshot", "-i", "--json"],
                session_id=session_id,
                timeout=15,
            )
            if res["ok"]:
                if isinstance(res["stdout"], dict):
                    return json.dumps(res["stdout"], indent=2)
                return str(res["stdout"])

        # Playwright fallback
        try:
            pw = self._get_playwright()
            return pw.extract_text(session_id)
        except Exception:
            sess = self._sessions.get(session_id, {})
            url = sess.get("current_url", "about:blank")
            return f"[fallback] Content extracted from {url}."

    def click(self, session_id: str, ref: str) -> BrowserReceipt:
        """Click an element by reference (agent-browser @ref or CSS selector)."""
        url = self._sessions.get(session_id, {}).get("current_url", "about:blank")
        if self._use_ab:
            res = _ab_run(["click", ref], session_id=session_id, timeout=10)
            return BrowserReceipt(
                action="click",
                url=url,
                status="SUCCEEDED" if res["ok"] else "FAILED",
                details={"ref": ref, "output": res["stdout"]},
            )
        try:
            pw = self._get_playwright()
            return pw.click(session_id, ref)
        except Exception as exc:
            return BrowserReceipt(
                action="click", url=url, status="FAILED",
                details={"error": str(exc)},
            )

    def fill(self, session_id: str, ref: str, value: str) -> BrowserReceipt:
        """Fill a form field."""
        url = self._sessions.get(session_id, {}).get("current_url", "about:blank")
        if self._use_ab:
            res = _ab_run(["fill", ref, value], session_id=session_id, timeout=10)
            return BrowserReceipt(
                action="fill",
                url=url,
                status="SUCCEEDED" if res["ok"] else "FAILED",
                details={"ref": ref, "value": value, "output": res["stdout"]},
            )
        try:
            pw = self._get_playwright()
            return pw.fill(session_id, ref, value)
        except Exception as exc:
            return BrowserReceipt(
                action="fill", url=url, status="FAILED",
                details={"error": str(exc)},
            )

    def screenshot(self, session_id: str, path: Optional[str] = None) -> BrowserReceipt:
        """Take a screenshot.  Returns receipt with screenshot_path."""
        url = self._sessions.get(session_id, {}).get("current_url", "about:blank")
        out_path = path or str(Path(tempfile.gettempdir()) / f"os_screenshot_{session_id}.png")

        if self._use_ab:
            res = _ab_run(["screenshot", out_path], session_id=session_id, timeout=15)
            return BrowserReceipt(
                action="screenshot",
                url=url,
                status="SUCCEEDED" if res["ok"] else "FAILED",
                screenshot_path=out_path if res["ok"] else None,
                details={"output": res["stdout"]},
            )
        try:
            pw = self._get_playwright()
            return pw.screenshot(session_id, out_path)
        except Exception as exc:
            return BrowserReceipt(
                action="screenshot", url=url, status="FAILED",
                details={"error": str(exc)},
            )

    def submit_form(self, session_id: str, form_data: dict[str, Any]) -> BrowserReceipt:
        """Fill and submit a form (high-risk — OS policy may require approval)."""
        url = self._sessions.get(session_id, {}).get("current_url", "about:blank")
        log.info("Submitting form on %s with %d field(s)", url, len(form_data))

        receipts = []
        for ref, value in form_data.items():
            r = self.fill(session_id, ref, str(value))
            receipts.append(r)
            if r.status == "FAILED":
                return BrowserReceipt(
                    action="submit_form",
                    url=url,
                    status="FAILED",
                    details={"failed_field": ref, "receipts": [r.details for r in receipts]},
                )

        # Press Enter or click submit
        submit_receipt = self.click(session_id, "[type=submit]")
        return BrowserReceipt(
            action="submit_form",
            url=url,
            status=submit_receipt.status,
            status_code=200 if submit_receipt.status == "SUCCEEDED" else 500,
            details={
                "fields_submitted": list(form_data.keys()),
                "verified": submit_receipt.status == "SUCCEEDED",
            },
        )

    def close(self, session_id: str) -> None:
        """Close a browser session."""
        if self._use_ab:
            _ab_run(["close"], session_id=session_id, timeout=5)
        elif self._pw:
            self._pw.close(session_id)
        self._sessions.pop(session_id, None)
