/**
 * Database-backed data source implementation using Drizzle ORM.
 *
 * This module implements the data source interfaces by querying the
 * Postgres database through the existing Drizzle setup.
 */

import { DrizzleQueryError } from 'drizzle-orm';
import Papa from 'papaparse';

import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { sha256HexFromText } from '$lib/server/db/util';
import {
  SimulationService,
  createClient,
  createConnectTransport,
} from '$lib/server/grpc';

import { env } from '$env/dynamic/private';

import type {
  DebyeResult,
  FeedbackDataSource,
  FeedbackInput,
  FeedbackResult,
  MoleculeDataSource,
  MoleculeFileContent,
  MoleculeInfo,
  SimRequest,
  SimulationDataSource,
  SolventDataSource,
  SolventIQ,
  SolventInfo,
  UploadMoleculeInput,
  UploadMoleculeResult,
} from './types';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:50051';

const transport = createConnectTransport({
  baseUrl: `${BACKEND_URL}`,
  httpVersion: '1.1',
});

const simClient = createClient(SimulationService, transport);

type SolventDifferentials = {
  Q: number;
  dSdT: number;
  dSdRho: number;
};

const atomCountLine = /^(\s*\d+)/;

function extractAtomCount(contents: string) {
  const firstLine = contents.split(/\r?\n/, 1)[0]?.trim();
  if (!firstLine) return null;
  const match = atomCountLine.exec(firstLine);
  if (!match) return null;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

// ─── Molecule Data Source ───────────────────────────────────────────────────

export const dbMoleculeSource: MoleculeDataSource = {
  async listMolecules(): Promise<MoleculeInfo[]> {
    return await db.select(schema.moleculesInfo).from(schema.molecules);
  },

  async getMoleculeFileContent(id: string): Promise<MoleculeFileContent> {
    const res = await db.query.molecules.findFirst({
      where: { id },
      columns: { contents: true },
    });

    if (!res) {
      throw error(404, 'Molecule not found');
    }

    return res;
  },

  async uploadMolecule(input: UploadMoleculeInput): Promise<UploadMoleculeResult> {
    const filename = input.file.name;
    const contents = await input.file.text();
    const derivedAtomCount = extractAtomCount(contents);
    const resolvedAtomCount = derivedAtomCount ?? input.atomCount;
    const sha = await sha256HexFromText(contents);

    try {
      const result = await db
        .insert(schema.moleculeFiles)
        .values({
          sha,
          moleculeName: input.moleculeName,
          description: input.description,
          state: input.state,
          reference: input.reference ?? null,
          atomCount: resolvedAtomCount,
          filename,
          contents,
        })
        .returning(schema.moleculesInfo);
      return { success: true, result: result?.[0] };
    } catch (err) {
      console.error('Failed to insert molecule:', err);
      if (err instanceof DrizzleQueryError) {
        const cause = err.cause as { code?: string } | undefined;
        if (cause?.code === '23505') {
          return {
            success: false,
            result: null,
            error: 'A molecule with this name already exists.',
          };
        }
      }
      throw err;
    }
  },
};

// ─── Solvent Data Source ────────────────────────────────────────────────────

export const dbSolventSource: SolventDataSource = {
  async listSolvents(): Promise<SolventInfo[]> {
    return await db.select(schema.solventsInfo).from(schema.solvents);
  },

  async getSolventIQ(id: string): Promise<SolventIQ> {
    const row = await db.query.solvents.findFirst({
      where: { id },
      columns: { contents: true },
    });

    if (!row?.contents) {
      throw error(404, 'Solvent not found');
    }

    const contentsCsv =
      'Q\tdSdT\tdSdRho\n' + row.contents.replaceAll(/#.*\n/g, '');
    const parsed = Papa.parse<SolventDifferentials>(contentsCsv, {
      delimiter: '\t',
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      console.error(`Failed to parse solvent data for ${id}:`, parsed.errors);
      throw error(422, `Failed to parse solvent data for ${id}`);
    }

    const q: number[] = [];
    const dSdT: number[] = [];
    for (const row of parsed.data) {
      if (!Number.isFinite(row.Q) || !Number.isFinite(row.dSdT)) {
        throw error(422, `Solvent data for ${id} contains non-numeric values`);
      }
      q.push(row.Q);
      dSdT.push(row.dSdT);
    }

    return { q, dSdT };
  },
};

// ─── Simulation Data Source ─────────────────────────────────────────────────

export const dbSimulationSource: SimulationDataSource = {
  async getDebyeResult(request: SimRequest): Promise<DebyeResult> {
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
      throw error(404, 'Molecule not found');
    }

    const encoder = new TextEncoder();
    const contents = encoder.encode(file.contents);

    const requestBody = {
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

    const result = await simClient.calcDebye(requestBody);

    // Best-effort cache write
    try {
      await db.insert(schema.intensities).values({
        moleculeId: request.fileId,
        qMin: request.qRange.min,
        qMax: request.qRange.max,
        qStep: request.qRange.step,
        intensity: result.i.map(String),
        q: result.q.map(String),
      });
    } catch (err) {
      const cause =
        err instanceof DrizzleQueryError
          ? (err.cause as { code?: string } | undefined)
          : undefined;
      if (cause?.code !== '23505') {
        console.error('Failed to cache intensity result:', err);
      }
    }

    return result;
  },
};

// ─── Feedback Data Source ───────────────────────────────────────────────────

export const dbFeedbackSource: FeedbackDataSource = {
  async createFeedback(data: FeedbackInput): Promise<FeedbackResult> {
    let region: unknown = null;
    if (data.region) {
      try {
        region = JSON.parse(data.region);
      } catch (err) {
        console.warn('Failed to parse feedback region JSON', err);
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
  },
};
