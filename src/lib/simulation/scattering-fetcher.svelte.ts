import { getDebyeResult, getSolventIQ } from '$remote';

import type { QRange } from '$lib/types';

import { type ScatteringSeries, createQGrid, interpolateLinear } from './math';

export type ScatteringResource<T> = {
  readonly value: T | null;
  readonly loading: boolean;
  readonly error: Error | null;
  refetch: () => Promise<void>;
};

export function createScatteringResource<T>(
  fetcher: () => Promise<T>,
  ready: () => boolean,
): ScatteringResource<T> {
  let value = $state<T | null>(null);
  let loading = $state(false);
  let error = $state<Error | null>(null);
  let requestId = 0;

  const runFetch = async () => {
    if (!ready()) {
      value = null;
      loading = false;
      error = null;
      return;
    }

    const currentRequest = (requestId += 1);
    loading = true;
    error = null;

    try {
      const result = await fetcher();
      if (currentRequest !== requestId) return;
      value = result;
    } catch (err) {
      if (currentRequest !== requestId) return;
      error = err instanceof Error ? err : new Error('Unknown fetch error');
      value = null;
    } finally {
      if (currentRequest === requestId) {
        loading = false;
      }
    }
  };

  $effect(() => {
    if (!ready()) {
      value = null;
      loading = false;
      error = null;
      return;
    }

    void runFetch();
  });

  return {
    get value() {
      return value;
    },
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    refetch: runFetch,
  };
}

export async function fetchDeltaSSolute(
  qRange: QRange,
  groundId: string,
  excitedId: string,
): Promise<ScatteringSeries> {
  const [ground, excited] = await Promise.all([
    getDebyeResult({ fileId: groundId, qRange }),
    getDebyeResult({ fileId: excitedId, qRange }),
  ]);

  if (ground.q.length !== excited.q.length) {
    throw new Error('Ground/excited Q ranges do not match.');
  }

  const deltaI = ground.i.map((value, index) => excited.i[index] - value);
  return { q: ground.q, i: deltaI };
}

export async function fetchDeltaSSolvent(
  qRange: QRange,
  solventId: string,
  ratioSolventSolute: number,
  deltaT: number,
): Promise<ScatteringSeries> {
  const solvent = await getSolventIQ(solventId);
  const targetQ = createQGrid(qRange);
  const solventQ = solvent.q.map((value) => Number(value));
  const solventDSdT = solvent.dSdT.map((value) => Number(value));

  const interpolated = interpolateLinear(solventQ, solventDSdT, targetQ);
  const scaled = interpolated.map((value) => {
    if (!Number.isFinite(value)) return Number.NaN;
    return value * ratioSolventSolute * deltaT;
  });

  return { q: targetQ, i: scaled };
}
