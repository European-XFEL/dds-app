import type { QRange } from '$lib/types';

import { EV_TO_JOULES, N_AVOGADRO } from './constants';

export type ScatteringSeries = {
  q: number[];
  i: number[];
};

export type ScatteringMathInputs = {
  concentrationSoluteMolar?: number | null;
  excitedStateFraction?: number | null;
  photonEnergyEv?: number | null;
  excitedStateEnergyEv?: number | null;
  solventRhom?: number | null;
  solventCpm?: number | null;
};

export interface ScatteringMathResults {
  readonly concentrationSolvent?: number;
  readonly concentrationExcited?: number;
  readonly ratioSolventSolute?: number;
  readonly deltaEeV: number;
  readonly deltaEJ: number;
  readonly deltaT?: number;
  readonly excitedStateFraction: number;
}

export type InterpolationOptions = {
  clamp?: boolean;
};

export function computeConcentrationSolvent(
  solventRhom?: number | null,
): number | undefined {
  if (!solventRhom || !Number.isFinite(solventRhom)) return undefined;
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
    !solventCpm ||
    !Number.isFinite(solventCpm) ||
    solventCpm === 0 ||
    // Delta E
    !deltaEJ ||
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

export function computeScatteringMath(
  inputs: ScatteringMathInputs,
): ScatteringMathResults {
  const concentrationSolvent = computeConcentrationSolvent(inputs.solventRhom);
  const concentrationExcited = computeConcentrationExcited(
    inputs.concentrationSoluteMolar,
    inputs.excitedStateFraction,
  );
  const ratioSolventSolute = computeRatioSolventSolute(
    concentrationSolvent,
    inputs.concentrationSoluteMolar,
  );
  const deltaEeV = computeDeltaEeV(
    inputs.photonEnergyEv,
    inputs.excitedStateEnergyEv,
  );
  const deltaEJ = computeDeltaEJ(deltaEeV);
  const deltaT = computeDeltaT(
    concentrationExcited,
    concentrationSolvent,
    deltaEJ,
    inputs.solventCpm,
  );
  const excitedStateFraction = normalizeExcitedStateFraction(
    inputs.excitedStateFraction,
  );

  return {
    concentrationSolvent,
    concentrationExcited,
    ratioSolventSolute,
    deltaEeV,
    deltaEJ,
    deltaT,
    excitedStateFraction,
  };
}

export function createQGrid(qRange: QRange): number[] {
  const { min, max, step } = qRange;
  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    !Number.isFinite(step)
  ) {
    return [];
  }

  if (step <= 0 || max < min) {
    return [];
  }

  const estimatedSteps = Math.floor((max - min) / step);
  const count = Math.max(estimatedSteps + 1, 1);
  const qValues: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const value = min + index * step;
    if (value > max + step * 0.5) break;
    qValues.push(value);
  }

  return qValues;
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
    return xNew.map(() => Number.NaN);
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

  const combinedI = deltaSSolute.i.map((soluteVal, index) => {
    const soluteContribution = soluteVal * excitedFraction;
    const solventContribution = deltaSSolvent.i[index];
    return soluteContribution + solventContribution;
  });

  return { q: deltaSSolute.q, i: combinedI };
}

export function scaleSoluteByExcitedFraction(
  deltaSSolute: ScatteringSeries | null,
  excitedFraction: number,
): number[] | null {
  if (!deltaSSolute) return null;
  return deltaSSolute.i.map((value) => value * excitedFraction);
}
