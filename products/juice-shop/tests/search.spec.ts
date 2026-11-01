import { test, expect } from '../fixtures';

test('search for apple shows pineapple juice', async ({ shopPage }) => {
  await shopPage.getByRole('button', { name: 'Open search' }).click();
  const searchBox = shopPage.getByRole('textbox');
  await searchBox.fill('apple');
  await searchBox.press('Enter');

  await expect(shopPage.getByText('Pineapple Juice (1000ml)')).toBeVisible();
});