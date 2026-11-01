import { test, expect } from '@playwright/test';
test.use({ storageState: { cookies: [], origins: [] } });

test('login to gitea', async ({ page }) => {
  await page.goto('/user/login');
  const userNameField = page.getByRole('textbox', { name: 'Username or Email Address' });
  const passwordField = page.getByRole('textbox', { name: 'Password' });
  const submitButton = page.getByRole('button', { name: 'Sign In' });
  await userNameField.fill('testadmin')
  await passwordField.fill('TestAdmin123!');
  await submitButton.click();
  await expect(page.getByRole('menu', { name: 'Profile and Settings' }).getByRole('img', { name: 'testadmin' })).toBeVisible();
});
