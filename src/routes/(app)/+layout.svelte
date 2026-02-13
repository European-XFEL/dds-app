<script lang="ts">
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import { Sidebar as AppSidebar } from '$lib/nav';
  import { useSimulationState } from '$lib/state.svelte';

  let { children } = $props();

  const simulation = useSimulationState();

  const sample = $derived({
    moleculeName: simulation.sample.ground?.moleculeName,
    groundName: simulation.sample.ground?.filename,
    excitedName: simulation.sample.excited?.filename,
    solventName: simulation.sample.solvent?.name,
    concentrationSoluteMolar: simulation.sample.concentrationSoluteMolar,
  });
</script>

<AppSidebar {sample} />

<Sidebar.Inset class="m-4 flex justify-center-safe overflow-y-auto">
  <div class="max-w-480 grow">
    {@render children()}
  </div>
</Sidebar.Inset>
