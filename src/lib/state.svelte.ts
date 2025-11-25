import type { SimulationDetails } from '$lib/types';

const defaultMolecules: string[] = ['Au2L2-a', 'Au2L2-b', 'Au2L2-c'];

export const molecules = defaultMolecules;

const defaultSolvents: string[] = ['Water', 'Ethanol', 'Acetonitrile'];

export const solvents = defaultSolvents;

const defaultSample = {
	name: 'Sample A',
	molecule_ground: molecules[0],
	molecule_excited: molecules[0],
	solvent: solvents[0],
	concentration: 0.05
};

export const sample = defaultSample;

const initial: SimulationDetails = {
	sample: sample,
	molecules: molecules,
	solvents: solvents,
	sample_excited: '',
	sample_ground: '',
	q_vals: { min: 0, max: 0, step: 0 },
	detector: { name: 'foo' }
};

export const appState = $state(initial);
