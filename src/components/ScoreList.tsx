// ScoreList.tsx
// shows all games for the active machine, newest first

import { useState } from 'react';
import type { MachineStats } from '../types';
import type { DisplayScoreEntry, DisplayScoreId } from '../utils/display';
import styles from '../styles/ScoreList.module.css';

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
  return (
    <div className={`${styles.row} ${isHigh ? styles.rowHigh : ''}`}>
      <div className={`${styles.score} ${isHigh ? styles.scoreHigh : ''}`}>{entry.formattedScore}</div>
      <div className={styles.date}>{entry.formattedDate}</div>
      {isHigh && <div className={`${styles.badge} ${styles.badgeHigh}`}>★ best</div>}
      {isLow && !isHigh && <div className={`${styles.badge} ${styles.badgeLow}`}>↓ low</div>}
      <button className={styles.removeBtn} onClick={() => onRemove(entry.id)}>×</button>
    </div>
  );
}

export default function ScoreList({ scores, stats, onRemove }: Props) {

  const [page, setPage] = useState<number>(0);

  if (scores.length === 0) {
    return <div className={styles.empty}>nothing logged yet</div>;
  }

  const sorted = [...scores].sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  );

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className={styles.section}>
      <div className={styles.label}>all games</div>
      <div className={styles.rows}>
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
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className={`${styles.pageBtn} ${page === 0 ? styles.pageBtnDisabled : ''}`}
          >
            ←
          </button>
          <div className={styles.pageIndicator}>{page + 1} / {totalPages}</div>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            className={`${styles.pageBtn} ${page === totalPages - 1 ? styles.pageBtnDisabled : ''}`}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
