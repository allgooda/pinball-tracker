// ScoreList.tsx
// shows all games for the active machine, newest first

import { useState } from 'react';
import type { MachineStats } from '../types';
import type { DisplayScoreEntry, DisplayScoreId } from '../utils/display';

const PAGE_SIZE = 10;

interface Props {
  scores: DisplayScoreEntry[];
  stats: MachineStats;
  onRemove: (id: DisplayScoreId) => void;
}

interface RowProps {
  entry: DisplayScoreEntry;
  isHigh: boolean;
  isLow: boolean;
  onRemove: (id: DisplayScoreId) => void;
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

  const [page, setPage] = useState<number>(0);

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

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div style={{ marginTop: 32 }}>

      <div style={{ fontSize: 11, color: '#806030', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
        all games
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {paginated.map((entry) => (
          <ScoreRow
            key={entry.id}
            entry={entry}
            isHigh={entry.rawScore === stats.high}
            isLow={entry.rawScore === stats.low}
            onRemove={onRemove}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            style={{
              background: 'none',
              border: '1px solid rgba(192,160,96,0.3)',
              borderRadius: 6,
              padding: '6px 14px',
              color: page === 0 ? '#3a2a10' : '#806030',
              cursor: page === 0 ? 'default' : 'pointer',
              fontFamily: 'Georgia, serif',
              fontSize: 13,
            }}
          >
            ←
          </button>

          <div style={{ fontSize: 11, color: '#604820' }}>
            {page + 1} / {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            style={{
              background: 'none',
              border: '1px solid rgba(192,160,96,0.3)',
              borderRadius: 6,
              padding: '6px 14px',
              color: page === totalPages - 1 ? '#3a2a10' : '#806030',
              cursor: page === totalPages - 1 ? 'default' : 'pointer',
              fontFamily: 'Georgia, serif',
              fontSize: 13,
            }}
          >
            →
          </button>
        </div>
      )}

    </div>
  );
}
