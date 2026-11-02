import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { requireEnv } from '@platform/test-core';
import { GiteaApi } from './gitea-api';

export const user = requireEnv('GITEA_ADMIN_USER');
const password = requireEnv('GITEA_ADMIN_PASSWORD');

export const test = base.extend<{ api: GiteaApi; repoName: string }>({
  api: async ({ request }, use) => {
    await use(new GiteaApi(request, user, password));
  },

  repoName: async ({ api }, use) => {
    const name = `test-repo-${randomUUID().slice(0, 8)}`;
    await expect(await api.createRepo(name)).toBeOK();

    await use(name);

    await expect(await api.deleteRepo(user, name)).toBeOK();
  },
});

export { expect };