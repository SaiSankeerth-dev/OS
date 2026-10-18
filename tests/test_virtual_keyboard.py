"""Automated Unit and Integration Tests for OS Virtual Keyboard Controller.

Verifies:
1. Shortcut and key normalization for Playwright and Linux X11 (xdotool)
2. Sensitive text and target credential masking
3. Typed text entry, single keypress, and modifier shortcut execution
4. Held-key tracking and stuck-key prevention via release_all_keys()
5. Control arbiter authorization (HUMAN_CONTROL, AI_PAUSED, STOPPED, AI_WORKING)
6. Automatic key release on human takeover
7. Concurrency protection against simultaneous typing from multiple agents
8. REST API endpoints for /keyboard/type, /press, /shortcut, /release_all
"""
import unittest
from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from server.computer.arbiter import ControlState, SessionArbiter, get_arbiter_registry
from server.computer.interface import (
    ActionResult,
    BackendCapabilities,
    ComputerControlError,
    ComputerControlInterface,
    HealthStatus,
    ObservationResult,
    SessionState,
)
from server.computer.keyboard import (
    ShortcutNormalizer,
    VirtualKeyboardController,
    mask_sensitive_input,
)
from web.routes_computer_control import router
from fastapi import FastAPI


class MockComputerBackend(ComputerControlInterface):
    """Mock backend implementing ComputerControlInterface for deterministic testing."""

    name = "mock_backend"

    def __init__(self):
        self.typed_text = []
        self.pressed_keys = []
        self.pressed_shortcuts = []
        self.held_keys = set()
        self.released_all = False

    def health_check(self) -> HealthStatus:
        return HealthStatus(ok=True, backend=self.name)

    def get_capabilities(self) -> BackendCapabilities:
        return BackendCapabilities(supports_browser=True, supports_desktop=True)

    def start_session(self, config=None) -> SessionState:
        return SessionState(session_id="test_session_1", backend_name=self.name)

    def attach_session(self, session_id: str) -> SessionState:
        return SessionState(session_id=session_id, backend_name=self.name)

    def list_windows(self):
        return []

    def list_tabs(self, session_id: str):
        return []

    def open_url(self, session_id: str, url: str) -> ActionResult:
        return ActionResult(success=True, action="open_url", session_id=session_id, backend=self.name)

    def observe_screen(self, session_id: str) -> ObservationResult:
        return ObservationResult(session_id=session_id, backend=self.name, url="http://test.local")

    def inspect_page(self, session_id: str) -> ObservationResult:
        return ObservationResult(session_id=session_id, backend=self.name, url="http://test.local")

    def click_element(self, session_id: str, target):
        return ActionResult(success=True, action="click_element", session_id=session_id, backend=self.name)

    def type_text(self, session_id: str, text: str, target=None) -> ActionResult:
        self.typed_text.append((text, target))
        return ActionResult(
            success=True,
            action="type_text",
            session_id=session_id,
            backend=self.name,
            details={"text": text, "target": target},
            observed_outcome=f"Typed '{text}' into '{target}'",
            verified=True,
        )

    def press_key(self, session_id: str, key: str) -> ActionResult:
        self.pressed_keys.append(key)
        return ActionResult(
            success=True,
            action="press_key",
            session_id=session_id,
            backend=self.name,
            details={"key": key},
            observed_outcome=f"Pressed '{key}'",
            verified=True,
        )

    def press_shortcut(self, session_id: str, shortcut: str) -> ActionResult:
        self.pressed_shortcuts.append(shortcut)
        return ActionResult(
            success=True,
            action="press_shortcut",
            session_id=session_id,
            backend=self.name,
            details={"shortcut": shortcut},
            observed_outcome=f"Executed shortcut '{shortcut}'",
            verified=True,
        )

    def key_down(self, session_id: str, key: str) -> ActionResult:
        self.held_keys.add(key)
        return ActionResult(success=True, action="key_down", session_id=session_id, backend=self.name)

    def key_up(self, session_id: str, key: str) -> ActionResult:
        self.held_keys.discard(key)
        return ActionResult(success=True, action="key_up", session_id=session_id, backend=self.name)

    def release_all_keys(self, session_id: str) -> ActionResult:
        self.released_all = True
        self.held_keys.clear()
        return ActionResult(success=True, action="release_all_keys", session_id=session_id, backend=self.name)

    def scroll(self, session_id: str, direction="down", amount=300):
        return ActionResult(success=True, action="scroll", session_id=session_id, backend=self.name)

    def switch_tab(self, session_id: str, tab_id: str):
        return ActionResult(success=True, action="switch_tab", session_id=session_id, backend=self.name)

    def take_screenshot(self, session_id: str) -> bytes:
        return b"fake_png"

    def download_file(self, session_id: str, url_or_action: str) -> str:
        return "/tmp/download.txt"

    def get_session_state(self, session_id: str) -> SessionState:
        return SessionState(session_id=session_id, backend_name=self.name)

    def cancel_action(self, session_id: str):
        return ActionResult(success=True, action="cancel_action", session_id=session_id, backend=self.name)

    def close_session(self, session_id: str):
        return ActionResult(success=True, action="close_session", session_id=session_id, backend=self.name)


class TestVirtualKeyboard(unittest.TestCase):
    """Unit test suite for VirtualKeyboardController, normalizers, and arbiter integration."""

    def setUp(self):
        self.controller = VirtualKeyboardController()
        self.backend = MockComputerBackend()
        self.session_id = "test_kb_session_42"
        self.arbiter = get_arbiter_registry().get_or_create(self.session_id)
        self.arbiter.state = ControlState.AI_WORKING  # Set authorized state for tests

    def tearDown(self):
        self.controller.release_all_keys(self.session_id, self.backend)
        get_arbiter_registry().remove(self.session_id)

    def test_shortcut_normalizer_playwright(self):
        """Test conversion of various user inputs to Playwright keyboard strings."""
        self.assertEqual(ShortcutNormalizer.to_playwright("Ctrl+L"), "Control+l")
        self.assertEqual(ShortcutNormalizer.to_playwright("ctrl+a"), "Control+a")
        self.assertEqual(ShortcutNormalizer.to_playwright("Alt+Tab"), "Alt+Tab")
        self.assertEqual(ShortcutNormalizer.to_playwright("Shift+Enter"), "Shift+Enter")
        self.assertEqual(ShortcutNormalizer.to_playwright("cmd+c"), "Meta+c")
        self.assertEqual(ShortcutNormalizer.to_playwright("enter"), "Enter")
        self.assertEqual(ShortcutNormalizer.to_playwright("escape"), "Escape")
        self.assertEqual(ShortcutNormalizer.to_playwright("arrowdown"), "ArrowDown")

    def test_shortcut_normalizer_xdotool(self):
        """Test conversion of shortcuts to Linux X11 xdotool strings."""
        self.assertEqual(ShortcutNormalizer.to_xdotool("Ctrl+L"), "ctrl+l")
        self.assertEqual(ShortcutNormalizer.to_xdotool("Enter"), "Return")
        self.assertEqual(ShortcutNormalizer.to_xdotool("Backspace"), "BackSpace")
        self.assertEqual(ShortcutNormalizer.to_xdotool("PageUp"), "Page_Up")
        self.assertEqual(ShortcutNormalizer.to_xdotool("Down"), "Down")

    def test_sensitive_text_masking(self):
        """Verify sensitive credentials and password fields are redacted in logs."""
        self.assertEqual(mask_sensitive_input("secret123", "input[type='password']"), "[REDACTED 9 chars]")
        self.assertEqual(mask_sensitive_input("topsecret", "auth_token_field"), "[REDACTED 9 chars]")
        self.assertIn("[REDACTED_SECRET]", mask_sensitive_input("Authorization: Bearer my_secret_token_12345"))
        self.assertEqual(mask_sensitive_input("hello world", "#username"), "hello world")

    def test_type_text_success(self):
        """Verify type_text delegates correctly to backend and records metrics."""
        res = self.controller.type_text(
            session_id=self.session_id,
            text="https://example.com",
            target="#address-bar",
            backend_instance=self.backend,
        )
        self.assertTrue(res.success)
        self.assertEqual(len(self.backend.typed_text), 1)
        self.assertEqual(self.backend.typed_text[0], ("https://example.com", "#address-bar"))
        self.assertGreaterEqual(res.duration_ms, 0)

    def test_press_key_and_shortcut(self):
        """Verify press_key and press_shortcut normalize and invoke backend."""
        res_key = self.controller.press_key(self.session_id, "Enter", self.backend)
        self.assertTrue(res_key.success)
        self.assertIn("Enter", self.backend.pressed_keys)

        res_sc = self.controller.press_shortcut(self.session_id, "Ctrl+A", self.backend)
        self.assertTrue(res_sc.success)
        self.assertIn("Control+a", self.backend.pressed_shortcuts)

    def test_held_keys_tracking_and_release_all(self):
        """Verify key_down tracks keys and release_all_keys clears them all."""
        self.controller.key_down(self.session_id, "Control", self.backend)
        self.controller.key_down(self.session_id, "Shift", self.backend)

        held = self.controller._get_held_keys(self.session_id)
        self.assertIn("Control", held)
        self.assertIn("Shift", held)

        # Release all
        res = self.controller.release_all_keys(self.session_id, self.backend)
        self.assertTrue(res.success)
        self.assertEqual(len(self.controller._get_held_keys(self.session_id)), 0)
        self.assertTrue(self.backend.released_all)

    def test_arbiter_rejection_on_human_control(self):
        """AI typing must be rejected when human is in control."""
        self.arbiter.state = ControlState.HUMAN_CONTROL
        with self.assertRaises(ComputerControlError) as ctx:
            self.controller.type_text(self.session_id, "unauthorized", backend_instance=self.backend)
        self.assertIn("Human control is active", str(ctx.exception))

    def test_arbiter_rejection_on_pause_or_stop(self):
        """AI typing must be rejected when session is paused or stopped."""
        self.arbiter.state = ControlState.AI_PAUSED
        with self.assertRaises(ComputerControlError):
            self.controller.press_shortcut(self.session_id, "Ctrl+L", self.backend)

        self.arbiter.state = ControlState.STOPPED
        with self.assertRaises(ComputerControlError):
            self.controller.press_key(self.session_id, "Enter", self.backend)

    def test_human_takeover_triggers_cleanup_callback(self):
        """When human interacts, registered arbiter cleanup (e.g. key release) is invoked."""
        cleanup_called = []
        self.arbiter.register_cleanup_callback(lambda: cleanup_called.append(True))

        paused, reason = self.arbiter.on_human_interaction("keyboard")
        self.assertTrue(paused)
        self.assertEqual(len(cleanup_called), 1)
        self.assertEqual(self.arbiter.state, ControlState.AI_PAUSED)

    def test_concurrent_agent_typing_lock(self):
        """Second agent cannot send keystrokes while first agent holds session lock."""
        # Agent 1 locks session
        self.controller._check_arbiter_and_lock(self.session_id, agent_id="agent_1")
        # Agent 2 attempts to type in same session
        with self.assertRaises(ComputerControlError) as ctx:
            self.controller._check_arbiter_and_lock(self.session_id, agent_id="agent_2")
        self.assertIn("Concurrent typing conflict", str(ctx.exception))

        # Agent 1 releases lock
        self.controller._release_typist_lock(self.session_id, agent_id="agent_1")
        # Agent 2 can now lock
        self.controller._check_arbiter_and_lock(self.session_id, agent_id="agent_2")
        self.controller._release_typist_lock(self.session_id, agent_id="agent_2")


class TestKeyboardAPIEndpoints(unittest.TestCase):
    """Test REST API routes for AI virtual keyboard."""

    def setUp(self):
        app = FastAPI()
        app.include_router(router)
        self.client = TestClient(app)
        self.session_id = "test_api_sess_1"
        self.arbiter = get_arbiter_registry().get_or_create(self.session_id)
        self.arbiter.state = ControlState.AI_WORKING

    def tearDown(self):
        get_arbiter_registry().remove(self.session_id)

    @patch("web.routes_computer_control.get_computer_registry")
    def test_api_type_text(self, mock_get_reg):
        mock_backend = MockComputerBackend()
        mock_reg = MagicMock()
        mock_reg.get_backend.return_value = mock_backend
        mock_get_reg.return_value = mock_reg

        resp = self.client.post(
            f"/api/computer/sessions/mock_backend/{self.session_id}/keyboard/type",
            json={"text": "Hello OS!", "target": "#input"},
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["ok"])
        self.assertEqual(data["action"], "type_text")

    @patch("web.routes_computer_control.get_computer_registry")
    def test_api_press_shortcut(self, mock_get_reg):
        mock_backend = MockComputerBackend()
        mock_reg = MagicMock()
        mock_reg.get_backend.return_value = mock_backend
        mock_get_reg.return_value = mock_reg

        resp = self.client.post(
            f"/api/computer/sessions/mock_backend/{self.session_id}/keyboard/shortcut",
            json={"shortcut": "Ctrl+L"},
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["ok"])
        self.assertEqual(data["action"], "press_shortcut")

    @patch("web.routes_computer_control.get_computer_registry")
    def test_api_release_all(self, mock_get_reg):
        mock_backend = MockComputerBackend()
        mock_reg = MagicMock()
        mock_reg.get_backend.return_value = mock_backend
        mock_get_reg.return_value = mock_reg

        resp = self.client.post(
            f"/api/computer/sessions/mock_backend/{self.session_id}/keyboard/release_all",
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["ok"])
        self.assertEqual(data["action"], "release_all_keys")


if __name__ == "__main__":
    unittest.main()
