import { getDebyeResult, getSolventIQ } from '$lib/data.remote';
import type { QRange } from '$lib/types';

export type ScatteringData = {
  q: number[];
  i: number[];
};

export type ScatteringResult = {
  data: ScatteringData | null;
  loading: boolean;
  error: Error | null;
};

/**
 * Fetches difference scattering data for the solute (excited - ground state).
 */
export async function fetchDeltaSSolute(
  qRange: QRange,
  groundId: string,
  excitedId: string,
): Promise<ScatteringData | null> {
  const [ground, excited] = await Promise.all([
    getDebyeResult({ fileId: groundId, qRange }),
    getDebyeResult({ fileId: excitedId, qRange }),
  ]);

  if (!ground || !excited) return null;

  // Validate Q ranges match
  if (
    ground.q.map((v) => v.toFixed(6)).toString() !==
    excited.q.map((v) => v.toFixed(6)).toString()
  ) {
    throw new Error('Q ranges of ground and excited states do not match.');
  }

  const deltaS = excited.i.map((val, index) => val - ground.i[index]);
  return { q: ground.q, i: deltaS };
}

/**
 * Fetches difference scattering data for the solvent.
 */
export async function fetchDeltaSSolvent(
  solventId: string,
  ratioSolventSolute: number,
  deltaT: number,
): Promise<ScatteringData> {
  const iqSolvent = await getSolventIQ(solventId);
  const deltaS = iqSolvent.dSdT.map((val) => val * ratioSolventSolute * deltaT);
  return { q: iqSolvent.q, i: deltaS };
}

/**
 * Creates a reactive resource for fetching scattering data.
 */
export function createScatteringResource<T>(
  fetcher: () => Promise<T | null>,
  deps: () => boolean,
): {
  value: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  let value = $state<T | null>(null);
  let loading = $state(false);
  let error = $state<Error | null>(null);
  let version = $state(0);

  function refetch() {
    version += 1;
  }

  $effect(() => {
    // Track version for manual refetches - reading it creates a dependency
    const currentVersion = version;

    // Check if we should fetch
    if (!deps()) {
      value = null;
      loading = false;
      error = null;
      return;
    }

    loading = true;
    error = null;

    fetcher()
      .then((result) => {
        // Only update if this is still the current fetch
        if (currentVersion === version) {
          value = result;
          loading = false;
        }
      })
      .catch((e) => {
        if (currentVersion === version) {
          error = e instanceof Error ? e : new Error(String(e));
          value = null;
          loading = false;
        }
      });
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
    refetch,
  };
}
