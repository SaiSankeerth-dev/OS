import { chromium } from 'file:///C:/Users/V.%20Sai%20Sankeerth/AppData/Local/OpenAI/Codex/runtimes/cua_node/ecfc0d9aa02807e3/bin/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const phase = process.argv[2] || 'baseline';
const width = Number(process.argv[3]) || 1536;
const height = Number(process.argv[4]) || 1024;
const theme = process.argv[5] || 'light';
const outputDir = path.resolve('artifacts/ui-audit', phase);
const baseUrl = process.env.UI_AUDIT_URL || 'http://127.0.0.1:3000';
const chromePath = process.env.UI_AUDIT_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
});
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 1,
});
const runtimeErrors = [];
page.on('console', (message) => {
  if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`));

async function settle() {
  await page.waitForTimeout(1200);
}

async function capture(name) {
  await settle();
  await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: false });
}

async function openView(label, name) {
  await page.getByRole('navigation').getByRole('button', { name: label, exact: true }).click();
  await capture(name);
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
  if (theme === 'dark') {
    await page.getByTitle('Switch to Dark mode').click();
    await settle();
  }
  await capture('overview');
  await openView('Ask OS', 'ask-os');
  await openView('Discovery', 'discovery');
  await openView('Tasks', 'tasks');
  await openView('Computer', 'computer-browser');
  await page.getByRole('button', { name: /Linux Virtual Computer/ }).click();
  await capture('computer-desktop');
  await page.getByRole('button', { name: /Sandbox Lab/ }).click();
  await capture('computer-terminal');
  await openView('Connections', 'connections');
  await openView('Activity', 'activity');
  await openView('Settings', 'settings');
  await openView('Cyber HUD', 'cyber-hud');

  const report = {
    phase,
    baseUrl,
    viewport: { width, height },
    theme,
    title: await page.title(),
    runtimeErrors: [...new Set(runtimeErrors)],
    generatedAt: new Date().toISOString(),
  };
  await fs.writeFile(path.join(outputDir, 'capture-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
