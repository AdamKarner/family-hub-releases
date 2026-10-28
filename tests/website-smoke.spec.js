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

test('feedback form offers the same Notion destination embedded and directly', async ({ page }) => {
  await page.goto('/feedback.html');
  const iframe = page.getByTitle('Submit Family Hub feedback');
  await expect(iframe).toBeVisible();
  const embedded = await iframe.getAttribute('src');
  const direct = await page.getByRole('link', { name: /Open form in new tab/ }).getAttribute('href');
  expect(embedded).toBe(direct);
  expect(new URL(embedded).hostname).toBe('hypnotic-octave-a1d.notion.site');
  await expect(page.getByText(/If the embedded form doesn't load/)).toBeVisible();
});

test('capture public landing pages in phone and desktop viewports', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844, name: 'mobile' }, { width: 1440, height: 900, name: 'desktop' }]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const [name, path] of [['home', '/'], ['downloads', '/download.html'], ['help', '/help.html'], ['feedback', '/feedback.html']]) {
      await page.goto(path);
      await page.screenshot({ path: 'test-results/' + name + '-' + viewport.name + '.png', fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow, name + ' ' + viewport.name + ' overflow').toBe(false);
    }
  }
});

test('recent Family Hub workflows are searchable and available under Everyday use', async ({ page }) => {
  await page.goto('/help.html');
  await page.locator('#search').fill('Monday');
  await expect(page.getByText('What happens to the meal plan on Monday?')).toBeVisible();
  await page.locator('#search').fill('kid permissions');
  await expect(page.getByText('How do invites and kid permissions work?')).toBeVisible();
  await page.locator('#search').fill('');
  await page.getByRole('button', { name: 'Everyday use' }).click();
  await expect(page.locator('#faqgroup details:visible').count()).resolves.toBeGreaterThan(5);
  await expect(page.getByText('Where did the Calendar controls go on a tablet?')).toBeVisible();
});

test('current household help keeps a clearly labeled legacy setup path', async ({ page }) => {
  await page.goto('/help.html');
  const q = page.getByText('How do I create or join a household?');
  await expect(q).toBeVisible();
  await q.click();
  await expect(page.getByRole('link', { name: 'legacy Firebase setup guide' })).toHaveAttribute('href', 'setup.html');
});
