import { defineConfig, devices } from '@playwright/test';
import type { Project } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '../../.env');
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

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
    retries: process.env.CI ? 2 : 0,
    forbidOnly: !!process.env.CI,
    reporter: [['html', { open: 'never' }]],
    use: {
      baseURL,
      trace: 'on-first-retry',
    },
    projects,
  });
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}