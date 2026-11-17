export type FaultProfile = 'calm' | 'flaky' | 'broken' | 'down';

const PROFILES: FaultProfile[] = ['calm', 'flaky', 'broken', 'down'];
const requested = process.env.FAULT_PROFILE ?? 'calm';

if (!PROFILES.includes(requested as FaultProfile)) {
  throw new Error(`Unknown FAULT_PROFILE "${requested}". Use one of: ${PROFILES.join(', ')}`);
}

export const profile = requested as FaultProfile;
export const seed = Number(process.env.FAULT_SEED ?? 42);

// mulberry32: a small, well-known seeded random generator
let state = seed >>> 0;
export function random(): number {
  state = (state + 0x6d2b79f5) >>> 0;
  let t = state;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function chance(probability: number): boolean {
  return random() < probability;
}