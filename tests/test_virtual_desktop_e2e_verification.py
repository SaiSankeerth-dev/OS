"""Playwright End-to-End Verification for OS Virtual Desktop.

Tests:
1. Loads OS Computer View on http://localhost:3000/#/computer
2. Selects the Linux Virtual Desktop tab
3. Asserts the status badge is READY
4. Asserts noVNC iframe is loaded with valid stream URL
5. Captures screenshot of OS frontend Computer View with the live desktop stream
"""
import time
from playwright.sync_api import sync_playwright

def run_e2e_desktop_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to OS dashboard on http://localhost:3000...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(2)

        # Click Computer in sidebar
        computer_nav = page.locator("nav button:has-text('Computer')").first
        if not computer_nav.is_visible():
            computer_nav = page.locator("button:has-text('Computer')").first
        computer_nav.click()
        time.sleep(2)

        # Click on Linux Virtual Desktop tab
        desktop_tab = page.locator("button:has-text('Linux Virtual Desktop')")
        assert desktop_tab.is_visible(), "Linux Virtual Desktop tab button not found"
        desktop_tab.click()
        
        # Wait for desktop status to update from loading/offline to READY
        print("Waiting for desktop status to report READY...")
        ready_badge = page.locator("span:has-text('READY')").first
        ready_badge.wait_for(state="visible", timeout=15000)
        print("Verified status badge: READY")

        # Verify iframe src contains 6080 and vnc.html
        iframe = page.locator("iframe[title='OS Linux Virtual Desktop Stream']")
        assert iframe.is_visible(), "noVNC desktop stream iframe is not visible"
        src = iframe.get_attribute("src") or ""
        assert "6080" in src and "vnc.html" in src, f"Unexpected iframe src: {src}"
        print(f"Verified noVNC stream iframe URL: {src}")

        # Wait for noVNC canvas to render
        time.sleep(3)

        # Capture screenshot of OS Computer view
        artifact_path = "C:/Users/V. Sai Sankeerth/.gemini/antigravity/brain/808c40c6-25a6-45a2-8607-df8e8514f82f/os_computer_view_final_verified.png"
        page.screenshot(path=artifact_path)
        print(f"Captured frontend verification screenshot: {artifact_path}")

        browser.close()

if __name__ == "__main__":
    run_e2e_desktop_verification()
