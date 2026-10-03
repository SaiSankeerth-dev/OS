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
from enum import Enum
from pathlib import Path
from typing import Any, Optional

from server.domain.enums import RiskLevel
from server.execution.registry import ToolDefinition, ExecutionToolRegistry

log = logging.getLogger("os.adapters.browser")


# ---------------------------------------------------------------------------
# Data & Classification
# ---------------------------------------------------------------------------

class BrowserActionType(str, Enum):
    READ = "READ"
    WRITE = "WRITE"
    DESTRUCTIVE = "DESTRUCTIVE"


def classify_browser_action(
    action: str,
    details: Optional[dict[str, Any]] = None,
) -> BrowserActionType:
    """Classifies a browser action into READ, WRITE, or DESTRUCTIVE.

    - READ: navigate, open, extract_text, screenshot, read, inspect, get_url.
    - WRITE: click, fill, type, press, select, hover, scroll.
    - DESTRUCTIVE: submit_form, checkout, delete, eval, execute_script,
      or clicks targeting high-risk keywords (delete, pay, purchase).
    """
    action_lower = action.lower().strip()
    details = details or {}

    # Explicit read-only actions
    if action_lower in ("navigate", "open", "extract_text", "screenshot", "read", "inspect", "get_url", "snapshot"):
        return BrowserActionType.READ

    # Explicit destructive actions
    if action_lower in ("submit_form", "checkout", "delete", "eval", "execute_script"):
        return BrowserActionType.DESTRUCTIVE

    # Interactions: click, fill, type, press
    if action_lower in ("click", "fill", "type", "press", "select", "hover", "scroll"):
        target_text = str(
            details.get("ref", "")
            or details.get("selector", "")
            or details.get("text", "")
            or details.get("value", "")
        ).lower()
        destructive_keywords = ("delete", "remove", "pay", "purchase", "buy", "checkout", "confirm_payment", "transfer")
        if any(kw in target_text for kw in destructive_keywords):
            return BrowserActionType.DESTRUCTIVE
        return BrowserActionType.WRITE

    # Conservative default
    return BrowserActionType.WRITE


def browser_action_to_risk(action_type: BrowserActionType) -> RiskLevel:
    """Maps BrowserActionType to OS RiskLevel."""
    if action_type == BrowserActionType.READ:
        return RiskLevel.LOW
    elif action_type == BrowserActionType.WRITE:
        return RiskLevel.MEDIUM
    elif action_type == BrowserActionType.DESTRUCTIVE:
        return RiskLevel.HIGH
    return RiskLevel.HIGH


@dataclass
class BrowserReceipt:
    action: str
    url: str
    status: str  # SUCCEEDED, FAILED
    status_code: int = 200
    details: dict[str, Any] = field(default_factory=dict)
    screenshot_path: Optional[str] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict[str, Any]:
        return {
            "action": self.action,
            "url": self.url,
            "status": self.status,
            "status_code": self.status_code,
            "details": self.details,
            "screenshot_path": self.screenshot_path,
            "created_at": self.created_at.isoformat(),
        }

    as_dict = to_dict


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

    def execute_action(
        self,
        session_id: str,
        action: str,
        arguments: dict[str, Any],
    ) -> BrowserReceipt:
        """Executes a browser action by name with arguments and returns BrowserReceipt."""
        action_lower = action.lower().strip()
        if action_lower in ("navigate", "open"):
            url = arguments.get("url") or arguments.get("target_url") or "about:blank"
            return self.navigate(session_id, url)
        elif action_lower in ("screenshot", "take_screenshot"):
            return self.screenshot(session_id, arguments.get("path"))
        elif action_lower in ("extract_text", "snapshot", "read"):
            text = self.extract_text(session_id)
            url = self._sessions.get(session_id, {}).get("current_url", "about:blank")
            return BrowserReceipt(
                action="extract_text",
                url=url,
                status="SUCCEEDED",
                status_code=200,
                details={"text": text, "length": len(text)},
            )
        elif action_lower == "click":
            ref = arguments.get("ref") or arguments.get("selector") or arguments.get("target") or ""
            return self.click(session_id, ref)
        elif action_lower == "fill":
            ref = arguments.get("ref") or arguments.get("selector") or arguments.get("target") or ""
            val = arguments.get("value") or arguments.get("text") or ""
            return self.fill(session_id, ref, str(val))
        elif action_lower == "submit_form":
            form_data = arguments.get("form_data") or arguments.get("fields") or {}
            return self.submit_form(session_id, form_data)
        else:
            raise ValueError(f"Unknown browser action: '{action}'")


def create_browser_tool(
    action: str,
    worker: Optional[BrowserWorker] = None,
    default_session_id: str = "default",
) -> ToolDefinition:
    """Creates a ToolDefinition for a browser action wired to PolicyEngine and SafeExecutor."""
    _worker = worker or BrowserWorker()
    action_type = classify_browser_action(action)
    risk = browser_action_to_risk(action_type)

    def _execute(args: dict[str, Any]) -> dict[str, Any]:
        session_id = args.get("session_id", default_session_id)
        receipt = _worker.execute_action(session_id, action, args)
        return receipt.to_dict()

    return ToolDefinition(
        name=f"browser.{action}",
        description=f"Browser action: {action} ({action_type.value})",
        risk_level=risk,
        requires_approval=(action_type == BrowserActionType.DESTRUCTIVE),
        execute=_execute,
    )


def register_browser_tools(
    registry: ExecutionToolRegistry,
    worker: Optional[BrowserWorker] = None,
) -> None:
    """Registers standard browser tools with the unified execution tool registry."""
    for action in ("navigate", "extract_text", "screenshot", "click", "fill", "submit_form"):
        registry.register(create_browser_tool(action, worker=worker))

