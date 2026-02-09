import { getContext, hasContext, setContext } from 'svelte';

import { DetectorState } from '$lib/detector/state.svelte';
import { SampleState } from '$lib/sample/state.svelte';
import type { Pump, QRange, XRayProbe } from '$lib/types';

export type SimulationSeed = {
  qRange: QRange;
  pump: Pump;
  probe: XRayProbe;
};

const DEFAULT_SEED: SimulationSeed = {
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

function mergeSeed(seed?: Partial<SimulationSeed>): SimulationSeed {
  return {
    qRange: { ...DEFAULT_SEED.qRange, ...seed?.qRange },
    pump: { ...DEFAULT_SEED.pump, ...seed?.pump },
    probe: { ...DEFAULT_SEED.probe, ...seed?.probe },
  };
}

export class SimulationState {
  qRange = $state(structuredClone(DEFAULT_SEED.qRange));
  pump = $state(structuredClone(DEFAULT_SEED.pump));
  probe = $state(structuredClone(DEFAULT_SEED.probe));

  detector = new DetectorState('LPD');
  sample = new SampleState();

  reset(seed: SimulationSeed) {
    this.qRange.min = seed.qRange.min;
    this.qRange.max = seed.qRange.max;
    this.qRange.step = seed.qRange.step;

    this.pump.photonEnergyEv = seed.pump.photonEnergyEv;
    this.pump.excitedStateEnergyEv = seed.pump.excitedStateEnergyEv;
    this.pump.excitedStateFraction = seed.pump.excitedStateFraction;

    this.probe.wavelength = seed.probe.wavelength;
  }

  syncQRangeFromSample() {
    const solvent = this.sample.solvent;
    if (!solvent) return;

    this.qRange.min = solvent.qMin ?? this.qRange.min;
    this.qRange.max = solvent.qMax ?? this.qRange.max;
    this.qRange.step = solvent.qStep ?? this.qRange.step;
  }
}

export function createSimulationSeed(seed?: Partial<SimulationSeed>): SimulationSeed {
  return structuredClone(mergeSeed(seed));
}

export function createSimulationState(seed = createSimulationSeed()): SimulationState {
  const state = new SimulationState();
  state.reset(seed);
  return state;
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
