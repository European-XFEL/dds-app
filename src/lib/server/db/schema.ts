import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const moleculeTable = sqliteTable('molecules', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  filename: text('filename').notNull(),
  name: text('name').notNull(),
  contents: text('contents').notNull(),
});

export const solventTable = sqliteTable('solvents', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  filename: text('filename').notNull(),
  name: text('name').notNull(),
  contents: text('contents').notNull(),
});
