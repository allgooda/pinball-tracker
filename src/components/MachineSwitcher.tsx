// MachineSwitcher.tsx

import type { Machine } from '../types';

interface Props {
  machines: Machine[];
  activeMachine: Machine;
  onSelect: (machine: Machine) => void;
  onDelete: (machine: Machine) => void;
}

export default function MachineSwitcher({ machines, activeMachine, onSelect, onDelete }: Props) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {machines.map((machine) => (
        <div
          key={machine.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: activeMachine.id === machine.id
              ? 'rgba(240,200,74,0.18)'
              : 'rgba(255,255,255,0.04)',
            border: activeMachine.id === machine.id
              ? '1px solid rgba(240,200,74,0.6)'
              : '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => onSelect(machine)}
            style={{
              background: 'none',
              border: 'none',
              padding: '9px 16px',
              color: activeMachine.id === machine.id ? '#f0c84a' : '#806030',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              letterSpacing: 1,
            }}
          >
            {machine.name}
          </button>
          <button
            onClick={() => onDelete(machine)}
            style={{
              background: 'none',
              border: 'none',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              padding: '9px 10px',
              color: '#503020',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}