<script lang="ts">
  import '$css';
  import '@xyflow/svelte/dist/style.css';

  import { Separator } from '$shadcn/ui/separator';
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import AppSidebar from '$lib/sidebar/Sidebar.svelte';
  import {
    type SimulationState,
    createSimulationSeed,
    setSimulationState,
  } from '$lib/state.svelte';

  let { children } = $props();

  const simulationSeed = createSimulationSeed();

  setSimulationState(simulationSeed);

  const simulation: SimulationState = $state(simulationSeed);

  const sample = $derived({
    groundName: simulation.sample.ground?.name,
    excitedName: simulation.sample.excited?.name,
    solventName: simulation.sample.solvent?.name,
    concentrationSoluteMolar: simulation.sample.concentrationSoluteMolar,
  });
</script>

<Sidebar.Provider style="--sidebar-width: 19rem;" class="h-svh">
  <AppSidebar {sample} />

  <Sidebar.Inset class="overflow-y-auto">
    <header class="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background px-4">
      <Sidebar.Trigger class="-ms-1" />
      <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
    </header>
    <main class="px-4 pb-4">
      {@render children?.()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
