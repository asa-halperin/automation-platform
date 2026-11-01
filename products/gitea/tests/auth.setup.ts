import { test as setup, expect } from '@playwright/test';

setup('sign in as admin', async ({ page }) => {
    await page.goto('/user/login');
    await page.getByRole('textbox', { name: 'Username or Email Address' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('TestAdmin123!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(
        page.getByRole('menu', { name: 'Profile and Settings' }).getByRole('img', { name: 'testadmin'})
    ).toBeVisible();

    await page.context().storageState({ path: '.auth/admin.json'});
})