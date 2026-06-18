/**
 * Data source factory.
 *
 * Selects the appropriate data source implementation based on PUBLIC_TARGET.
 * - `node` (production): uses Postgres/Drizzle via db-source.ts
 * - `static` (demo): uses committed JSON files via static-source.ts
 */
import { PUBLIC_TARGET } from '$env/static/public';

import {
  dbFeedbackSource,
  dbMoleculeSource,
  dbSimulationSource,
  dbSolventSource,
} from './db-source';
import {
  staticFeedbackSource,
  staticMoleculeSource,
  staticSimulationSource,
  staticSolventSource,
} from './static-source';
import type {
  FeedbackDataSource,
  MoleculeDataSource,
  SimulationDataSource,
  SolventDataSource,
} from './types';

const STATIC = PUBLIC_TARGET === 'static';

export const moleculeSource: MoleculeDataSource = STATIC
  ? staticMoleculeSource
  : dbMoleculeSource;

export const solventSource: SolventDataSource = STATIC
  ? staticSolventSource
  : dbSolventSource;

export const simulationSource: SimulationDataSource = STATIC
  ? staticSimulationSource
  : dbSimulationSource;

export const feedbackSource: FeedbackDataSource = STATIC
  ? staticFeedbackSource
  : dbFeedbackSource;

export type {
  DebyeResult,
  FeedbackInput,
  FeedbackResult,
  MoleculeFileContent,
  MoleculeInfo,
  SimRequest,
  SolventIQ,
  SolventInfo,
  UploadMoleculeInput,
  UploadMoleculeResult,
} from './types';
