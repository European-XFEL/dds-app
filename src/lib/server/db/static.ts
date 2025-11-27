import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core/table';
import fs from 'fs/promises';

import { env } from '$env/dynamic/private';

import { setup_db } from './';
import * as schema from './schema';

// Dump database contents to disk, directory per table, file per entry, in JSON format
export async function export_data() {
  if (!env.OUT_DIR) throw new Error('OUT_DIR is not set');

  const OUT_DIR = env.OUT_DIR;

  const db = await setup_db();

  // Create output directory if it doesn't exist
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Define schema directory pairs
  let schema_file_pairs: [SQLiteTableWithColumns<any>, string][] = [
    [schema.moleculeTable, 'molecules'],
    [schema.solventTable, 'solvents'],
  ];

  for (const [table, dir] of schema_file_pairs) {
    const table_dir = `${OUT_DIR}/${dir}`;
    await fs.mkdir(table_dir, { recursive: true });

    const rows = await db.select().from(table);
    for (const row of rows) {
      const file_path = `${table_dir}/${row.id}.json`;
      await fs.writeFile(file_path, JSON.stringify(row, null, 2), 'utf-8');
    }
  }
}
