// FloorChart.tsx
// shows how the floor score has trended over time as more games are logged

import type { ScoreEntry } from '../types';
import { runningFloor, sortByDate } from '../utils/stats';
import { formatScore } from '../utils/format';

interface Props {
  scores: ScoreEntry[];
}

export default function FloorChart({ scores }: Props) {

  if (scores.length < 4) return null;

    const sorted = sortByDate(scores);

    // only show the bottom 25% of scores
    const byScore = [...scores].sort((a, b) => a.score - b.score);
    const bottomSlice = byScore.slice(0, Math.max(1, Math.ceil(scores.length * 0.25)));
    const bottomSorted = sortByDate(bottomSlice);

    const floors = runningFloor(bottomSorted);
    const max = Math.max(...floors);
    const min = Math.min(...floors);

    // add some padding so the line doesn't hug the edges
    const range = max - min || 1;
    const padded = range * 0.2;
    const chartMax = max + padded;
    const chartMin = Math.max(0, min - padded);
    const chartRange = chartMax - chartMin;

    const chartH = 100;
    const gap = 48;
    const width = Math.max(500, sorted.length * gap);

    const toY = (val: number) => chartH - ((val - chartMin) / chartRange) * chartH;

    const linePath = floors
        .map((val, i) => `${i * gap + 30},${toY(val)}`)
        .join(' ');

    const latest = floors[floors.length - 1];
    const prev = floors[floors.length - 2];
    const trending = latest >= prev;

  return (
    <div style={{ marginTop: 28 }}>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: '#806030', textTransform: 'uppercase', letterSpacing: 2 }}>
          floor trend
        </div>
        <div style={{ fontSize: 12, color: trending ? '#80d080' : '#d08080' }}>
          {trending ? '↑' : '↓'} {formatScore(latest)}
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        padding: '16px 16px 8px',
        overflowX: 'auto',
      }}>

        <svg width={width} height={chartH + 30} style={{ display: 'block' }}>

          {/* grid lines */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={0} y1={chartH - f * chartH}
              x2={width} y2={chartH - f * chartH}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}

          {/* floor line */}
          <polyline
            points={linePath}
            fill="none"
            stroke="#804020"
            strokeWidth={2}
            opacity={0.9}
          />

          {/* dots at each data point */}
          {floors.map((val, i) => (
            <circle
              key={i}
              cx={i * gap + 30}
              cy={toY(val)}
              r={3}
              fill="#804020"
              opacity={0.9}
            />
          ))}

          {/* date labels */}
          {sorted.map((entry, i) => (
            <text
              key={entry.id}
              x={i * gap + 30}
              y={chartH + 16}
              textAnchor="middle"
              fontSize={9}
              fill="#604820"
            >
              {entry.date.slice(5)}
            </text>
          ))}

        </svg>

        <div style={{ fontSize: 10, color: '#604820', marginTop: 4 }}>
          floor = average of your bottom 25% of games at each point in time
        </div>

      </div>
    </div>
  );
}