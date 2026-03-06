// MachineSwitcher.tsx

import { useState } from 'react';
import type { Machine } from '../types';

interface Props {
  machines: Machine[];
  activeMachine: Machine | null;
  onSelect: (machine: Machine) => void;
  onDelete: (machine: Machine) => void;
}

interface ConfirmModalProps {
  machine: Machine;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ machine, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: '#1a1005',
        border: '1px solid rgba(192,160,96,0.3)',
        borderRadius: 8,
        padding: '28px 32px',
        maxWidth: 340,
        fontFamily: 'Georgia, serif',
      }}>

        <div style={{ color: '#e8d5a0', fontSize: 16, marginBottom: 8 }}>
          delete {machine.name}?
        </div>

        <div style={{ color: '#604820', fontSize: 12, marginBottom: 24 }}>
          this will permanently delete the machine and all its scores.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onConfirm}
            style={{
              background: 'rgba(180,60,40,0.2)',
              border: '1px solid rgba(180,60,40,0.5)',
              borderRadius: 6,
              padding: '8px 20px',
              color: '#d08060',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
            }}
          >
            delete
          </button>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              padding: '8px 20px',
              color: '#806030',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
            }}
          >
            cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default function MachineSwitcher({ machines, activeMachine, onSelect, onDelete }: Props) {

  const [pendingDelete, setPendingDelete] = useState<Machine | null>(null);

  function handleDeleteClick(machine: Machine) {
    setPendingDelete(machine);
  }

  function handleConfirm() {
    if (pendingDelete) {
      onDelete(pendingDelete);
      setPendingDelete(null);
    }
  }

  function handleCancel() {
    setPendingDelete(null);
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 10 }}>
        {machines.map((machine) => (
          <div
            key={machine.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: activeMachine?.id === machine.id
                ? 'rgba(240,200,74,0.18)'
                : 'rgba(255,255,255,0.04)',
              border: activeMachine?.id === machine.id
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
                color: activeMachine?.id === machine.id ? '#f0c84a' : '#806030',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                letterSpacing: 1,
              }}
            >
              {machine.name}
            </button>
            <button
              onClick={() => handleDeleteClick(machine)}
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

      {pendingDelete && (
        <ConfirmModal
          machine={pendingDelete}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}