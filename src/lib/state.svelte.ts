import { getContext, hasContext, setContext } from 'svelte';

import type { SimulationDetails } from '$lib/types/';

const initial: SimulationDetails = {
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
  probe: {
    wavelength: 1.54,
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
    image_shape: [512, 512],
    beam_center: { x: 256, y: 256 },
    modules: [
      {
        id: 'module-1',
        x: 100,
        y: 80,
        width: 120,
        height: 100,
      },
      {
        id: 'module-2',
        x: 240,
        y: 80,
        width: 120,
        height: 100,
      },
      {
        id: 'module-3',
        x: 100,
        y: 200,
        width: 120,
        height: 100,
      },
      {
        id: 'module-4',
        x: 240,
        y: 200,
        width: 120,
        height: 100,
      },
    ],
  },
};

const APP_STATE_KEY = Symbol('simulation-state');

export type SimulationState = SimulationDetails;

export function createSimulationSeed(seed: SimulationDetails = initial): SimulationDetails {
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
