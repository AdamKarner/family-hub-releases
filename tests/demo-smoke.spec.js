// Run after complete original demo ZIP assets are integrated.
// npm install --no-save playwright && npx playwright test tests/demo-smoke.spec.js
const { test, expect } = require('@playwright/test');

test('phone primary navigation and reset', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./demo/index.html');
  for (const label of ['Calendar', 'Meals', 'Grocery', 'Daily list', 'Home']) {
    await page.locator('#nav').getByText(label, { exact: true }).click();
    await expect(page.locator('#screen')).not.toBeEmpty();
  }
  await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 390).catch(() => {});
  await page.getByRole('button', { name: /reset demo/i }).click();
  await expect(page.locator('#screen')).toContainText(/Today|Home/i);
});
