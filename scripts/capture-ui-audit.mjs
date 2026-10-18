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
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  // Captures must exercise the current server build, not a previous run's
  // persistent service-worker cache.  Service worker behavior is verified
  // separately by the browser, while this runner records route readiness.
  serviceWorkers: 'block',
});
const page = await context.newPage();
const runtimeErrors = [];
const failedRequests = [];
const routeResults = [];
page.on('console', (message) => {
  if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`));
page.on('requestfailed', (request) => {
  failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`);
});

async function waitForRoute(label) {
  await page.getByText('Loading module...', { exact: true }).waitFor({ state: 'hidden', timeout: 10000 });
  await page.locator('main').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('main').evaluate((main) => {
    if (!main.textContent?.trim()) throw new Error('Main route content is empty');
  });
  await page.getByRole('navigation').getByRole('button', { name: label, exact: true })
    .waitFor({ state: 'visible', timeout: 10000 });
  // Let the route's own data effect paint once; do not wait for idle because
  // the dashboard intentionally maintains polling and WebSocket connections.
  await page.waitForTimeout(500);
}

async function capture(name) {
  await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: false });
}

async function openView(label, name) {
  const startedAt = Date.now();
  try {
    console.log(`Opening ${label}`);
    await page.getByRole('navigation').getByRole('button', { name: label, exact: true }).click();
    await waitForRoute(label);
    await capture(name);
    routeResults.push({ name, label, status: 'captured', durationMs: Date.now() - startedAt });
  } catch (error) {
    routeResults.push({ name, label, status: 'failed', durationMs: Date.now() - startedAt, error: String(error) });
    console.error(`Capture failed for ${label}: ${error}`);
  }
}

try {
  // Do not make the document load event a prerequisite: module graphs can
  // legitimately outlive it while lazy routes are being fetched.  The next
  // step has a bounded, semantic readiness check for the rendered Overview.
  await page.goto(baseUrl, { waitUntil: 'commit', timeout: 15000 });
  await waitForRoute('Overview');
  if (theme === 'dark') {
    await page.getByTitle('Switch to Dark mode').click();
    await page.waitForTimeout(300);
  }
  await capture('overview');
  routeResults.push({ name: 'overview', label: 'Overview', status: 'captured' });
  await openView('Ask OS', 'ask-os');
  await openView('Discovery', 'discovery');
  await openView('Tasks', 'tasks');
  await openView('Computer', 'computer-browser');
  try {
    await page.getByRole('button', { name: /^Desktop (?:READY|STARTING|STANDBY|DEGRADED|OFFLINE)/i }).click({ timeout: 10000 });
    await page.getByText(/Linux Virtual Computer|HTML5 noVNC/i).first().waitFor({ state: 'visible', timeout: 10000 });
    await capture('computer-desktop');
    routeResults.push({ name: 'computer-desktop', label: 'Computer / Linux Desktop', status: 'captured' });
    
    // Also capture wallpaper picker opened
    try {
      await page.getByRole('button', { name: /Wallpapers/i }).click();
      await page.waitForTimeout(300);
      await capture('computer-desktop-wallpapers');
      await page.getByRole('button', { name: /Wallpapers/i }).click(); // toggle close
    } catch (_) {}
  } catch (error) {
    routeResults.push({ name: 'computer-desktop', label: 'Computer / Linux Desktop', status: 'failed', error: String(error) });
  }
  try {
    await page.getByRole('button', { name: /^Terminal/ }).click({ timeout: 10000 });
    await page.getByLabel('Sandbox command').waitFor({ state: 'visible', timeout: 10000 });
    await capture('computer-terminal');
    routeResults.push({ name: 'computer-terminal', label: 'Computer / Terminal', status: 'captured' });
  } catch (error) {
    routeResults.push({ name: 'computer-terminal', label: 'Computer / Terminal', status: 'failed', error: String(error) });
  }
  await openView('Connections', 'connections');
  await openView('Activity', 'activity');
  await openView('Settings', 'settings');
  // Cyber HUD remains an internal, non-primary route; it is intentionally not
  // part of the unified eight-item navigation or the reference-page capture.

  const report = {
    phase,
    baseUrl,
    viewport: { width, height },
    theme,
    title: await page.title(),
    runtimeErrors: [...new Set(runtimeErrors)],
    failedRequests: [...new Set(failedRequests)],
    routes: routeResults,
    generatedAt: new Date().toISOString(),
  };
  await fs.writeFile(path.join(outputDir, 'capture-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await context.close();
  await browser.close();
}
