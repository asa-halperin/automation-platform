import { test as base, expect } from '@playwright/test';
import { requireEnv } from '@platform/test-core';
import { PadelApi } from './padel-api';

export const test = base.extend<{ api: PadelApi; freeDate: string }>({
  api: async ({ request }, use) => {
    const api = new PadelApi(request);
    await api.login(requireEnv('PADEL_USER'), requireEnv('PADEL_PASSWORD'));
    await use(api);
    await api.cleanup();
  },

  freeDate: async ({}, use, testInfo) => {
    const day = new Date(Date.UTC(2030, 0, 1 + testInfo.parallelIndex));
    await use(day.toISOString().slice(0, 10));
  },
});

export { expect };