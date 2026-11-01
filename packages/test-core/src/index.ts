import { defineConfig, devices } from '@playwright/test';
import type { Project } from '@playwright/test';

interface ConfigOptions {
  storageState?: string;
}

export function createConfig(baseURL: string, options: ConfigOptions = {}) {
  const projects: Project[] = [];

  if (options.storageState) {
    projects.push({ name: 'setup', testMatch: /.*\.setup\.ts/ });
  }

  projects.push({
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: options.storageState },
    dependencies: options.storageState ? ['setup'] : [],
  });

  return defineConfig({
    testDir: './tests',
    fullyParallel: true,
    reporter: [['html', { open: 'never' }]],
    use: {
      baseURL,
      trace: 'on-first-retry',
    },
    projects,
  });
}