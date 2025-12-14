<script lang="ts">
  import '$css';
  import '@xyflow/svelte/dist/style.css';

  import { Separator } from '$shadcn/ui/separator';
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import AppSidebar from '$lib/sidebar/Sidebar.svelte';
  import { type SimulationState, createSimulationSeed } from '$lib/state.svelte';

  let { children } = $props();

  const simulation: SimulationState = $state(createSimulationSeed());

  const sample = $derived({
    groundName: simulation.sample.ground?.name,
    excitedName: simulation.sample.excited?.name,
    solventName: simulation.sample.solvent?.name,
    concentrationSoluteMolar: simulation.sample.concentrationSoluteMolar,
  });
</script>

<Sidebar.Provider style="--sidebar-width: 19rem;" class="h-svh overflow-hidden">
  <AppSidebar {sample} />

  <Sidebar.Inset class="overflow-hidden">
    <header class="flex h-16 shrink-0 items-center gap-2 px-4">
      <Sidebar.Trigger class="-ms-1" />
      <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
    </header>
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
