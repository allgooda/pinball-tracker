// src/components/ScoreList.tsx

import type { ScoreEntry, MachineStats } from '../types';
import { formatScore, formatDate } from '../utils/format';

interface Props {
  scores: ScoreEntry[];
  stats: MachineStats;
  onRemove: (id: number) => void;
}

function ScoreRow({ entry, isHigh, isLow, onRemove }: {
  entry: ScoreEntry;
  isHigh: boolean;
  isLow: boolean;
  onRemove: (id: number) => void;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 16px',
      background: isHigh ? 'rgba(240,200,74,0.08)' : 'rgba(255,255,255,0.03)',
      border: isHigh ? '1px solid rgba(240,200,74,0.25)' : '1px solid rgba(255,255,255,0.06)',
      borderRadius: 6,
    }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: isHigh ? '#f0c84a' : '#e8d5a0', minWidth: 80 }}>
        {formatScore(entry.score)}
      </div>
      <div style={{ fontSize: 11, color: '#604820', flex: 1 }}>
        {formatDate(entry.date)}
      </div>
      {isHigh && <div style={{ fontSize: 10, color: '#f0c84a', textTransform: 'uppercase' }}>★ best</div>}
      {isLow && !isHigh && <div style={{ fontSize: 10, color: '#804020', textTransform: 'uppercase' }}>↓ low</div>}
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
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
            isHigh={entry.score === stats.high}
            isLow={entry.score === stats.low}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}