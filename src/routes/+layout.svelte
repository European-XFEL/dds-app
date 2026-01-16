<script lang="ts">
  import '$css';
  import '@xyflow/svelte/dist/style.css';

  import { onMount } from 'svelte';

  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import {
    type SimulationState,
    createSimulationSeed,
    setSimulationState,
  } from '$lib/state.svelte';
  import { Sidebar as AppSidebar } from '$lib/ui';

  let { children } = $props();

  const simulationSeed = createSimulationSeed();

  setSimulationState(simulationSeed);

  const simulation: SimulationState = $state(simulationSeed);

  // TODO: make this consistent - sample sets the maximum q values, user can set values
  // lower than those, which then bins the data via frontend js
  $effect(() => {
    simulation.qRange.min = simulation.sample.solvent?.qMin ?? 0;
    simulation.qRange.max = simulation.sample.solvent?.qMax ?? 0;
    simulation.qRange.step = simulation.sample.solvent?.qStep ?? 0;
  });

  const sample = $derived({
    groundName: simulation.sample.ground?.name,
    excitedName: simulation.sample.excited?.name,
    solventName: simulation.sample.solvent?.name,
    concentrationSoluteMolar: simulation.sample.concentrationSoluteMolar,
  });

  function applySystemTheme() {
    document.documentElement.classList.toggle(
      'dark',
      localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
    );
  }

  onMount(() => applySystemTheme());
</script>

<Sidebar.Provider style="--sidebar-width: 19rem;" class="h-svh">
  <AppSidebar {sample} />

  <Sidebar.Inset class="overflow-y-auto">
    <main class="m-8 flex justify-center-safe">
      <div class="max-w-[1920px] grow">
        {@render children?.()}
      </div>
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
