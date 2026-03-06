// api.ts
// all communication with the backend lives here

import { type Machine, type ScoreEntry, type MachineId, type ScoreId, toScoreId, toMachineId } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function fetchMachines(): Promise<Machine[]> {
  const res = await fetch(`${BASE_URL}/machines`);
  if (!res.ok) throw new Error(`Failed to fetch machines: ${res.status}`);
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
  if (!res.ok) throw new Error(`Failed to add machine: ${res.status}`);
  const data = await res.json();
  return { id: toMachineId(data.id), name: data.name };
}

export async function deleteMachine(id: MachineId): Promise<void> {
  const res = await fetch(`${BASE_URL}/machines/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete machine: ${res.status}`);
}

export async function fetchScores(machine: Machine): Promise<ScoreEntry[]> {
  const res = await fetch(`${BASE_URL}/scores?machineId=${machine.id}`);
  if (!res.ok) throw new Error(`Failed to fetch scores: ${res.status}`);
  const raw = await res.json();
  return raw.map((s: any) => ({
    id: toScoreId(s.id),
    score: s.score,
    date: s.date,
    machine,
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
  if (!res.ok) throw new Error(`Failed to add score: ${res.status}`);
  const data = await res.json();
  return { id: toScoreId(data.id), score, date, machine };
}

export async function deleteScore(id: ScoreId): Promise<void> {
  const res = await fetch(`${BASE_URL}/scores/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete score: ${res.status}`);
}