// stats.ts
// computes machine statistics from raw score rows

import type { ScoreRow, MachineStats } from './types';

const MILESTONES = [100000, 200000, 300000, 500000, 750000, 1000000];

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

function average(values: number[]): number {
  return Math.round(sum(values) / values.length);
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function floor(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const bottomCount = Math.max(1, Math.ceil(values.length * 0.25));
  return average(sorted.slice(0, bottomCount));
}

function sortByDate(scores: ScoreRow[]): ScoreRow[] {
  return [...scores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

function trend(scores: ScoreRow[]): number {
  const chronological = sortByDate(scores).map(s => s.score);
  const recent = chronological.slice(-5);
  const prev = chronological.slice(-10, -5);
  return Math.round(average(recent) - (prev.length > 0 ? average(prev) : average(recent)));
}

function milestoneHits(values: number[]): Record<number, number> {
  const hits: Record<number, number> = {};
  MILESTONES.forEach(m => {
    hits[m] = values.filter(v => v >= m).length;
  });
  return hits;
}

function rollingAverage(scores: ScoreRow[], window: number = 5): number[] {
  return sortByDate(scores).map((_, i, arr) => {
    const slice = arr.slice(Math.max(0, i - window + 1), i + 1);
    return average(slice.map(s => s.score));
  });
}

function dailyFloor(scores: ScoreRow[]): { date: string; floor: number }[] {
  const chronological = sortByDate(scores);
  const dates = [...new Set(chronological.map(s => s.date))];
  return dates.map(date => {
    const upToDate = chronological.filter(s => s.date <= date);
    return { date, floor: floor(upToDate.map(s => s.score)) };
  });
}

export function calculateStats(scores: ScoreRow[]): MachineStats | null {
  if (scores.length === 0) return null;
  const values = scores.map(s => s.score);
  return {
    count: values.length,
    average: average(values),
    median: median(values),
    high: Math.max(...values),
    low: Math.min(...values),
    floor: floor(values),
    trend: trend(scores),
    milestoneHits: milestoneHits(values),
    rollingAverage: rollingAverage(scores),
    dailyFloor: dailyFloor(scores),
  };
}
