import { chromium } from 'file:///C:/Users/V.%20Sai%20Sankeerth/AppData/Local/OpenAI/Codex/runtimes/cua_node/ecfc0d9aa02807e3/bin/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('button:has-text("Discovery")').first().click();
await page.waitForTimeout(1500);

// Click the 1st Run Skill button (Gpt Researcher)
const firstRunBtn = page.locator('button:has-text("Run Skill")').first();
await firstRunBtn.click();
await page.waitForTimeout(1000);

// Click Execute in OS
const execBtn = page.locator('button:has-text("Execute in OS")').first();
await execBtn.click();
await page.waitForTimeout(2500);

const p = 'artifacts/skills-verification/skills-imported-github-run-verified.png';
await page.screenshot({ path: p });
await fs.copyFile(p, 'C:/Users/V. Sai Sankeerth/.gemini/antigravity/brain/808c40c6-25a6-45a2-8607-df8e8514f82f/skills-imported-github-run-verified.png').catch(() => {});
await browser.close();
console.log('Captured skills-imported-github-run-verified.png successfully!');
