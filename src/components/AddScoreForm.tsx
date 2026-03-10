import { useState } from 'react';
import type { Machine } from '../types';
import type { DisplayScoreEntry } from '../utils/display';
import { toDisplayScoreId } from '../utils/display';
import { formatScore, formatDate } from '../utils/format';
import styles from '../styles/AddScoreForm.module.css';

function getLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface Props {
  activeMachine: Machine;
  onAdd: (entry: DisplayScoreEntry) => void;
}

export default function AddScoreForm({ activeMachine, onAdd }: Props) {
  const [score, setScore] = useState<string>('');
  const [date, setDate] = useState<string>(getLocalDate());
  const [error, setError] = useState<string>('');
  const [added, setAdded] = useState<boolean>(false);

  function handleSubmit() {
    const parsed = parseInt(score.replace(/[^0-9]/g, ''));
    if (!parsed || parsed < 1000) {
      setError('Enter a score above 1,000');
      return;
    }

    const entry: DisplayScoreEntry = {
      id: toDisplayScoreId(''),
      formattedScore: formatScore(parsed),
      formattedDate: formatDate(date),
      rawScore: parsed,
      rawDate: date,
      machineName: activeMachine.name,
    };

    onAdd(entry);
    setScore('');
    setError('');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className={styles.section}>
      <div className={styles.label}>Log a Game</div>
      <div className={styles.row}>
        <input
          type="text"
          value={score}
          onChange={(e) => { setScore(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Score (e.g. 245000)"
          className={styles.input}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={styles.dateInput}
        />
        <button
          onClick={handleSubmit}
          className={`${styles.submitBtn} ${added ? styles.submitBtnAdded : ''}`}
        >
          {added ? '✓ Logged!' : 'Log Score'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
