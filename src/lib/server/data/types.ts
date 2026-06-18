/**
 * Data source abstraction interfaces.
 *
 * These interfaces define the operations used by the app for accessing
 * molecule, solvent, and simulation data. Two implementations exist:
 * - `db-source.ts`: Production implementation using Postgres/Drizzle
 * - `static-source.ts`: Static demo implementation reading from JSON files
 */

// ─── Molecule types ─────────────────────────────────────────────────────────

export interface MoleculeInfo {
  id: string;
  filename: string;
  sha: string;
  moleculeName: string;
  description: string;
  state: number;
  reference: string | null;
  atomCount: number;
  createdAt: Date;
  updatedAt: Date | undefined;
}

export interface MoleculeFileContent {
  contents: string;
}

export interface UploadMoleculeInput {
  moleculeName: string;
  description: string;
  state: number;
  reference: string | null;
  atomCount: number;
  file: File;
}

export type UploadMoleculeResult =
  | { success: true; result: MoleculeInfo; error?: undefined }
  | { success: false; result: null; error: string };

export interface MoleculeDataSource {
  listMolecules(): Promise<MoleculeInfo[]>;
  getMoleculeFileContent(id: string): Promise<MoleculeFileContent>;
  uploadMolecule(input: UploadMoleculeInput): Promise<UploadMoleculeResult>;
}

// ─── Solvent types ──────────────────────────────────────────────────────────

export interface SolventInfo {
  id: string;
  name: string;
  rhom: number;
  cpm: number;
  filename: string;
  sha: string;
  createdAt: Date;
  updatedAt: Date | undefined;
  qMin: number;
  qMax: number;
  qStep: number;
}

export interface SolventIQ {
  q: number[];
  dSdT: number[];
}

export interface SolventDataSource {
  listSolvents(): Promise<SolventInfo[]>;
  getSolventIQ(id: string): Promise<SolventIQ>;
}

// ─── Simulation types ───────────────────────────────────────────────────────

export interface SimRequest {
  fileId: string;
  qRange: {
    min: number;
    max: number;
    step: number;
  };
}

export interface DebyeResult {
  q: number[];
  i: number[];
}

export interface SimulationDataSource {
  getDebyeResult(request: SimRequest): Promise<DebyeResult>;
}

// ─── Feedback types ─────────────────────────────────────────────────────────

export interface FeedbackInput {
  url: string;
  comment?: string;
  categories: string[];
  region?: string;
  regionImage?: string;
}

export interface FeedbackResult {
  success: boolean;
  id: string | null;
}

export interface FeedbackDataSource {
  createFeedback(data: FeedbackInput): Promise<FeedbackResult>;
}
