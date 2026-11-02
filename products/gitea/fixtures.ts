import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { requireEnv } from '@platform/test-core';

export const user = requireEnv('GITEA_ADMIN_USER');
const password = requireEnv('GITEA_ADMIN_PASSWORD');
export const authHeader = 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64');

export const test = base.extend<{ repoName: string }>({
  repoName: async ({ request }, use) => {
    const name = `test-repo-${randomUUID().slice(0, 8)}`;
    const createResponse = await request.post('/api/v1/user/repos', {
      headers: { Authorization: authHeader },
      data: { name, auto_init: true },
    });
    await expect(createResponse).toBeOK();

    await use(name);

    const deleteResponse = await request.delete(`/api/v1/repos/${user}/${name}`, {
      headers: { Authorization: authHeader },
    });
    await expect(deleteResponse).toBeOK();
  },
});

export { expect };