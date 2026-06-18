import type { listMolecules } from '$lib/data/api';

export type Molecules = Awaited<ReturnType<typeof listMolecules>>;

export type Molecule = Molecules[number];

export type MoleculeSelection = {
  ground: Molecule | null;
  excited: Molecule | null;
};

export function formatState(state: number): string {
  if (state === 0) return 'Ground (S\u2080)';
  if (state === 1) return 'Excited (S\u2081)';
  return `State ${state}`;
}
