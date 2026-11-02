import { test, expect } from '@playwright/test';

test('version endpoint returns Gitea 1.24', async ({ request }) => {
    const response = await request.get('/api/v1/version');
    await expect(response).toBeOK();

    const body: { version: string } = await response.json();
    expect(body.version).toMatch(/^1\.24/);
});