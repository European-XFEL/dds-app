import type { Molecule, Sample, Solvent } from '$lib/types';

export class SampleState implements Sample {
  concentrationSoluteMolar: number | null = $state(null);
  solvent: Solvent | null = $state(null);
  ground: Molecule | null = $state(null);
  excited: Molecule | null = $state(null);
}
