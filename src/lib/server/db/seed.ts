import { PGlite } from '@electric-sql/pglite';
import dotenv from 'dotenv';
import { PgliteDatabase } from 'drizzle-orm/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import fs from 'fs/promises';
import path from 'path';
import { env } from 'process';

import * as schema from './schema';
import { fileTable, moleculeTable, solventTable } from './schema';

dotenv.config();

type Database = PgliteDatabase<typeof schema>;

/**
 * Bootstrap the database with initial molecule and solvent data from files.
 * Uses onConflictDoNothing to safely handle duplicate entries.
 */
export async function bootstrap(
  molecules_dir = './src/data/molecules',
  solvents_dir = './src/data/solvents',
) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

  const client = new PGlite(env.DATABASE_URL);
  const db = drizzle({ client, schema });

  // Run molecule and solvent seeding in parallel
  await Promise.all([seedMolecules(db, molecules_dir), seedSolvents(db, solvents_dir)]);
}

/**
 * Seed molecules from .xyz files in the specified directory.
 * Each file is stored in the files table and linked to a molecule entry.
 */
async function seedMolecules(db: Database, directory: string) {
  const files = await fs.readdir(directory);
  const xyzFiles = files.filter((file) => file.endsWith('.xyz'));

  // Read all files in parallel
  const moleculeData = await Promise.all(
    xyzFiles.map(async (filename) => {
    const filePath = path.join(directory, filename);
    const contents = await fs.readFile(filePath, 'utf-8');
    const name = path.basename(filename, '.xyz');
      return { name, filename, contents };
    }),
  );

  // Insert all molecules in parallel
  await Promise.all(
    moleculeData.map(async ({ name, filename, contents }) => {
      console.log(`Seeding molecule: ${name} from file: ${filename}`);
      await db
        .insert(molecules)
        .values({ name, filename, contents })
        .onConflictDoNothing({ target: molecules.name });
    }),
  );
  }
}

/**
 * Seed solvents from .txt files in the specified directory.
 * Only non-error files are processed (files ending in -error.txt are skipped).
 */
async function seedSolvents(db: Database, directory: string) {
  const solvent_name_map: { [key: string]: string } = {
    CCl4: 'carbon tetrachloride',
    CH2Cl2: 'dichloromethane',
    CHCl3: 'chloroform',
    Cyclohexane: 'cyclohexane',
    EtOH: 'ethanol',
    'KMnO4-H2O': 'aqueous potassium permanganate',
    MeOH: 'methanol',
    MeCN: 'acetonitrile',
  };
  const files = await fs.readdir(directory);
  const solventFiles = files.filter(
    (file) => file.endsWith('.txt') && !file.endsWith('-error.txt'),
  );

  // Read all files and start chemical queries in parallel
  const solventDataPromises = solventFiles.map(async (filename) => {
    const filePath = path.join(directory, filename);
    const contents = await fs.readFile(filePath, 'utf-8');
    const fileName = path.parse(filename).name;
    const name = solvent_name_map[fileName] || fileName;

    // Insert file and get the id
    const [fileRecord] = await db
      .insert(fileTable)
      .values({ filename, contents })
      .onConflictDoNothing()
      .returning({ id: fileTable.id });

  // Wait for all file processing to complete
  const solventData = await Promise.all(solventDataPromises);

  // Insert all solvents in parallel
  await Promise.all(
    solventData.map(async (values) => {
      console.log(
        `Seeding solvent: ${values.name} with rhom: ${values.rhom}, cpm: ${values.cpm}, q: [${values.qMin}, ${values.qMax}] step: ${values.qStep}`,
      );

      await db
        .insert(solvents)
        .values(values)
        .onConflictDoUpdate({ target: solvents.name, set: values });
    }),
  );
}

// Run bootstrap when executed directly
bootstrap()
  .then(() => {
    console.log('Database seeded successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
