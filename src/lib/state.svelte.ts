import { getContext, hasContext, setContext } from 'svelte';

import { DetectorState } from '$lib/detector/state.svelte';
import { SampleState } from '$lib/sample/state.svelte';

const DEFAULT = {
  qRange: {
    min: 0.005253,
    max: 8.498164,
    step: 0.006044,
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

export class SimulationState {
  qRange = $state(structuredClone(DEFAULT.qRange));
  pump = $state(structuredClone(DEFAULT.pump));
  probe = $state(structuredClone(DEFAULT.probe));

  detector = new DetectorState('LPD');
  sample = new SampleState();
}

export function createSimulationState(): SimulationState {
  return new SimulationState();
}

export function setSimulationState(state: SimulationState): void {
  setContext<SimulationState>(APP_STATE_KEY, state);
}

export function useSimulationState(): SimulationState {
  if (!hasContext(APP_STATE_KEY)) {
    throw new Error(
      'Simulation state has not been provided in this component tree.',
    );
  }

  return getContext<SimulationState>(APP_STATE_KEY);
}
