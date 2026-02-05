import { listMolecules } from '$remote';
import type { CellContext } from '@tanstack/table-core';

import type { Component } from 'svelte';

export type Molecules = Awaited<ReturnType<typeof listMolecules>>;

export type Molecule = Molecules[number];

export type MoleculeSelection = {
  ground: Molecule | null;
  excited: Molecule | null;
};

export type EditingCell = {
  id: string;
  field: string;
} | null;

export function formatState(state: number): string {
  if (state === 0) return 'Ground (S\u2080)';
  if (state === 1) return 'Excited (S\u2081)';
  return `State ${state}`;
}

export type CellComponentResult = {
  component: Component<Record<string, unknown>>;
  props: Record<string, unknown>;
};

export type MoleculeColumnMeta = {
  cell?: (context: CellContext<Molecule, unknown>) => CellComponentResult;
  sortable?: boolean;
  headerClass?: string;
  cellClass?: string;
};
