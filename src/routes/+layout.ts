import type { LayoutLoad } from '$types';

import { createSimulationSeed } from '$lib/state.svelte';

export const load: LayoutLoad = async () => {
  return {
    simulationSeed: createSimulationSeed(),
  };
};
