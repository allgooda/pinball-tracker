// api.ts
// all communication with the backend lives here

import { type Machine, type ScoreEntry, type MachineId, type ScoreId, toScoreId, toMachineId } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

function authHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function fetchMachines(token: string): Promise<Machine[]> {
  const res = await fetch(`${BASE_URL}/machines`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(`Failed to fetch machines: ${res.status}`);
  const raw = await res.json();
  return raw.map((m: any) => ({ id: toMachineId(m.id), name: m.name, stats: null }));
}

export async function fetchMachine(id: MachineId, token: string): Promise<Machine> {
  const res = await fetch(`${BASE_URL}/machines/${id}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(`Failed to fetch machine: ${res.status}`);
  const m = await res.json();
  return { id: toMachineId(m.id), name: m.name, stats: m.stats };
}

export async function addMachine(name: string, token: string): Promise<Machine> {
  const res = await fetch(`${BASE_URL}/machines`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Failed to add machine: ${res.status}`);
  const data = await res.json();
  return { id: toMachineId(data.id), name: data.name, stats: null };
}

export async function deleteMachine(id: MachineId, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/machines/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to delete machine: ${res.status}`);
}

export async function fetchScores(machine: Machine, token: string): Promise<ScoreEntry[]> {
  const res = await fetch(`${BASE_URL}/scores?machineId=${machine.id}`, { headers: authHeaders(token) });
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
  machine: Machine,
  token: string,
): Promise<ScoreEntry> {
  const res = await fetch(`${BASE_URL}/scores`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ score, date, machineId: machine.id }),
  });
  if (!res.ok) throw new Error(`Failed to add score: ${res.status}`);
  const data = await res.json();
  return { id: toScoreId(data.id), score, date, machine };
}

export async function deleteScore(id: ScoreId, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/scores/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to delete score: ${res.status}`);
}
