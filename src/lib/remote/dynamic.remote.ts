import { LRUCache } from 'lru-cache';
import z from 'zod';

import { invalid } from '@sveltejs/kit';

import { form, query } from '$app/server';

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

export const listMolecules = query(async () => {
  return await listMoleculesImpl();
});

export const uploadMolecule = form(uploadSchema, async (input, issue) => {
  const response = await uploadMoleculeImpl(input);

  if (!response.success) {
    invalid(issue.moleculeName(response.error ?? 'Unable to upload molecule.'));
  }

  return response;
});

export const listSolvents = query(async () => {
  return await listSolventsImpl();
});

export const getMoleculeFileContent = query(z.string(), async (id: string) => {
  type R = Awaited<ReturnType<typeof getMoleculeFileContentImpl>>;
  let res = immutableCache.get(id) as R | undefined;

  if (!res) {
    res = await getMoleculeFileContentImpl(id);
    immutableCache.set(id, res);
  }
  return res;
});

export const getSolventIQ = query(z.string(), async (id: string) => {
  type R = Awaited<ReturnType<typeof getSolventIQImpl>>;
  let res = immutableCache.get(id) as R | undefined;

  if (!res) {
    res = await getSolventIQImpl(id);
    immutableCache.set(id, res);
  }

  return res;
});

export const getDebyeResult = query(simRequest, async (request) => {
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
  return await createFeedbackImpl(data);
});
