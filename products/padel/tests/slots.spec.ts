import { test, expect } from '@playwright/test';

interface Slot {
  courtId: string;
  date: string;
  hour: number;
  available: boolean;
}

test('slots are listed for every court and opening hour', async ({ request }) => {
  const response = await request.get('/api/slots?date=2027-01-15');
  await expect(response).toBeOK();

  const slots: Slot[] = await response.json();
  expect(slots).toHaveLength(42);
  expect([...new Set(slots.map((slot) => slot.date))]).toEqual(['2027-01-15']);
});

test('slots request without a date is rejected', async ({ request }) => {
  const response = await request.get('/api/slots');
  expect(response.status()).toBe(400);
});