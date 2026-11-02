import { test, expect } from '../fixtures';

test('version endpoint returns Gitea 1.24', async ({ api }) => {
    const response = await api.getVersion();
    await expect(response).toBeOK();

    const body: { version: string } = await response.json();
    expect(body.version).toMatch(/^1\.24/);
});