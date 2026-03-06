// ScoreChart.tsx
// bar chart of scores over time with a rolling average line

import type { ScoreEntry, MachineStats } from '../types';
import { rollingAverage } from '../utils/stats';

interface Props {
  scores: ScoreEntry[];
  stats: MachineStats;
}

export default function ScoreChart({ scores, stats }: Props) {

  if (scores.length < 2) return null;

  const sorted = [...scores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const rolling = rollingAverage(sorted);

  const chartH = 120;
  const barW = 28;
  const gap = 48;
  const width = Math.max(500, sorted.length * gap);

  return (
    <div style={{ marginTop: 28 }}>

      <div style={{ fontSize: 11, color: '#806030', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
        score history
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

          {/* bars */}
          {sorted.map((entry, i) => {

            const h = Math.max(4, (entry.score / stats.high) * chartH);
            const x = i * gap + 16;
            const isHigh = entry.score === stats.high;
            const isLow = entry.score === stats.low;
            const fill = isHigh ? '#f0c84a' : isLow ? '#804020' : 'rgba(192,160,96,0.55)';

            return (
              <g key={entry.id}>
                <rect x={x} y={chartH - h} width={barW} height={h} fill={fill} rx={3} />
                <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" fontSize={9} fill="#604820">
                  {entry.date.slice(5)}
                </text>
              </g>
            );
          })}

          {/* rolling average line */}
          <polyline
            points={rolling.map((avg, i) => `${i * gap + 30},${chartH - (avg / stats.high) * chartH}`).join(' ')}
            fill="none"
            stroke="#f0c84a"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.6}
          />

        </svg>

        <div style={{ fontSize: 10, color: '#604820', marginTop: 4 }}>
          <span style={{ color: '#f0c84a', marginRight: 6 }}>— —</span> 5-game rolling average
          &nbsp;&nbsp;
          <span style={{ color: '#f0c84a' }}>█</span> high
          &nbsp;&nbsp;
          <span style={{ color: '#804020' }}>█</span> low
        </div>

      </div>
    </div>
  );
}