// index.ts
// express server with routes for machines and scores

import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './db';
import type { MachineRow, ScoreRow, AddMachineBody, AddScoreBody } from './types';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());


// --- machines ---

app.get('/machines', (req: Request, res: Response) => {
  const machines = db.prepare('SELECT * FROM machines').all() as MachineRow[];
  res.json(machines);
});

app.post('/machines', (req: Request<{}, {}, AddMachineBody>, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const result = db.prepare('INSERT INTO machines (name) VALUES (?)').run(name);
  res.json({ id: result.lastInsertRowid, name });
});

app.delete('/machines/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  db.prepare('DELETE FROM scores WHERE machine_id = ?').run(id);
  db.prepare('DELETE FROM machines WHERE id = ?').run(id);
  res.json({ success: true });
});


// --- scores ---

app.get('/scores', (req: Request<{}, {}, {}, { machineId?: string }>, res: Response) => {
  const { machineId } = req.query;
  const scores = machineId
    ? db.prepare('SELECT * FROM scores WHERE machine_id = ?').all(machineId) as ScoreRow[]
    : db.prepare('SELECT * FROM scores').all() as ScoreRow[];
  res.json(scores);
});

app.post('/scores', (req: Request<{}, {}, AddScoreBody>, res: Response) => {
  const { score, date, machineId } = req.body;
  if (!score || !date || !machineId) {
    res.status(400).json({ error: 'score, date and machineId are required' });
    return;
  }
  const result = db.prepare(
    'INSERT INTO scores (score, date, machine_id) VALUES (?, ?, ?)'
  ).run(score, date, machineId);
  res.json({ id: result.lastInsertRowid, score, date, machineId });
});

app.delete('/scores/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  db.prepare('DELETE FROM scores WHERE id = ?').run(id);
  res.json({ success: true });
});


app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('uncaught exception:', err);
});