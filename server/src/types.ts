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

export interface MachineStats {
  count: number;
  average: number;
  median: number;
  high: number;
  low: number;
  floor: number;
  trend: number;
  milestoneHits: Record<number, number>;
  rollingAverage: number[];
  dailyFloor: { date: string; floor: number }[];
}

export interface Machine {
  id: number;
  name: string;
  stats: MachineStats | null;
}