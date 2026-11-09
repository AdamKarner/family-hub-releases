const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

test('capture retired demo pages for mobile and desktop review', async ({ page }) => {
  const out = path.join('test-results', 'retired-demo-review');
  fs.mkdirSync(out, { recursive: true });
  for (const route of ['demo', 'preview']) {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1100, height: 900 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/' + route + '/');
      await expect(page.getByRole('heading', { name: 'See the real Kindlane.' })).toBeVisible();
      await page.screenshot({ path: path.join(out, route + '-' + viewport.width + '.png'), fullPage: true });
    }
  }
});
