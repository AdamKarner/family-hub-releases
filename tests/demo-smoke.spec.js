const { test, expect } = require('@playwright/test');

test('phone navigation and no document overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo/index.html');
  await expect(page.locator('#screen')).not.toBeEmpty();
  for (const label of ['Calendar', 'Meals', 'Grocery', 'Daily list', 'Home']) {
    await page.locator('#nav').getByText(label, { exact: true }).click();
    await expect(page.locator('#screen')).not.toBeEmpty();
  }
  const overflowing = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflowing).toBe(false);
});

test('reset demo restores Home state', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto('/demo/index.html');
  await page.locator('#nav').getByText('Calendar', { exact: true }).click();
  const resetButton = page.getByRole('button', { name: /reset demo/i });
  await expect(resetButton).toBeVisible();
  await resetButton.click();
  await expect(page.locator('#screen')).not.toBeEmpty();
  await expect(page.locator('#nav').getByText('Home', { exact: true })).toBeVisible();
});

test('fictional portraits load without 404', async ({ page }) => {
  await page.goto('/demo/index.html');
  for (const portrait of ['mia.webp','leo.webp']) {
    const response = await page.request.get('/demo/' + portrait);
    expect(response.status(), portrait + ' must exist').toBe(200);
  }
});
