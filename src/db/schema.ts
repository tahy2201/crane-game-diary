import { pgTable, text, integer, timestamp, uuid, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const plays = pgTable(
  'plays',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    memo: text('memo'),
    spent: integer('spent').notNull(),
    result: text('result').notNull(),
    played_at: timestamp('played_at', { withTimezone: true }).notNull().defaultNow(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check('result_check', sql`${table.result} IN ('got', 'failed')`)],
);
