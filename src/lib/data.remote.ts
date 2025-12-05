import { eq } from 'drizzle-orm';
import z from 'zod';

import { prerender } from '$app/server';

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const listMolecules = prerender(
  async () => {
    return await db.select(schema.moleculesInfo).from(schema.molecules);
  },
  {
    inputs: () => [],
  },
);

export const listSolvents = prerender(
  async () => {
    return await db.select(schema.solventsInfo).from(schema.solvents);
  },
  {
    inputs: () => [],
  },
);

export const getMoleculeFileContent = prerender(
  z.string(),
  async (id: string) => {
    return await db.query.molecules.findFirst({
      where: eq(schema.molecules.id, id),
      columns: {
        contents: true,
      },
    });
  },
  {
    inputs: () => {
      return db.query.molecules.findMany().then((molecules) => molecules.map((m) => m.id));
    },
  },
);

// export const getSimulationResult = prerender(
//   z.string(),
//   async (moleculeFileID: string, qRange: QRange) => {
//     ...
//   }
// )
