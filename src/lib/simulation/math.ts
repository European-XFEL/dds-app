import type { QRange } from '$lib/types';

import { EV_TO_JOULES, N_AVOGADRO } from './constants';

export type ScatteringSeries = {
  q: number[];
  i: number[];
};

export type InterpolationOptions = {
  clamp?: boolean;
};

/**
 * Solvent molar concentration in mol/L.
 *
 * `rhom` is the solvent molar density in mol/m³ (as stored from the thermo
 * data); dividing by 1000 converts mol/m³ → mol/L.
 */
export function computeConcentrationSolvent(
  solventRhom?: number | null,
): number | undefined {
  if (!Number.isFinite(solventRhom)) return undefined;
  return solventRhom / 1000.0;
}

export function computeConcentrationExcited(
  concentrationSoluteMolar?: number | null,
  excitedStateFraction?: number | null,
): number | undefined {
  if (concentrationSoluteMolar == null || excitedStateFraction == null) {
    return undefined;
  }
  return concentrationSoluteMolar * excitedStateFraction;
}

export function computeRatioSolventSolute(
  concentrationSolvent?: number | null,
  concentrationSoluteMolar?: number | null,
): number | undefined {
  if (concentrationSoluteMolar == null || concentrationSoluteMolar === 0) {
    return undefined;
  }
  if (concentrationSolvent == null) return undefined;
  return concentrationSolvent / concentrationSoluteMolar;
}

export function computeDeltaEeV(
  photonEnergyEv?: number | null,
  excitedStateEnergyEv?: number | null,
): number {
  if (photonEnergyEv == null || excitedStateEnergyEv == null) return 0;
  return photonEnergyEv - excitedStateEnergyEv;
}

export function computeDeltaEJ(deltaEeV: number): number {
  return deltaEeV * EV_TO_JOULES;
}

/**
 * Solvent temperature rise (in Kelvin) from energy deposited by the excited
 * solute molecules.
 *
 * Physical model: each excited molecule releases `deltaEJ` joules into the
 * surrounding solvent. The energy released per mole of excited solute is
 * `deltaEJ * N_AVOGADRO` (J/mol), and the per-molecule energy is shared across
 * the solvent in proportion to the excited-solute / solvent concentration
 * ratio. Dividing by the solvent molar heat capacity `solventCpm` (J/mol/K)
 * yields a temperature change in Kelvin:
 *
 *   ΔT = (cExcited / cSolvent) * (deltaEJ / Cpm) * Nₐ
 *
 * `concentrationExcited` and `concentrationSolvent` must share units (mol/L);
 * the ratio is dimensionless so their unit cancels.
 */
export function computeDeltaT(
  concentrationExcited?: number | null,
  concentrationSolvent?: number | null,
  deltaEJ?: number | null,
  solventCpm?: number | null,
): number | undefined {
  if (
    // Concentration
    concentrationExcited == null ||
    concentrationSolvent == null ||
    // Solvent
    !Number.isFinite(solventCpm) ||
    solventCpm === 0 ||
    // Delta E
    !Number.isFinite(deltaEJ)
  ) {
    return undefined;
  }

  return (
    (concentrationExcited / concentrationSolvent) *
    (deltaEJ / solventCpm) *
    N_AVOGADRO
  );
}

export function normalizeExcitedStateFraction(
  excitedStateFraction?: number | null,
): number {
  return excitedStateFraction ?? 0;
}

/**
 * Validates a Q range: all values finite, a positive step, and `max >= min`.
 * Single source of truth for the QRange invariant, used both to guard grid
 * construction and to gate reactive fetches.
 */
export function isValidQRange(qRange: QRange): boolean {
  const { min, max, step } = qRange;
  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    Number.isFinite(step) &&
    step > 0 &&
    max >= min
  );
}

export function createQGrid(qRange: QRange): number[] {
  if (!isValidQRange(qRange)) return [];

  const { min, max, step } = qRange;
  const estimatedSteps = Math.floor((max - min) / step);
  const count = Math.max(estimatedSteps + 1, 1);

  return Array.from({ length: count }, (_, index) => min + index * step).filter(
    (value) => value <= max + step * 0.5,
  );
}

export function interpolateLinear(
  x: number[],
  y: number[],
  xNew: number[],
  options: InterpolationOptions = {},
): number[] {
  if (x.length !== y.length) {
    throw new Error('Interpolation requires matching x/y arrays.');
  }

  if (!x.length) {
    return new Array(xNew.length).fill(Number.NaN);
  }

  const clamp = options.clamp ?? false;
  let cursor = 0;
  const lastIndex = x.length - 1;

  return xNew.map((target) => {
    if (target <= x[0]) {
      return clamp ? y[0] : Number.NaN;
    }

    if (target >= x[lastIndex]) {
      return clamp ? y[lastIndex] : Number.NaN;
    }

    while (cursor < lastIndex - 1 && target > x[cursor + 1]) {
      cursor += 1;
    }

    const x0 = x[cursor];
    const x1 = x[cursor + 1];
    const y0 = y[cursor];
    const y1 = y[cursor + 1];
    const t = (target - x0) / (x1 - x0);

    return y0 + t * (y1 - y0);
  });
}

/**
 * Combined difference-scattering signal ΔS(q): the solute contribution scaled
 * by the excited-state fraction, summed with the solvent contribution.
 *
 *   ΔS = (excitedFraction · ΔS_solute) + ΔS_solvent
 *
 * Both series are assumed to be sampled on the same q-grid, aligned by index
 * (enforced via the length check below); mismatched grids return null.
 */
export function computeDeltaS(
  deltaSSolute: ScatteringSeries | null,
  deltaSSolvent: ScatteringSeries | null,
  excitedFraction: number,
): ScatteringSeries | null {
  if (!deltaSSolute || !deltaSSolvent) return null;

  if (deltaSSolute.q.length !== deltaSSolvent.q.length) {
    console.warn('Q ranges of solute and solvent do not match.');
    return null;
  }

  return {
    q: deltaSSolute.q,
    i: deltaSSolute.i.map(
      (soluteVal, index) =>
        soluteVal * excitedFraction + deltaSSolvent.i[index],
    ),
  };
}

export function scaleSoluteByExcitedFraction(
  deltaSSolute: ScatteringSeries | null,
  excitedFraction: number,
): number[] | null {
  if (!deltaSSolute) return null;
  return deltaSSolute.i.map((value) => value * excitedFraction);
}
