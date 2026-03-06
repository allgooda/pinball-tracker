// ScoreChart.tsx
// bar chart of scores over time with rolling average, median and floor trend lines

import type { ScoreEntry, MachineStats } from '../types';
import { rollingAverage, runningMedian, runningFloor } from '../utils/stats';

interface Props {
  scores: ScoreEntry[];
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

  if (scores.length < 2) return null;

  const sorted = [...scores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const rolling = rollingAverage(sorted);
  const medians = runningMedian(sorted);
  const floors = runningFloor(sorted);

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
          <TrendLine
            points={rolling}
            max={stats.high}
            chartH={chartH}
            gap={gap}
            color="#f0c84a"
            dash="4 3"
            opacity={0.6}
          />

          {/* running median line */}
          <TrendLine
            points={medians}
            max={stats.high}
            chartH={chartH}
            gap={gap}
            color="#60a0d0"
            opacity={0.8}
          />

          {/* running floor line */}
          <TrendLine
            points={floors}
            max={stats.high}
            chartH={chartH}
            gap={gap}
            color="#804020"
            dash="2 2"
            opacity={0.8}
          />

        </svg>

        <div style={{ fontSize: 10, color: '#604820', marginTop: 4, display: 'flex', gap: 16 }}>
          <span><span style={{ color: '#f0c84a' }}>— —</span> rolling avg</span>
          <span><span style={{ color: '#60a0d0' }}>——</span> median</span>
          <span><span style={{ color: '#804020' }}>- -</span> floor</span>
          <span><span style={{ color: '#f0c84a' }}>█</span> high</span>
          <span><span style={{ color: '#804020' }}>█</span> low</span>
        </div>

      </div>
    </div>
  );
}