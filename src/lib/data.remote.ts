import { eq } from 'drizzle-orm';
import z from 'zod';

import { prerender } from '$app/server';

import { env } from '$env/dynamic/private';

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { SimulationService, createClient, createConnectTransport } from '$lib/server/grpc';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:50051';

const transport = createConnectTransport({
  baseUrl: `${BACKEND_URL}`,
  httpVersion: '2',
});

const simulation_client = createClient(SimulationService, transport);

export const listMolecules = prerender(
  async () => {
    return await db.select(schema.moleculesInfo).from(schema.molecules);
  },
  {
    inputs: () => [],
  },
);

export const listSolvents = prerender(
  async () => {
    return await db.select(schema.solventsInfo).from(schema.solvents);
  },
  {
    inputs: () => [],
  },
);

export const getMoleculeFileContent = prerender(
  z.string(),
  async (id: string) => {
    return await db.query.molecules.findFirst({
      where: eq(schema.molecules.id, id),
      columns: {
        contents: true,
      },
    });
  },
  {
    inputs: () => {
      return db.query.molecules.findMany().then((molecules) => molecules.map((m) => m.id));
    },
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

export const getSimulationResult = prerender(
  simulation_request,
  async (request: z.infer<typeof simulation_request>) => {
    const file = await db.query.molecules.findFirst({
      where: eq(schema.molecules.id, request.fileId),
    });

    if (!file) {
      throw new Error('Molecule not found');
    }

    const contents = encoder.encode(file.contents);

    const request_body = {
      structure: {
        filename: file.name,
        contents: contents,
      },
      qRange: {
        min: request.qRange.min,
        max: request.qRange.max,
        step: request.qRange.step,
      },
    };

    console.log('Sending simulation request:', request_body);

    try {
      const response = await simulation_client.calcDebye(request_body);

      return response;
    } catch (error) {
      console.error('Simulation error:', error);
      throw error;
    }
  },
);
