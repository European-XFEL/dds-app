import type * as types from '$lib/types';

const initial: types.SimulationDetails = {
  sample: {
    ground: {
      id: '',
      name: '',
    },
    excited: {
      id: '',
      name: '',
    },
    solvent: {
      id: '',
      name: '',
    },
    concentration: 0,
  },
  q_vals: {
    min: 0,
    max: 0,
    step: 0,
  },
  detector: {
    name: 'detector',
    pixel_size: 0.172,
    distance: 200,
    wavelength: 1.54,
    shape: [512, 512],
    beam_center: [256, 256],
    quadrant_positions: [],
  },
  pump: {
    energy: 0,
    excitedFrac: 0,
    excitedPotential: 0,
  },
};

export const appState = $state(initial);
