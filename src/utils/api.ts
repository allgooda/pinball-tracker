// api.ts
// all communication with the backend lives here

import { type Machine, type ScoreEntry, type MachineId, type ScoreId, toScoreId, toMachineId } from '../types';

const BASE_URL = 'http://localhost:3001';

export async function fetchMachines(): Promise<Machine[]> {
  const res = await fetch(`${BASE_URL}/machines`);
  const raw = await res.json();
  return raw.map((m: any) => ({
    id: toMachineId(m.id),
    name: m.name,
  }));
}

export async function addMachine(name: string): Promise<Machine> {
  const res = await fetch(`${BASE_URL}/machines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  return { id: toMachineId(data.id), name: data.name };
}

export async function deleteMachine(id: MachineId): Promise<void> {
  await fetch(`${BASE_URL}/machines/${id}`, { method: 'DELETE' });
}

export async function fetchScores(machineId: number): Promise<ScoreEntry[]> {
  const res = await fetch(`${BASE_URL}/scores?machineId=${machineId}`);
  const raw = await res.json();

  // the db stores machine_id but our frontend expects a full machine object
  // we reconstruct the ScoreEntry shape here
  return raw.map((s: any) => ({
    id: toScoreId(s.id),
    score: s.score,
    date: s.date,
    machine: { id: toMachineId(s.machine_id), name: '' },
  }));
}

export async function addScore(
  score: number,
  date: string,
  machine: Machine
): Promise<ScoreEntry> {
  const res = await fetch(`${BASE_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, date, machineId: machine.id }),
  });
  const data = await res.json();
  return { id: toScoreId(data.id), score, date, machine };
}

export async function deleteScore(id: ScoreId): Promise<void> {
  await fetch(`${BASE_URL}/scores/${id}`, { method: 'DELETE' });
}