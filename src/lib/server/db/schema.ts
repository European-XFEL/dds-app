import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const moleculeTable = sqliteTable('molecules', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  content: text('content').notNull(),
});

export const solventTable = sqliteTable('solvents', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  content: text('content').notNull(),
});
