// ScoreList.tsx
// shows all games for the active machine, newest first

import type { ScoreId, MachineStats } from '../types';
import type { DisplayScoreEntry } from '../utils/display';

interface Props {
  scores: DisplayScoreEntry[];
  stats: MachineStats;
  onRemove: (id: ScoreId) => void;
}

interface RowProps {
  entry: DisplayScoreEntry;
  isHigh: boolean;
  isLow: boolean;
  onRemove: (id: ScoreId) => void;
}

function ScoreRow({ entry, isHigh, isLow, onRemove }: RowProps) {

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 16px',
    background: isHigh ? 'rgba(240,200,74,0.08)' : 'rgba(255,255,255,0.03)',
    border: isHigh ? '1px solid rgba(240,200,74,0.25)' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: 6,
  };

  return (
    <div style={rowStyle}>

      <div style={{ fontSize: 18, fontWeight: 'bold', color: isHigh ? '#f0c84a' : '#e8d5a0', minWidth: 80 }}>
        {entry.formattedScore}
      </div>

      <div style={{ fontSize: 11, color: '#604820', flex: 1 }}>
        {entry.formattedDate}
      </div>

      {isHigh && (
        <div style={{ fontSize: 10, color: '#f0c84a', textTransform: 'uppercase' }}>
          ★ best
        </div>
      )}

      {isLow && !isHigh && (
        <div style={{ fontSize: 10, color: '#804020', textTransform: 'uppercase' }}>
          ↓ low
        </div>
      )}

      <button
        onClick={() => onRemove(entry.id)}
        style={{ background: 'none', border: 'none', color: '#503020', cursor: 'pointer', fontSize: 16 }}
      >
        ×
      </button>

    </div>
  );
}

export default function ScoreList({ scores, stats, onRemove }: Props) {

  if (scores.length === 0) {
    return (
      <div style={{ padding: '48px 0', color: '#604820', fontSize: 14, textAlign: 'center' }}>
        nothing logged yet
      </div>
    );
  }

  const sorted = [...scores].sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  );

  return (
    <div style={{ marginTop: 32 }}>

      <div style={{ fontSize: 11, color: '#806030', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
        all games
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((entry) => (
          <ScoreRow
            key={entry.id}
            entry={entry}
            isHigh={entry.rawScore === stats.high}
            isLow={entry.rawScore === stats.low}
            onRemove={onRemove}
          />
        ))}
      </div>

    </div>
  );
}