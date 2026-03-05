// src/App.tsx

import { useState } from 'react';
import type { Machine, ScoreEntry } from './types';
import { calculateStats } from './utils/stats';
import MachineSwitcher from './components/MachineSwitch';
import StatsRow from './components/StatsRow';
import AddScoreForm from './components/AddScoreForm';

const initialMachines: Machine[] = [
  { id: 1, name: 'Black Hole' },
  { id: 2, name: "Hotdoggin'" },
];

const initialScores: ScoreEntry[] = [
  { id: 1, score: 319770, date: '2026-03-05', machine: initialMachines[0] },
  { id: 2, score: 120290, date: '2026-03-05', machine: initialMachines[0] },
  { id: 3, score: 91300, date: '2026-03-05', machine: initialMachines[0] },
  { id: 4, score: 64800, date: '2026-03-05', machine: initialMachines[0] },
];

export default function App() {
  const [machines] = useState<Machine[]>(initialMachines);
  const [scores, setScores] = useState<ScoreEntry[]>(initialScores);
  const [activeMachine, setActiveMachine] = useState<Machine>(initialMachines[0]);

  const activeScores = scores.filter((s) => s.machine.id === activeMachine.id);
  const stats = calculateStats(activeScores);

  function handleAddScore(entry: ScoreEntry) {
    setScores((prev) => [...prev, entry]);
  }

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32 }}>
      <h1 style={{ color: '#f0c84a', fontFamily: 'Georgia, serif' }}>
        Pinball Tracker
      </h1>
      <MachineSwitcher
        machines={machines}
        activeMachine={activeMachine}
        onSelect={setActiveMachine}
      />
      {stats && <StatsRow stats={stats} />}
      <AddScoreForm
        activeMachine={activeMachine}
        onAdd={handleAddScore}
      />
    </div>
  );
}