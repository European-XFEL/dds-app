/* eslint-disable @typescript-eslint/no-unused-vars */
// deno-lint-ignore-file no-unused-vars
import z from 'zod';

import { command, prerender } from '$app/server';

import { db, schema } from '$lib/server/db';

import {
  getDebyeResultImpl,
  getMoleculeFileContentImpl,
  getSolventIQImpl,
  listMoleculesImpl,
  listSolventsImpl,
  simRequest,
  uploadSchema,
} from './common';

export const listMolecules = prerender(
  async () => {
    return await listMoleculesImpl();
  },
  {
    inputs: () => [],
  },
);

export const uploadMolecule = command(
  uploadSchema,
  ({ name, filename, contents }) => {
    return {
      success: false,
      error: 'Uploading molecules is not supported in the static build.',
    };
  },
);

export const listSolvents = prerender(
  async () => {
    return await listSolventsImpl();
  },
  {
    inputs: () => [],
  },
);

export const getMoleculeFileContent = prerender(
  z.string(),
  async (id: string) => {
    return await getMoleculeFileContentImpl(id);
  },
  {
    inputs: async () => {
      const res = await db
        .select({ id: schema.moleculesInfo.id })
        .from(schema.molecules);

      const ids = res.map((r) => r.id);

      return ids;
    },
  },
);

export const getSolventIQ = prerender(
  z.string(),
  async (id: string) => {
    return await getSolventIQImpl(id);
  },
  {
    inputs: async () => {
      const res = await db
        .select({ id: schema.solventsInfo.id })
        .from(schema.solvents);

      const ids = res.map((r) => r.id);

      return ids;
    },
  },
);

export const getDebyeResult = prerender(
  simRequest,
  async (request) => {
    return await getDebyeResultImpl(request);
  },
  {
    inputs: async () => {
      const qRange = {
        min: 0.005253,
        max: 8.498164,
        step: 0.006044,
      };

      const res = await db
        .select({ id: schema.moleculesInfo.id })
        .from(schema.molecules);

      const ids = res.map((r) => r.id);

      return ids.map((id) => ({ fileId: id, qRange: qRange }));
    },
  },
);
