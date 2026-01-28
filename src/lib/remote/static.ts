/* eslint-disable @typescript-eslint/no-unused-vars */
// deno-lint-ignore-file no-unused-vars
import Papa from 'papaparse';
import z from 'zod';

import { command, prerender } from '$app/server';

import { env } from '$env/dynamic/private';

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import {
  SimulationService,
  createClient,
  createConnectTransport,
} from '$lib/server/grpc';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:50051';

const transport = createConnectTransport({
  baseUrl: `${BACKEND_URL}`,
  httpVersion: '1.1',
});

const simulation_client = createClient(SimulationService, transport);

export const listMolecules = prerender(
  async () => {
    return await db.select(schema.moleculesInfo).from(schema.molecules);
  },
  {
    inputs: () => [],
    dynamic: true,
  },
);

export const uploadMolecule = command(
  z.object({
    name: z.string(),
    filename: z.string(),
    contents: z.string(),
  }),
  ({ name, filename, contents }) => {
    return {
      success: false,
      error: 'Uploading molecules is not supported in the static build.',
    };
  },
);

export const listSolvents = prerender(
  async () => {
    return await db.select(schema.solventsInfo).from(schema.solvents);
  },
  {
    inputs: () => [],
    dynamic: true,
  },
);

export const getMoleculeFileContent = prerender(
  z.string(),
  async (id: string) => {
    return await db.query.molecules.findFirst({
      where: { id },
      columns: {
        contents: true,
      },
    });
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

type SolventDifferentials = {
  Q: number;
  dSdT: number;
  dSdRho: number;
};

export const getSolventIQ = prerender(
  z.string(),
  async (id: string) => {
    const contents = await db.query.solvents
      .findFirst({
        where: { id },
        columns: {
          contents: true,
        },
      })
      .then(
        (s) =>
          s?.contents ??
          (() => {
            throw new Error('Solvent not found');
          })(),
      );

    const contentsCsv = 'Q\tdSdT\tdSdRho\n' + contents.replaceAll(/#.*\n/g, '');
    const parsed = Papa.parse<SolventDifferentials>(contentsCsv, {
      delimiter: '\t',
      dynamicTyping: false,
      header: true,
      skipEmptyLines: true,
    });

    const { data } = parsed;

    const q = data.map((row) => row.Q);
    const dSdT = data.map((row) => row.dSdT);

    return { q, dSdT };
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

const simulation_request = z.object({
  fileId: z.string(),
  qRange: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
  }),
});

const encoder = new TextEncoder();

export const getDebyeResult = prerender(
  simulation_request,
  async (request: z.infer<typeof simulation_request>) => {
    const fetched = await db.query.intensities.findFirst({
      where: {
        moleculeId: request.fileId,
        qMin: request.qRange.min,
        qMax: request.qRange.max,
        qStep: request.qRange.step,
      },
    });

    if (fetched?.q && fetched?.intensity) {
      return {
        q: fetched.q.map((v) => Number(v)),
        i: fetched.intensity.map((v) => Number(v)),
      };
    }

    const file = await db.query.molecules.findFirst({
      where: { id: request.fileId },
    });

    if (!file) {
      throw new Error('Molecule not found');
    }

    const contents = encoder.encode(file.contents);

    const request_body = {
      structure: {
        filename: file.filename,
        contents: contents,
      },
      qRange: {
        min: request.qRange.min,
        max: request.qRange.max,
        step: request.qRange.step,
      },
    };

    try {
      const result = await simulation_client.calcDebye(request_body);

      db.insert(schema.intensities)
        .values({
          moleculeId: request.fileId,
          qMin: request.qRange.min,
          qMax: request.qRange.max,
          qStep: request.qRange.step,
          intensity: result.i.map(String),
          q: result.q.map(String),
        })
        .catch((error) =>
          console.error('Failed to insert intensity result:', error),
        );

      return result;
    } catch (error) {
      console.error('Simulation error:', error);
      throw error;
    }
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
