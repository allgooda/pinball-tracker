// AddMachineForm.tsx
// form for adding a new pinball machine

import { useState } from 'react';
import type { Machine } from '../types';

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

    // optimistically create the machine and pass it up
    // the parent will handle the actual API call
    onAdd({ id: 0 as any, name: name.trim() });
    setName('');
    setError('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none',
          border: '1px dashed rgba(192,160,96,0.3)',
          borderRadius: 6,
          padding: '9px 22px',
          color: '#806030',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'Georgia, serif',
          letterSpacing: 1,
          transition: 'all 0.2s',
        }}
      >
        + add machine
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>

      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => { setName(e.target.value); setError(''); }}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="machine name"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(192,160,96,0.3)',
          borderRadius: 6,
          padding: '9px 14px',
          color: '#e8d5a0',
          fontSize: 14,
          fontFamily: 'Georgia, serif',
          outline: 'none',
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          background: 'rgba(192,160,96,0.2)',
          border: '1px solid rgba(192,160,96,0.5)',
          borderRadius: 6,
          padding: '9px 22px',
          color: '#f0c84a',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'Georgia, serif',
          letterSpacing: 1,
        }}
      >
        add
      </button>

      <button
        onClick={() => { setOpen(false); setError(''); setName(''); }}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 6,
          padding: '9px 14px',
          color: '#604820',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'Georgia, serif',
        }}
      >
        cancel
      </button>

      {error && (
        <div style={{ color: '#d06040', fontSize: 12, marginTop: 6 }}>
          {error}
        </div>
      )}

    </div>
  );
}