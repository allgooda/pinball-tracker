import type { MachineStats } from '../types';
import { formatScore } from '../utils/format';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}

function StatCard({ label, value, sub, highlight = false }: StatCardProps) {
  return (
    <div style={{
      background: highlight ? 'rgba(192,160,96,0.12)' : 'rgba(255,255,255,0.04)',
      border: highlight ? '1px solid rgba(192,160,96,0.4)' : '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      padding: '14px 14px 12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, fontWeight: 'bold', color: highlight ? '#f0c84a' : '#e8d5a0', letterSpacing: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: '#806030', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 10, color: '#604820', marginTop: 2 }}>
        {sub}
      </div>
    </div>
  );
}

interface Props {
  stats: MachineStats;
}

export default function StatsRow({ stats }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 16 }}>
      <StatCard label="Games" value={stats.count.toString()} sub="logged" />
      <StatCard label="Median" value={formatScore(stats.median)} sub="middle score" />
      <StatCard label="Average" value={formatScore(stats.average)} sub="per game" />
      <StatCard label="Your Floor" value={formatScore(stats.floor)} sub="bottom 25% avg" highlight />
      <StatCard label="High Score" value={formatScore(stats.high)} sub="all time" />
    </div>
  );
}