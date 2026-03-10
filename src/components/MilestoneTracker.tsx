// MilestoneTracker.tsx
// shows which score milestones have been hit and how many times

import type { MachineStats } from '../types';
import { formatScore } from '../utils/format';
import { MILESTONES } from '../data/constants';
import styles from '../styles/MilestoneTracker.module.css';

interface Props {
  stats: MachineStats;
}

export default function MilestoneTracker({ stats }: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.label}>milestones</div>
      <div className={styles.badges}>
        {MILESTONES.map((m) => {
          const count = stats.milestoneHits[m];
          const hit = count > 0;
          return (
            <div key={m} className={`${styles.badge} ${hit ? styles.badgeHit : ''}`}>
              {formatScore(m)} {hit ? `×${count}` : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}