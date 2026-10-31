import { test, expect } from '@playwright/test';

test('search for apple shows pineapple juice', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
  await page.getByRole('button', { name: 'dismiss cookie message' }).click();

  await page.getByRole('button', { name: 'Open search' }).click();
  const searchBox = page.getByRole('textbox');
  await searchBox.fill('apple');
  await searchBox.press('Enter');

  await expect(page.getByText('Pineapple Juice (1000ml)')).toBeVisible();
});