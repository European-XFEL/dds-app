import {
  computeConcentrationExcited,
  computeConcentrationSolvent,
  computeDeltaEJ,
  computeDeltaEeV,
  computeDeltaT,
  computeRatioSolventSolute,
  normalizeExcitedStateFraction,
} from './math';

export type ScatteringMathSources = {
  concentrationSoluteMolar: () => number | null | undefined;
  excitedStateFraction: () => number | null | undefined;
  photonEnergyEv: () => number | null | undefined;
  excitedStateEnergyEv: () => number | null | undefined;
  solventRhom: () => number | null | undefined;
  solventCpm: () => number | null | undefined;
};

export class ScatteringMathState {
  readonly concentrationSolvent = $derived.by(() =>
    computeConcentrationSolvent(this.sources.solventRhom()),
  );

  readonly concentrationExcited = $derived.by(() =>
    computeConcentrationExcited(
      this.sources.concentrationSoluteMolar(),
      this.sources.excitedStateFraction(),
    ),
  );

  readonly ratioSolventSolute = $derived.by(() =>
    computeRatioSolventSolute(
      this.concentrationSolvent,
      this.sources.concentrationSoluteMolar(),
    ),
  );

  readonly deltaEeV = $derived.by(() =>
    computeDeltaEeV(
      this.sources.photonEnergyEv(),
      this.sources.excitedStateEnergyEv(),
    ),
  );

  readonly deltaEJ = $derived.by(() => computeDeltaEJ(this.deltaEeV));

  readonly deltaT = $derived.by(() =>
    computeDeltaT(
      this.concentrationExcited,
      this.concentrationSolvent,
      this.deltaEJ,
      this.sources.solventCpm(),
    ),
  );

  readonly excitedStateFraction = $derived.by(() =>
    normalizeExcitedStateFraction(this.sources.excitedStateFraction()),
  );

  constructor(private readonly sources: ScatteringMathSources) {}
}
