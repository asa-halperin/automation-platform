import { test, expect } from '@playwright/test';

test('home page has the store title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/OWASP Juice Shop/);
});
