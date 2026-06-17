import type { SimulationState } from '$lib/state.svelte';
import { throttled } from '$lib/utils/throttled.svelte';

import { THROTTLE_INTERVAL_MS } from './constants';
import {
  type ScatteringMathSources,
  ScatteringMathState,
} from './state.svelte';

export function createScatteringCalculations(
  simulation: SimulationState,
): ScatteringMathState {
  const throttledExcitedStateFraction = throttled(
    () => simulation.pump.excitedStateFraction,
    THROTTLE_INTERVAL_MS,
  );
  const throttledPhotonEnergy = throttled(
    () => simulation.pump.photonEnergyEv,
    THROTTLE_INTERVAL_MS,
  );
  const throttledExcitedStateEnergy = throttled(
    () => simulation.pump.excitedStateEnergyEv,
    THROTTLE_INTERVAL_MS,
  );
  const throttledConcentrationSolute = throttled(
    () => simulation.sample.concentrationSoluteMolar,
    THROTTLE_INTERVAL_MS,
  );

  return new ScatteringMathState({
    concentrationSoluteMolar: () => throttledConcentrationSolute.current,
    excitedStateFraction: () => throttledExcitedStateFraction.current,
    photonEnergyEv: () => throttledPhotonEnergy.current,
    excitedStateEnergyEv: () => throttledExcitedStateEnergy.current,
    solventRhom: () => simulation.sample.solvent?.rhom,
    solventCpm: () => simulation.sample.solvent?.cpm,
  });
}

export { computeDeltaS, scaleSoluteByExcitedFraction } from './math';
