import { getContext, hasContext, setContext } from 'svelte';

import { DetectorState } from '$lib/detector/state.svelte';
import { SampleState } from '$lib/sample/state.svelte';
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
};

const APP_STATE_KEY = Symbol('simulation-state');

export type SimulationState = SimulationDetails;

export function createSimulationSeed(_seed = initialSeed): SimulationState {
  const seed = structuredClone(_seed);

  // Wrap with $state() to make it deeply reactive for bindings
  const state: SimulationState = $state({
    ...seed,
    detector: new DetectorState('LPD'),
    sample: new SampleState(),
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
