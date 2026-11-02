import { test, expect } from '@playwright/test';
import { requireEnv } from '@platform/test-core';

const user = requireEnv('GITEA_ADMIN_USER');
const password = requireEnv('GITEA_ADMIN_PASSWORD');
const authHeader = 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64');

test('repository created via API is shown in the UI', async ({ page, request }) => {
  const repoName = `test-repo-${Date.now()}`;

  const createResponse = await request.post('/api/v1/user/repos', {
    headers: { Authorization: authHeader },
    data: { name: repoName, auto_init: true },
  });
  await expect(createResponse).toBeOK();

  await page.goto(`/${user}/${repoName}`);
  await expect(page).toHaveTitle(new RegExp(repoName));

  const deleteResponse = await request.delete(`/api/v1/repos/${user}/${repoName}`, {
    headers: { Authorization: authHeader },
  });
  await expect(deleteResponse).toBeOK();
});

test('repository created via API can be fetched via API', async ({ request }) => {
  const repoName = `test-repo-${Date.now()}`;

  // 1. Create (same as the first test)
  const createResponse = await request.post('/api/v1/user/repos', {
    headers: { Authorization: authHeader },
    data: { name: repoName, auto_init: true },
  });
  await expect(createResponse).toBeOK();

  // 2. Fetch
  const getResponse = await request.get(`/api/v1/repos/${user}/${repoName}`, {
    headers: { Authorization: authHeader },
  });
  await expect(getResponse).toBeOK();

  // 3. Check the name
  const body: { name: string } = await getResponse.json();
  expect(body.name).toBe(repoName);

  // 4. Delete (same as the first test)
  const deleteResponse = await request.delete(`/api/v1/repos/${user}/${repoName}`, {
    headers: { Authorization: authHeader },
  });
  await expect(deleteResponse).toBeOK();
});