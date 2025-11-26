import path from 'path';
import fs from 'fs/promises';

import { env } from '$env/dynamic/private';

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as schema from './schema';
import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core/table';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: env.DATABASE_URL });

export const db = drizzle(client, { schema });

/**
 * Bootstrap function that inserts example data into the table.
 *
 * The IDs for example data are hardcoded to `example-{filename}` so that this function can be
 * re-run without creating duplicate entries, instead it will just overwrite existing example entries.
 */
async function bootstrap_examples(
	example_molecules_dir = './src/lib/server/db/examples/molecules',
	example_solvents_dir = './src/lib/server/db/examples/solvents'
) {
	// Define schema directory pairs
	let schema_file_pairs: [SQLiteTableWithColumns<any>, string, string[]][] = [
		[schema.moleculeTable, example_molecules_dir, await fs.readdir(example_molecules_dir)],
		[
			schema.solventTable,
			example_solvents_dir,
			await fs
				.readdir(example_solvents_dir)
				.then((files) => files.filter((f) => !f.endsWith('-error.txt')))
		]
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
					content: content
				})
				.onConflictDoUpdate({
					target: table.id,
					set: {
						name: name,
						content: content
					}
				});
		}
	}
}

export { bootstrap_examples as bootstrap };
