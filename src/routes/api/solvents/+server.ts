import { error, json } from '@sveltejs/kit';

import { solventSource } from '$lib/server/data';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (id) {
    try {
      return json(await solventSource.getSolventIQ(id));
    } catch (err) {
      if (err instanceof Error && err.message.includes('not found')) {
        error(404, 'Solvent not found');
      }
      throw err;
    }
  }

  return json(await solventSource.listSolvents());
};
