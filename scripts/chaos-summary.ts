import { readFileSync } from 'node:fs';

interface Attempt { status: string }
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

const summary = report.suites.flatMap(collectSpecs).map((spec) => ({
  title: spec.title,
  status: spec.tests[0].status,
  attempts: spec.tests[0].results.length,
}));

console.log(JSON.stringify(summary, null, 2));