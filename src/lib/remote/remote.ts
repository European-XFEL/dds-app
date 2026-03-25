import { LRUCache } from 'lru-cache';
import z from 'zod';

import { invalid } from '@sveltejs/kit';
import { PUBLIC_TARGET } from '$env/static/public';

import { form, prerender, query } from '$app/server';

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

const immutableCache = new LRUCache<
  string,
  | Awaited<ReturnType<typeof getMoleculeFileContentImpl>>
  | Awaited<ReturnType<typeof getSolventIQImpl>>
  | Awaited<ReturnType<typeof getDebyeResultImpl>>
>({
  max: 1000,
  onInsert: (value, key, reason) => {
    console.log(`Cache insert: key=${key}, reason=${reason}`);
  },
});

export const listMolecules = STATIC
  ? prerender(
      async () => {
        return await listMoleculesImpl();
      },
      { inputs: () => [] },
    )
  : query(async () => {
      return await listMoleculesImpl();
    });

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
  ? prerender(
      async () => {
        return await listSolventsImpl();
      },
      { inputs: () => [] },
    )
  : query(async () => {
      return await listSolventsImpl();
    });

export const getMoleculeFileContent = STATIC
  ? prerender(
      z.string(),
      async (id: string) => {
        return await getMoleculeFileContentImpl(id);
      },
      {
        dynamic: true,
        inputs: async () => {
          const res = await db
            .select({ id: schema.moleculesInfo.id })
            .from(schema.molecules);
          return res.map((r) => r.id);
        },
      },
    )
  : query(z.string(), async (id: string) => {
      type R = Awaited<ReturnType<typeof getMoleculeFileContentImpl>>;
      let res = immutableCache.get(id) as R | undefined;

      if (!res) {
        res = await getMoleculeFileContentImpl(id);
        immutableCache.set(id, res);
      }
      return res;
    });

export const getSolventIQ = STATIC
  ? prerender(
      z.string(),
      async (id: string) => {
        return await getSolventIQImpl(id);
      },
      {
        dynamic: true,
        inputs: async () => {
          const res = await db
            .select({ id: schema.solventsInfo.id })
            .from(schema.solvents);
          return res.map((r) => r.id);
        },
      },
    )
  : query(z.string(), async (id: string) => {
      type R = Awaited<ReturnType<typeof getSolventIQImpl>>;
      let res = immutableCache.get(id) as R | undefined;

      if (!res) {
        res = await getSolventIQImpl(id);
        immutableCache.set(id, res);
      }

      return res;
    });

export const getDebyeResult = STATIC
  ? prerender(
      simRequest,
      async (request) => {
        return await getDebyeResultImpl(request);
      },
      {
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
      },
    )
  : query(simRequest, async (request) => {
      type R = Awaited<ReturnType<typeof getDebyeResultImpl>>;
      const id = JSON.stringify(request);
      let res = immutableCache.get(id) as R | undefined;

      if (!res) {
        res = await getDebyeResultImpl(request);
        immutableCache.set(id, res);
      }

      return res;
    });

export const submitFeedback = form(feedbackSchema, async (data) => {
  if (STATIC) {
    return {
      success: false,
      error: 'Feedback submission is not supported in the static build.',
    };
  }

  return await createFeedbackImpl(data);
});
