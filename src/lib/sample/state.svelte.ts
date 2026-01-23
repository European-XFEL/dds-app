import type { Molecule, Sample, Solvent } from './types.ts';

export class SampleState implements Sample {
  concentrationSoluteMolar: number = $state(1.0);
  solvent: Solvent | undefined = $state();
  ground: Molecule | undefined = $state();
  excited: Molecule | undefined = $state();
}
