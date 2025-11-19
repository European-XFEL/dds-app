import type { SimulationDetails } from '$lib/types';

const defaultMolecules: string[] = ['Au2L2-a', 'Au2L2-b', 'Au2L2-c'];

const defaultSolvents: string[] = ['Water', 'Ethanol', 'Acetonitrile'];

const defaultSample = {
	name: 'Sample A',
	molecule_ground: defaultMolecules[0],
	molecule_excited: defaultMolecules[0],
	solvent: defaultSolvents[0],
	concentration: 0.05
};

const initial: SimulationDetails = {
	sample: defaultSample,
	molecules: defaultMolecules,
	solvents: defaultSolvents,
	sample_excited: '',
	sample_ground: '',
	q_vals: { min: 0, max: 0, step: 0 },
	detector: { name: 'foo' }
};

export const appState = $state(initial);
