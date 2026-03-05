import { ScoreEntry, MachineStats } from "../types";
import { MILESTONES } from "../data/constants";

export function sum(values: number[]): number {
    return values.reduce((a, b) => a + b, 0);
}

export function average(values: number[]): number {
    return Math.round(sum(values) / values.length);
}

export function median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? Math.round((sorted[mid-1] + sorted[mid])/2)
        : sorted[mid];
}

export function floor(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const bottom = sorted.slice(0, Math.max(0, sorted.length - Math.floor(sorted.length * 0.1)));
    return average(bottom);
}

export function sortByDate(scores: ScoreEntry[]): ScoreEntry[] {
  return [...scores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function trend(scores:ScoreEntry[]): number {
    const chronological = sortByDate(scores).map(s => s.score);
    const recent = chronological.slice(-5);
    const prev = chronological.slice(-10, -5);
    return Math.round(average(recent) - (prev.length > 0 ? average(prev) : average(recent)));
}

export function milestoneHits(values: number[]): Record<number, number> {
  const hits: Record<number, number> = {};
  MILESTONES.forEach((m) => {
    hits[m] = values.filter((v) => v >= m).length;
  });
  return hits;
}

export function rollingAverage(scores: ScoreEntry[], window: number = 5): number[] {
  return sortByDate(scores).map((_, i, arr) => {
    const slice = arr.slice(Math.max(0, i - window + 1), i + 1);
    return average(slice.map((s) => s.score));
  });
}

export function calculateStats(scores: ScoreEntry[]): MachineStats | null {
  if (scores.length === 0) return null;
  const values = scores.map((s) => s.score);
  return {
    count: values.length,
    average: average(values),
    median: median(values),
    high: Math.max(...values),
    low: Math.min(...values),
    floor: floor(values),
    trend: trend(scores),
    milestoneHits: milestoneHits(values),
  };
}