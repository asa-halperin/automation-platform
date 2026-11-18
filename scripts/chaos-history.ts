import { existsSync, readFileSync, writeFileSync } from 'node:fs';

interface TestResult { title: string; status: string; attempts: number }
interface Run {
  number: number;
  url: string;
  date: string;
  profiles: Record<string, TestResult[]>;
}

const KEEP = 12;
const PROFILES = ['calm', 'flaky', 'broken'];
const [historyFile, summariesDir] = process.argv.slice(2);

const history: Run[] = existsSync(historyFile) ? JSON.parse(readFileSync(historyFile, 'utf8')) : [];

const profiles: Record<string, TestResult[]> = {};
for (const profile of PROFILES) {
  const file = `${summariesDir}/summary-${profile}.json`;
  if (existsSync(file)) {
    profiles[profile] = JSON.parse(readFileSync(file, 'utf8'));
  }
}

const env = process.env;
const run: Run = {
  number: Number(env.GITHUB_RUN_NUMBER),
  url: `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`,
  date: new Date().toISOString(),
  profiles,
};

const updated = [...history, run].slice(-KEEP);
writeFileSync(historyFile, JSON.stringify(updated, null, 2) + '\n');
console.log(`History now has ${updated.length} runs`);