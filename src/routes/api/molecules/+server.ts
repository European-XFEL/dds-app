import { error, json } from '@sveltejs/kit';

import { moleculeSource } from '$lib/server/data';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (id) {
    try {
      return json(await moleculeSource.getMoleculeFileContent(id));
    } catch (err) {
      if (err instanceof Error && err.message.includes('not found')) {
        error(404, 'Molecule not found');
      }
      throw err;
    }
  }

  return json(await moleculeSource.listMolecules());
};
