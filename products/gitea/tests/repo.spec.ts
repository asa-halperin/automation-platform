import { test, expect, user, authHeader } from '../fixtures';

test('repository is shown in the UI', async ({ page, repoName }) => {
  await page.goto(`/${user}/${repoName}`);
  await expect(page).toHaveTitle(new RegExp(repoName));
});

test('repository can be fetched via API', async ({ request, repoName }) => {
  const response = await request.get(`/api/v1/repos/${user}/${repoName}`, {
    headers: { Authorization: authHeader },
  });
  await expect(response).toBeOK();

  const body: { name: string } = await response.json();
  expect(body.name).toBe(repoName);
});

 test('repository appears in the user repository list', async ({ request, repoName }) => {
    const response = await request.get(`/api/v1/user/repos`, {
    headers: { Authorization: authHeader },
  });
  await expect(response).toBeOK();

  const repos: { name: string }[] = await response.json();

  expect(repos.map(r => r.name)).toContain(repoName)
 })