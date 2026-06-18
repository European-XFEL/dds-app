import { error, json } from '@sveltejs/kit';

import { moleculeSource } from '$lib/server/data';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    return json(await moleculeSource.getMoleculeFileContent(params.id));
  } catch (err) {
    if (err instanceof Error && err.message.includes('not found')) {
      error(404, 'Molecule not found');
    }
    throw err;
  }
};
