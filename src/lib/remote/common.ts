import { DrizzleQueryError } from 'drizzle-orm';
import Papa from 'papaparse';
import z from 'zod';

import { env } from '$env/dynamic/private';

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { sha256HexFromText } from '$lib/server/db/util';
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

export const simulation_request = z.object({
  fileId: z.string(),
  qRange: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
  }),
});

export async function listMoleculesImpl() {
  return await db.select(schema.moleculesInfo).from(schema.molecules);
}

export async function listSolventsImpl() {
  return await db.select(schema.solventsInfo).from(schema.solvents);
}

export async function getMoleculeFileContentImpl(id: string) {
  return await db.query.molecules.findFirst({
    where: { id },
    columns: { contents: true },
  });
}

type SolventDifferentials = {
  Q: number;
  dSdT: number;
  dSdRho: number;
};

export async function getSolventIQImpl(id: string) {
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
}

export async function getDebyeResultImpl(
  request: z.infer<typeof simulation_request>,
) {
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

  const encoder = new TextEncoder();
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
}

export const uploadSchema = z.object({
  name: z.string(),
  filename: z.string(),
  contents: z.string(),
});

export async function uploadMoleculeImpl({
  name,
  filename,
  contents,
}: z.infer<typeof uploadSchema>) {
  const sha = await sha256HexFromText(contents);

  try {
    const result = await db
      .insert(schema.molecules)
      .values({
        sha,
        name,
        filename,
        contents,
      })
      .returning(schema.moleculesInfo);
    return { success: true, result: result?.[0] };
  } catch (error) {
    console.error('Failed to insert molecule:', error);
    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as { code?: string } | undefined;
      if (cause?.code === '23505') {
        return {
          success: false,
          error: 'A molecule with this name already exists.',
        };
      }
    }
    throw error;
  }
}

export { schema as dbSchema };
