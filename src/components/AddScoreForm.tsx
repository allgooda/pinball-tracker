import { useState } from 'react';
import type { Machine, ScoreEntry } from '../types';

interface Props {
  activeMachine: Machine;
  onAdd: (entry: ScoreEntry) => void;
}

export default function AddScoreForm({ activeMachine, onAdd }: Props) {
  const [score, setScore] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string>('');
  const [added, setAdded] = useState<boolean>(false);

  function handleSubmit() {
    const parsed = parseInt(score.replace(/[^0-9]/g, ''));
    if (!parsed || parsed < 1000) {
      setError('Enter a score above 1,000');
      return;
    }

    const entry: ScoreEntry = {
      id: Date.now(),
      score: parsed,
      date,
      machine: activeMachine,
    };

    onAdd(entry);
    setScore('');
    setError('');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ fontSize: 11, color: '#806030', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
        Log a Game
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={score}
          onChange={(e) => { setScore(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Score (e.g. 245000)"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(192,160,96,0.3)',
            borderRadius: 6,
            padding: '10px 14px',
            color: '#e8d5a0',
            fontSize: 15,
            width: 180,
            fontFamily: 'Georgia, serif',
            outline: 'none',
          }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(192,160,96,0.3)',
            borderRadius: 6,
            padding: '10px 14px',
            color: '#e8d5a0',
            fontSize: 13,
            fontFamily: 'Georgia, serif',
            outline: 'none',
            colorScheme: 'dark',
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            background: added ? 'rgba(80,160,80,0.3)' : 'rgba(192,160,96,0.2)',
            border: added ? '1px solid rgba(80,200,80,0.5)' : '1px solid rgba(192,160,96,0.5)',
            borderRadius: 6,
            padding: '10px 22px',
            color: added ? '#80d080' : '#f0c84a',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
            transition: 'all 0.2s',
          }}
        >
          {added ? '✓ Logged!' : 'Log Score'}
        </button>
      </div>
      {error && (
        <div style={{ color: '#d06040', fontSize: 12, marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
}
