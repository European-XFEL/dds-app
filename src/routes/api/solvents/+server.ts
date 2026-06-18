import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { solventSource } from '$lib/server/data';

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (id) {
    // GET /api/solvents?id=xxx -> IQ data
    const iq = await solventSource.getSolventIQ(id);
    return json(iq);
  }

  // GET /api/solvents -> list all
  const solvents = await solventSource.listSolvents();
  return json(solvents);
};
