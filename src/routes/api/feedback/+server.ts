import { error, json } from '@sveltejs/kit';

import { PUBLIC_TARGET } from '$env/static/public';

import { feedbackSource } from '$lib/server/data';

import type { RequestHandler } from './$types';

const STATIC = PUBLIC_TARGET === 'static';

const feedbackCategories = [
  'Content',
  'Interface',
  'Bug',
  'Suggestion',
] as const;

export const POST: RequestHandler = async ({ request }) => {
  if (STATIC) {
    return json({
      success: false,
      error: 'Feedback submission is not supported in the static build.',
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  if (typeof body !== 'object' || body === null) {
    throw error(400, 'Request body must be an object');
  }

  const data = body as Record<string, unknown>;

  // Validate url
  const url = data.url;
  if (typeof url !== 'string' || !url) {
    throw error(400, 'Missing or invalid url');
  }
  try {
    new globalThis.URL(url);
  } catch {
    throw error(400, 'Invalid url format');
  }

  // Validate comment
  const comment = data.comment;
  let validatedComment: string | undefined;
  if (comment !== undefined && comment !== null) {
    if (typeof comment !== 'string') {
      throw error(400, 'comment must be a string');
    }
    const trimmed = comment.trim();
    if (trimmed.length > 2000) {
      throw error(400, 'comment must be at most 2000 characters');
    }
    validatedComment = trimmed || undefined;
  }

  // Validate categories
  const categories = data.categories;
  let validatedCategories: string[] = [];
  if (categories !== undefined && categories !== null) {
    if (!Array.isArray(categories)) {
      throw error(400, 'categories must be an array');
    }
    for (const cat of categories) {
      if (
        typeof cat !== 'string' ||
        !(feedbackCategories as readonly string[]).includes(cat)
      ) {
        throw error(400, `Invalid category: ${cat}`);
      }
    }
    validatedCategories = categories as string[];
  }

  // Validate optional fields
  const region = data.region;
  let validatedRegion: string | undefined;
  if (region !== undefined && region !== null) {
    if (typeof region !== 'string') {
      throw error(400, 'region must be a string');
    }
    validatedRegion = region;
  }

  const regionImage = data.regionImage;
  let validatedRegionImage: string | undefined;
  if (regionImage !== undefined && regionImage !== null) {
    if (typeof regionImage !== 'string') {
      throw error(400, 'regionImage must be a string');
    }
    validatedRegionImage = regionImage;
  }

  const result = await feedbackSource.createFeedback({
    url,
    comment: validatedComment,
    categories: validatedCategories,
    region: validatedRegion,
    regionImage: validatedRegionImage,
  });

  return json(result);
};
