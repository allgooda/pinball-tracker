export interface ScoreEntry{
    id: number;
    score: number;
    date: string;
    machine: string;
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

export type ScoreMap = Record<string, ScoreEntry[]>;

