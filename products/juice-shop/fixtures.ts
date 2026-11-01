import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

export const test = base.extend<{ shopPage: Page }>({
  shopPage: async ({ page }, use) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    await page.getByRole('button', { name: 'dismiss cookie message' }).click();
    await use(page);
  },
});

export { expect } from '@playwright/test';