import type { MachineStats } from '../types';
import { formatScore } from '../utils/format';
import styles from '../styles/StatsRow.module.css';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}

function StatCard({ label, value, sub, highlight = false }: StatCardProps) {
  return (
    <div className={`${styles.card} ${highlight ? styles.cardHighlight : ''}`}>
      <div className={`${styles.value} ${highlight ? styles.valueHighlight : ''}`}>{value}</div>
      <div className={styles.label}>{label}</div>
      <div className={styles.sub}>{sub}</div>
    </div>
  );
}

interface Props {
  stats: MachineStats;
}

export default function StatsRow({ stats }: Props) {
  return (
    <div className={styles.grid}>
      <StatCard label="Games" value={stats.count.toString()} sub="logged" />
      <StatCard label="Median" value={formatScore(stats.median)} sub="middle score" />
      <StatCard label="Average" value={formatScore(stats.average)} sub="per game" />
      <StatCard label="Your Floor" value={formatScore(stats.floor)} sub="bottom 25% avg" highlight />
      <StatCard label="High Score" value={formatScore(stats.high)} sub="all time" />
    </div>
  );
}