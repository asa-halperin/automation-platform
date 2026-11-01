import { defineConfig, devices } from '@playwright/test';

export function createConfig(baseURL: string) {
  return defineConfig({
    testDir: './tests',
    fullyParallel: true,
    reporter: [['html', { open: 'never' }]],
    use: {
      baseURL,
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
  });
}