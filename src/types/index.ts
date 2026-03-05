export interface ScoreEntry{
    id: number;
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
}

export interface Machine {
    id: number;
    name: string;
}
export type ScoreMap = Record<number, ScoreEntry[]>;

