const { test, expect } = require('@playwright/test');
const axe = require('axe-core');

// Keep the scan to our own pages. External embeds (for example the Notion form on
// feedback.html) are blocked so the result does not depend on the internet or on
// another site's security policy.
test.beforeEach(async ({ page }) => {
  await page.route(url => !/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/)/.test(url.href), route => route.abort());
});

const pages = ['index','get-started','web','help','start','download','install','hearth','releases','privacy','feedback','skylight','features','testers'];

// WCAG 2.x AA text contrast on every public page, in Light (all four accents) and Dark.
for (const name of pages) {
  test('text contrast passes WCAG AA on ' + name + '.html in Light and Dark', async ({ page }) => {
    const runs = [['light','coral'],['light','ocean'],['light','meadow'],['light','plum'],['dark','coral']];
    for (const [mode, accent] of runs) {
      await page.addInitScript(([m, a]) => { try { localStorage.setItem('fh_site_theme', JSON.stringify({mode:m,accent:a})); } catch (_) {} }, [mode, accent]);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto('/' + name + '.html');
      await page.addScriptTag({ content: axe.source });
      const bad = await page.evaluate(async () => {
        const r = await axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] } });
        return r.violations.flatMap(v => v.nodes.map(n => n.target.join(' ') + ' (' + ((n.any[0] && n.any[0].data && n.any[0].data.contrastRatio) || '?') + ')'));
      });
      expect(bad, name + ' ' + mode + ' ' + accent).toEqual([]);
    }
  });
}

test('homepage text contrast passes on a phone in Light and Dark', async ({ page }) => {
  for (const mode of ['light','dark']) {
    await page.addInitScript(m => { try { localStorage.setItem('fh_site_theme', JSON.stringify({mode:m,accent:'coral'})); } catch (_) {} }, mode);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.addScriptTag({ content: axe.source });
    const bad = await page.evaluate(async () => {
      const r = await axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] } });
      return r.violations.flatMap(v => v.nodes.map(n => n.target.join(' ')));
    });
    expect(bad, 'phone ' + mode).toEqual([]);
  }
});


test('signup notices and links remain readable on legacy and administration pages', async ({ page }) => {
  for (const [url,selector] of [['/setup.html','#current-web-setup'],['/setup/','#current-web-setup'],['/setup-demo.html','#current-web-setup'],['/access.html','.intro']]) {
    for(const mode of ['light','dark']) {
      await page.addInitScript(m=>localStorage.setItem('fh_site_theme',JSON.stringify({mode:m,accent:'coral'})),mode);
      await page.goto(url);
      await page.addScriptTag({content:axe.source});
      const bad=await page.evaluate(async selector=>{
        const result=await axe.run(document.querySelector(selector),{runOnly:{type:'rule',values:['color-contrast']}});
        return result.violations.flatMap(v=>v.nodes.map(n=>n.target.join(' ')));
      },selector);
      expect(bad,url+' '+mode).toEqual([]);
    }
  }
});
