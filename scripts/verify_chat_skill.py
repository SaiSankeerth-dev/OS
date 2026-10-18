import os
import shutil
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = "C:/Users/V. Sai Sankeerth/.gemini/antigravity/brain/808c40c6-25a6-45a2-8607-df8e8514f82f"
LOCAL_OUT = "d:/OS/artifacts/skills-verification"
os.makedirs(LOCAL_OUT, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

def save_screenshot(page, name):
    local_path = os.path.join(LOCAL_OUT, f"{name}.png")
    page.screenshot(path=local_path)
    art_path = os.path.join(ARTIFACT_DIR, f"{name}.png")
    shutil.copyfile(local_path, art_path)
    print(f"[SCREENSHOT] Saved: {art_path}")

def main():
    print("=== TESTING ASK OS CHAT SKILL DISPATCH ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path="C:/Program Files/Google/Chrome/Application/chrome.exe"
        )
        context = browser.new_context(viewport={"width": 1536, "height": 960})
        page = context.new_page()

        page.goto("http://127.0.0.1:3000", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # Click Ask OS in sidebar nav
        print("Clicking Ask OS in sidebar nav...")
        ask_os_nav = page.locator("nav button:has-text('Ask OS')").first
        ask_os_nav.wait_for(state="visible", timeout=10000)
        ask_os_nav.click()
        page.wait_for_timeout(1500)

        # Locate the chat input
        chat_input = page.locator("input[placeholder*='Ask OS']").first
        chat_input.wait_for(state="visible", timeout=10000)
        print("Found chat input, sending skill command: /skill calc (1024 * 8) + 256")
        
        chat_input.fill("/skill calc (1024 * 8) + 256")
        page.wait_for_timeout(500)
        chat_input.press("Enter")

        print("Waiting for computation response in Chat...")
        page.wait_for_selector("text=8448", timeout=25000)
        page.wait_for_timeout(2000)

        save_screenshot(page, "skills-chat-command-verified")
        browser.close()
        print("=== CHAT SKILL DISPATCH VERIFIED SUCCESSFULLY ===")

if __name__ == "__main__":
    main()
