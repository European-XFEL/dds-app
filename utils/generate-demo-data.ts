/**
 * Generate static demo data JSON files from the seeded database.
 *
 * This script reads molecule and solvent info from the database and writes
 * JSON files with references to the original data files instead of inline
 * contents. The static source can then resolve contents from these references.
 *
 * Usage: pnpm tsx utils/generate-demo-data.ts
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

import { relations } from '../src/lib/server/db/relations.ts';
import * as schema from '../src/lib/server/db/schema.ts';
import { getDbUrl } from '../src/lib/server/db/url.ts';
import { sha256HexFromText } from '../src/lib/server/db/util.ts';
import { drizzle } from 'drizzle-orm/postgres-js';

const DATABASE_URL = getDbUrl();
console.log('Connecting to database...');

const db = drizzle(DATABASE_URL, { schema, relations });

// Base paths for data files
const MOLECULES_DIR = './data/molecules';
const SOLVENTS_DIR = './data/solvents';
const DEMO_DIR = './data/demo';

interface MoleculeInfoRow {
  id: string;
  filename: string;
  sha: string;
  moleculeName: string;
  description: string;
  state: number;
  reference: string | null;
  atomCount: number;
  createdAt: Date | string;
  updatedAt: Date | string | null;
}

interface SolventInfoRow {
  id: string;
  name: string;
  rhom: number;
  cpm: number;
  filename: string;
  sha: string;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  qMin: number;
  qMax: number;
  qStep: number;
}

interface MoleculeDemoRecord {
  id: string;
  filename: string;
  sha: string;
  moleculeName: string;
  description: string;
  state: number;
  reference: string | null;
  atomCount: number;
  createdAt: string;
  updatedAt: string | null;
  contentsRef: string;
}

interface SolventDemoRecord {
  id: string;
  name: string;
  rhom: number;
  cpm: number;
  filename: string;
  sha: string;
  createdAt: string;
  updatedAt: string | null;
  qMin: number;
  qMax: number;
  qStep: number;
  contentsRef: string;
}

function toDateISOString(
  date: Date | string | null | undefined,
): string | null {
  if (!date) return null;
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString();
}

/**
 * Build a map of sha -> file path for all molecule files.
 */
async function buildMoleculeFileMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  if (!existsSync(MOLECULES_DIR)) {
    console.warn(`Molecules directory not found: ${MOLECULES_DIR}`);
    return map;
  }

  const moleculeNames = readdirSync(MOLECULES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const moleculeName of moleculeNames) {
    const moleculeDir = join(MOLECULES_DIR, moleculeName);
    const files = readdirSync(moleculeDir).filter((f) => f.endsWith('.xyz'));

    for (const file of files) {
      const filePath = join(moleculeDir, file);
      const contents = readFileSync(filePath, 'utf-8');
      const sha = await sha256HexFromText(contents);
      map.set(sha, filePath);
    }
  }

  return map;
}

/**
 * Build a map of sha -> file path for all solvent files.
 */
async function buildSolventFileMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  if (!existsSync(SOLVENTS_DIR)) {
    console.warn(`Solvents directory not found: ${SOLVENTS_DIR}`);
    return map;
  }

  const files = readdirSync(SOLVENTS_DIR).filter(
    (f) => f.endsWith('.txt') && !f.endsWith('-error.txt'),
  );

  for (const file of files) {
    const filePath = join(SOLVENTS_DIR, file);
    const contents = readFileSync(filePath, 'utf-8');
    const sha = await sha256HexFromText(contents);
    map.set(sha, filePath);
  }

  return map;
}

async function generateMolecules(): Promise<MoleculeDemoRecord[]> {
  console.log('Reading molecules from database...');

  // Query molecule info (without contents) from the molecules view
  const molecules = await db
    .select(schema.moleculesInfo)
    .from(schema.molecules);

  console.log(`Found ${molecules.length} molecules`);

  // Build file map for sha matching
  const fileMap = await buildMoleculeFileMap();

  const records: MoleculeDemoRecord[] = [];

  for (const mol of molecules as MoleculeInfoRow[]) {
    const contentsRef = fileMap.get(mol.sha);

    if (!contentsRef) {
      console.warn(
        `Warning: No file found for molecule ${mol.moleculeName} (sha: ${mol.sha})`,
      );
      // Fallback: reconstruct path from DB fields
      const filenameStem = mol.filename.replace(/\.xyz$/, '');
      const reconstructedPath = join(
        MOLECULES_DIR,
        mol.moleculeName,
        `${filenameStem}-${mol.state}.xyz`,
      );

      if (!existsSync(reconstructedPath)) {
        throw new Error(
          `Cannot find file for molecule ${mol.moleculeName}. ` +
            `Tried: ${reconstructedPath}`,
        );
      }

      records.push({
        id: mol.id,
        filename: mol.filename,
        sha: mol.sha,
        moleculeName: mol.moleculeName,
        description: mol.description,
        state: mol.state,
        reference: mol.reference,
        atomCount: mol.atomCount,
        createdAt: toDateISOString(mol.createdAt)!,
        updatedAt: toDateISOString(mol.updatedAt),
        contentsRef: reconstructedPath,
      });
    } else {
      records.push({
        id: mol.id,
        filename: mol.filename,
        sha: mol.sha,
        moleculeName: mol.moleculeName,
        description: mol.description,
        state: mol.state,
        reference: mol.reference,
        atomCount: mol.atomCount,
        createdAt: toDateISOString(mol.createdAt)!,
        updatedAt: toDateISOString(mol.updatedAt),
        contentsRef,
      });
    }
  }

  return records;
}

async function generateSolvents(): Promise<SolventDemoRecord[]> {
  console.log('Reading solvents from database...');

  // Query solvent info (without contents) from the solvents table
  const solvents = await db.select(schema.solventsInfo).from(schema.solvents);

  console.log(`Found ${solvents.length} solvents`);

  // Build file map for sha matching
  const fileMap = await buildSolventFileMap();

  const records: SolventDemoRecord[] = [];

  for (const sol of solvents as SolventInfoRow[]) {
    const contentsRef = fileMap.get(sol.sha);

    if (!contentsRef) {
      console.warn(
        `Warning: No file found for solvent ${sol.name} (sha: ${sol.sha})`,
      );
      // Fallback: reconstruct path from DB fields
      const reconstructedPath = join(SOLVENTS_DIR, sol.filename);

      if (!existsSync(reconstructedPath)) {
        throw new Error(
          `Cannot find file for solvent ${sol.name}. ` +
            `Tried: ${reconstructedPath}`,
        );
      }

      records.push({
        id: sol.id,
        name: sol.name,
        rhom: sol.rhom,
        cpm: sol.cpm,
        filename: sol.filename,
        sha: sol.sha,
        createdAt: toDateISOString(sol.createdAt)!,
        updatedAt: toDateISOString(sol.updatedAt),
        qMin: sol.qMin,
        qMax: sol.qMax,
        qStep: sol.qStep,
        contentsRef: reconstructedPath,
      });
    } else {
      records.push({
        id: sol.id,
        name: sol.name,
        rhom: sol.rhom,
        cpm: sol.cpm,
        filename: sol.filename,
        sha: sol.sha,
        createdAt: toDateISOString(sol.createdAt)!,
        updatedAt: toDateISOString(sol.updatedAt),
        qMin: sol.qMin,
        qMax: sol.qMax,
        qStep: sol.qStep,
        contentsRef,
      });
    }
  }

  return records;
}

async function main() {
  try {
    // Generate molecules
    const molecules = await generateMolecules();

    // Generate solvents
    const solvents = await generateSolvents();

    // Ensure demo directory exists
    if (!existsSync(DEMO_DIR)) {
      console.log(`Creating demo directory: ${DEMO_DIR}`);
      const { mkdirSync } = await import('node:fs');
      mkdirSync(DEMO_DIR, { recursive: true });
    }

    // Write molecules JSON
    const moleculesPath = join(DEMO_DIR, 'molecules.json');
    writeFileSync(moleculesPath, JSON.stringify(molecules, null, 2));
    console.log(`Wrote ${molecules.length} molecules to ${moleculesPath}`);

    // Write solvents JSON
    const solventsPath = join(DEMO_DIR, 'solvents.json');
    writeFileSync(solventsPath, JSON.stringify(solvents, null, 2));
    console.log(`Wrote ${solvents.length} solvents to ${solventsPath}`);

    console.log('\nDemo data generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error generating demo data:', error);
    process.exit(1);
  }
}

main();
