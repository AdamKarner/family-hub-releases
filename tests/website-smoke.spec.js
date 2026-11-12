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
  const iframe = page.getByTitle('Submit Kindlane feedback');
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
    for (const [name, path] of [['home', '/'], ['downloads', '/download.html'], ['help', '/help.html'], ['skylight', '/skylight.html'], ['feedback', '/feedback.html']]) {
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
  await expect(page.getByText('Last reviewed: November 6, 2026')).toBeVisible();
  await expect(page.getByText(/Pass the Baton requests are intended for the sender and recipient/)).toBeVisible();
  await expect(page.getByText(/This sharing never changes anything in Google Calendar/)).toBeVisible();
  await expect(page.getByText(/Edit inside Kindlane/)).toBeVisible();
  await expect(page.getByText(/We do not sell this data/)).toBeVisible();
  await expect(page.getByText(/Google API Services User Data Policy, including the Limited Use requirements/)).toBeVisible();
});

test('home page footer links to the privacy policy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer a[href="https://kindlane.app/privacy"]')).toHaveText('Privacy');
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
  await expect(art).toHaveAttribute('alt', /Kindlane/i);
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

test('iPhone and computer entry points do not create a second sign-in site', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#header-sign-in')).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
  await expect(page.locator('#header-get-started')).toHaveAttribute('href','get-started.html');
  await expect(page.locator('#nav-web-guide')).toHaveAttribute('href','web.html');
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
  await expect(page.locator('html')).toHaveAttribute('data-mode','light');
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


test('mobile navigation has Get Started and Sign In inside the screen at 390px', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  for (const [id,href] of [['#mobile-get-started','get-started.html'],['#mobile-sign-in','https://family-hub-7cb05.web.app/'],['#hero-get-started','get-started.html']]) {
    const link=page.locator(id);
    await expect(link, id).toBeVisible();
    await expect(link, id).toHaveAttribute('href',href);
    const box=await link.boundingBox();
    expect(box.x, id).toBeGreaterThanOrEqual(0);
    expect(box.x+box.width, id).toBeLessThanOrEqual(390);
    expect(box.height, id).toBeGreaterThanOrEqual(44);
  }
  const mobileCta=await page.locator('#mobile-get-started').boundingBox();
  expect(mobileCta.y+mobileCta.height, 'Get Started above the fold').toBeLessThanOrEqual(844);
  const guide=page.locator('#web-guide');
  await expect(guide).toHaveAttribute('href','web.html');
});

test('Sign In and Get Started are each visible exactly once in the header area at every width', async ({ page }) => {
  await page.goto('/');
  for (const width of [360,390,680,681,768,1024,1060,1061,1200,1440]) {
    await page.setViewportSize({width,height:900});
    let signIn=0, getStarted=0;
    for (const id of ['#header-sign-in','#mobile-sign-in']) if (await page.locator(id).isVisible()) signIn++;
    for (const id of ['#header-get-started','#mobile-get-started']) if (await page.locator(id).isVisible()) getStarted++;
    expect(signIn, 'Sign In links at '+width+'px').toBe(1);
    expect(getStarted, 'Get Started links at '+width+'px').toBe(1);
    await expect(page.locator('#hero-get-started')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      'horizontal overflow at ' + width + 'px').toBe(false);
  }
});

test('header Sign In and Get Started sit at the right of the header with 44px targets', async ({ page }) => {
  for (const width of [768,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    const signIn=page.locator('#header-sign-in');
    const start=page.locator('#header-get-started');
    await expect(signIn).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
    await expect(start).toHaveAttribute('href','get-started.html');
    for (const link of [signIn,start]) {
      const box=await link.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x+box.width).toBeLessThanOrEqual(width);
    }
    const a=await signIn.boundingBox(), b=await start.boundingBox();
    expect(b.x, 'Get Started after Sign In').toBeGreaterThan(a.x);
  }
});

test('header theme controls keep a gutter from the screen edge on phones', async ({ page }) => {
  for (const width of [360,390,430]) {
    await page.setViewportSize({width,height:800});
    await page.goto('/');
    const edges=await page.evaluate(() => [...document.querySelectorAll('.nav [data-color]')].map(e => e.getBoundingClientRect().right));
    expect(edges.length).toBe(4);
    for (const right of edges) expect(right, 'swatch right edge at '+width+'px').toBeLessThanOrEqual(width-12);
  }
});

test('Get Started page routes new, invited and returning families to browser sign-in', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.locator('#hero-get-started').click();
  await expect(page).toHaveURL(/\/get-started\.html$/);
  await expect(page.getByRole('heading',{level:1,name:/Get your family started/})).toBeVisible();
  await expect(page.locator('#start-browser')).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
  await expect(page.locator('#start-android')).toHaveAttribute('href','download.html?device=android');
  for (const id of ['#start-join','#start-sign-in']) await expect(page.locator(id)).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
  await expect(page.getByText(/never asks for your password/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  await page.setViewportSize({width:1440,height:900});
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
});

test('Get Started page keeps the saved theme and updates it', async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('fh_site_theme', JSON.stringify({mode:'light',accent:'ocean'})); } catch (_) {} });
  await page.goto('/get-started.html');
  await expect(page.locator('html')).toHaveAttribute('data-mode','light');
  await expect(page.locator('html')).toHaveAttribute('data-accent','ocean');
  await page.getByRole('button',{name:'Plum'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-accent','plum');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('fh_site_theme')).accent)).toBe('plum');
});

test('existing Setup and Help pages cross-link Get Started and the browser app guide', async ({ page }) => {
  for(const [url,start,guide] of [['/start.html','#start-get-started','#start-web-guide'],['/help.html','#help-get-started','#help-web-guide']]) {
    await page.goto(url);
    await expect(page.locator(start)).toHaveAttribute('href','get-started.html');
    await expect(page.locator(guide)).toHaveAttribute('href','web.html');
    await page.locator(guide).click();
    await expect(page).toHaveURL(/\/web\.html$/);
    await expect(page.getByRole('heading',{name:/One family workspace/})).toBeVisible();
    await page.goto(url);
    await page.locator(start).click();
    await expect(page).toHaveURL(/\/get-started\.html$/);
  }
});

test('colour swatches have a generous tap area and stay inside the header', async ({ page }) => {
  for (const width of [360,390,1440]) {
    await page.setViewportSize({width,height:800});
    await page.goto('/');
    const hits=await page.evaluate(() => [...document.querySelectorAll('.nav [data-color]')].map(el => {
      const r=el.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
      const owner=(x,y) => { const t=document.elementFromPoint(x,y); const b=t && t.closest('[data-color]'); return b ? b.dataset.color : null; };
      return { color: el.dataset.color, width: r.width, right: r.right,
        up: owner(cx,cy-20), down: owner(cx,cy+20), left: owner(cx-11,cy), rightHit: owner(cx+11,cy) };
    }));
    expect(hits.length).toBe(4);
    for (const h of hits) {
      expect(h.width, h.color+' size at '+width).toBeGreaterThanOrEqual(20);
      expect(h.right, h.color+' edge at '+width).toBeLessThanOrEqual(width-12);
      for (const side of ['up','down']) expect(h[side], h.color+' '+side+' tap at '+width).toBe(h.color);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  }
});

test('phone Get Started buttons are both filled with the accent colour', async ({ page }) => {
  for (const mode of ['dark','light']) {
    await page.addInitScript(m => { try { localStorage.setItem('fh_site_theme', JSON.stringify({mode:m,accent:'ocean'})); } catch (_) {} }, mode);
    await page.setViewportSize({width:390,height:844});
    await page.goto('/');
    const bg = id => page.locator(id).evaluate(el => getComputedStyle(el).backgroundColor);
    const hero = await bg('#hero-get-started');
    expect(hero, mode+' hero Get Started is filled').not.toBe('rgba(0, 0, 0, 0)');
    expect(await bg('#mobile-get-started'), mode+' header Get Started matches the hero button').toBe(hero);
  }
});

test('Help and Setup show a Get Started button that opens the Get Started page', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  for (const [url,id] of [['/help.html','#help-get-started-cta'],['/start.html','#start-get-started-cta']]) {
    await page.goto(url);
    const cta=page.locator(id);
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href','get-started.html');
    const box=await cta.boundingBox();
    expect(box.height, id+' height').toBeGreaterThanOrEqual(44);
    expect(box.x+box.width, id+' inside screen').toBeLessThanOrEqual(390);
    await cta.click();
    await expect(page).toHaveURL(/\/get-started\.html$/);
  }
});

test('hero artwork is framed with rounded corners and room below on both themes', async ({ page }) => {
  for (const mode of ['light','dark']) {
    for (const width of [390,1440]) {
      await page.addInitScript(m => { try { localStorage.setItem('fh_site_theme', JSON.stringify({mode:m,accent:'coral'})); } catch (_) {} }, mode);
      await page.setViewportSize({width,height:900});
      await page.goto('/');
      const info = await page.evaluate(() => {
        const pic = document.querySelector('.hero .art picture'), art = document.querySelector('.hero .art'), img = pic.querySelector('img');
        const cs = getComputedStyle(pic);
        return { radius: parseFloat(cs.borderTopLeftRadius), overflow: cs.overflow, shadow: cs.boxShadow, below: parseFloat(getComputedStyle(art).marginBottom), loaded: img.complete && img.naturalWidth > 0, sw: document.documentElement.scrollWidth <= innerWidth };
      });
      const label = mode + ' ' + width + 'px';
      expect(info.radius, label + ' corner radius').toBeGreaterThanOrEqual(18);
      expect(info.overflow, label + ' clips to the frame').toBe('hidden');
      expect(info.shadow, label + ' has a soft shadow').not.toBe('none');
      expect(info.below, label + ' room below the image').toBeGreaterThanOrEqual(40);
      expect(info.loaded, label + ' image loaded').toBe(true);
      expect(info.sw, label + ' no horizontal overflow').toBe(true);
    }
  }
});

test('the top bar Help & Support link lands on a section with a Get Started button', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await page.locator('.nav .links a[href="#help"]').click();
  await expect(page).toHaveURL(/#help$/);
  const cta=page.locator('#help-section-get-started');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href','get-started.html');
  // The page scrolls smoothly, so wait for it to arrive before checking.
  await expect.poll(() => cta.evaluate(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), { message: 'button is on screen after the jump', timeout: 8000 }).toBe(true);
  await cta.click();
  await expect(page).toHaveURL(/\/get-started\.html$/);
});


test('homepage uses the selected artwork and responsive crop at the approved breakpoint', async ({ page }) => {
  const { createHash } = require('node:crypto');
  await page.goto('/');
  const image = page.locator('main .hero picture img');
  await expect(image).toHaveAttribute('alt', /^Illustration of Kindlane/);
  for (const width of [390, 680, 681, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const phone = width <= 680;
    const expected = phone ? 'ee0a59131a04fdd6e496084c9bdd8dd776b69755a535d78e8975fdad000680ce' : 'bb27ae35289a938bf5c67372846cb5054d20bbc0056cd973a229da54b82b1011';
    await expect.poll(async () => {
      const src = await image.evaluate(img => img.currentSrc);
      if (!src.startsWith('data:image/webp;base64,')) return 'missing selected artwork';
      return createHash('sha256').update(Buffer.from(src.split(',')[1], 'base64')).digest('hex');
    }, { message: 'Selected hero bytes at viewport ' + width }).toBe(expected);
    await expect.poll(() => image.evaluate(img => [img.naturalWidth, img.naturalHeight])).toEqual(phone ? [780, 941] : [1672, 941]);
  }
});


test('new visitors start every themed website page in Light even on a dark device', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('fh_site_theme'));
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const name of ['index','get-started','web','help','start','download','install','hearth','releases','privacy','feedback','access','setup','household-setup-concept']) {
    await page.goto('/' + name + '.html');
    await expect(page.locator('html'), name).toHaveAttribute('data-mode', 'light');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme), name).toBe('light');
  }
});

test('saved Dark choice overrides the Light default before page scripts finish', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('fh_site_theme', JSON.stringify({mode:'dark',accent:'plum'})));
  for (const path of ['/', '/get-started.html', '/web.html', '/help.html']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-accent', 'plum');
  }
});


test('homepage welcomes new web households and routes them through current signup', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const entry=page.locator('#web-app-entry');
  await expect(entry).toContainText('Start a new household');
  await expect(entry).toContainText('no Android device is required');
  await expect(entry).not.toContainText('Already part of a Family Hub household?');
  await expect(entry).not.toContainText('not on this website');
  await entry.screenshot({path:'test-results/web-signup-mobile.png'});
  await entry.locator('#web-get-started').click();
  await expect(page).toHaveURL(/get-started\.html$/);
  await expect(page.locator('#start-browser')).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
  await expect(page.locator('#new-title').locator('..')).toContainText('Your first sign-in creates your account');
  await expect(page.locator('#new-title').locator('..')).toContainText('Create household');
});

test('household and installation guides provide a standalone browser path', async ({ page }) => {
  await page.goto('/start.html');
  for(const id of ['#household-create-app','#household-join-app']) await expect(page.locator(id)).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
  await expect(page.locator('#create-family')).toContainText('You do not need an Android device');
  await expect(page.locator('#create-family')).not.toContainText('Install Family Hub for Android');
  await expect(page.locator('#join-family')).not.toContainText('Install the Android app');
  await expect(page.locator('#kids-without-google')).toContainText('The web app uses Google sign-in');
  await page.goto('/install.html');
  await expect(page.locator('#browser-install')).toContainText('Your first sign-in creates your Kindlane account');
  await page.getByText('Can I use it on an iPhone or iPad?', {exact:true}).click();
  await expect(page.getByText('An iPhone-friendly web companion is a separate development effort', {exact:false})).toHaveCount(0);
  await expect(page.locator('#browser-install a').filter({hasText:'Sign in with Google'})).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
});

test('Help Center explains browser signup, invitations and current Settings', async ({ page }) => {
  await page.goto('/help.html');
  const create=page.getByText('How do I create or join a household?',{exact:true}).locator('..');
  await create.locator('summary').click();
  await expect(create).toContainText('Your first sign-in creates your account');
  await expect(create).toContainText('No Android device or Firebase setup is required');
  await expect(create.getByRole('link',{name:'Get Started with browser signup'})).toHaveAttribute('href','get-started.html');
  const invites=page.getByText('How do invites and kid permissions work?',{exact:true}).locator('..');
  await invites.locator('summary').click();
  await expect(invites).toContainText('Home → Settings → Household members');
  await expect(invites).toContainText('24 hours');
  const appearance=page.getByText("How do I change Kindlane's appearance?",{exact:true}).locator('..');
  await appearance.locator('summary').click();
  await expect(appearance).toContainText('Preferences');
  await expect(appearance).toContainText('Light is the default');
});

test('old Firebase guide URLs clearly identify their legacy scope and lead new families to signup', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  for(const url of ['/setup.html','/setup/','/setup-demo.html']) {
    await page.goto(url);
    await expect(page).toHaveTitle('Legacy Firebase Setup — Kindlane');
    const notice=page.locator('#current-web-setup');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('No Android device or Firebase project is required');
    await expect(notice).toContainText('existing custom Firebase installation');
    // Legacy screenshots and the complete step navigation remain available.
    await expect(page.locator('#nav button')).toHaveCount(8);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await notice.getByRole('link',{name:'Get Started with Google signup'}).click();
    await expect(page).toHaveURL(/get-started\.html$/);
  }
});

test('archived setup concept and download administration point families to the live signup flow', async ({ page }) => {
  await page.goto('/household-setup-concept.html');
  await expect(page.locator('.notice')).toContainText('Archived design concept');
  await expect(page.locator('.notice a')).toHaveAttribute('href','get-started.html');
  await page.goto('/access.html');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Manage download access.');
  await expect(page.locator('#access-family-app')).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
  await page.goto('/download.html');
  await expect(page.locator('#download-web-app')).toHaveAttribute('href','https://family-hub-7cb05.web.app/');
});

test('Google Calendar connection is documented for web and Android', async ({ page }) => {
  await page.goto('/google-child-calendars.html');
  await expect(page.getByRole('heading', { name: 'Connect your Google calendars to Kindlane' })).toBeVisible();
  await expect(page.getByText('Connect Google Calendar').first()).toBeVisible();
  await expect(page.getByText(/Edit inside Kindlane/).first()).toBeVisible();
  await expect(page.getByText(/Kindlane Android currently requires/)).toHaveCount(0);
  await page.goto('/web.html');
  await expect(page.getByText(/choose Connect Google Calendar/).first()).toBeVisible();
  await expect(page.getByText(/Android calendar integration continues to use its existing path/)).toHaveCount(0);
  await page.goto('/help.html');
  await page.locator('#search').fill('connect google calendar');
  await expect(page.getByText('How do I connect Google Calendar to Kindlane?')).toBeVisible();
});

test('social preview image is the Kindlane card at 1200x630', async () => {
  const fs = require('node:fs');
  const png = fs.readFileSync('social-preview.png');
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
  const svg = fs.readFileSync('social-preview.svg', 'utf8');
  expect(svg).toContain('Less chaos. More family.');
  expect(svg).not.toMatch(/Family Hub/i);
});

test('Kindlane domain cutover metadata matches the one-domain Pages CNAME', async ({ page }) => {
  const fs = require('node:fs');
  expect(fs.readFileSync('CNAME', 'utf8').trim()).toBe('kindlane.app');
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://kindlane.app/');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://kindlane.app/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://kindlane.app/social-preview.png');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://kindlane.app/social-preview.png');
  await expect(page.locator('a[href="https://family-hub-7cb05.web.app/"]').first()).toBeVisible();
});

test('Kindlane support pages share the approved tagline and accessible product name', async ({ page }) => {
  for (const path of ['access.html', 'feedback.html', 'help.html', 'install.html', 'releases.html']) {
    await page.goto('/' + path);
    await expect(page.locator('footer, .foot').first()).toContainText('Less chaos. More family.');
  }
  await page.goto('/');
  await expect(page.locator('.art img')).toHaveAttribute('alt', /^Illustration of Kindlane in a warm kitchen:/);
  await page.goto('/app-check-test.html');
  await expect(page).toHaveTitle('Kindlane · App Check Diagnostic');
  await expect(page.getByRole('link', { name: '← Kindlane' })).toBeVisible();
});

test('Skylight guide is discoverable, firmware-aware, and narrow-screen safe', async ({ page }) => {
  await page.goto('/help.html');
  await page.locator('#search').fill('Skylight');
  await expect(page.locator('#articles .tile:visible')).toHaveCount(1);
  await expect(page.locator('#faqgroup details:visible')).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Install on a Skylight Calendar Max/ })).toHaveAttribute('href', 'skylight.html');

  await page.goto('/install.html');
  await expect(page.locator('#skylightJump')).toHaveAttribute('href', 'skylight.html');

  await page.goto('/skylight.html');
  await expect(page.getByRole('heading', { name: /Install Kindlane on a Skylight Calendar Max/ })).toBeVisible();
  await expect(page.getByText(/original Skylight Calendar Max ADB project/)).toBeVisible();
  await expect(page.getByText(/updated devices/).first()).toBeVisible();
  const commands = (await page.locator('pre.command').allTextContents()).join('\n');
  for (const expected of ['adb devices', 'adb push', 'adb shell pm install -r', 'adb pair', 'adb connect']) expect(commands).toContain(expected);
  await expect(page.getByText(/not been verified on this hardware/)).toBeVisible();
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({width, height: 844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      'Skylight guide horizontal overflow at '+width).toBe(false);
  }
});
