const { test, expect } = require('@playwright/test');

for (const route of ['/demo/', '/preview/']) {
  test(`retired demo at ${route} directs visitors to the actual app`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [360, 390, 1100]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      await expect(page.getByRole('heading', { name: 'See the real Kindlane.' })).toBeVisible();
      await expect(page.getByText(/fictional, sample-only/)).toBeVisible();
      await expect(page.getByRole('link', { name: 'Open Kindlane' }))
        .toHaveAttribute('href', 'https://app.kindlane.app/');
      await expect(page.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '../get-started.html');
      await expect(page.getByRole('link', { name: /How to use Kindlane/ })).toHaveAttribute('href', '../web.html');
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        `${route} has horizontal overflow at ${width}px`).toBe(false);
      expect(await page.locator('#nav, #screen').count()).toBe(0);
    }
    expect(errors).toEqual([]);
  });
}
