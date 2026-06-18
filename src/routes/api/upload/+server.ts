import { error, json } from '@sveltejs/kit';

import { PUBLIC_TARGET } from '$env/static/public';

import { moleculeSource } from '$lib/server/data';

import type { RequestHandler } from './$types';

const STATIC = PUBLIC_TARGET === 'static';

export const POST: RequestHandler = async ({ request }) => {
  if (STATIC) {
    return json({
      success: false,
      result: null,
      error: 'Uploading molecules is not supported in the static build.',
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw error(400, 'Invalid form data');
  }

  const moleculeName = formData.get('moleculeName');
  const description = formData.get('description');
  const state = formData.get('state');
  const reference = formData.get('reference');
  const atomCount = formData.get('atomCount');
  const file = formData.get('file');

  if (
    typeof moleculeName !== 'string' ||
    !moleculeName.trim() ||
    typeof description !== 'string' ||
    !description.trim() ||
    typeof state !== 'string' ||
    typeof atomCount !== 'string' ||
    !(file instanceof File) ||
    !file.name
  ) {
    throw error(400, 'Missing or invalid required fields');
  }

  const parsedState = Number.parseInt(state, 10);
  const parsedAtomCount = Number.parseInt(atomCount, 10);

  if (!Number.isFinite(parsedState) || parsedState < 0) {
    throw error(400, 'Invalid state value');
  }
  if (!Number.isFinite(parsedAtomCount) || parsedAtomCount <= 0) {
    throw error(400, 'Invalid atom count value');
  }

  const result = await moleculeSource.uploadMolecule({
    moleculeName: moleculeName.trim(),
    description: description.trim(),
    state: parsedState,
    reference:
      typeof reference === 'string' && reference.trim()
        ? reference.trim()
        : null,
    atomCount: parsedAtomCount,
    file,
  });

  return json(result);
};
