import { test as setup, expect } from '@playwright/test';
import { requireEnv } from '@platform/test-core';

setup('sign in as admin', { tag: '@setup' }, async ({ page }) => {
    await page.goto('/user/login');
    await page.getByRole('textbox', { name: 'Username or Email Address' }).fill(requireEnv('GITEA_ADMIN_USER'));
    await page.getByRole('textbox', { name: 'Password' }).fill(requireEnv('GITEA_ADMIN_PASSWORD'));
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(
        page.getByRole('menu', { name: 'Profile and Settings' }).getByRole('img', { name: 'testadmin'})
    ).toBeVisible();

    await page.context().storageState({ path: '.auth/admin.json'});
})