import express from 'express';
import { courts } from './data.js';

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