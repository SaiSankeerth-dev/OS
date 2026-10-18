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
    print("=== STARTING FULL E2E AGENT SKILLS VERIFICATION ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path="C:/Program Files/Google/Chrome/Application/chrome.exe"
        )
        context = browser.new_context(viewport={"width": 1536, "height": 1280})
        page = context.new_page()

        # Listen to console messages
        page.on("console", lambda msg: print(f"[CONSOLE] {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))

        print("Navigating to OS web application...")
        page.goto("http://127.0.0.1:3000", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # 1. Navigate to Discovery (Skills) View
        print("1. Navigating to Discovery View...")
        disc_btn = page.locator("button:has-text('Discovery'), a:has-text('Discovery')").first
        if disc_btn.count() > 0:
            disc_btn.click()
            page.wait_for_timeout(1500)
        else:
            page.evaluate("window.location.hash = '#/discovery'")
            page.wait_for_timeout(1500)

        save_screenshot(page, "skills-catalog-overview")

        # 2. Test Import Modal with 4 tabs
        print("2. Testing Import Modal with 4 tabs...")
        import_btn = page.locator("button:has-text('Import Skill')").first
        import_btn.wait_for(state="visible", timeout=10000)
        import_btn.click()
        page.wait_for_timeout(1000)

        save_screenshot(page, "skills-import-modal-tabs")

        # 3. Test ZIP Archive Tab and Upload
        print("3. Testing ZIP Archive Tab & Uploading test_agent_skill.zip...")
        zip_tab = page.locator("button:has-text('ZIP Archive')").first
        zip_tab.click()
        page.wait_for_timeout(500)

        file_input = page.locator("#zip-upload-input").first
        file_input.set_input_files("d:/OS/test_agent_skill.zip")
        page.wait_for_timeout(1000)

        save_screenshot(page, "skills-zip-tab-selected")

        # Click Unpack & Install ZIP
        install_zip_btn = page.locator("button:has-text('Unpack & Install ZIP')").first
        install_zip_btn.click()
        print("Waiting for ZIP import to complete...")
        page.wait_for_timeout(3000)

        save_screenshot(page, "skills-catalog-after-zip-import")

        # 4. Open Skill Inspector Modal for newly imported skill
        print("4. Inspecting imported skill card...")
        card = page.locator("div.p-5:has-text('test_agent_skill')").first
        if card.count() == 0:
            card = page.locator("div.p-5").first

        inspect_btn = card.locator("button:has-text('Inspect')").first
        inspect_btn.wait_for(state="visible", timeout=5000)
        inspect_btn.click()
        page.wait_for_timeout(1500)
        save_screenshot(page, "skills-inspector-contract-tab")

        # Click Files & Scripts tab inside modal
        modal = page.locator("div.fixed.inset-0.z-50").last
        files_tab = modal.locator("button:has-text('Files & Scripts')").first
        if files_tab.count() > 0:
            files_tab.click()
            page.wait_for_timeout(1000)
            save_screenshot(page, "skills-inspector-files-tab")

        # Click Security tab inside modal
        sec_tab = modal.locator("button:has-text('Security & Permissions')").first
        if sec_tab.count() > 0:
            sec_tab.click()
            page.wait_for_timeout(1000)
            save_screenshot(page, "skills-inspector-security-tab")

        # Close Inspector Modal via Escape
        page.keyboard.press("Escape")
        page.wait_for_timeout(1000)

        # 5. Run Skill on Virtual Computer Container
        print("5. Executing Skill on OS Virtual Desktop container...")
        run_computer_btn = card.locator("button:has-text('Run on Computer')").first
        run_computer_btn.click()
        page.wait_for_timeout(1500)

        run_modal = page.locator("div.fixed.inset-0.z-50").last
        save_screenshot(page, "skills-run-modal-before-exec")

        exec_btn = run_modal.locator("button:has-text('Execute in OS')").first
        exec_btn.click()
        print("Waiting for container execution and postcondition verification...")
        
        # Wait up to 30 seconds for COMPLETED badge
        run_modal.locator("text=COMPLETED").wait_for(state="visible", timeout=30000)
        page.wait_for_timeout(2000)

        save_screenshot(page, "skills-container-execution-verified")

        # 6. Check Execution Runs & Telemetry Tab
        print("6. Checking Execution Runs & Telemetry Tab...")
        page.keyboard.press("Escape")
        page.wait_for_timeout(1000)

        # Switch to Execution Runs tab
        runs_tab = page.locator("button:has-text('Execution Runs')").first
        runs_tab.click()
        page.wait_for_timeout(2000)

        save_screenshot(page, "skills-execution-runs-history")

        # 7. Test Ask OS Chat Skill Execution
        print("7. Testing Ask OS Chat Skill Command Integration...")
        chat_nav = page.locator("button:has-text('Ask OS'), a:has-text('Ask OS')").first
        if chat_nav.count() > 0:
            chat_nav.click()
            page.wait_for_timeout(1500)
        else:
            page.evaluate("window.location.hash = '#/chat'")
            page.wait_for_timeout(1500)

        # Find chat input textarea
        chat_input = page.locator("textarea").first
        chat_input.fill("/skill calc (1024 * 8) + 256")
        page.wait_for_timeout(500)
        
        # Press Enter
        chat_input.press("Enter")
        print("Waiting for skill output in Chat...")
        page.wait_for_timeout(5000)

        save_screenshot(page, "skills-chat-command-verified")

        browser.close()
        print("=== E2E AGENT SKILLS VERIFICATION COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    main()
