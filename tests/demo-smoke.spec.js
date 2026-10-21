const { test, expect } = require('@playwright/test');

test('phone navigation, reset, and overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo/index.html');
  await expect(page.locator('#screen')).not.toBeEmpty();
  for (const label of ['Calendar', 'Meals', 'Grocery', 'Daily list', 'Home']) {
    await page.locator('#nav').getByText(label, { exact: true }).click();
    await expect(page.locator('#screen')).not.toBeEmpty();
  }
  const overflowing = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflowing).toBe(false);
  await page.getByRole('button', { name: /reset demo/i }).click();
  await expect(page.locator('#screen')).not.toBeEmpty();
});
