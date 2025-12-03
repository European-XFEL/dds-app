import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { char, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const fileTable = pgTable('files', {
  id: char({ length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  filename: text().unique().notNull(),
  contents: text().notNull(),
  createdAt: timestamp({ mode: 'date', precision: 3 })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const moleculeTable = pgTable('molecules', {
  id: char({ length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text().unique().notNull(),
  fileId: char('fileId', { length: 32 })
    .references(() => fileTable.id)
    .notNull(),
});

export const solventTable = pgTable('solvents', {
  id: char({ length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text().unique().notNull(),
  fileId: char('fileId', { length: 32 })
    .references(() => fileTable.id)
    .notNull(),
});

export const moleculeFileRelations = relations(moleculeTable, ({ one }) => ({
  fileTable: one(fileTable, {
    fields: [moleculeTable.fileId],
    references: [fileTable.id],
  }),
}));

export const solventFileRelations = relations(solventTable, ({ one }) => ({
  fileTable: one(fileTable, {
    fields: [solventTable.fileId],
    references: [fileTable.id],
  }),
}));

export const sampleTable = pgTable('samples', {
  id: char({ length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text().notNull(),
  groundId: char('groundId', { length: 32 })
    .references(() => moleculeTable.id)
    .notNull(),
  excitedId: char('excitedId', { length: 32 })
    .references(() => moleculeTable.id)
    .notNull(),
  solventId: char('solventId', { length: 32 })
    .references(() => solventTable.id)
    .notNull(),
});

export const sampleRelations = relations(sampleTable, ({ one }) => ({
  ground: one(moleculeTable, {
    fields: [sampleTable.groundId],
    references: [moleculeTable.id],
  }),
  excited: one(moleculeTable, {
    fields: [sampleTable.excitedId],
    references: [moleculeTable.id],
  }),
  solvent: one(solventTable, {
    fields: [sampleTable.solventId],
    references: [solventTable.id],
  }),
}));
