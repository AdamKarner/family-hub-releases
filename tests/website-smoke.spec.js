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
  for (const path of ['/', '/download.html', '/releases.html', '/install.html', '/help.html', '/feedback.html', '/start.html', '/privacy.html']) {
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
  expect(await page.locator('#faqgroup details:visible').count()).toBeGreaterThan(5);
  await expect(page.getByText('Where did the Calendar controls go on a tablet?')).toBeVisible();
});

test('current household help keeps a clearly labeled legacy setup path', async ({ page }) => {
  await page.goto('/help.html');
  const q = page.getByText('How do I create or join a household?');
  await expect(q).toBeVisible();
  await q.click();
  await expect(page.getByRole('link', { name: 'legacy Firebase setup guide' })).toHaveAttribute('href', 'setup.html');
});

test('updated household guidance and Baton feature are discoverable', async ({page}) => {
  await page.goto('/help.html');
  await page.locator('#search').fill('Pass the Baton');
  await expect(page.getByText('How do I ask someone to do something with Pass the Baton?')).toBeVisible();
  await page.locator('#search').fill('');
  await expect(page.getByRole('link', {name: /Set up or join a household/}).first()).toHaveAttribute('href', 'start.html');
  await page.goto('/start.html');
  await expect(page.getByRole('heading', {name: 'Get your household connected.'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Legacy Firebase walkthrough'})).toHaveAttribute('href', 'setup.html');
});
test('privacy describes household membership and private requests', async ({page}) => {
  await page.goto('/privacy.html');
  await expect(page.getByText('Last reviewed: October 28, 2026')).toBeVisible();
  await expect(page.getByText(/Pass the Baton requests are intended for the sender and recipient/)).toBeVisible();
});

test('child-without-Google FAQ distinguishes a created login from a fictitious email', async ({ page }) => {
  await page.goto('/help.html');
  await page.locator('#search').fill('made-up email');
  const question = page.getByText("My child doesn't have a Google account. Can I use a made-up email address?");
  await expect(question).toBeVisible();
  await question.click();
  await expect(page.getByText(/typing a made-up address here does not create an account/)).toBeVisible();
  await page.getByRole('link', { name: 'Read the child account setup note' }).click();
  await expect(page).toHaveURL(/start\.html#kids-without-google$/);
  await expect(page.getByRole('heading', { name: 'About the made-up email address tip' })).toBeVisible();
  await expect(page.getByText(/not yet a self-service sign-up method/)).toBeVisible();
});


test('homepage preserves working Android and Wall actions plus accessible hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero-android')).toHaveAttribute('href',/download\.html\?device=android$/);
  await expect(page.locator('#hero-wall')).toHaveAttribute('href',/download\.html\?device=wall$/);
  await expect(page.locator('main .hero h1')).toBeVisible();
  const art = page.locator('main .hero picture img');
  await expect(art).toHaveAttribute('alt', /Family Hub/i);
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 860 });
    await expect(page.locator('#hero-android')).toBeVisible();
    await expect(page.locator('#hero-wall')).toBeVisible();
    const report = await page.evaluate(() => ({
      viewport: innerWidth, pageWidth: document.documentElement.scrollWidth,
      validHeroImage: (() => { const el = document.querySelector('main .hero picture img'); return Boolean(el && el.complete && el.naturalWidth > 0); })()
    }));
    expect(report.pageWidth, 'homepage overflow at ' + width).toBeLessThanOrEqual(report.viewport + 1);
    expect(report.validHeroImage, 'hero image missing at ' + width).toBe(true);
  }
});

test('proposed iPhone and computer entry points do not create a second sign-in site', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#nav-open-family-hub')).toHaveAttribute('href','web.html');
  for (const id of ['web-iphone','web-computer']) {
    await expect(page.locator('#' + id)).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
  }
  await expect(page.locator('#web-guide')).toHaveAttribute('href','web.html');
  await page.goto('/web.html');
  await expect(page.getByRole('heading',{name:/One family workspace/})).toBeVisible();
  for (const id of ['open-iphone','open-computer']) {
    await expect(page.locator('#'+id)).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
  }
  await expect(page.locator('#android-download')).toHaveAttribute('href','download.html?device=android');
  await expect(page.locator('#wall-download')).toHaveAttribute('href','download.html?device=wall');
  await expect(page.locator('input[type=password]')).toHaveCount(0);
  for (const width of [360,390,768,1440]) {
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth+1)).toBe(false);
  }
});

test('web guide restores Family Hub dark-light and accent theme preferences', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('fh_site_theme', JSON.stringify({mode:'light',accent:'ocean'})));
  await page.goto('/web.html');
  await expect(page.locator('html')).toHaveAttribute('data-mode','light');
  await expect(page.locator('html')).toHaveAttribute('data-accent','ocean');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('color-scheme').trim())).toBe('light');
  await page.evaluate(() => localStorage.setItem('fh_site_theme', JSON.stringify({mode:'dark',accent:'plum'})));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-mode','dark');
  await expect(page.locator('html')).toHaveAttribute('data-accent','plum');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim())).toBe('#b38af1');
  await page.evaluate(() => localStorage.setItem('fh_site_theme', '{"mode":"invalid","accent":"invalid"}'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-mode','dark');
  await expect(page.locator('html')).toHaveAttribute('data-accent','coral');
});

test('web guide theme controls are keyboard accessible and persist back to homepage', async ({ page }) => {
  await page.goto('/web.html');
  const light=page.getByRole('button',{name:'Light'});
  const plum=page.getByRole('button',{name:'Plum'});
  await light.click();
  await plum.click();
  await expect(light).toHaveAttribute('aria-pressed','true');
  await expect(plum).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('html')).toHaveAttribute('data-mode','light');
  await expect(page.locator('html')).toHaveAttribute('data-accent','plum');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('fh_site_theme')));
  expect(saved).toEqual({mode:'light',accent:'plum'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-mode','light');
  await expect(page.locator('html')).toHaveAttribute('data-accent','plum');
  await page.goto('/web.html');
  await expect(page.getByRole('button',{name:'Plum'})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content','#fbf8f4');
});


test('mobile quick navigation exposes the existing-family web app guide', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const entry=page.locator('#mobile-open-family-hub');
  await expect(entry).toBeVisible();
  await expect(entry).toHaveAttribute('href','web.html');
  await entry.click();
  await expect(page).toHaveURL(/\/web\.html$/);
  await expect(page.getByRole('heading',{name:/One family workspace/})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});

test('web app entry remains discoverable across phone, tablet, and desktop widths', async ({ page }) => {
  await page.goto('/');
  for (const width of [360,390,680,681,768,1024,1060,1061,1440]) {
    await page.setViewportSize({width,height:860});
    await expect.poll(async () =>
      (await page.locator('#mobile-open-family-hub').isVisible()) ||
      (await page.locator('#nav-open-family-hub').isVisible()), {
        message: 'Open Family Hub missing at ' + width + 'px',
        timeout: 3000
      }).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      'horizontal overflow at ' + width + 'px').toBe(false);
  }
});
