import { json } from '@sveltejs/kit';

import { feedbackSource } from '$lib/server/data';
import { feedbackSchema } from '$lib/server/data/validation';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = feedbackSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { success: false, id: null, error: parsed.error.message },
      { status: 400 },
    );
  }

  return json(await feedbackSource.createFeedback(parsed.data));
};
