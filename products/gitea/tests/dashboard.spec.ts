import { test, expect } from "@playwright/test";

test('signed-in admin sees profile menu', async ({ page }) => {
    await page.goto('/');
    await expect(
        page.getByRole('menu', { name: 'Profile and Settings' }).getByRole('img', { name: 'testadmin' })).toBeVisible();
});