import { getContext, hasContext, setContext } from 'svelte';

import type { SimulationDetails } from '$lib/types';

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
      id: '',
      filename: '',
      name: '',
    },
    excited: {
      id: '',
      filename: '',
      name: '',
    },
    solvent: {
      id: '',
      filename: '',
      name: '',
    },
  },
  detector: {
    name: 'detector',
    pixel_size: 0.172,
    distance: 200,
    wavelength: 1.54,
    image_shape: [256, 256],
    beam_center: { x: 128, y: 128 },
    modules: [
      {
        id: 'module-1',
        x: 64,
        y: 0 + 32,
        width: 128,
        height: 256,
      },
      {
        id: 'module-2',
        x: 64 + 32,
        y: 256 + 32 + 32,
        width: 128,
        height: 256,
      },
      {
        id: 'module-3',
        x: 64 + 32 + 128,
        y: 0 + 32,
        width: 128,
        height: 256,
      },
      {
        id: 'module-4',
        x: 64 + 32 + 32 + 128,
        y: 256 + 32 + 32,
        width: 128,
        height: 256,
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
  // Set default image shape and beam center if undefined based on the module extents
  let maxX = 0;
  let maxY = 0;
  for (const module of state.detector.modules) {
    const moduleMaxX = module.x + module.width;
    const moduleMaxY = module.y + module.height;
    if (moduleMaxX > maxX) {
      maxX = moduleMaxX;
    }
    if (moduleMaxY > maxY) {
      maxY = moduleMaxY;
    }
  }
  state.detector.image_shape = [maxY, maxX];

  state.detector.beam_center = {
    x: state.detector.beam_center.x ?? 16 + maxX / 2,
    y: state.detector.beam_center.y ?? 16 + maxY / 2,
  };

  setContext(APP_STATE_KEY, state);
  return state;
}

export function useSimulationState(): SimulationState {
  if (!hasContext(APP_STATE_KEY)) {
    throw new Error('Simulation state has not been provided in this component tree.');
  }

  return getContext<SimulationState>(APP_STATE_KEY);
}
