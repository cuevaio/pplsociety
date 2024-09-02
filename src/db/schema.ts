import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const id8 = varchar('id', { length: 8 }).primaryKey();
const userId = varchar('id', { length: 27 });

export const muscles = pgTable('muscles', {
  id: id8,

  name: varchar('name', { length: 255 }),

  imageUrl: varchar('image_url', { length: 255 }),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),

  createdBy: userId,
});

export const exercise = pgTable('exercises', {
  id: varchar('id', { length: 8 }).primaryKey(),

  name: varchar('name', { length: 255 }),
  videoUrl: varchar('video_url', { length: 255 }),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
});

export const routine = pgTable('routines', {
  id: varchar('id', { length: 8 }).primaryKey(),

  name: varchar('name', { length: 128 }),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
});

export const workload = pgTable('workload', {
  id: varchar('id', { length: 8 }).primaryKey(),

  suggestedOrder: smallint('suggested_order'),

  exercise: varchar('id', { length: 8 })
    .references(() => exercise.id)
    .notNull(),
  firstReplacementOption: varchar('id', { length: 8 }).references(
    () => exercise.id,
  ),
  secondReplacementOption: varchar('id', { length: 8 }).references(
    () => exercise.id,
  ),

  notes: varchar('notes', { length: 255 }),

  minRestMinutes: smallint('min_rest_minutes'),
  maxRestMinutes: smallint('max_rest_minutes'),

  minRPE: smallint('min_rpe'),
  maxRPE: smallint('max_rpe'),

  minWarmUpSets: smallint('min_warm_up_sets'),
  maxWarmUpSets: smallint('max_warm_up_sets'),

  workingSets: smallint('working_sets'),

  minReps: smallint('min_reps'),
  maxReps: smallint('max_reps'),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
});
