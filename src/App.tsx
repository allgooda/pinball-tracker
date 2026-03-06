// App.tsx
// root component, manages global state and data fetching

import { useState, useEffect } from 'react';
import type { Machine, ScoreEntry } from './types';
import { toScoreId } from './types';
import type { DisplayScoreEntry, DisplayScoreId } from './utils/display';
import { calculateStats } from './utils/stats';
import { fetchMachines, fetchScores, addScore, deleteScore, addMachine, deleteMachine } from './utils/api';
import MachineSwitcher from './components/MachineSwitcher';
import StatsRow from './components/StatsRow';
import AddScoreForm from './components/AddScoreForm';
import AddMachineForm from './components/AddMachineForm';
import ScoreList from './components/ScoreList';
import MilestoneTracker from './components/MilestoneTracker';
import ScoreChart from './components/ScoreChart';
import { toDisplayScoreEntries } from './utils/display';
import FloorChart from './components/FloorChart';

export default function App() {

  const [machines, setMachines] = useState<Machine[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [activeMachine, setActiveMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // load machines on mount
  useEffect(() => {
    fetchMachines().then((data) => {
      setMachines(data);
      if (data.length > 0) setActiveMachine(data[0]);
      setLoading(false);
    });
  }, []);

  // load scores whenever active machine changes
  useEffect(() => {
    if (!activeMachine) return;
    fetchScores(activeMachine).then((data) => {
      setScores(data);
    });
  }, [activeMachine]);

  async function handleAddScore(entry: DisplayScoreEntry) {
    if (!activeMachine) return;
    const saved = await addScore(entry.rawScore, entry.rawDate, activeMachine);
    setScores((prev) => [...prev, saved]);
  }

  async function handleRemoveScore(id: DisplayScoreId) {
    await deleteScore(toScoreId(Number(id)));
    setScores((prev) => prev.filter((s) => String(s.id) !== id));
  }

  async function handleSelectMachine(machine: Machine) {
    setActiveMachine(machine);
  }

  async function handleAddMachine(machine: Machine) {
    const saved = await addMachine(machine.name);
    setMachines((prev) => [...prev, saved]);
    setActiveMachine(saved);
  }

  async function handleDeleteMachine(machine: Machine) {
    await deleteMachine(machine.id);
    const remaining = machines.filter((m) => m.id !== machine.id);
    setMachines(remaining);
    if (activeMachine?.id === machine.id) {
      setActiveMachine(remaining[0] ?? null);
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32, color: '#806030', fontFamily: 'Georgia, serif' }}>
        loading...
      </div>
    );
  }

  const activeScores = activeMachine
    ? scores.filter((s) => s.machine.id === activeMachine.id)
    : [];

  const stats = activeMachine ? calculateStats(activeScores) : null;

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32 }}>

      <h1 style={{ color: '#f0c84a', fontFamily: 'Georgia, serif' }}>
        Pinball Tracker
      </h1>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 24, flexWrap: 'wrap' }}>
        <MachineSwitcher
          machines={machines}
          activeMachine={activeMachine}
          onSelect={handleSelectMachine}
          onDelete={handleDeleteMachine}
        />
        <AddMachineForm onAdd={handleAddMachine} />
      </div>

      {stats && <StatsRow stats={stats} />}

      {stats && <MilestoneTracker stats={stats} />}

      {stats && (
        <ScoreChart
          scores={activeScores}
          stats={stats}
        />
      )}

      {activeScores.length >= 4 && (
        <FloorChart scores={activeScores} />
      )}
      {activeMachine && (
        <AddScoreForm
          activeMachine={activeMachine}
          onAdd={handleAddScore}
        />
      )}

      {stats && (
        <ScoreList
          scores={toDisplayScoreEntries(activeScores)}
          stats={stats}
          onRemove={handleRemoveScore}
        />
      )}

    </div>
  );
}