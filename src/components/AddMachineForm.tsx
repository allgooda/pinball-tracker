// AddMachineForm.tsx
// form for adding a new pinball machine

import { useState } from 'react';
import type { Machine } from '../types';
import styles from '../styles/AddMachineForm.module.css';

interface Props {
  onAdd: (machine: Machine) => void;
}

export default function AddMachineForm({ onAdd }: Props) {

  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  function handleSubmit() {
    if (!name.trim()) {
      setError('enter a machine name');
      return;
    }

    onAdd({ id: 0 as any, name: name.trim(), stats: null });
    setName('');
    setError('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button className={styles.addBtn} onClick={() => setOpen(true)}>
        + add machine
      </button>
    );
  }

  return (
    <div className={styles.row}>
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => { setName(e.target.value); setError(''); }}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="machine name"
        className={styles.input}
      />
      <button onClick={handleSubmit} className={styles.submitBtn}>add</button>
      <button onClick={() => { setOpen(false); setError(''); setName(''); }} className={styles.cancelBtn}>cancel</button>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}