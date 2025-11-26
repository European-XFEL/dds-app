import type * as types from '$lib/types';

const initial: types.SimulationDetails = {
	sample: {
		groundMolecule: {
			id: '',
			name: '',
			content: ''
		},
		excitedMolecule: {
			id: '',
			name: '',
			content: ''
		},
		solvent: {
			id: '',
			name: '',
			content: ''
		},
		concentration: 0
	},
	qVals: {
		min: undefined,
		max: undefined,
		step: undefined
	},
	detector: {
		name: undefined
	}
};

export const appState = $state(initial);
