'use server';

import { createReadStream } from 'fs';

import { parse } from 'csv-parse';

interface WorkoutRow {
  week: number;
  day_id: number;
  day: string;
  mainMuscle: string;
  exercise: string;
  substitutionOption1: string;
  substitutionOption2: string;
  notes: string;
  repsWorkingSet1: number | null;
  minRestMinutes: number;
  maxRestMinutes: number;
  minWarmUpSets: number;
  maxWarmUpSets: number;
  workingSets: number;
  minRPE: number | null;
  maxRPE: number | null;
  repsWorkingSet2: number | null;
  repsWorkingSet3: number | null;
  minReps: number | null;
  maxReps: number | null;
  timeSeconds: number | null;
  amrap: boolean;
  hold: boolean;
}

export async function readWorkoutCsv(filePath: string): Promise<WorkoutRow[]> {
  const records: WorkoutRow[] = [];

  const parser = createReadStream(filePath).pipe(
    parse({
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        if (context.column === 'amrap' || context.column === 'hold') {
          return value.toLowerCase() === 'true';
        }
        if (value === '') {
          return null;
        }
        if (!isNaN(Number(value))) {
          return Number(value);
        }
        return value;
      },
    }),
  );

  for await (const record of parser) {
    records.push(record as WorkoutRow);
  }

  return records;
}
