import { error, json } from '@sveltejs/kit';

import { simulationSource } from '$lib/server/data';
import type { SimRequest } from '$lib/server/data';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  let body: SimRequest;
  try {
    body = (await request.json()) as SimRequest;
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  if (!body.fileId || !body.qRange) {
    throw error(400, 'Missing required fields: fileId, qRange');
  }

  const result = await simulationSource.getDebyeResult(body);
  return json(result);
};
