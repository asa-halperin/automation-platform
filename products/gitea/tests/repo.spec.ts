import { test, expect, user } from '../fixtures';

test('repository is shown in the UI', async ({ page, repoName }) => {
  await page.goto(`/${user}/${repoName}`);
  await expect(page).toHaveTitle(new RegExp(repoName));
});

test('repository can be fetched via API', async ({ api, repoName }) => {
  const response = await api.getRepo(user, repoName);
  await expect(response).toBeOK();

  const body: { name: string } = await response.json();
  expect(body.name).toBe(repoName);
});

test('repository appears in the user repository list', async ({ api, repoName }) => {
  const response = await api.listMyRepos();
  await expect(response).toBeOK();

  const repos: { name: string }[] = await response.json();
  expect(repos.map(r => r.name)).toContain(repoName);
});