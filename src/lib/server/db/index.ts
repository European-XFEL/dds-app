import { drizzle } from 'drizzle-orm/libsql/node';
import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core/table';
import fs from 'fs/promises';
import path from 'path';

import { env } from '$env/dynamic/private';

import * as schema from './schema';

export async function setup_db() {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

  const db = drizzle(env.DATABASE_URL, { schema });
  return db;
}

/**
 * Bootstrap function that inserts example data into the table.
 *
 * The IDs for example data are hardcoded to `example-{filename}` so that this function can be
 * re-run without creating duplicate entries, instead it will just overwrite existing example entries.
 */
export async function bootstrap(
  db: ReturnType<typeof drizzle> | null = null,
  example_molecules_dir = './src/lib/server/db/examples/molecules',
  example_solvents_dir = './src/lib/server/db/examples/solvents',
) {
  if (!db) {
    db = await setup_db();
  }

  // Define schema directory pairs
  let schema_file_pairs: [SQLiteTableWithColumns<any>, string, string[]][] = [
    [schema.moleculeTable, example_molecules_dir, await fs.readdir(example_molecules_dir)],
    [
      schema.solventTable,
      example_solvents_dir,
      await fs
        .readdir(example_solvents_dir)
        .then((files) => files.filter((f) => !f.endsWith('-error.txt'))),
    ],
  ];

  for (const [table, root, files] of schema_file_pairs) {
    for (const file of files) {
      console.log(` - ${file}`);
      // Strip file extension for name
      let name = file.replace(/\.[^/.]+$/, '');
      const content = await fs.readFile(path.join(root, file), 'utf-8');
      await db
        .insert(table)
        .values({
          id: `example-${file}`,
          name: name,
          content: content,
        })
        .onConflictDoUpdate({
          target: table.id,
          set: {
            name: name,
            content: content,
          },
        });
    }
  }
}
