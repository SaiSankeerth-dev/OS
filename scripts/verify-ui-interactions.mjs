import { chromium } from 'file:///C:/Users/V.%20Sai%20Sankeerth/AppData/Local/OpenAI/Codex/runtimes/cua_node/ecfc0d9aa02807e3/bin/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('artifacts/ui-audit/interactions');
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
  await page.waitForTimeout(1200);

  await check('sidebar navigation', async () => {
    for (const label of ['Ask OS', 'Discovery', 'Tasks', 'Computer', 'Connections', 'Activity', 'Settings']) {
      await page.getByRole('navigation').getByRole('button', { name: label, exact: true }).click();
      await page.waitForTimeout(200);
    }
    return 'All primary sidebar destinations rendered.';
  });

  await page.getByRole('navigation').getByRole('button', { name: 'Computer', exact: true }).click();
  await page.waitForTimeout(600);
  await check('inspector collapse', async () => {
    await page.getByRole('button', { name: 'Hide inspector', exact: true }).click();
    const visible = await page.getByText('Execution Backends', { exact: true }).isVisible().catch(() => false);
    if (visible) throw new Error('Execution backends remained visible after collapse.');
    await page.screenshot({ path: path.join(outputDir, 'computer-inspector-collapsed.png') });
    return 'Inspector collapsed and work surface expanded.';
  });

  await check('sandbox terminal command', async () => {
    await page.getByRole('button', { name: /Terminal|Sandbox Lab/ }).click();
    const command = page.getByPlaceholder('e.g. uname -a, python --version, ls -la');
    await command.fill('python --version');
    await command.press('Enter');
    await page.waitForTimeout(2500);
    const terminalText = await page.locator('body').innerText();
    if (!/Python\s+\d+\.\d+/.test(terminalText)) {
      throw new Error('Terminal did not return a Python version within 2.5 seconds.');
    }
    await page.screenshot({ path: path.join(outputDir, 'terminal-python-version.png') });
    return terminalText.match(/Python\s+\d+\.\d+(?:\.\d+)?/)?.[0] || 'Python version returned';
  });

  await check('browser mode and fullscreen', async () => {
    await page.getByRole('button', { name: /Browser|Native Viewport/ }).click();
    await page.getByRole('button', { name: 'Fullscreen', exact: true }).click();
    await page.waitForTimeout(300);
    const active = await page.evaluate(() => Boolean(document.fullscreenElement));
    if (!active) throw new Error('Fullscreen API did not enter fullscreen in the browser test runner.');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.fullscreenElement);
    await page.waitForTimeout(400);
    return 'Entered and exited native fullscreen.';
  });

  await check('connections configuration dialog', async () => {
    await page.getByRole('navigation').getByRole('button', { name: 'Connections', exact: true }).click();
    // Connections is lazy loaded and then fetches the real connector list.  Waiting for
    // a rendered action avoids treating its initial loading state as a dialog failure.
    const configure = page.getByRole('button', { name: /^(?:Connect|Configure)$/ }).first();
    await configure.waitFor({ state: 'visible', timeout: 10000 });
    await configure.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    await page.screenshot({ path: path.join(outputDir, 'connections-configure-dialog.png') });
    await page.keyboard.press('Escape');
    return 'Configure opened its dialog and dismissed with Escape.';
  });

  await check('light and dark theme toggle', async () => {
    const themeButton = page.getByTitle('Switch to Dark mode');
    await themeButton.click();
    const dark = await page.locator('html').getAttribute('data-theme');
    if (dark !== 'dark') throw new Error(`Expected dark theme, received ${dark}.`);
    await page.getByTitle('Switch to Light mode').click();
    return 'Both theme states toggled.';
  });
} finally {
  await fs.writeFile(path.join(outputDir, 'interaction-report.json'), JSON.stringify(results, null, 2));
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
