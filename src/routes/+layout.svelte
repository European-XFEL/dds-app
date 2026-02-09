<script lang="ts">
  import '$css';

  import { onMount } from 'svelte';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import { Sidebar as AppSidebar } from '$lib/nav';
  import {
        createSimulationSeed,
createSimulationState,
    setSimulationState,
  } from '$lib/state.svelte';
  import { preloadMatterviz } from '$lib/utils/matterviz';

  let { data, children } = $props();

  const simulation = createSimulationState(createSimulationSeed());

  setSimulationState(simulation);

  $effect(() => {
    const seed = (
      data as { simulationSeed: import('$lib/state.svelte').SimulationSeed }
    ).simulationSeed;
    simulation.qRange.min = seed.qRange.min;
    simulation.qRange.max = seed.qRange.max;
    simulation.qRange.step = seed.qRange.step;

    simulation.pump.photonEnergyEv = seed.pump.photonEnergyEv;
    simulation.pump.excitedStateEnergyEv = seed.pump.excitedStateEnergyEv;
    simulation.pump.excitedStateFraction = seed.pump.excitedStateFraction;

    simulation.probe.wavelength = seed.probe.wavelength;
  });

  // TODO: make this consistent - sample sets the maximum q values, user can set values lower than those, which then bins the data via frontend js
  $effect(() => {
    const solvent = simulation.sample.solvent;
    if (!solvent) return;

    simulation.qRange.min = solvent.qMin ?? simulation.qRange.min;
    simulation.qRange.max = solvent.qMax ?? simulation.qRange.max;
    simulation.qRange.step = solvent.qStep ?? simulation.qRange.step;
  });

  const sample = $derived({
    moleculeName: simulation.sample.ground?.moleculeName,
    groundName: simulation.sample.ground?.filename,
    excitedName: simulation.sample.excited?.filename,
    solventName: simulation.sample.solvent?.name,
    concentrationSoluteMolar: simulation.sample.concentrationSoluteMolar,
  });

  function applySystemTheme() {
    document.documentElement.classList.toggle(
      'dark',
      localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches),
    );
  }

  onMount(() => {
    applySystemTheme();
    preloadMatterviz();
  });

  const heroPathname = resolve('/').replace('./', '/');
  const showSidebar = $derived(page.url.pathname !== heroPathname);
</script>

<Sidebar.Provider style="--sidebar-width: 19rem">
  {#if showSidebar}
    <AppSidebar {sample} />
  {/if}

  <Sidebar.Inset class="overflow-y-auto">
    <main class="m-0 mr-8 ml-8 flex justify-center-safe">
      <div class="max-w-[1920px] grow">
        {@render children?.()}
      </div>
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
