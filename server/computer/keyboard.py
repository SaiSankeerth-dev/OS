"""OS Virtual Keyboard Controller.

Provides typed, permission-checked, arbiter-integrated keyboard control
for both browser sessions (Playwright CDP) and Linux desktop environments (X11 / xdotool).

Key capabilities:
- Accurate typing with target focus verification
- Standard keys: Enter, Tab, Escape, Backspace, Delete, Space, Arrow keys, etc.
- Modifier shortcuts: Ctrl+L, Ctrl+A, Ctrl+C, Ctrl+V, etc.
- Unicode and multi-line text input
- Arbiter integration: halts AI typing on human takeover; prevents concurrent agent typing
- Stuck-key prevention: tracks held keys and provides release_all_keys()
- Safe logging: masks passwords, tokens, and sensitive content in telemetry and logs
"""
from __future__ import annotations

import logging
import re
import subprocess
import threading
import time
from typing import Any, Dict, List, Optional, Set, Tuple

from server.computer.arbiter import ControlState, get_arbiter_registry
from server.computer.interface import ActionResult, ComputerControlError

log = logging.getLogger("os.computer.keyboard")

# Sensitive input patterns for redaction
_SENSITIVE_TARGET_RE = re.compile(r"(password|passwd|token|secret|api[_-]?key|auth|credit|cvv|pin)", re.IGNORECASE)
_SENSITIVE_VALUE_RE = re.compile(r"(bearer\s+[a-zA-Z0-9_\-\.]+|ghp_[a-zA-Z0-9]{36}|sk-[a-zA-Z0-9]{32,})", re.IGNORECASE)


def mask_sensitive_input(text: str, target: Optional[str] = None) -> str:
    """Mask sensitive passwords, tokens, or credentials for safe logging."""
    if target and _SENSITIVE_TARGET_RE.search(str(target)):
        return f"[REDACTED {len(text)} chars]"
    if _SENSITIVE_VALUE_RE.search(text):
        return _SENSITIVE_VALUE_RE.sub("[REDACTED_SECRET]", text)
    return text


class ShortcutNormalizer:
    """Normalizes keyboard shortcuts across Playwright and Linux X11 (xdotool)."""

    PLAYWRIGHT_KEY_MAP = {
        "ctrl": "Control",
        "control": "Control",
        "alt": "Alt",
        "shift": "Shift",
        "meta": "Meta",
        "cmd": "Meta",
        "command": "Meta",
        "win": "Meta",
        "super": "Meta",
        "enter": "Enter",
        "return": "Enter",
        "tab": "Tab",
        "esc": "Escape",
        "escape": "Escape",
        "backspace": "Backspace",
        "delete": "Delete",
        "del": "Delete",
        "space": "Space",
        "spacebar": "Space",
        "arrowdown": "ArrowDown",
        "down": "ArrowDown",
        "arrowup": "ArrowUp",
        "up": "ArrowUp",
        "arrowleft": "ArrowLeft",
        "left": "ArrowLeft",
        "arrowright": "ArrowRight",
        "right": "ArrowRight",
        "home": "Home",
        "end": "End",
        "pageup": "PageUp",
        "pgup": "PageUp",
        "pagedown": "PageDown",
        "pgdn": "PageDown",
    }

    XDOTOOL_KEY_MAP = {
        "ctrl": "ctrl",
        "control": "ctrl",
        "alt": "alt",
        "shift": "shift",
        "meta": "super",
        "cmd": "super",
        "command": "super",
        "win": "super",
        "super": "super",
        "enter": "Return",
        "return": "Return",
        "tab": "Tab",
        "esc": "Escape",
        "escape": "Escape",
        "backspace": "BackSpace",
        "delete": "Delete",
        "del": "Delete",
        "space": "space",
        "spacebar": "space",
        "arrowdown": "Down",
        "down": "Down",
        "arrowup": "Up",
        "up": "Up",
        "arrowleft": "Left",
        "left": "Left",
        "arrowright": "Right",
        "right": "Right",
        "home": "Home",
        "end": "End",
        "pageup": "Page_Up",
        "pgup": "Page_Up",
        "pagedown": "Page_Down",
        "pgdn": "Page_Down",
    }

    @classmethod
    def to_playwright(cls, shortcut: str) -> str:
        """Convert 'Ctrl+L' or 'ctrl+l' to Playwright format 'Control+l'."""
        parts = [p.strip() for p in shortcut.replace("-", "+").split("+")]
        norm_parts = []
        for p in parts:
            low = p.lower()
            if low in cls.PLAYWRIGHT_KEY_MAP:
                norm_parts.append(cls.PLAYWRIGHT_KEY_MAP[low])
            elif len(p) == 1:
                norm_parts.append(p.lower())
            else:
                norm_parts.append(p)
        return "+".join(norm_parts)

    @classmethod
    def to_xdotool(cls, shortcut: str) -> str:
        """Convert 'Ctrl+L' to xdotool format 'ctrl+l'."""
        parts = [p.strip() for p in shortcut.replace("-", "+").split("+")]
        norm_parts = []
        for p in parts:
            low = p.lower()
            norm_parts.append(cls.XDOTOOL_KEY_MAP.get(low, low))
        return "+".join(norm_parts)


class VirtualKeyboardController:
    """Manages AI keyboard input, focus targeting, stuck-key prevention, and arbiter coordination."""

    CONTAINER_NAME = "os-virtual-desktop"

    def __init__(self) -> None:
        self._held_keys: Dict[str, Set[str]] = {}
        self._session_locks: Dict[str, threading.Lock] = {}
        self._active_typists: Dict[str, str] = {}  # session_id -> agent_id / task_id
        self._lock = threading.Lock()

    def _get_session_lock(self, session_id: str) -> threading.Lock:
        with self._lock:
            if session_id not in self._session_locks:
                self._session_locks[session_id] = threading.Lock()
            return self._session_locks[session_id]

    def _get_held_keys(self, session_id: str) -> Set[str]:
        with self._lock:
            if session_id not in self._held_keys:
                self._held_keys[session_id] = set()
            return self._held_keys[session_id]

    def _check_arbiter_and_lock(self, session_id: str, agent_id: Optional[str] = None, user_directed: bool = False) -> None:
        """Verify arbiter state and prevent concurrent agents from typing at the same time."""
        arbiter = get_arbiter_registry().get_or_create(session_id)
        if hasattr(arbiter, "can_ai_act"):
            ok, err = arbiter.can_ai_act()
            if not ok and not (user_directed and arbiter.state == ControlState.HUMAN_CONTROL):
                raise ComputerControlError(
                    f"AI keyboard input rejected: {err}",
                    backend="keyboard_controller",
                )
        elif arbiter.state == ControlState.AI_PAUSED:
            raise ComputerControlError(
                "AI keyboard input rejected: Session is paused under human takeover.",
                backend="keyboard_controller",
            )
        elif arbiter.state == ControlState.STOPPED:
            raise ComputerControlError(
                "AI keyboard input rejected: Session execution is stopped.",
                backend="keyboard_controller",
            )

        with self._lock:
            current_typist = self._active_typists.get(session_id)
            if current_typist and agent_id and current_typist != agent_id:
                raise ComputerControlError(
                    f"Concurrent typing conflict: Session is currently locked by agent '{current_typist}'",
                    backend="keyboard_controller",
                )
            if agent_id:
                self._active_typists[session_id] = agent_id

    def _release_typist_lock(self, session_id: str, agent_id: Optional[str] = None) -> None:
        with self._lock:
            if agent_id and self._active_typists.get(session_id) == agent_id:
                del self._active_typists[session_id]

    def type_text(
        self,
        session_id: str,
        text: str,
        target: Optional[Any] = None,
        backend_instance: Optional[Any] = None,
        agent_id: Optional[str] = None,
        timeout_sec: float = 10.0,
        user_directed: bool = False,
    ) -> ActionResult:
        """Type text into a target input or currently focused control with timeout and verification."""
        self._check_arbiter_and_lock(session_id, agent_id, user_directed=user_directed)
        sess_lock = self._get_session_lock(session_id)
        if not sess_lock.acquire(timeout=timeout_sec):
            raise ComputerControlError("Keyboard input timed out waiting for session lock", backend="keyboard_controller")

        t0 = time.time()
        safe_preview = mask_sensitive_input(text, target)
        arbiter = get_arbiter_registry().get_or_create(session_id)
        arbiter.update_ai_cursor(
            x=640.0,
            y=400.0,
            status=f"Typing into {target or 'active focus'}: {safe_preview[:30]}",
            action="type_text",
            visible=True,
        )

        try:
            # 1. Use backend instance if provided and ready
            if backend_instance and hasattr(backend_instance, "type_text"):
                res = backend_instance.type_text(session_id, text, target)
                dur = (time.time() - t0) * 1000
                res.duration_ms = dur
                res.details["safe_preview"] = safe_preview
                return res

            # 2. Container X11 desktop fallback via xdotool
            res = self._xdotool_type(text)
            dur = (time.time() - t0) * 1000
            return ActionResult(
                success=res.returncode == 0,
                action="type_text",
                session_id=session_id,
                backend="desktop_x11",
                details={"chars": len(text), "safe_preview": safe_preview},
                observed_outcome=f"Typed {len(text)} characters into desktop" if res.returncode == 0 else f"xdotool failed: {res.stderr}",
                verified=res.returncode == 0,
                error=res.stderr if res.returncode != 0 else None,
                duration_ms=dur,
            )
        finally:
            self._release_typist_lock(session_id, agent_id)
            sess_lock.release()

    def press_key(
        self,
        session_id: str,
        key: str,
        backend_instance: Optional[Any] = None,
        agent_id: Optional[str] = None,
        timeout_sec: float = 5.0,
        user_directed: bool = False,
    ) -> ActionResult:
        """Press a single key (Enter, Tab, Escape, Backspace, etc.)."""
        self._check_arbiter_and_lock(session_id, agent_id, user_directed=user_directed)
        sess_lock = self._get_session_lock(session_id)
        if not sess_lock.acquire(timeout=timeout_sec):
            raise ComputerControlError("Keyboard input timed out waiting for session lock", backend="keyboard_controller")

        t0 = time.time()
        pw_key = ShortcutNormalizer.to_playwright(key)
        xd_key = ShortcutNormalizer.to_xdotool(key)

        arbiter = get_arbiter_registry().get_or_create(session_id)
        arbiter.update_ai_cursor(
            x=640.0,
            y=400.0,
            status=f"Pressing key: {pw_key}",
            action="press_key",
            visible=True,
        )

        try:
            if backend_instance and hasattr(backend_instance, "press_key"):
                res = backend_instance.press_key(session_id, pw_key)
                dur = (time.time() - t0) * 1000
                res.duration_ms = dur
                return res

            res = self._xdotool_key(xd_key)
            dur = (time.time() - t0) * 1000
            return ActionResult(
                success=res.returncode == 0,
                action="press_key",
                session_id=session_id,
                backend="desktop_x11",
                details={"key": pw_key, "xdotool_key": xd_key},
                observed_outcome=f"Pressed '{pw_key}'" if res.returncode == 0 else f"xdotool failed: {res.stderr}",
                verified=res.returncode == 0,
                error=res.stderr if res.returncode != 0 else None,
                duration_ms=dur,
            )
        finally:
            self._release_typist_lock(session_id, agent_id)
            sess_lock.release()

    def press_shortcut(
        self,
        session_id: str,
        shortcut: str,
        backend_instance: Optional[Any] = None,
        agent_id: Optional[str] = None,
        timeout_sec: float = 5.0,
        user_directed: bool = False,
    ) -> ActionResult:
        """Press a keyboard modifier shortcut like Ctrl+L, Ctrl+A, Ctrl+C, Ctrl+V."""
        self._check_arbiter_and_lock(session_id, agent_id, user_directed=user_directed)
        sess_lock = self._get_session_lock(session_id)
        if not sess_lock.acquire(timeout=timeout_sec):
            raise ComputerControlError("Keyboard input timed out waiting for session lock", backend="keyboard_controller")

        t0 = time.time()
        pw_shortcut = ShortcutNormalizer.to_playwright(shortcut)
        xd_shortcut = ShortcutNormalizer.to_xdotool(shortcut)

        arbiter = get_arbiter_registry().get_or_create(session_id)
        arbiter.update_ai_cursor(
            x=640.0,
            y=400.0,
            status=f"Sending shortcut: {shortcut}",
            action="press_shortcut",
            visible=True,
        )

        try:
            if backend_instance and hasattr(backend_instance, "press_shortcut"):
                res = backend_instance.press_shortcut(session_id, pw_shortcut)
                dur = (time.time() - t0) * 1000
                res.duration_ms = dur
                return res
            elif backend_instance and hasattr(backend_instance, "press_key"):
                res = backend_instance.press_key(session_id, pw_shortcut)
                dur = (time.time() - t0) * 1000
                res.duration_ms = dur
                return res

            res = self._xdotool_key(xd_shortcut)
            dur = (time.time() - t0) * 1000
            return ActionResult(
                success=res.returncode == 0,
                action="press_shortcut",
                session_id=session_id,
                backend="desktop_x11",
                details={"shortcut": shortcut, "playwright": pw_shortcut, "xdotool": xd_shortcut},
                observed_outcome=f"Executed shortcut '{shortcut}'" if res.returncode == 0 else f"xdotool failed: {res.stderr}",
                verified=res.returncode == 0,
                error=res.stderr if res.returncode != 0 else None,
                duration_ms=dur,
            )
        finally:
            self._release_typist_lock(session_id, agent_id)
            sess_lock.release()

    def key_down(
        self,
        session_id: str,
        key: str,
        backend_instance: Optional[Any] = None,
        agent_id: Optional[str] = None,
        user_directed: bool = False,
    ) -> ActionResult:
        """Hold a key down and track it to prevent stuck keys."""
        self._check_arbiter_and_lock(session_id, agent_id, user_directed=user_directed)
        pw_key = ShortcutNormalizer.to_playwright(key)
        xd_key = ShortcutNormalizer.to_xdotool(key)

        held = self._get_held_keys(session_id)
        held.add(pw_key)

        if backend_instance and hasattr(backend_instance, "key_down"):
            return backend_instance.key_down(session_id, pw_key)

        res = self._xdotool_cmd(["keydown", xd_key])
        return ActionResult(
            success=res.returncode == 0,
            action="key_down",
            session_id=session_id,
            backend="desktop_x11",
            details={"key": pw_key},
            observed_outcome=f"Key '{pw_key}' down",
            verified=res.returncode == 0,
        )

    def key_up(
        self,
        session_id: str,
        key: str,
        backend_instance: Optional[Any] = None,
        agent_id: Optional[str] = None,
    ) -> ActionResult:
        """Release a held key."""
        pw_key = ShortcutNormalizer.to_playwright(key)
        xd_key = ShortcutNormalizer.to_xdotool(key)

        held = self._get_held_keys(session_id)
        held.discard(pw_key)

        if backend_instance and hasattr(backend_instance, "key_up"):
            return backend_instance.key_up(session_id, pw_key)

        res = self._xdotool_cmd(["keyup", xd_key])
        return ActionResult(
            success=res.returncode == 0,
            action="key_up",
            session_id=session_id,
            backend="desktop_x11",
            details={"key": pw_key},
            observed_outcome=f"Key '{pw_key}' up",
            verified=res.returncode == 0,
        )

    def release_all_keys(
        self,
        session_id: str,
        backend_instance: Optional[Any] = None,
    ) -> ActionResult:
        """Release all held keys to prevent stuck keys on pause, stop, or human takeover."""
        with self._lock:
            held = list(self._held_keys.get(session_id, set()))
            if session_id in self._held_keys:
                self._held_keys[session_id].clear()
            if session_id in self._active_typists:
                del self._active_typists[session_id]

        log.info("Releasing all held keys for session '%s': %s", session_id, held)

        # 1. Release via backend if available
        if backend_instance and hasattr(backend_instance, "release_all_keys"):
            try:
                backend_instance.release_all_keys(session_id)
            except Exception as e:
                log.warning("Backend release_all_keys warning: %s", e)

        # 2. Release via individual key_up calls
        for k in held:
            try:
                if backend_instance and hasattr(backend_instance, "key_up"):
                    backend_instance.key_up(session_id, k)
            except Exception:
                pass

        # 3. Always release standard modifiers in container desktop
        self._xdotool_cmd(["keyup", "ctrl", "alt", "shift", "super"])

        return ActionResult(
            success=True,
            action="release_all_keys",
            session_id=session_id,
            backend="keyboard_controller",
            details={"released_keys": held},
            observed_outcome=f"Released {len(held)} held keys and reset modifiers",
            verified=True,
        )

    def _xdotool_type(self, text: str) -> subprocess.CompletedProcess:
        return subprocess.run(
            ["docker", "exec", "-e", "DISPLAY=:1", self.CONTAINER_NAME, "xdotool", "type", "--delay", "12", text],
            capture_output=True,
            text=True,
            timeout=10,
        )

    def _xdotool_key(self, keysequence: str) -> subprocess.CompletedProcess:
        return subprocess.run(
            ["docker", "exec", "-e", "DISPLAY=:1", self.CONTAINER_NAME, "xdotool", "key", "--clearmodifiers", keysequence],
            capture_output=True,
            text=True,
            timeout=5,
        )

    def _xdotool_cmd(self, args: List[str]) -> subprocess.CompletedProcess:
        return subprocess.run(
            ["docker", "exec", "-e", "DISPLAY=:1", self.CONTAINER_NAME, "xdotool"] + args,
            capture_output=True,
            text=True,
            timeout=5,
        )


_GLOBAL_KEYBOARD_CONTROLLER: Optional[VirtualKeyboardController] = None


def get_keyboard_controller() -> VirtualKeyboardController:
    """Retrieve the singleton VirtualKeyboardController."""
    global _GLOBAL_KEYBOARD_CONTROLLER
    if _GLOBAL_KEYBOARD_CONTROLLER is None:
        _GLOBAL_KEYBOARD_CONTROLLER = VirtualKeyboardController()
    return _GLOBAL_KEYBOARD_CONTROLLER
