import z from 'zod';

import { command, query } from '$app/server';

import {
  getDebyeResultImpl,
  getMoleculeFileContentImpl,
  getSolventIQImpl,
  listMoleculesImpl,
  listSolventsImpl,
  simulation_request,
  uploadMoleculeImpl,
  uploadSchema,
} from './common';

export const listMolecules = query(async () => {
  return await listMoleculesImpl();
});

export const uploadMolecule = command(uploadSchema, async (input) => {
  return await uploadMoleculeImpl(input);
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

export const getDebyeResult = query(simulation_request, async (request) => {
  return await getDebyeResultImpl(request);
});
