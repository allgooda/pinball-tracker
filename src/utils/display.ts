// display.ts
// converts raw data types into display-ready types with formatting applied

import type { ScoreEntry, ScoreId } from '../types';
import { formatScore, formatDate } from './format';

export interface DisplayScoreEntry {
  id: ScoreId;
  formattedScore: string;
  formattedDate: string;
  rawScore: number;
  rawDate: string;
  machineName: string;
}

export function toDisplayScoreEntry(entry: ScoreEntry): DisplayScoreEntry {
  return {
    id: entry.id,
    formattedScore: formatScore(entry.score),
    formattedDate: formatDate(entry.date),
    rawScore: entry.score,
    rawDate: entry.date,
    machineName: entry.machine.name,
  };
}

export function toDisplayScoreEntries(entries: ScoreEntry[]): DisplayScoreEntry[] {
  return entries.map(toDisplayScoreEntry);
}