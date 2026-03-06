// App.tsx
// root component, manages global state and data fetching

import { useState, useEffect } from 'react';
import type { Machine, ScoreEntry, ScoreId } from './types';
import { calculateStats } from './utils/stats';
import { fetchMachines, fetchScores, addScore, deleteScore } from './utils/api';
import MachineSwitcher from './components/MachineSwitch';
import StatsRow from './components/StatsRow';
import AddScoreForm from './components/AddScoreForm';
import ScoreList from './components/ScoreList';
import MilestoneTracker from './components/MilestoneTracker';
import ScoreChart from './components/ScoreChart';

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
    fetchScores(activeMachine.id).then((data) => {
      setScores(data);
    });
  }, [activeMachine]);

  async function handleAddScore(entry: ScoreEntry) {
    const saved = await addScore(entry.score, entry.date, entry.machine);
    setScores((prev) => [...prev, saved]);
  }

  async function handleRemoveScore(id: ScoreId) {
    await deleteScore(id);
    setScores((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSelectMachine(machine: Machine) {
    setActiveMachine(machine);
  }

  if (loading) {
    return (
      <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32, color: '#806030', fontFamily: 'Georgia, serif' }}>
        loading...
      </div>
    );
  }

  if (machines.length === 0) {
    return (
      <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32, color: '#806030', fontFamily: 'Georgia, serif' }}>
        no machines found — add one to get started
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

      <MachineSwitcher
        machines={machines}
        activeMachine={activeMachine!}
        onSelect={handleSelectMachine}
      />

      {stats && <StatsRow stats={stats} />}

      {stats && <MilestoneTracker stats={stats} />}

      {stats && (
        <ScoreChart
          scores={activeScores}
          stats={stats}
        />
      )}

      {activeMachine && (
        <AddScoreForm
          activeMachine={activeMachine}
          onAdd={handleAddScore}
        />
      )}

      {stats && (
        <ScoreList
          scores={activeScores}
          stats={stats}
          onRemove={handleRemoveScore}
        />
      )}

    </div>
  );
}