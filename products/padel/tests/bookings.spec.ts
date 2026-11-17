import { test, expect } from '../fixtures';

test('a 90 minute booking on Center Court costs 240', async ({ api, freeDate }) => {
  const response = await api.book({ courtId: 'court-1', date: freeDate, hour: 10, durationMinutes: 90, players: 4 });
  expect(response.status()).toBe(201);
  expect((await response.json()).price).toBe(240);
});

test('the same slot cannot be booked twice', async ({ api, freeDate }) => {
  const slot = { courtId: 'court-1', date: freeDate, hour: 10, durationMinutes: 60, players: 2 };
  expect((await api.book(slot)).status()).toBe(201);
  expect((await api.book(slot)).status()).toBe(409);
});