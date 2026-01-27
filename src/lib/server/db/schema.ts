import { createId } from '@paralleldrive/cuid2';
import { getTableColumns } from 'drizzle-orm';
import {
  char,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp({ mode: 'date', precision: 3 })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() =>
    new Date()
  ),
};

const fileData = {
  filename: text('filename').notNull(),
  contents: text('contents').notNull(),
};

const qRange = {
  qMin: numeric({ mode: 'number' }).notNull(),
  qMax: numeric({ mode: 'number' }).notNull(),
  qStep: numeric({ mode: 'number' }).notNull(),
};

export const molecules = pgTable('molecules', {
  id: char({ length: 64 }).primaryKey().notNull(),
  name: text().unique().notNull(),
  ...fileData,
  ...timestamps,
});

const { contents: _m_contents, ...moleculesInfo } = getTableColumns(molecules);

export { moleculesInfo };

export const intensities = pgTable(
  'intensities',
  {
    moleculeId: char({ length: 64 })
      .references(() => molecules.id)
      .notNull(),
    ...qRange,
    q: numeric().array(),
    intensity: numeric().array(),
    ...timestamps,
  },
  (table) => ({
    pk: [table.moleculeId, table.qMin, table.qMax, table.qStep],
  }),
);

export const solvents = pgTable(
  'solvents',
  {
    id: char({ length: 32 })
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text().unique().notNull(),
    rhom: numeric({ mode: 'number' }).notNull(),
    cpm: numeric({ mode: 'number' }).notNull(),
    ...fileData,
    ...timestamps,
    ...qRange,
  },
  (table) => ({
    filenameUnique: unique().on(table.filename),
  }),
);

const { contents: _s_contents, ...solventsInfo } = getTableColumns(solvents);

export { solventsInfo };
