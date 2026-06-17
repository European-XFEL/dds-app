import { getDebyeResult, getSolventIQ } from '$remote';

import type { QRange } from '$lib/types';

import { type ScatteringSeries, createQGrid, interpolateLinear } from './math';

export type ResourceState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; value: T }
  | { status: 'error'; error: Error };

export type ScatteringResource<T> = {
  readonly state: ResourceState<T>;
  readonly value: T | null;
  readonly loading: boolean;
  readonly error: Error | null;
  refetch: () => Promise<void>;
};

export function createScatteringResource<T>(
  fetcher: () => Promise<T>,
  ready: () => boolean,
): ScatteringResource<T> {
  let state = $state<ResourceState<T>>({ status: 'idle' });
  let requestId = 0;

  const runFetch = async () => {
    // Reading `ready()` synchronously (before any await) is what registers the
    // resource's reactive dependencies, so callers must read every input they
    // depend on inside `ready` for the fetch to re-run when they change.
    if (!ready()) {
      state = { status: 'idle' };
      return;
    }

    const currentRequest = (requestId += 1);
    state = { status: 'loading' };

    try {
      const value = await fetcher();
      if (currentRequest !== requestId) return;
      state = { status: 'success', value };
    } catch (err) {
      if (currentRequest !== requestId) return;
      state = {
        status: 'error',
        error:
          err instanceof Error
            ? err
            : new Error('Scattering fetch failed', { cause: err }),
      };
    }
  };

  $effect(() => {
    void runFetch();
  });

  return {
    get state() {
      return state;
    },
    get value() {
      return state.status === 'success' ? state.value : null;
    },
    get loading() {
      return state.status === 'loading';
    },
    get error() {
      return state.status === 'error' ? state.error : null;
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
