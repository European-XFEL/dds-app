<script lang="ts">
  import '$css';

  import { Separator } from '$shadcn/ui/separator';
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import { createSimulationSeed, provideSimulationState } from '$lib/state.svelte';

  import AppSidebar from '$components/sidebar/Sidebar.svelte';

  let { children } = $props();

  const simulation = $state(createSimulationSeed());
  provideSimulationState(simulation);

  const sample = $derived({
    groundName: simulation.sample.ground.name,
    excitedName: simulation.sample.excited.name,
    solventName: simulation.sample.solvent.name,
    concentrationSoluteMolar: simulation.sample.concentrationSoluteMolar,
  });
</script>

<Sidebar.Provider style="--sidebar-width: 19rem;">
  <AppSidebar {sample} />

  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2 px-4">
      <Sidebar.Trigger class="-ms-1" />
      <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
