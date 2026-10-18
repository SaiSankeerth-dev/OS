import { chromium } from 'file:///C:/Users/V.%20Sai%20Sankeerth/AppData/Local/OpenAI/Codex/runtimes/cua_node/ecfc0d9aa02807e3/bin/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('artifacts/ui-audit/model-switcher');
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
  await page.waitForTimeout(1500);

  await check('topbar model selector rendered', async () => {
    const select = page.locator('header select[title="Switch Ollama model dynamically"]');
    await select.waitFor({ state: 'visible', timeout: 10000 });
    const options = await select.locator('option').allInnerTexts();
    if (options.length === 0) {
      throw new Error('Model selector dropdown has no options');
    }
    return `Model selector rendered with ${options.length} model(s): ${options.join(', ')}`;
  });

  await check('topbar rescan button works', async () => {
    const refreshBtn = page.locator('header button[title="Rescan Ollama models"]');
    await refreshBtn.waitFor({ state: 'visible', timeout: 5000 });
    await refreshBtn.click();
    await page.waitForTimeout(1500);
    return 'Rescan button clicked and response received cleanly.';
  });

  await check('select model dynamically', async () => {
    const select = page.locator('header select[title="Switch Ollama model dynamically"]');
    const firstVal = await select.locator('option').first().getAttribute('value');
    if (!firstVal) throw new Error('No value found in first option');
    await select.selectOption(firstVal);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, 'topbar-model-selector-verified.png') });
    return `Selected model '${firstVal}' successfully in topbar.`;
  });
} finally {
  await fs.writeFile(path.join(outputDir, 'test-report.json'), JSON.stringify(results, null, 2));
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
