import { chromium } from 'file:///C:/Users/V.%20Sai%20Sankeerth/AppData/Local/OpenAI/Codex/runtimes/cua_node/ecfc0d9aa02807e3/bin/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('artifacts/ui-audit/settings-models');
await fs.mkdir(outputDir, { recursive: true });

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
  } catch (error) {
    results.push({ name, status: 'FAIL', detail: error.message });
  }
}

try {
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Navigate to Settings
  await page.getByRole('navigation').getByRole('button', { name: 'Settings', exact: true }).click();
  await page.waitForTimeout(800);

  // Click on Policy & Routing Tab
  const policyTab = page.getByRole('button', { name: /Policy|Routing|Security/i });
  await policyTab.waitFor({ state: 'visible', timeout: 5000 });
  await policyTab.click();
  await page.waitForTimeout(1000);

  await check('settings inference engine model select visible', async () => {
    const select = page.locator('select[title="Select model from available models"]');
    await select.waitFor({ state: 'visible', timeout: 5000 });
    const options = await select.locator('option').allInnerTexts();
    return `Inference Engine dropdown has ${options.length} model option(s): ${options.join(', ')}`;
  });

  await check('settings available models cards rendered', async () => {
    const cards = page.locator('div:has-text("Available Downloaded Models") + div > div');
    const count = await cards.count();
    await page.screenshot({ path: path.join(outputDir, 'settings-inference-engine-verified.png') });
    return `Rendered ${count} available model card(s).`;
  });
} finally {
  await fs.writeFile(path.join(outputDir, 'test-report.json'), JSON.stringify(results, null, 2));
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
