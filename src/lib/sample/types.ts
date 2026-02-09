import { listSolvents } from '$remote';

import { Molecule } from '$lib/types';

export type Solvents = Awaited<ReturnType<typeof listSolvents>>;

export type Solvent = Solvents[number];

export interface Sample {
  concentrationSoluteMolar: number | null;
  solvent: Solvent | null;
  ground: Molecule | null;
  excited: Molecule | null;
}
