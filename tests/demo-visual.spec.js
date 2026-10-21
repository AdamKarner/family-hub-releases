const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const tabs = ['Home', 'Calendar', 'Meals', 'Grocery', 'Daily list'];
const screensDir = path.join('test-results', 'visual-review');
test('capture phone and desktop screenshots for human comparison', async ({ page }) => {
  fs.mkdirSync(screensDir, { recursive: true });
  const problems = [];
  page.on('pageerror', error => problems.push(error.message));
  for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 740 }, { width: 1100, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/demo/index.html');
    for (const tab of tabs) {
      await page.locator('#nav').getByText(tab, { exact: true }).click();
      await expect(page.locator('#screen')).not.toBeEmpty();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(overflow, tab + ' overflowing ' + viewport.width).toBe(false);
      await page.screenshot({
        path: path.join(screensDir, viewport.width + 'x' + viewport.height + '-' + tab.toLowerCase().replace(/\s+/g, '-') + '.png'),
        animations: 'disabled'
      });
    }
  }
  expect(problems, 'Uncaught browser script errors').toEqual([]);
});
