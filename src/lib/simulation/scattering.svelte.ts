import type { SimulationState } from '$lib/state.svelte';
import { throttled } from '$lib/utils/throttled.svelte';

import { EV_TO_JOULES, N_AVOGADRO } from './constants.ts';

export type ScatteringData = {
  q: number[];
  i: number[];
};

/** Throttle interval in milliseconds for slider inputs */
const THROTTLE_INTERVAL_MS = 300;

/**
 * Pump parameters and solute concentration are throttled to prevent jitter
 * when the user rapidly moves sliders. Values update at regular intervals
 * rather than on every input change.
 */
export function createScatteringCalculations(simulation: SimulationState) {
  // Throttle the rapidly-changing slider values to prevent chart jitter
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

  /**
   * Concentration of solvent in mol/L.
   * rhom is molar density (from thermo.chemical.Chemical.rhom) in mol/m3.
   * To convert to mol/L divide by 1_000 (1 m3 = 1000 L).
   */
  const concentrationSolvent = $derived.by(() => {
    const rhom = simulation.sample.solvent?.rhom;
    if (!rhom) return undefined;
    return rhom / 1000;
  });

  /**
   * Concentration of excited molecules (mol/L).
   * Uses throttled values.
   */
  const concentrationExcited = $derived.by(() => {
    const concentrationSolute = throttledConcentrationSolute.current;
    const excitedFraction = throttledExcitedStateFraction.current;
    if (!concentrationSolute || !excitedFraction) return undefined;
    return concentrationSolute * excitedFraction;
  });

  /**
   * Ratio of solvent to solute concentration.
   * Uses throttled values.
   */
  const ratioSolventSolute = $derived.by(() => {
    const concentrationSolute = throttledConcentrationSolute.current;
    const solvent = concentrationSolvent;
    if (!concentrationSolute || !solvent) return undefined;
    return solvent / concentrationSolute;
  });

  /**
   * Energy difference in eV between photon and excited state.
   * Uses throttled values.
   */
  const deltaEeV = $derived(
    throttledPhotonEnergy.current - throttledExcitedStateEnergy.current,
  );

  /**
   * Energy difference in Joules.
   */
  const deltaEJ = $derived(deltaEeV * EV_TO_JOULES);

  /**
   * Temperature change in the solvent (K) due to deposited energy.
   */
  const deltaT = $derived.by(() => {
    const cpm = simulation.sample?.solvent?.cpm;
    const excited = concentrationExcited;
    const solvent = concentrationSolvent;
    if (!excited || !solvent || !deltaEJ || !cpm) return undefined;
    return (((excited / solvent) * deltaEJ) / cpm) * N_AVOGADRO;
  });

  /**
   * Get the throttled excited state fraction from simulation.
   */
  const excitedStateFraction = $derived(throttledExcitedStateFraction.current);

  return {
    get concentrationSolvent() {
      return concentrationSolvent;
    },
    get concentrationExcited() {
      return concentrationExcited;
    },
    get ratioSolventSolute() {
      return ratioSolventSolute;
    },
    get deltaEeV() {
      return deltaEeV;
    },
    get deltaEJ() {
      return deltaEJ;
    },
    get deltaT() {
      return deltaT;
    },
    get excitedStateFraction() {
      return excitedStateFraction;
    },
  };
}

/**
 * Computes the combined difference scattering signal.
 */
export function computeDeltaS(
  deltaSSolute: ScatteringData | null,
  deltaSSolvent: ScatteringData | null,
  excitedFraction: number,
): ScatteringData | null {
  if (!deltaSSolute || !deltaSSolvent) return null;

  // Check that Q ranges match
  if (deltaSSolute.q.length !== deltaSSolvent.q.length) {
    console.warn('Q ranges of solute and solvent do not match');
    return null;
  }

  // Combine: ExFrac * ΔS_solute + ΔS_solvent (NOTE: already scaled by ratio and deltaT)
  const combinedI = deltaSSolute.i.map((soluteVal, index) => {
    const soluteContribution = excitedFraction * soluteVal;
    const solventContribution = deltaSSolvent.i[index];
    return soluteContribution + solventContribution;
  });

  return { q: deltaSSolute.q, i: combinedI };
}

/**
 * Scales solute contribution by excited fraction for display.
 */
export function scaleSoluteByExcitedFraction(
  deltaSSolute: ScatteringData | null,
  excitedFraction: number,
): number[] | null {
  if (!deltaSSolute) return null;
  return deltaSSolute.i.map((val) => val * excitedFraction);
}
