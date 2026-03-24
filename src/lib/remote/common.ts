import { DrizzleQueryError } from 'drizzle-orm';
import Papa from 'papaparse';
import z from 'zod';

import { error } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { sha256HexFromText } from '$lib/server/db/util';
import {
  SimulationService,
  createClient,
  createConnectTransport,
} from '$lib/server/grpc';

import { uploadSchema } from './schema';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:50051';

const transport = createConnectTransport({
  baseUrl: `${BACKEND_URL}`,
  httpVersion: '1.1',
});

export const simClient = createClient(SimulationService, transport);

export const simRequest = z.object({
  fileId: z.string(),
  qRange: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
  }),
});

const feedbackCategories = [
  'Content',
  'Interface',
  'Bug',
  'Suggestion',
] as const;

export const feedbackSchema = z.object({
  url: z.string().url(),
  comment: z.string().trim().max(2000).optional(),
  categories: z
    .array(z.enum(feedbackCategories))
    .optional()
    .transform((value) => value ?? []),
  region: z.string().optional(),
  regionImage: z.string().optional(),
});

export async function listMoleculesImpl() {
  return await db.select(schema.moleculesInfo).from(schema.molecules);
}

export async function listSolventsImpl() {
  return await db.select(schema.solventsInfo).from(schema.solvents);
}

export async function getMoleculeFileContentImpl(id: string) {
  const res = await db.query.molecules.findFirst({
    where: { id },
    columns: { contents: true },
  });

  if (!res) {
    return error(404, 'Molecule not found');
  }

  return res;
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
          return error(404, 'Solvent not found');
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

export async function getDebyeResultImpl(request: z.infer<typeof simRequest>) {
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
    return error(404, 'Molecule not found');
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
    const result = await simClient.calcDebye(request_body);

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

const atomCountLine = /^(\s*\d+)/;

function extractAtomCount(contents: string) {
  const firstLine = contents.split(/\r?\n/, 1)[0]?.trim();
  if (!firstLine) return null;
  const match = atomCountLine.exec(firstLine);
  if (!match) return null;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export { uploadSchema };

export async function uploadMoleculeImpl({
  moleculeName,
  description,
  state,
  reference,
  atomCount,
  file,
}: z.infer<typeof uploadSchema>) {
  const filename = file.name;
  const contents = await file.text();
  const derivedAtomCount = extractAtomCount(contents);
  const resolvedAtomCount = derivedAtomCount ?? atomCount;
  const sha = await sha256HexFromText(contents);

  try {
    const result = await db
      .insert(schema.moleculeFiles)
      .values({
        sha,
        moleculeName,
        description,
        state,
        reference: reference ?? null,
        atomCount: resolvedAtomCount,
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

export async function createFeedbackImpl(data: z.infer<typeof feedbackSchema>) {
  let region: unknown = null;
  if (data.region) {
    try {
      region = JSON.parse(data.region);
    } catch (error) {
      console.warn('Failed to parse feedback region JSON', error);
    }
  }

  const inserted = await db
    .insert(schema.feedback)
    .values({
      url: data.url,
      comment: data.comment?.length ? data.comment : null,
      categories: data.categories.length ? data.categories : null,
      region,
      regionImage: data.regionImage?.length ? data.regionImage : null,
    })
    .returning({ id: schema.feedback.id });

  return { success: true, id: inserted?.[0]?.id ?? null };
}

export { schema as dbSchema };
