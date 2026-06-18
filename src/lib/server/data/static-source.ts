/**
 * Static JSON-backed data source implementation.
 *
 * This module implements the data source interfaces by reading from
 * committed JSON files in `data/demo/`. Used for the static/demo build
 * where no database is available.
 */

import Papa from 'papaparse';

import { error } from '@sveltejs/kit';

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

// Import demo data files - these are bundled at build time for static builds
// and read from filesystem for node builds
import moleculesRaw from '../../../../data/demo/molecules.json' with { type: 'json' };
import solventsRaw from '../../../../data/demo/solvents.json' with { type: 'json' };

// ─── Internal types for JSON data (includes contents) ───────────────────────

interface MoleculeRecord {
  id: string;
  filename: string;
  sha: string;
  moleculeName: string;
  description: string;
  state: number;
  reference: string | null;
  atomCount: number;
  createdAt: string;
  updatedAt: string | null;
  contents: string;
}

interface SolventRecord {
  id: string;
  name: string;
  rhom: number;
  cpm: number;
  filename: string;
  sha: string;
  createdAt: string;
  updatedAt: string | null;
  qMin: number;
  qMax: number;
  qStep: number;
  contents: string;
}

type SolventDifferentials = {
  Q: number;
  dSdT: number;
  dSdRho: number;
};

// Cast imported JSON to our internal types
const moleculesData = moleculesRaw as MoleculeRecord[];
const solventsData = solventsRaw as SolventRecord[];

// ─── Helper functions ───────────────────────────────────────────────────────

function parseDate(dateStr: string | null | undefined): Date | undefined {
  if (!dateStr) return undefined;
  return new Date(dateStr);
}

function toMoleculeInfo(record: MoleculeRecord): MoleculeInfo {
  return {
    id: record.id,
    filename: record.filename,
    sha: record.sha,
    moleculeName: record.moleculeName,
    description: record.description,
    state: record.state,
    reference: record.reference,
    atomCount: record.atomCount,
    createdAt: new Date(record.createdAt),
    updatedAt: parseDate(record.updatedAt),
  };
}

function toSolventInfo(record: SolventRecord): SolventInfo {
  return {
    id: record.id,
    name: record.name,
    rhom: record.rhom,
    cpm: record.cpm,
    filename: record.filename,
    sha: record.sha,
    createdAt: new Date(record.createdAt),
    updatedAt: parseDate(record.updatedAt),
    qMin: record.qMin,
    qMax: record.qMax,
    qStep: record.qStep,
  };
}

// ─── Molecule Data Source ───────────────────────────────────────────────────

export const staticMoleculeSource: MoleculeDataSource = {
  async listMolecules(): Promise<MoleculeInfo[]> {
    return moleculesData.map(toMoleculeInfo);
  },

  async getMoleculeFileContent(id: string): Promise<MoleculeFileContent> {
    const record = moleculesData.find((m) => m.id === id);
    if (!record) {
      throw error(404, 'Molecule not found');
    }
    return { contents: record.contents };
  },

  async uploadMolecule(
    _input: UploadMoleculeInput,
  ): Promise<UploadMoleculeResult> {
    return {
      success: false,
      result: null,
      error: 'Uploading molecules is not supported in the static build.',
    };
  },
};

// ─── Solvent Data Source ────────────────────────────────────────────────────

export const staticSolventSource: SolventDataSource = {
  async listSolvents(): Promise<SolventInfo[]> {
    return solventsData.map(toSolventInfo);
  },

  async getSolventIQ(id: string): Promise<SolventIQ> {
    const record = solventsData.find((s) => s.id === id);
    if (!record) {
      throw error(404, 'Solvent not found');
    }

    const contentsCsv =
      'Q\tdSdT\tdSdRho\n' + record.contents.replaceAll(/#.*\n/g, '');
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

export const staticSimulationSource: SimulationDataSource = {
  async getDebyeResult(_request: SimRequest): Promise<DebyeResult> {
    throw error(
      501,
      'Simulation is not supported in the static build. Use the production build with a database.',
    );
  },
};

// ─── Feedback Data Source ───────────────────────────────────────────────────

export const staticFeedbackSource: FeedbackDataSource = {
  async createFeedback(_data: FeedbackInput): Promise<FeedbackResult> {
    return {
      success: false,
      id: null,
    };
  },
};
