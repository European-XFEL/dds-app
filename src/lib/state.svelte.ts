import type * as types from '$lib/types';

const initial: types.SimulationDetails = {
  qRange: {
    min: 0.01,
    max: 9.0,
    step: 0.01,
  },
  pump: {
    photonEnergyEv: 4.0,
    excitedStateEnergyEv: 2.0,
    excitedStateFraction: 0.5,
  },
  sample: {
    concentrationSoluteMolar: 0.005,
    ground: {
      id: 'Au2L2-S0_GS.xyz',
      filename: 'Au2L2-S0_GS.xyz',
      name: 'Au2L2-S0_GS',
    },
    excited: {
      id: 'Au2L2-T0_ES.xyz',
      filename: 'Au2L2-T0_ES.xyz',
      name: 'Au2L2-T0_ES',
    },
    solvent: {
      id: 'MeCN.txt',
      filename: 'MeCN.txt',
      name: 'acetonitrile',
    },
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
};

export const appState = $state(initial);
