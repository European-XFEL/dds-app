import { init } from '@paralleldrive/cuid2';
import { eq, getColumns } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import {
  char,
  integer,
  numeric,
  pgTable,
  pgView,
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

export const moleculeFiles = pgTable('moleculeFiles', {
  id: char({ length: uIdLength })
    .primaryKey()
    .unique()
    .$defaultFn(() => createId()),

  moleculeName: text().notNull(),
  atomCount: integer().notNull(),
  description: text().notNull(),
  state: integer().notNull(),
  reference: text(),
  ...fileData,
  ...timestamps,
});

export const moleculesOverride = pgTable('molecules_override', {
  moleculeId: char({ length: uIdLength })
    .primaryKey()
    .references(() => moleculeFiles.id, { onDelete: 'cascade' })
    .notNull(),

  moleculeName: text(),
  description: text(),
  state: integer(),
  reference: text(),
  ...timestamps,
});

export const molecules = pgView('molecules').as((qb) =>
  qb
    .select({
      id: moleculeFiles.id,

      filename: moleculeFiles.filename,
      contents: moleculeFiles.contents,
      sha: moleculeFiles.sha,

      // merged fields
      moleculeName:
        sql<string>`coalesce(${moleculesOverride.moleculeName}, ${moleculeFiles.moleculeName})`.as(
          'moleculeName',
        ),
      description:
        sql<string>`coalesce(${moleculesOverride.description}, ${moleculeFiles.description})`.as(
          'description',
        ),
      state:
        sql<number>`coalesce(${moleculesOverride.state}, ${moleculeFiles.state})`.as(
          'state',
        ),
      reference: sql<
        string | null
      >`coalesce(${moleculesOverride.reference}, ${moleculeFiles.reference})`.as(
        'reference',
      ),

      atomCount: moleculeFiles.atomCount,
      createdAt: moleculeFiles.createdAt,
      updatedAt: sql<Date>`
        greatest(${moleculeFiles.updatedAt}, coalesce(${moleculesOverride.updatedAt}, ${moleculeFiles.updatedAt}))
      `.as('updatedAt'),
    })
    .from(moleculeFiles)
    .leftJoin(
      moleculesOverride,
      eq(moleculesOverride.moleculeId, moleculeFiles.id),
    ),
);

const { contents: _m_contents, ...moleculesInfo } = getColumns(molecules);

export { moleculesInfo };

export const intensities = pgTable(
  'intensities',
  {
    moleculeId: char({ length: uIdLength })
      .references(() => moleculeFiles.id)
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

const { contents: _s_contents, ...solventsInfo } = getColumns(solvents);

export { solventsInfo };
