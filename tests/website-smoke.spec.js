const { test, expect } = require('@playwright/test');

test('download page resolves both approved APKs', async ({ page }) => {
  await page.route('https://api.github.com/repos/AdamKarner/family-hub-releases/releases/**', route => {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      assets: [
        { name: 'FamilyHub-build-90000359.apk', browser_download_url: 'https://example.com/android.apk' },
        { name: 'FamilyHubWall-build-90000359.apk', browser_download_url: 'https://example.com/wall.apk' }
      ]
    }) });
  });
  await page.goto('/download.html?device=android');
  await expect(page.locator('#android')).toHaveAttribute('href', 'https://example.com/android.apk');
  await expect(page.locator('#wall')).toHaveAttribute('href', 'https://example.com/wall.apk');
  await expect(page.locator('#status')).toContainText('Both downloads are ready');
});

test('download page recovers from an unavailable GitHub API', async ({ page }) => {
  await page.route('https://api.github.com/repos/AdamKarner/family-hub-releases/releases/**', route => route.abort());
  await page.goto('/download.html');
  for (const id of ['android', 'wall']) {
    await expect(page.locator('#' + id)).toHaveAttribute('href', /github.com\/AdamKarner\/family-hub-releases\/releases/);
    await expect(page.locator('#' + id)).not.toHaveAttribute('aria-disabled', 'true');
  }
  await expect(page.locator('#fallback')).toBeVisible();
});

test('Help Center search filters FAQ and guides', async ({ page }) => {
  await page.goto('/help.html');
  await page.locator('#search').fill('Bugjaeger');
  await expect(page.locator('#articles .tile:visible')).toHaveCount(1);
  await expect(page.locator('#faqgroup details:visible')).toHaveCount(1);
  await page.locator('#search').focus();
  const visibleFocus = await page.locator('.search').evaluate(el => getComputedStyle(el).outlineStyle !== 'none');
  expect(visibleFocus).toBe(true);
});

test('public entry pages fit a narrow Android viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  for (const path of ['/', '/download.html', '/releases.html', '/install.html', '/help.html', '/feedback.html']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, path + ' has horizontal overflow').toBe(false);
  }
});
