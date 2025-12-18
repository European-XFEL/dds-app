<script lang="ts">
  import '$css';
  import '@xyflow/svelte/dist/style.css';

  import { Separator } from '$shadcn/ui/separator';
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
</script>

<Sidebar.Provider style="--sidebar-width: 19rem;" class="h-svh">
  <AppSidebar {sample} />

  <Sidebar.Inset class="overflow-y-auto">
    <header class="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background px-4">
      <Sidebar.Trigger class="-ms-1" />
      <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
    </header>
    <main class="mx-4 flex justify-center-safe">
      <div class="max-w-[1920px] grow">
        {@render children?.()}
      </div>
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
