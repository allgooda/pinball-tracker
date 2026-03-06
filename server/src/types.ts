// types.ts
// server side types for request bodies and database rows

export interface MachineRow {
  id: number;
  name: string;
}

export interface ScoreRow {
  id: number;
  score: number;
  date: string;
  machine_id: number;
}

export interface AddMachineBody {
  name: string;
}

export interface AddScoreBody {
  score: number;
  date: string;
  machineId: number;
}