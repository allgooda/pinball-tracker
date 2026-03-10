import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import pool, { initDb } from './db';
import type { MachineRow, ScoreRow, AddMachineBody, AddScoreBody, Machine } from './types';
import { calculateStats } from './stats';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
});

app.use(checkJwt);

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('auth error:', err.message, err.code);
  res.status(err.status ?? 500).json({ error: err.message });
});


// --- machines ---

app.get('/machines', async (req: Request, res: Response) => {
  const userId = req.auth?.payload.sub;
  const result = await pool.query<MachineRow>('SELECT * FROM machines WHERE user_id = $1', [userId]);
  res.json(result.rows);
});

app.get('/machines/:id', async (req: Request<{ id: string }>, res: Response) => {
  const userId = req.auth?.payload.sub;
  const { id } = req.params;
  const machineResult = await pool.query<MachineRow>(
    'SELECT * FROM machines WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  if (machineResult.rows.length === 0) {
    res.status(404).json({ error: 'Machine not found' });
    return;
  }
  const m = machineResult.rows[0];
  const scoresResult = await pool.query<ScoreRow>('SELECT * FROM scores WHERE machine_id = $1', [id]);
  const machine: Machine = { id: m.id, name: m.name, stats: calculateStats(scoresResult.rows) };
  res.json(machine);
});

app.post('/machines', async (req: Request<{}, {}, AddMachineBody>, res: Response) => {
  const userId = req.auth?.payload.sub;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const result = await pool.query<MachineRow>(
    'INSERT INTO machines (name, user_id) VALUES ($1, $2) RETURNING *',
    [name, userId]
  );
  const m = result.rows[0];
  res.json({ id: m.id, name: m.name, stats: null });
});

app.delete('/machines/:id', async (req: Request<{ id: string }>, res: Response) => {
  const userId = req.auth?.payload.sub;
  const { id } = req.params;
  // verify ownership before deleting
  const check = await pool.query('SELECT id FROM machines WHERE id = $1 AND user_id = $2', [id, userId]);
  if (check.rows.length === 0) {
    res.status(404).json({ error: 'Machine not found' });
    return;
  }
  await pool.query('DELETE FROM scores WHERE machine_id = $1', [id]);
  await pool.query('DELETE FROM machines WHERE id = $1', [id]);
  res.json({ success: true });
});


// --- scores ---

app.get('/scores', async (req: Request<{}, {}, {}, { machineId?: string }>, res: Response) => {
  const { machineId } = req.query;
  const result = machineId
    ? await pool.query<ScoreRow>('SELECT * FROM scores WHERE machine_id = $1', [machineId])
    : await pool.query<ScoreRow>('SELECT * FROM scores');
  res.json(result.rows);
});

app.post('/scores', async (req: Request<{}, {}, AddScoreBody>, res: Response) => {
  const { score, date, machineId } = req.body;
  if (!score || !date || !machineId) {
    res.status(400).json({ error: 'score, date and machineId are required' });
    return;
  }
  const result = await pool.query<ScoreRow>(
    'INSERT INTO scores (score, date, machine_id) VALUES ($1, $2, $3) RETURNING *',
    [score, date, machineId]
  );
  res.json(result.rows[0]);
});

app.delete('/scores/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM scores WHERE id = $1', [id]);
  res.json({ success: true });
});


// start server after db is ready
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    }).on('error', (err) => {
      console.error('server error:', err);
    });
  })
  .catch((err) => {
    console.error('failed to initialize database:', err);
    process.exit(1);
  });

process.on('uncaughtException', (err) => {
  console.error('uncaught exception:', err);
});
