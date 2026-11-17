import { randomUUID } from 'node:crypto';
import express from 'express';
import {
  bookings, courts, CLOSING_HOUR, DURATIONS, OPENING_HOUR,
  hoursTaken, isFree, priceFor, slotsFor,
} from './data.js';
import type { Booking } from './data.js';
import { fileURLToPath } from 'node:url';
import { chance, profile, random, seed } from './faults.js';



const app = express();
app.use(express.json());
app.use('/api', async (_req, _res, next) => {
  if (profile === 'flaky' && chance(0.2)) {
    await new Promise((resolve) => setTimeout(resolve, 1500 + random() * 2500));
  }
  next();
});
const publicDir = fileURLToPath(new URL('../public', import.meta.url));
app.use(express.static(publicDir));

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

function reject(res: express.Response, status: number, error: string): void {
  res.status(status).json({ error });
}

const USERNAME = process.env.PADEL_USER ?? 'player';
const PASSWORD = process.env.PADEL_PASSWORD ?? 'padel123';
const sessions = new Set<string>();

function requireLogin(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessions.has(token)) return reject(res, 401, 'login required');
  next();
}

const port = Number(process.env.PORT ?? 3002);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/courts', (_req, res) => {
  res.json(courts);
});

app.get('/api/slots', (req, res) => {
  
  const date = req.query.date;
    if (typeof date !== 'string' || !DATE_FORMAT.test(date)) {
    res.status(400).json({ error: 'date must be in YYYY-MM-DD format' });
    return;
  }
  res.json(slotsFor(date));
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body ?? {};
  if (username !== USERNAME || password !== PASSWORD) {
    return reject(res, 401, 'wrong username or password');
  }
  const token = randomUUID();
  sessions.add(token);
  res.json({ token });
});

app.post('/api/bookings', requireLogin, (req, res) => {
  const { courtId, date, hour, durationMinutes, players } = req.body ?? {};

  const court = courts.find((c) => c.id === courtId);
  if (!court) return reject(res, 404, 'court not found');
  if (typeof date !== 'string' || !DATE_FORMAT.test(date)) {
    return reject(res, 400, 'date must be in YYYY-MM-DD format');
  }
  if (!DURATIONS.includes(durationMinutes)) {
    return reject(res, 400, 'durationMinutes must be 60, 90 or 120');
  }
  if (!Number.isInteger(hour) || hour < OPENING_HOUR || hour + hoursTaken(durationMinutes) > CLOSING_HOUR) {
    return reject(res, 400, 'hour is outside opening hours');
  }
  if (players !== 2 && players !== 4) return reject(res, 400, 'players must be 2 or 4');

  for (let h = hour; h < hour + hoursTaken(durationMinutes); h++) {
    if (!isFree(court.id, date, h)) return reject(res, 409, 'slot is already booked');
  }

  const booking: Booking = {
    id: randomUUID(), courtId: court.id, date, hour, durationMinutes, players,
    price: priceFor(court, durationMinutes),
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

app.get('/api/bookings', requireLogin, (_req, res) => {
  res.json(bookings);
});

app.delete('/api/bookings/:id', requireLogin, (req, res) => {
  const index = bookings.findIndex((b) => b.id === req.params.id);
  if (index === -1) return reject(res, 404, 'booking not found');
  bookings.splice(index, 1);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Padel app listening on http://localhost:${port} (faults: ${profile}, seed: ${seed})`);
});