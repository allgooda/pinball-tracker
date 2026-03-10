// App.tsx
// root component, manages global state and data fetching

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { Machine, ScoreEntry } from './types';
import { fromDisplayScoreId } from './utils/display';
import type { DisplayScoreEntry, DisplayScoreId } from './utils/display';
import { fetchMachines, fetchMachine, fetchScores, addScore, deleteScore, addMachine, deleteMachine } from './utils/api';
import MachineSwitcher from './components/MachineSwitcher';
import StatsRow from './components/StatsRow';
import AddScoreForm from './components/AddScoreForm';
import AddMachineForm from './components/AddMachineForm';
import ScoreList from './components/ScoreList';
import MilestoneTracker from './components/MilestoneTracker';
import ScoreChart from './components/ScoreChart';
import { toDisplayScoreEntries } from './utils/display';
import FloorChart from './components/FloorChart';
import MedianChart from './components/MedianChart';

export default function App() {

  const { isLoading, isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

  const [machines, setMachines] = useState<Machine[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [activeMachine, setActiveMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // load machines on mount once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    getAccessTokenSilently().then((token) =>
      fetchMachines(token).then((data) => {
        setMachines(data);
        if (data.length > 0) setActiveMachine(data[0]);
        setLoading(false);
      })
    );
  }, [isAuthenticated]);

  // load scores and stats whenever active machine changes
  useEffect(() => {
    if (!activeMachine) return;
    getAccessTokenSilently().then((token) => {
      fetchScores(activeMachine, token).then((data) => setScores(data));
      fetchMachine(activeMachine.id, token).then((data) => setActiveMachine(data));
    });
  }, [activeMachine?.id]);

  async function handleAddScore(entry: DisplayScoreEntry) {
    if (!activeMachine) return;
    const token = await getAccessTokenSilently();
    const saved = await addScore(entry.rawScore, entry.rawDate, activeMachine, token);
    setScores((prev) => [...prev, saved]);
    const updated = await fetchMachine(activeMachine.id, token);
    setActiveMachine(updated);
    setMachines((prev) => prev.map((m) => m.id === updated.id ? updated : m));
  }

  async function handleRemoveScore(id: DisplayScoreId) {
    if (!activeMachine) return;
    const token = await getAccessTokenSilently();
    await deleteScore(fromDisplayScoreId(id), token);
    setScores((prev) => prev.filter((s) => String(s.id) !== id));
    const updated = await fetchMachine(activeMachine.id, token);
    setActiveMachine(updated);
    setMachines((prev) => prev.map((m) => m.id === updated.id ? updated : m));
  }

  async function handleSelectMachine(machine: Machine) {
    setActiveMachine(machine);
  }

  async function handleAddMachine(machine: Machine) {
    const token = await getAccessTokenSilently();
    const saved = await addMachine(machine.name, token);
    setMachines((prev) => [...prev, saved]);
    setActiveMachine(saved);
  }

  async function handleDeleteMachine(machine: Machine) {
    const token = await getAccessTokenSilently();
    await deleteMachine(machine.id, token);
    const remaining = machines.filter((m) => m.id !== machine.id);
    setMachines(remaining);
    if (activeMachine?.id === machine.id) {
      setActiveMachine(remaining[0] ?? null);
    }
  }

  if (isLoading) {
    return (
      <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32, color: '#806030', fontFamily: 'Georgia, serif' }}>
        loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#f0c84a', fontFamily: 'Georgia, serif', marginBottom: 32 }}>Pinball Tracker</h1>
        <button
          onClick={() => loginWithRedirect()}
          style={{
            background: 'rgba(192,160,96,0.2)',
            border: '1px solid rgba(192,160,96,0.5)',
            borderRadius: 6,
            padding: '12px 32px',
            color: '#f0c84a',
            fontSize: 16,
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
          }}
        >
          log in
        </button>
      </div>
    );
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

  const stats = activeMachine?.stats ?? null;

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#f0c84a', fontFamily: 'Georgia, serif' }}>
          Pinball Tracker
        </h1>
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '6px 16px',
            color: '#604820',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
          }}
        >
          log out
        </button>
      </div>

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
          scores={toDisplayScoreEntries(activeScores)}
          stats={stats}
        />
      )}

      {stats && stats.dailyFloor.length >= 4 && (
        <FloorChart stats={stats} />
      )}

      {stats && stats.dailyMedian.length >= 4 && (
        <MedianChart stats={stats} />
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
