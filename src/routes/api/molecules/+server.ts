import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { moleculeSource } from '$lib/server/data';

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (id) {
    // GET /api/molecules?id=xxx -> file content
    const content = await moleculeSource.getMoleculeFileContent(id);
    return json(content);
  }

  // GET /api/molecules -> list all
  const molecules = await moleculeSource.listMolecules();
  return json(molecules);
};
