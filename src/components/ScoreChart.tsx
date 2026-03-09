// ScoreChart.tsx
// bar chart of scores over time with rolling average line

import { useState } from 'react';
import { toMachineId, type MachineStats } from '../types';
import { fromDisplayScoreId, type DisplayScoreEntry } from '../utils/display';
import { rollingAverage } from '../utils/stats';

interface Props {
  scores: DisplayScoreEntry[];
  stats: MachineStats;
}

interface LineProps {
  points: number[];
  max: number;
  chartH: number;
  gap: number;
  color: string;
  dash?: string;
  opacity?: number;
}

function TrendLine({ points, max, chartH, gap, color, dash, opacity = 1 }: LineProps) {
  const path = points
    .map((val, i) => `${i * gap + 30},${chartH - (val / max) * chartH}`)
    .join(' ');

  return (
    <polyline
      points={path}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeDasharray={dash}
      opacity={opacity}
    />
  );
}

export default function ScoreChart({ scores, stats }: Props) {

  const [visible, setVisible] = useState<boolean>(true);

  if (scores.length < 2) return null;

  const sorted = [...scores].sort(
    (a, b) => new Date(a.formattedDate).getTime() - new Date(b.formattedDate).getTime()
  );

  const rolling = rollingAverage(
    sorted.map(e => ({
      id: fromDisplayScoreId(e.id),
      score: e.rawScore,
      date: e.rawDate,
      machine: { id: toMachineId(0), name: e.machineName },
    }))
  );

  const chartH = 120;
  const barW = 28;
  const gap = 48;
  const width = Math.max(500, sorted.length * gap);

  return (
    <div style={{ marginTop: 28 }}>

      <div
        onClick={() => setVisible((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 10 }}
      >
        <div style={{ fontSize: 11, color: '#806030', textTransform: 'uppercase', letterSpacing: 2 }}>
          score history
        </div>
        <div style={{ fontSize: 10, color: '#604820' }}>
          {visible ? '▲ hide' : '▼ show'}
        </div>
      </div>

      {visible && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          padding: '16px 16px 8px',
          overflowX: 'auto',
        }}>

          <svg width={width} height={chartH + 30} style={{ display: 'block' }}>

            {[0.25, 0.5, 0.75, 1].map((f) => (
              <line
                key={f}
                x1={0} y1={chartH - f * chartH}
                x2={width} y2={chartH - f * chartH}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            ))}

            {sorted.map((entry, i) => {
              const h = Math.max(4, (Number(entry.formattedScore) / stats.high) * chartH);
              const x = i * gap + 16;
              const isHigh = Number(entry.formattedScore) === stats.high;
              const isLow = Number(entry.formattedScore) === stats.low;
              const fill = isHigh ? '#f0c84a' : isLow ? '#804020' : 'rgba(192,160,96,0.55)';

              return (
                <g key={entry.id}>
                  <rect x={x} y={chartH - h} width={barW} height={h} fill={fill} rx={3} />
                  <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" fontSize={9} fill="#604820">
                    {entry.formattedDate.slice(5)}
                  </text>
                </g>
              );
            })}

            <TrendLine
              points={rolling}
              max={stats.high}
              chartH={chartH}
              gap={gap}
              color="#f0c84a"
              dash="4 3"
              opacity={0.6}
            />

          </svg>

          <div style={{ fontSize: 10, color: '#604820', marginTop: 4, display: 'flex', gap: 16 }}>
            <span><span style={{ color: '#f0c84a' }}>— —</span> rolling avg</span>
            <span><span style={{ color: '#f0c84a' }}>█</span> high</span>
            <span><span style={{ color: '#804020' }}>█</span> low</span>
          </div>

        </div>
      )}

    </div>
  );
}