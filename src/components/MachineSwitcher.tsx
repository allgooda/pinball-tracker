// MachineSwitcher.tsx

import { useState } from 'react';
import type { Machine } from '../types';
import styles from '../styles/MachineSwitcher.module.css';

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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>delete {machine.name}?</div>
        <div className={styles.modalSubtitle}>this will permanently delete the machine and all its scores.</div>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.confirmBtn}>delete</button>
          <button onClick={onCancel} className={styles.cancelBtn}>cancel</button>
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
      <div className={styles.switcher}>
        {machines.map((machine) => {
          const isActive = activeMachine?.id === machine.id;
          return (
            <div key={machine.id} className={`${styles.machine} ${isActive ? styles.machineActive : ''}`}>
              <button
                onClick={() => onSelect(machine)}
                className={`${styles.selectBtn} ${isActive ? styles.selectBtnActive : ''}`}
              >
                {machine.name}
              </button>
              <button onClick={() => handleDeleteClick(machine)} className={styles.deleteBtn}>×</button>
            </div>
          );
        })}
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
