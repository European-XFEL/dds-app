import { LRUCache } from 'lru-cache';
import z from 'zod';

import { invalid } from '@sveltejs/kit';

import { form, prerender, query } from '$app/server';

import { PUBLIC_TARGET } from '$env/static/public';

import { db, schema } from '$lib/server/db';

import {
  createFeedbackImpl,
  feedbackSchema,
  getDebyeResultImpl,
  getMoleculeFileContentImpl,
  getSolventIQImpl,
  listMoleculesImpl,
  listSolventsImpl,
  simRequest,
  uploadMoleculeImpl,
  uploadSchema,
} from './common';

const STATIC = PUBLIC_TARGET === 'static';

type UploadMoleculeResult = Awaited<ReturnType<typeof uploadMoleculeImpl>>;

type UploadMoleculeResponse =
  | {
      success: true;
      result: NonNullable<UploadMoleculeResult['result']>;
      error?: undefined;
    }
  | {
      success: false;
      result: null;
      error: string;
    };

type CachedValue =
  | Awaited<ReturnType<typeof getMoleculeFileContentImpl>>
  | Awaited<ReturnType<typeof getSolventIQImpl>>
  | Awaited<ReturnType<typeof getDebyeResultImpl>>;

const immutableCache = new LRUCache<string, CachedValue>({
  max: 1000,
  onInsert: (value, key, reason) => {
    console.log(`Cache insert: key=${key}, reason=${reason}`);
  },
});

/**
 * Wraps an impl in a query whose results are memoised in `immutableCache`.
 * String arguments are used as the cache key directly; objects are keyed by
 * their JSON form.
 */
function cachedQuery<S extends z.ZodType, R extends CachedValue>(
  validate: S,
  impl: (arg: z.infer<S>) => Promise<R>,
) {
  return query(validate, async (arg) => {
    const key = typeof arg === 'string' ? arg : JSON.stringify(arg);
    const cached = immutableCache.get(key) as R | undefined;
    if (cached) return cached;

    const res = await impl(arg as z.infer<S>);
    immutableCache.set(key, res);
    return res;
  });
}

export const listMolecules = STATIC
  ? prerender(listMoleculesImpl, { inputs: () => [] })
  : query(listMoleculesImpl);

export const uploadMolecule = form(uploadSchema, async (input, issue) => {
  if (STATIC) {
    return {
      success: false,
      result: null,
      error: 'Uploading molecules is not supported in the static build.',
    } satisfies UploadMoleculeResponse;
  }

  const response = await uploadMoleculeImpl(input);

  if (!response.success) {
    const message = response.error ?? 'Unable to upload molecule.';
    invalid(issue.moleculeName(message));
  }

  if (!response.result) {
    return {
      success: false,
      result: null,
      error: 'Unable to upload molecule.',
    } satisfies UploadMoleculeResponse;
  }

  return {
    success: true,
    result: response.result,
  } satisfies UploadMoleculeResponse;
});

export const listSolvents = STATIC
  ? prerender(listSolventsImpl, { inputs: () => [] })
  : query(listSolventsImpl);

export const getMoleculeFileContent = STATIC
  ? prerender(z.string(), getMoleculeFileContentImpl, {
      dynamic: true,
      inputs: async () => {
        const res = await db
          .select({ id: schema.moleculesInfo.id })
          .from(schema.molecules);
        return res.map((r) => r.id);
      },
    })
  : cachedQuery(z.string(), getMoleculeFileContentImpl);

export const getSolventIQ = STATIC
  ? prerender(z.string(), getSolventIQImpl, {
      dynamic: true,
      inputs: async () => {
        const res = await db
          .select({ id: schema.solventsInfo.id })
          .from(schema.solvents);
        return res.map((r) => r.id);
      },
    })
  : cachedQuery(z.string(), getSolventIQImpl);

export const getDebyeResult = STATIC
  ? prerender(simRequest, getDebyeResultImpl, {
      dynamic: true,
      inputs: async () => {
        const qRange = {
          min: 0.005253,
          max: 8.498164,
          step: 0.006044,
        };

        const res = await db
          .select({ id: schema.moleculesInfo.id })
          .from(schema.molecules);

        return res.map((r) => ({ fileId: r.id, qRange }));
      },
    })
  : cachedQuery(simRequest, getDebyeResultImpl);

export const submitFeedback = form(feedbackSchema, async (data) => {
  if (STATIC) {
    return {
      success: false,
      error: 'Feedback submission is not supported in the static build.',
    };
  }

  return await createFeedbackImpl(data);
});
