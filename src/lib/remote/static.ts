/* eslint-disable @typescript-eslint/no-unused-vars */
// deno-lint-ignore-file no-unused-vars
import z from 'zod';

import { command, prerender } from '$app/server';

import { db } from '$lib/server/db';

import {
  getDebyeResultImpl,
  getMoleculeFileContentImpl,
  getSolventIQImpl,
  listMoleculesImpl,
  listSolventsImpl,
  simulation_request,
  uploadSchema,
} from './common';

export const listMolecules = prerender(
  async () => {
    return await listMoleculesImpl();
  },
  {
    inputs: () => [],
    dynamic: true,
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
    dynamic: true,
  },
);

export const getMoleculeFileContent = prerender(
  z.string(),
  async (id: string) => {
    return await getMoleculeFileContentImpl(id);
  },
  {
    inputs: () => {
      return db.query.molecules
        .findMany()
        .then((molecules) => molecules.map((m) => m.id));
    },
    dynamic: true,
  },
);

export const getSolventIQ = prerender(
  z.string(),
  async (id: string) => {
    return await getSolventIQImpl(id);
  },
  {
    inputs: () => {
      return db.query.solvents
        .findMany()
        .then((solvents) => solvents.map((s) => s.id));
    },
    dynamic: true,
  },
);

export const getDebyeResult = prerender(
  simulation_request,
  async (request) => {
    return await getDebyeResultImpl(request);
  },
  {
    inputs: () => {
      const qRange = {
        min: 0.005253,
        max: 8.498164,
        step: 0.006044,
      };

      return db.query.molecules.findMany().then((molecules) => {
        return molecules.map((m) => ({
          fileId: m.id,
          qRange: qRange,
        }));
      });
    },
    dynamic: true,
  },
);
