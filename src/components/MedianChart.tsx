// MedianChart.tsx
// shows how the median score has trended over time as more games are logged

import { useState } from 'react';
import type { MachineStats } from '../types';
import { formatScore } from '../utils/format';
import styles from '../styles/MedianChart.module.css';

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

  const linePath = values.map((val, i) => `${i * gap + 30},${toY(val)}`).join(' ');

  const latest = values[values.length - 1];
  const prev = values[values.length - 2];
  const trending = prev !== undefined ? latest >= prev : true;

  return (
    <div className={styles.section}>
      <div className={styles.toggle} onClick={() => setVisible((v) => !v)}>
        <div className={styles.toggleLabel}>median trend</div>
        <div className={`${styles.toggleTrend} ${trending ? styles.toggleTrendUp : styles.toggleTrendDown}`}>
          {trending ? '↑' : '↓'} {formatScore(latest)}
        </div>
        <div className={styles.toggleHint}>{visible ? '▲ hide' : '▼ show'}</div>
      </div>

      {visible && (
        <div className={styles.chart}>
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

            <polyline points={linePath} fill="none" stroke="#4a90c8" strokeWidth={2} opacity={0.9} />

            {values.map((val, i) => (
              <g key={i}>
                <circle cx={i * gap + 30} cy={toY(val)} r={3} fill="#4a90c8" opacity={0.9} />
                <text x={i * gap + 30} y={toY(val) - 8} textAnchor="middle" fontSize={9} fill="#6ab0d8">
                  {formatScore(val)}
                </text>
              </g>
            ))}

            {dates.map((date, i) => (
              <text key={date} x={i * gap + 30} y={chartH + 16} textAnchor="middle" fontSize={9} fill="#604820">
                {date.slice(5)}
              </text>
            ))}
          </svg>

          <div className={styles.legend}>
            median = middle score across all games at each point in time
          </div>
        </div>
      )}
    </div>
  );
}
