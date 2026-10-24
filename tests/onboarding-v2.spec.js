const { test, expect } = require('@playwright/test');
test('onboarding v2 concept stays clearly nonfunctional and mobile-friendly', async ({ page }) => {
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({width, height:900});
    await page.goto('/onboarding-v2-concept.html');
    await expect(page.getByRole('note')).toContainText('Planning preview only');
    await expect(page.getByRole('heading',{name:'iPhone'})).toBeVisible();
    await expect(page.getByText('In development',{exact:true})).toBeVisible();
    await expect(page.getByRole('link',{name:/Approved Android download/})).toHaveAttribute('href','download.html');
    await expect(page.getByRole('link',{name:/Current setup guide/})).toHaveAttribute('href','setup.html');
    await expect(page.locator('input')).toHaveCount(0);
    await expect(page.locator('form')).toHaveCount(0);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
    expect(overflow,'horizontal overflow at '+width+'px').toBe(false);
  }
});
