import { chromium } from 'file:///C:/Users/V.%20Sai%20Sankeerth/AppData/Local/OpenAI/Codex/runtimes/cua_node/ecfc0d9aa02807e3/bin/node_modules/playwright/index.mjs';
import path from 'node:path';

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Navigate to Connections
  await page.getByRole('navigation').getByRole('button', { name: 'Connections', exact: true }).click();
  await page.waitForTimeout(1500);

  // Screenshot grid
  await page.screenshot({ path: 'artifacts/ui-audit/interactions/connectors-view-grid.png' });
  console.log('Saved connectors-view-grid.png');

  // Open Google Calendar modal
  const calCard = page.locator('div').filter({ hasText: /^Google Calendar/ }).first();
  await page.getByRole('button', { name: /^(?:Connect|Configure)$/ }).first().click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'artifacts/ui-audit/interactions/google-calendar-modal-setup.png' });
  console.log('Saved google-calendar-modal-setup.png');

} finally {
  await browser.close();
}
