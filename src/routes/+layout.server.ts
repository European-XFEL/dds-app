import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load: LayoutServerLoad = async ({}) => {
  return {
    molecules: await db.select().from(schema.moleculeTable),
    solvents: await db.select().from(schema.solventTable),
  };
};
