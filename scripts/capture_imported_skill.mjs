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

const p = 'artifacts/skills-verification/skills-catalog-with-imported-github-skill.png';
await page.screenshot({ path: p });
await fs.copyFile(p, 'C:/Users/V. Sai Sankeerth/.gemini/antigravity/brain/808c40c6-25a6-45a2-8607-df8e8514f82f/skills-catalog-with-imported-github-skill.png').catch(() => {});
await browser.close();
console.log('Captured skills-catalog-with-imported-github-skill.png successfully!');
