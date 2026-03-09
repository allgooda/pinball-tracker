// display.ts
// converts raw data types into display-ready types with formatting applied

import { toScoreId, type ScoreEntry, type ScoreId } from '../types';
import { formatScore, formatDate } from './format';

export type DisplayScoreId = string & { readonly __brand: 'DisplayScoreId' };

export function toDisplayScoreId(id: string): DisplayScoreId {
  return id as DisplayScoreId;
}

export function fromDisplayScoreId(entry: DisplayScoreId): ScoreId {
  return toScoreId(Number(entry));
}
export interface DisplayScoreEntry {
  id: DisplayScoreId;
  formattedScore: string;
  formattedDate: string;
  rawScore: number;
  rawDate: string;
  machineName: string;
}

export function toDisplayScoreEntry(entry: ScoreEntry): DisplayScoreEntry {
  return {
    id: toDisplayScoreId(String(entry.id)),
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