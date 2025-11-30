import { getContext, hasContext, setContext } from 'svelte';

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

const APP_STATE_KEY = Symbol('simulation-state');

export type SimulationState = types.SimulationDetails;

export function createSimulationSeed(seed: types.SimulationDetails = initial): types.SimulationDetails {
  return structuredClone(seed);
}

export function provideSimulationState(state: SimulationState): SimulationState {
  setContext(APP_STATE_KEY, state);
  return state;
}

export function useSimulationState(): SimulationState {
  if (!hasContext(APP_STATE_KEY)) {
    throw new Error('Simulation state has not been provided in this component tree.');
  }

  return getContext<SimulationState>(APP_STATE_KEY);
}
