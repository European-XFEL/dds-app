import z from 'zod';

import { invalid } from '@sveltejs/kit';

import { form, query } from '$app/server';

import {
  getDebyeResultImpl,
  getMoleculeFileContentImpl,
  getSolventIQImpl,
  listMoleculesImpl,
  listSolventsImpl,
  createFeedbackImpl,
  feedbackSchema,
  simRequest,
  uploadMoleculeImpl,
  uploadSchema,
} from './common';

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
  return await getMoleculeFileContentImpl(id);
});

export const getSolventIQ = query(z.string(), async (id: string) => {
  return await getSolventIQImpl(id);
});

export const getDebyeResult = query(simRequest, async (request) => {
  return await getDebyeResultImpl(request);
});

export const submitFeedback = form(feedbackSchema, async (data) => {
  return await createFeedbackImpl(data);
});
