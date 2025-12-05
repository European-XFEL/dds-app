import { listMolecules, listSolvents } from '$lib/data.remote';

export type Solvents = Awaited<ReturnType<typeof listSolvents>>;

export type Solvent = Solvents[number];

export type Molecules = Awaited<ReturnType<typeof listMolecules>>;

export type Molecule = Molecules[number];

export type Sample = {
  concentrationSoluteMolar: number | undefined;
  solvent: Solvent | undefined;
  ground: Molecule | undefined;
  excited: Molecule | undefined;
};
