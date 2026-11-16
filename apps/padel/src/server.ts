import express from 'express';
import { courts, slotsFor } from './data.js';


const app = express();
const port = Number(process.env.PORT ?? 3002);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/courts', (_req, res) => {
  res.json(courts);
});

app.listen(port, () => {
  console.log(`Padel app listening on http://localhost:${port}`);
});

app.get('/api/slots', (req, res) => {
  const date = req.query.date;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: 'date must be in YYYY-MM-DD format' });
    return;
  }
  res.json(slotsFor(date));
});