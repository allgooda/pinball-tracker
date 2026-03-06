import type { ScoreEntry, MachineStats } from "../types";
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
  const bottomCount = Math.max(1, Math.ceil(values.length * 0.25));
  console.log('floor sorted:', sorted, 'taking bottom:', bottomCount, 'slice:', sorted.slice(0, bottomCount));
  const bottom = sorted.slice(0, bottomCount);
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
  console.log('values:', values, 'floor:', floor(values));
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

export function runningMedian(scores: ScoreEntry[]): number[] {
  const chronological = sortByDate(scores);
  return chronological.map((_, i) => {
    const slice = chronological.slice(0, i + 1).map((s) => s.score);
    return median(slice);
  });
}

export function runningFloor(scores: ScoreEntry[]): number[] {
  const chronological = sortByDate(scores);
  return chronological.map((_, i) => {
    const slice = chronological.slice(0, i + 1).map((s) => s.score);
    console.log('slice:', slice, 'floor:', floor(slice));
    return floor(slice);
  });
}