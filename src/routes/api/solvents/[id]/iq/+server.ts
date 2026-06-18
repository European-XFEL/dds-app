import { error, json } from '@sveltejs/kit';

import { solventSource } from '$lib/server/data';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    return json(await solventSource.getSolventIQ(params.id));
  } catch (err) {
    if (err instanceof Error && err.message.includes('not found')) {
      error(404, 'Solvent not found');
    }
    throw err;
  }
};
