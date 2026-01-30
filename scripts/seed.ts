/// <reference lib="deno.ns" />
import solvents_data from '../data/solvents.json' with { type: 'json' };
import '@std/dotenv/load';
import * as path from '@std/path';
import { drizzle } from 'drizzle-orm/postgres-js';
import Papa from 'papaparse';

import process from 'node:process';

import { relations } from '$lib/server/db/relations.ts';
import * as schema from '$lib/server/db/schema.ts';
import { sha256HexFromText } from '$lib/server/db/util.ts';

const env = Deno.env.toObject();

const DB_USER = env['DB_USER'];
const DB_PASSWORD = env['DB_PASSWORD'];
const DB_HOST = env['DB_HOST'];
const DB_NAME = env['DB_NAME'];

if (!DB_USER || !DB_PASSWORD) {
  throw new Error(
    'Missing DB credentials: set DB_USER and DB_PASSWORD environment variables',
  );
}

if (!DB_HOST || !DB_NAME) {
  throw new Error(
    'Missing DB host info: set DB_HOST and DB_NAME environment variables',
  );
}

const DATABASE_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

console.log('Connecting to db with', { DB_USER, DB_HOST, DB_NAME });

const db = drizzle(DATABASE_URL, { schema, relations });

/**
 * Bootstrap the database with initial molecule and solvent data from files.
 * Uses onConflictDoNothing to safely handle duplicate entries.
 */
export async function bootstrap(
  molecules_dir = './data/molecules',
  solvents_dir = './data/solvents',
) {
  await Promise.all([seedMolecules(molecules_dir), seedSolvents(solvents_dir)]);
}

const moleculeFilenameRegex = /^(.*)-(\d+)\.xyz$/;

const urlRegex = /(https?:\/\/[^\s]+)/g;

/**
 * Seed molecules from .xyz files in the specified directory.
 * Each file is stored in the molecules table with its id as the sha256 hash of its contents.
 */
async function seedMolecules(directory: string) {
  const moleculeDirs: { [key: string]: string[] } = {};

  for await (const entry of Deno.readDir(directory)) {
    if (entry.isDirectory) {
      const subdir = path.join(directory, entry.name);
      moleculeDirs[entry.name] = [];

      for await (const subentry of Deno.readDir(subdir)) {
        if (subentry.isFile && subentry.name.endsWith('.xyz')) {
          moleculeDirs[entry.name].push(path.join(entry.name, subentry.name));
        }
      }
    }
  }

  await Promise.all(
    Object.values(moleculeDirs)
      .flat()
      .map(async (fileSubPath) => {
        const filePath = path.join(directory, fileSubPath);
        const moleculeName = path.dirname(fileSubPath);

        // get state and original filename from `${filename}-${state}.xyz` w/ regex
        const { filename, state } = (() => {
          const baseName = path.basename(fileSubPath);
          const match = baseName.match(moleculeFilenameRegex);
          if (match) {
            return {
              filename: match[1] + '.xyz',
              state: parseInt(match[2], 10),
            };
          } else {
            return { filename: baseName, state: 0 };
          }
        })();

        const contents = await Deno.readTextFile(filePath);
        const contentsLines = contents.split('\n');

        const sha = await sha256HexFromText(contents);

        const atomCount = Number(contentsLines[0]);
        const description = (contentsLines[1] || '').replace(/^#\s*/, '');

        // References are urls in the description, extract if present
        const reference = (() => {
          const urls = description.match(urlRegex);
          return urls ? urls[0] : null;
        })();

        console.log(`${moleculeName} - ${filename} (state: ${state})`);

        await db
          .insert(schema.moleculeFiles)
          .values({
            moleculeName,
            atomCount,
            description,
            reference,
            state,
            filename,
            contents,
            sha,
          })
          .onConflictDoUpdate({
            target: schema.moleculeFiles.sha,
            set: {
              moleculeName,
              atomCount,
              description,
              reference,
              state,
              filename,
            },
          });
      }),
  );
}

type SolventDifferentials = {
  Q: number;
  dSdT: number;
  dSdRho: number;
};

const solvent_name_map: { [key: string]: string } = {
  MeCN: 'Acetonitrile',
  CCl4: 'Carbon tetrachloride',
  CHCl3: 'Chloroform',
  Cyclohexane: 'Cyclohexane',
  CH2Cl2: 'Dichloromethane',
  EtOH: 'Ethanol',
  MeOH: 'Methanol',
  'KMnO4-H2O': 'Water (w/ Potassium permanganate)',
};

/**
 * Seed solvents from .txt files in the specified directory.
 * Only non-error files are processed (files ending in -error.txt are skipped).
 */
async function seedSolvents(directory: string) {
  const solventFiles: string[] = [];

  for await (const entry of Deno.readDir(directory)) {
    if (
      entry.isFile &&
      entry.name.endsWith('.txt') &&
      !entry.name.endsWith('-error.txt')
    ) {
      solventFiles.push(entry.name);
    }
  }

  // Read all files and start chemical queries in parallel
  const solventDataPromises = solventFiles.map(async (filename) => {
    const filePath = path.join(directory, filename);
    const contents = await Deno.readTextFile(filePath);
    const fileName = path.parse(filename).name;
    const name = solvent_name_map[fileName] || fileName;
    const sha = await sha256HexFromText(contents);

    let rhom = undefined;
    let cpm = undefined;

    const contentsCsv = 'Q\tdSdT\tdSdRho\n' + contents.replaceAll(/#.*\n/g, '');
    const parsed = Papa.parse<SolventDifferentials>(contentsCsv, {
      delimiter: '\t',
      dynamicTyping: false,
      header: true,
      skipEmptyLines: true,
    });

    const { data } = parsed;

    const q = new Float64Array(data.map((row) => row.Q));

    const qMin = Math.min(...q);
    const qMax = Math.max(...q);
    const qSteps = q
      .map((val, idx, arr) => (idx === 0 ? 0 : val - arr[idx - 1]))
      .slice(1);
    const qStep = qSteps.length ? Math.min(...qSteps) : 0;

    const saved_solvent_data = solvents_data.find(
      (solvent) => solvent.filename === filename,
    );
    if (saved_solvent_data) {
      rhom = parseFloat(saved_solvent_data.rhom);
      cpm = parseFloat(saved_solvent_data.cpm);
    } else {
      const queryChemicalPyodide = await import('$lib/server/thermo.ts').then(
        (mod) => mod.queryChemicalPyodide,
      );
      const chemPromise = queryChemicalPyodide(name);
      [rhom, cpm] = await chemPromise;
    }

    return {
      name,
      filename,
      contents,
      sha,
      rhom,
      cpm,
      qMin,
      qMax,
      qStep,
    };
  });

  // Wait for all file processing to complete
  const solventData = await Promise.all(solventDataPromises);

  // Insert all solvents in parallel
  await Promise.all(
    solventData.map(async (values) => {
      console.log(
        `Seeding solvent: ${values.name} with rhom: ${values.rhom}, cpm: ${values.cpm}, q: [${values.qMin}, ${values.qMax}] step: ${values.qStep}`,
      );

      await db
        .insert(schema.solvents)
        .values(values)
        .onConflictDoUpdate({ target: schema.solvents.name, set: values });
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
