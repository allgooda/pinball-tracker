export interface ScoreEntry{
    id: ScoreId;
    score: number;
    date: string;
    machine: Machine;
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
    id: MachineId;
    name: string;
    stats: MachineStats | null;
}
export type ScoreMap = Record<number, ScoreEntry[]>;

export type MachineId = number & { readonly __brand: 'MachineId' };
export type ScoreId = number & { readonly __brand: 'ScoreId' };

// helper functions to create branded ids
export function toMachineId(id: number): MachineId {
  return id as MachineId;
}

export function toScoreId(id: number): ScoreId {
  return id as ScoreId;
}