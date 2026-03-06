// MilestoneTracker.tsx
// shows which score milestones have been hit and how many times

import type { MachineStats } from '../types';
import { formatScore } from '../utils/format';
import { MILESTONES } from '../data/constants';

interface Props {
  stats: MachineStats;
}

export default function MilestoneTracker({ stats }: Props) {

  return (
    <div style={{ marginTop: 28 }}>

      <div style={{ fontSize: 11, color: '#806030', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
        milestones
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {MILESTONES.map((m) => {

          const count = stats.milestoneHits[m];
          const hit = count > 0;

          return (
            <div
              key={m}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                background: hit ? 'rgba(240,200,74,0.15)' : 'rgba(255,255,255,0.03)',
                border: hit ? '1px solid rgba(240,200,74,0.4)' : '1px solid rgba(255,255,255,0.07)',
                fontSize: 12,
                color: hit ? '#f0c84a' : '#504030',
                letterSpacing: 1,
              }}
            >
              {formatScore(m)} {hit ? `×${count}` : ''}
            </div>
          );
        })}
      </div>

    </div>
  );
}