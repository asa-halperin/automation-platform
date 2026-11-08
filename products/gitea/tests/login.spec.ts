import { test, expect } from '@playwright/test';
import { requireEnv } from '@platform/test-core';
test.use({ storageState: { cookies: [], origins: [] } });

test('login to gitea', async ({ page }) => {
  const user = requireEnv('GITEA_ADMIN_USER');
  await page.goto('/user/login');
  const userNameField = page.getByRole('textbox', { name: 'Username or Email Address' });
  const passwordField = page.getByRole('textbox', { name: 'Password' });
  const submitButton = page.getByRole('button', { name: 'Sign In' });
  await userNameField.fill(user);
  await passwordField.fill(requireEnv('GITEA_ADMIN_PASSWORD'));
  await submitButton.click();
  await expect(page.getByRole('menu', { name: 'Profile and Settings' }).getByRole('img', { name: user })).toBeVisible();
});