import { init } from '@paralleldrive/cuid2';
import { getTableColumns } from 'drizzle-orm';
import {
  char,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

const uIdLength = 24;

const createId = init({ length: uIdLength });

const timestamps = {
  createdAt: timestamp({ mode: 'date', precision: 3 })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
};

const fileData = {
  filename: text('filename').notNull(),
  contents: text('contents').notNull(),
  sha: char({ length: 64 }).unique().notNull(),
};

const qRange = {
  qMin: numeric({ mode: 'number' }).notNull(),
  qMax: numeric({ mode: 'number' }).notNull(),
  qStep: numeric({ mode: 'number' }).notNull(),
};

export const molecules = pgTable('molecules', {
  id: char({ length: uIdLength })
    .primaryKey()
    .unique()
    .$defaultFn(() => createId()),
  name: text().unique().notNull(),
  ...fileData,
  ...timestamps,
});

const { contents: _m_contents, ...moleculesInfo } = getTableColumns(molecules);

export { moleculesInfo };

export const intensities = pgTable(
  'intensities',
  {
    moleculeId: char({ length: uIdLength })
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
    id: char({ length: uIdLength })
      .primaryKey()
      .unique()
      .$defaultFn(() => createId()),
    name: text().unique().notNull(),
    rhom: numeric({ mode: 'number' }).notNull(),
    cpm: numeric({ mode: 'number' }).notNull(),
    ...fileData,
    ...timestamps,
    ...qRange,
  },
  (table) => ({
    shaUnique: unique().on(table.sha),
  }),
);

const { contents: _s_contents, ...solventsInfo } = getTableColumns(solvents);

export { solventsInfo };
