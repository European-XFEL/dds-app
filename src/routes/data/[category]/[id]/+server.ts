import { _db } from '../../../+layout.server';
import { eq } from 'drizzle-orm';

import * as schema from '$lib/server/db/schema';

import type { EntryGenerator } from './$types';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
  let table;

  if (params.category == 'molecules') {
    table = schema.moleculeTable;
  } else if (params.category == 'solvents') {
    table = schema.solventTable;
  } else {
    return new Response('Invalid category', { status: 400 });
  }

  const res = await _db
    .select({ content: table.content })
    .from(table)
    .where(eq(table.id, params.id));

  return new Response(String(res[0]?.content ?? ''), { status: 200 });
};

export const entries: EntryGenerator = async () => {
  const all_molecules = await _db
    .select({ id: schema.moleculeTable.id })
    .from(schema.moleculeTable);
  const all_solvents = await _db.select({ id: schema.solventTable.id }).from(schema.solventTable);

  return [
    ...all_molecules.map((m) => ({ category: 'molecule', id: m.id })),
    ...all_solvents.map((s) => ({ category: 'solvent', id: s.id })),
  ];
};
