const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const cases = [
  {name:'desktop-light-coral',width:1440,height:900,mode:'light',accent:'coral'},
  {name:'desktop-dark-ocean',width:1440,height:900,mode:'dark',accent:'ocean'},
  {name:'tablet-light-meadow',width:768,height:1024,mode:'light',accent:'meadow'},
  {name:'mobile-dark-plum',width:390,height:844,mode:'dark',accent:'plum'}
];
for(const c of cases){
  test('review screenshot: '+c.name,async({page})=>{
    await page.setViewportSize({width:c.width,height:c.height});
    await page.goto('/');
    await page.evaluate(({mode,accent})=>localStorage.setItem('fh_site_theme',JSON.stringify({mode,accent})),c);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-mode',c.mode);
    await expect(page.locator('html')).toHaveAttribute('data-accent',c.accent);
    const dir=path.join('test-results','website-review');
    fs.mkdirSync(dir,{recursive:true});
    await page.screenshot({path:path.join(dir,'homepage-'+c.name+'.png'),fullPage:true,animations:'disabled'});
    await page.goto('/web.html');
    await expect(page.getByRole('heading',{name:/One family workspace/})).toBeVisible();
    await page.screenshot({path:path.join(dir,'web-guide-'+c.name+'.png'),fullPage:true,animations:'disabled'});
  });
}
