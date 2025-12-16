import { getContext, hasContext, setContext } from 'svelte';

import type { SimulationDetails } from '$lib/types';

const initialSeed = {
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
  detector: {
    name: 'detector',
    pixelSize: 0.172,
    distance: 200,
    wavelength: 1.54,
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

export function createSimulationSeed(_seed = initialSeed): SimulationState {
  const seed = structuredClone(_seed);

  // Set default image shape and beam center if undefined based on the module extents
  let maxX = 0;
  let maxY = 0;
  for (const module of seed.detector.modules) {
    const moduleMaxX = module.x + module.width;
    const moduleMaxY = module.y + module.height;
    if (moduleMaxX > maxX) {
      maxX = moduleMaxX;
    }
    if (moduleMaxY > maxY) {
      maxY = moduleMaxY;
    }
  }
  const imageShape = { width: maxX, height: maxY };
  const beamCenter = {
    x: 16 + maxX / 2,
    y: 16 + maxY / 2,
  };

  // Wrap with $state() to make it deeply reactive for bindings
  const state: SimulationState = $state({
    ...seed,
    detector: {
      ...seed.detector,
      imageShape,
      beamCenter,
    },
    sample: {
      concentrationSoluteMolar: undefined,
      solvent: undefined,
      excited: undefined,
      ground: undefined,
    },
  });

  return state;
}

export function setSimulationState(state: SimulationState): void {
  setContext<SimulationState>(APP_STATE_KEY, state);
}

export function useSimulationState(): SimulationState {
  if (!hasContext(APP_STATE_KEY)) {
    throw new Error('Simulation state has not been provided in this component tree.');
  }

  return getContext<SimulationState>(APP_STATE_KEY);
}
