import type { Machine } from '../types';

interface Props {
  machines: Machine[];
  activeMachine: Machine;
  onSelect: (machine: Machine) => void;
}

export default function MachineSwitcher({ machines, activeMachine, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
      {machines.map((machine) => (
        <button
          key={machine.id}
          onClick={() => onSelect(machine)}
          style={{
            background: activeMachine.id === machine.id
              ? 'rgba(240,200,74,0.18)'
              : 'rgba(255,255,255,0.04)',
            border: activeMachine.id === machine.id
              ? '1px solid rgba(240,200,74,0.6)'
              : '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '9px 22px',
            color: activeMachine.id === machine.id ? '#f0c84a' : '#806030',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
            transition: 'all 0.2s',
          }}
        >
          {machine.name}
        </button>
      ))}
    </div>
  );
}