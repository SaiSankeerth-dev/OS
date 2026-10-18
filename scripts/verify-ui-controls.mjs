import { chromium } from 'file:///C:/Users/V.%20Sai%20Sankeerth/AppData/Local/OpenAI/Codex/runtimes/cua_node/ecfc0d9aa02807e3/bin/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('artifacts/ui-audit/interactions');
await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
const results = [];

try {
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(750);

  await page.getByRole('navigation').getByRole('button', { name: 'Connections', exact: true }).click();
  await page.getByRole('button', { name: 'Configure', exact: true }).first().click();
  await page.waitForTimeout(300);
  const dialogVisible = await page.getByRole('dialog').isVisible();
  await page.screenshot({ path: path.join(outputDir, 'connections-configure-dialog.png') });
  results.push({ name: 'connections configuration dialog', status: dialogVisible ? 'PASS' : 'FAIL' });
  await page.keyboard.press('Escape');

  await page.getByTitle('Switch to Dark mode').click();
  const dark = await page.locator('html').getAttribute('data-theme');
  await page.getByTitle('Switch to Light mode').click();
  results.push({ name: 'light and dark theme toggle', status: dark === 'dark' ? 'PASS' : 'FAIL' });

  await page.getByRole('navigation').getByRole('button', { name: 'Computer', exact: true }).click();
  await page.getByRole('button', { name: 'Hide inspector', exact: true }).click();
  const inspectorVisible = await page.getByText('Execution Backends', { exact: true }).isVisible().catch(() => false);
  results.push({ name: 'computer inspector collapse', status: inspectorVisible ? 'FAIL' : 'PASS' });
} catch (error) {
  results.push({ name: 'control test runner', status: 'FAIL', detail: error.message });
} finally {
  await fs.writeFile(path.join(outputDir, 'controls-report.json'), JSON.stringify(results, null, 2));
  await browser.close();
}

console.log(JSON.stringify(results));
