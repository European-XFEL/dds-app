import z from 'zod';

import { prerender, query } from '$app/server';

import { db } from '$lib/server/db';

const IS_DYNAMIC = process.env.BUILD_MODE === 'dynamic';

export const listMolecules = prerender(
  async () => {
    return await db.query.moleculeTable.findMany({
      with: { fileTable: { columns: { filename: true } } },
    });
  },
  {
    dynamic: IS_DYNAMIC,
  },
);

export const listSolvents = prerender(
  async () => {
    return await db.query.solventTable.findMany({
      with: { fileTable: { columns: { filename: true } } },
    });
  },
  {
    dynamic: IS_DYNAMIC,
  },
);

export const getMoleculeFileContent = query(z.string(), async (id: string) => {
  return await db.query.moleculeTable.findFirst({
    with: { fileTable: true },
    where: (table, { eq }) => eq(table.id, id),
  });
});
