import { readFileSync } from 'node:fs';

interface Attempt { status: string; error?: { message?: string } }
interface Test { status: string; results: Attempt[] }
interface Spec { title: string; tests: Test[] }
interface Suite { specs: Spec[]; suites?: Suite[] }
interface Report { suites: Suite[] }

const file = process.argv[2];
const report: Report = JSON.parse(readFileSync(file, 'utf8'));

function collectSpecs(suite: Suite): Spec[] {
  const nested = (suite.suites ?? []).flatMap(collectSpecs);
  return [...suite.specs, ...nested];
}

const ANSI_COLORS = /\u001b\[[0-9;]*m/g;

const summary = report.suites.flatMap(collectSpecs).map((spec) => {
  const test = spec.tests[0];
  const failedAttempt = test.results.find((attempt) => attempt.error);
  return {
    title: spec.title,
    status: test.status,
    attempts: test.results.length,
    error: failedAttempt?.error?.message?.replace(ANSI_COLORS, '').split('\n').slice(0, 8).join('\n'),
  };
});

console.log(JSON.stringify(summary, null, 2));