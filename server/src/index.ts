import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/machines', (req, res) => {
    const machines = db.prepare('SELECT * FROM machines').all();
    res.json(machines);
});

app.post('/machines', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }
    const result = db.prepare('INSERT INTO machines (name) VALUES (?)').run(name);
    res.json({ id: result.lastInsertRowid, name });
});

app.delete('/machines/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM scores WHERE machine_id = ?').run(id);
    db.prepare('DELETE FROM machines WHERE id = ?').run(id);
    res.json({ success: true });
});

app.get('/scores', (req, res) => {
    const { machineId } = req.query;
    const scores = machineId
        ? db.prepare('SELECT * FROM scores WHERE machine_id = ?').all(machineId)
        : db.prepare('SELECT * FROM scores').all();
    res.json(scores);
});

app.post('/scores', (req, res) => {
    const { score, date, machineId } = req.body;
    if (!score || !date || !machineId) {
        res.status(400).json({ error: 'Score, date, and machineId are required' });
        return;
    }
    const result = db.prepare('INSERT INTO scores (score, date, machine_id) VALUES (?, ?, ?)').run(score, date, machineId);
    res.json({ id: result.lastInsertRowid, score, date, machineId });
});

app.delete('/scores/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM scores WHERE id = ?').run(id);
    res.json({ success: true });
});