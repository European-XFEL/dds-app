import * as db from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const _db = await db.setup_db();

export const load: LayoutServerLoad = async ({}) => {
  return {
    molecules: await _db.select().from(schema.moleculeTable),
    solvents: await _db.select().from(schema.solventTable),
  };
};
