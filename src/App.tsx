import { useState } from 'react';
import type { Machine } from './types';
import MachineSwitcher from './components/MachineSwitch';

const initialMachines: Machine[] = [
  { id: 1, name: 'Black Hole' },
  { id: 2, name: "Hotdoggin'" },
];

export default function App() {
  const [machines] = useState<Machine[]>(initialMachines);
  const [activeMachine, setActiveMachine] = useState<Machine>(initialMachines[0]);

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh', padding: 32 }}>
      <h1 style={{ color: '#f0c84a', fontFamily: 'Georgia, serif' }}>
        Pinball Tracker
      </h1>
      <MachineSwitcher
        machines={machines}
        activeMachine={activeMachine}
        onSelect={setActiveMachine}
      />
      <p style={{ color: '#a08040', fontFamily: 'Georgia, serif', marginTop: 24 }}>
        Active machine: {activeMachine.name}
      </p>
    </div>
  );
}