"""Batch B Interactive Browser Acceptance Test Suite.

Verifies:
1. Browser tools (navigate, inspect, click, type, screenshot) registered in ToolRegistry.
2. Playwright-backed BrowserWorker navigation and receipt generation.
3. Element clicking and text entry with observed outcomes.
4. Page inspection returning title, URL, and interactive elements.
5. Visual screenshot capture with valid byte payload.
6. SSRF gate preventing dangerous local/private/metadata navigation.
"""
import pytest
from unittest.mock import MagicMock, patch

from server.intent.registry import ToolRegistry, ExecutionMode
from server.skills.loader import SkillLoader
from skills.browser_skill.tools import (
    browser_navigate,
    browser_inspect,
    browser_click,
    browser_type,
    browser_screenshot,
    TOOLS as BROWSER_TOOLS,
)


def test_browser_tools_registration():
    reg = ToolRegistry()
    for spec, handler, formatter in BROWSER_TOOLS:
        reg.register(spec, handler, formatter)

    spec, handler, fmt = reg.get("browser_navigate")
    assert spec.name == "browser_navigate"
    assert spec.execution_mode == ExecutionMode.DIRECT
    assert callable(handler)
    assert callable(fmt)

    spec_ins, _, _ = reg.get("browser_inspect")
    assert spec_ins.name == "browser_inspect"


def test_browser_skill_loaded_by_skill_loader():
    loader = SkillLoader()
    reg = ToolRegistry()
    loaded_skills = loader.load(reg)
    skill_names = [s.name for s in loaded_skills]

    assert "browser" in skill_names
    # Verify tools registered in registry
    assert reg.get("browser_navigate") is not None
    assert reg.get("browser_inspect") is not None
    assert reg.get("browser_click") is not None
    assert reg.get("browser_type") is not None
    assert reg.get("browser_screenshot") is not None


def test_browser_navigate_ssrf_blocked():
    res = browser_navigate("http://169.254.169.254/latest")
    assert res.status == "failure"
    assert "SSRF" in res.error

    res_local = browser_navigate("http://127.0.0.1:8000")
    assert res_local.status == "failure"
    assert "SSRF" in res_local.error


def test_browser_navigate_success_receipt():
    mock_worker = MagicMock()
    mock_receipt = MagicMock()
    mock_receipt.status = "SUCCEEDED"
    mock_receipt.url = "https://example.org"
    mock_receipt.status_code = 200
    mock_receipt.to_dict.return_value = {
        "action": "navigate",
        "url": "https://example.org",
        "status": "SUCCEEDED",
        "status_code": 200,
    }
    mock_worker.navigate.return_value = mock_receipt

    with patch("skills.browser_skill.tools._get_browser_worker", return_value=mock_worker):
        res = browser_navigate("https://example.org", session_id="test_sess")
        assert res.status == "success"
        assert res.data["url"] == "https://example.org"
        assert res.data["status_code"] == 200
        assert res.data["session_id"] == "test_sess"


def test_browser_inspect_page():
    mock_backend = MagicMock()
    mock_obs = MagicMock()
    mock_obs.url = "https://example.org"
    mock_obs.title = "Example Domain"
    mock_obs.text_content = "This domain is for use in illustrative examples in documents."
    mock_obs.dom_elements = [{"tag": "a", "text": "More information...", "selector": "a"}]
    mock_backend.inspect_page.return_value = mock_obs

    with patch("skills.browser_skill.tools._get_browser_backend", return_value=mock_backend):
        res = browser_inspect(session_id="test_sess")
        assert res.status == "success"
        assert res.data["title"] == "Example Domain"
        assert "illustrative examples" in res.data["text"]
        assert res.data["interactive_elements_count"] == 1


def test_browser_click_and_type():
    mock_backend = MagicMock()
    mock_action = MagicMock()
    mock_action.success = True
    mock_action.observed_outcome = "Element clicked"
    mock_backend.click_element.return_value = mock_action

    mock_type_action = MagicMock()
    mock_type_action.success = True
    mock_type_action.observed_outcome = "Typed 'Hello OS'"
    mock_backend.type_text.return_value = mock_type_action

    with patch("skills.browser_skill.tools._get_browser_backend", return_value=mock_backend):
        # Click
        res_click = browser_click(target="a.more-info", session_id="test_sess")
        assert res_click.status == "success"
        assert res_click.data["action"] == "click"

        # Type
        res_type = browser_type(text="Hello OS", target="input#search", session_id="test_sess")
        assert res_type.status == "success"
        assert res_type.data["text"] == "Hello OS"


def test_browser_screenshot():
    mock_backend = MagicMock()
    fake_png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100
    mock_backend.take_screenshot.return_value = fake_png

    with patch("skills.browser_skill.tools._get_browser_backend", return_value=mock_backend):
        res = browser_screenshot(session_id="test_sess")
        assert res.status == "success"
        assert res.data["bytes_len"] == len(fake_png)
        assert res.data["session_id"] == "test_sess"
