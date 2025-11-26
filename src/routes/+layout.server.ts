import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load: PageServerLoad = async ({}) => {
	return {
		molecules: await db.select().from(schema.moleculeTable),
		solvents: await db.select().from(schema.solventTable)
	};
};
