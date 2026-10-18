"""Focused browser verification for Phase 1 theme/input readability.

Requires a locally running OS dashboard (default: http://127.0.0.1:3000).
It writes screenshots and a compact computed-style report under artifacts/ui-audit.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright


ARTIFACT_DIR = Path("artifacts/ui-audit")
COMPOSER_PLACEHOLDER = (
    "Ask OS anything or direct an action (e.g., 'Schedule meeting with Alex at 3pm')..."
)
PALETTE_PLACEHOLDER = "Type a command, search tasks, or ask OS..."


def inspect(locator) -> dict[str, object]:
    return locator.evaluate(
        """element => {
          const style = getComputedStyle(element);
          const placeholder = getComputedStyle(element, '::placeholder');
          const parentStyle = getComputedStyle(element.parentElement);
          return {
            color: style.color,
            caretColor: style.caretColor,
            placeholderColor: placeholder.color,
            outlineStyle: style.outlineStyle,
            parentBoxShadow: parentStyle.boxShadow,
            parentBackground: parentStyle.backgroundColor,
            focused: document.activeElement === element,
          };
        }"""
    )


def assert_visible_focus(result: dict[str, object], expected_text: str, expected_caret: str, expected_placeholder: str) -> None:
    assert result["focused"], "input did not retain focus"
    assert result["color"] == expected_text, result
    assert result["caretColor"] == expected_caret, result
    assert result["placeholderColor"] == expected_placeholder, result
    assert result["outlineStyle"] == "solid", result
    assert "rgb(" in str(result["parentBoxShadow"]), result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:3000/")
    args = parser.parse_args()

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    console_errors: list[str] = []
    failed_requests: list[dict[str, object]] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.set_default_timeout(5_000)
        page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        page.on("requestfailed", lambda request: failed_requests.append({"url": request.url, "failure": request.failure or "unknown"}))
        page.goto(args.url, wait_until="domcontentloaded")
        page.get_by_role("navigation").get_by_role("button", name="Ask OS").click()

        composer = page.get_by_placeholder(COMPOSER_PLACEHOLDER)
        composer.wait_for()
        composer.click()
        composer.fill("Phase 1 typed-input visibility check")
        light_chat = inspect(composer)
        assert_visible_focus(light_chat, "rgb(22, 35, 61)", "rgb(37, 99, 235)", "rgb(94, 109, 133)")
        page.screenshot(path=str(ARTIFACT_DIR / "phase1-light-chat-focus.png"), full_page=True)

        page.get_by_title("Switch to Dark mode").click()
        page.wait_for_function("document.documentElement.dataset.theme === 'dark'")
        composer.click()
        dark_chat = inspect(composer)
        assert_visible_focus(dark_chat, "rgb(248, 250, 252)", "rgb(16, 185, 129)", "rgb(185, 197, 212)")
        page.screenshot(path=str(ARTIFACT_DIR / "phase1-dark-chat-focus.png"), full_page=True)

        page.get_by_role("button", name="Search or ask OS...").click()
        palette = page.get_by_placeholder(PALETTE_PLACEHOLDER)
        palette.wait_for()
        palette.fill("overview")
        dark_palette = inspect(palette)
        assert_visible_focus(dark_palette, "rgb(248, 250, 252)", "rgb(16, 185, 129)", "rgb(185, 197, 212)")
        page.screenshot(path=str(ARTIFACT_DIR / "phase1-dark-command-palette-focus.png"), full_page=True)
        browser.close()

    assert not console_errors, console_errors
    assert not failed_requests, failed_requests
    report = {
        "lightChat": light_chat,
        "darkChat": dark_chat,
        "darkPalette": dark_palette,
        "consoleErrors": console_errors,
        "failedRequests": failed_requests,
    }
    (ARTIFACT_DIR / "phase1-browser-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
