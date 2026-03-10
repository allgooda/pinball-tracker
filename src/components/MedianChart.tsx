// MedianChart.tsx
// shows how the median score has trended over time as more games are logged

import { useState } from 'react';
import type { MachineStats } from '../types';
import { formatScore } from '../utils/format';

interface Props {
  stats: MachineStats;
}

export default function MedianChart({ stats }: Props) {

  const [visible, setVisible] = useState<boolean>(true);

  const data = stats.dailyMedian;
  const values = data.map((d) => d.median);
  const dates = data.map((d) => d.date);

  const max = Math.max(...values);
  const min = Math.min(...values);

  const range = max - min || 1;
  const padded = range * 0.2;
  const chartMax = max + padded;
  const chartMin = Math.max(0, min - padded);
  const chartRange = chartMax - chartMin;

  const chartH = 100;
  const gap = 48;
  const width = Math.max(500, data.length * gap);

  const toY = (val: number) => chartH - ((val - chartMin) / chartRange) * chartH;

  const linePath = values
    .map((val, i) => `${i * gap + 30},${toY(val)}`)
    .join(' ');

  const latest = values[values.length - 1];
  const prev = values[values.length - 2];
  const trending = prev !== undefined ? latest >= prev : true;

  return (
    <div style={{ marginTop: 28 }}>

      <div
        onClick={() => setVisible((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 10 }}
      >
        <div style={{ fontSize: 11, color: '#806030', textTransform: 'uppercase', letterSpacing: 2 }}>
          median trend
        </div>
        <div style={{ fontSize: 12, color: trending ? '#80d080' : '#d08080' }}>
          {trending ? '↑' : '↓'} {formatScore(latest)}
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

            <polyline
              points={linePath}
              fill="none"
              stroke="#4a90c8"
              strokeWidth={2}
              opacity={0.9}
            />

            {values.map((val, i) => (
              <g key={i}>
                <circle
                  cx={i * gap + 30}
                  cy={toY(val)}
                  r={3}
                  fill="#4a90c8"
                  opacity={0.9}
                />
                <text
                  x={i * gap + 30}
                  y={toY(val) - 8}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#6ab0d8"
                >
                  {formatScore(val)}
                </text>
              </g>
            ))}

            {dates.map((date, i) => (
              <text
                key={date}
                x={i * gap + 30}
                y={chartH + 16}
                textAnchor="middle"
                fontSize={9}
                fill="#604820"
              >
                {date.slice(5)}
              </text>
            ))}

          </svg>

          <div style={{ fontSize: 10, color: '#604820', marginTop: 4 }}>
            median = middle score across all games at each point in time
          </div>

        </div>
      )}

    </div>
  );
}
