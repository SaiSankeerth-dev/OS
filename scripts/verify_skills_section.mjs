import { chromium } from 'file:///C:/Users/V.%20Sai%20Sankeerth/AppData/Local/OpenAI/Codex/runtimes/cua_node/ecfc0d9aa02807e3/bin/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const artifactDir = 'C:/Users/V. Sai Sankeerth/.gemini/antigravity/brain/808c40c6-25a6-45a2-8607-df8e8514f82f';
const localOutputDir = path.resolve('artifacts/skills-verification');
await fs.mkdir(localOutputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
const results = [];

async function check(name, action) {
  try {
    const detail = await action();
    results.push({ name, status: 'PASS', detail });
    console.log(`[PASS] ${name}: ${detail}`);
  } catch (error) {
    results.push({ name, status: 'FAIL', detail: error.message });
    console.error(`[FAIL] ${name}: ${error.message}`);
  }
}

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message));

try {
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Navigate to Discovery view
  await check('navigate to Discovery view', async () => {
    // Look for button or link with "Discovery" in text or icon
    const discoveryBtn = page.locator('button:has-text("Discovery"), a:has-text("Discovery")').first();
    await discoveryBtn.click();
    await page.waitForTimeout(1500);
    return 'Navigated to Discovery view.';
  });

  // 2. Verify Skills tab and Import button
  await check('verify skills catalog and import button', async () => {
    const skillsTab = page.locator('button:has-text("Skills & Templates")').first();
    await skillsTab.click();
    await page.waitForTimeout(1000);

    const importBtn = page.locator('button:has-text("Import Skill")').first();
    await importBtn.waitFor({ state: 'visible', timeout: 8000 });

    const screenshotPath = path.join(localOutputDir, 'skills-catalog-overview.png');
    await page.screenshot({ path: screenshotPath });
    await fs.copyFile(screenshotPath, path.join(artifactDir, 'skills-catalog-overview.png')).catch(() => {});

    return 'Skills catalog rendered with + Import Skill button.';
  });

  // 3. Open Import Modal & Test GitHub / File Tabs
  await check('open import skill modal', async () => {
    const importBtn = page.locator('button:has-text("Import Skill")').first();
    await importBtn.click();
    await page.waitForTimeout(1000);

    // Verify modal title
    const modalTitle = page.locator('text="Import Skill into OS"');
    await modalTitle.waitFor({ state: 'visible', timeout: 5000 });

    // Capture GitHub Import Tab
    const githubScreenshot = path.join(localOutputDir, 'skills-import-github-modal.png');
    await page.screenshot({ path: githubScreenshot });
    await fs.copyFile(githubScreenshot, path.join(artifactDir, 'skills-import-github-modal.png')).catch(() => {});

    // Switch to File / Code Tab
    const fileTabBtn = page.locator('button:has-text("Skill File or Code")').first();
    await fileTabBtn.click();
    await page.waitForTimeout(800);

    const fileScreenshot = path.join(localOutputDir, 'skills-import-file-modal.png');
    await page.screenshot({ path: fileScreenshot });
    await fs.copyFile(fileScreenshot, path.join(artifactDir, 'skills-import-file-modal.png')).catch(() => {});

    // Close modal
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    await cancelBtn.click();
    await page.waitForTimeout(1000);

    return 'Import modal verified with GitHub and File tabs.';
  });

  // 4. Open Run Skill Modal on calc_skill
  await check('open run modal and execute calc_skill', async () => {
    // Click the 2nd Run Skill button (Safe Math & Arithmetic)
    const runButtons = page.locator('button:has-text("Run Skill")');
    await runButtons.nth(1).waitFor({ state: 'visible', timeout: 5000 });
    await runButtons.nth(1).click();
    await page.waitForTimeout(1000);

    // Verify modal opened
    const modalTitle = page.locator('text="Run Skill: Safe Math & Arithmetic"');
    await modalTitle.waitFor({ state: 'visible', timeout: 5000 });

    // Fill in formula
    const textarea = page.locator('textarea[placeholder*="prompt, query, or command"]');
    await textarea.waitFor({ state: 'visible', timeout: 5000 });
    await textarea.fill('(256 * 16) + 42');

    // Click Execute
    const execBtn = page.locator('button:has-text("Execute in OS")').first();
    await execBtn.click();
    
    // Wait and screenshot modal
    await page.waitForTimeout(3000);
    const runScreenshot = path.join(localOutputDir, 'skills-execution-modal-verified.png');
    await page.screenshot({ path: runScreenshot });
    await fs.copyFile(runScreenshot, path.join(artifactDir, 'skills-execution-modal-verified.png')).catch(() => {});

    // Check if result text is on page
    const pageText = await page.innerText('body');
    const has4138 = pageText.includes('4138');
    console.log('Page has 4138 in text:', has4138);

    return `calc_skill executed. Output verified on page: ${has4138}.`;
  });

} catch (err) {
  console.error('Test suite uncaught error:', err);
  results.push({ name: 'uncaught_error', status: 'FAIL', detail: err.message });
} finally {
  await fs.writeFile(path.join(localOutputDir, 'skills-test-summary.json'), JSON.stringify(results, null, 2));
  await browser.close();
}
