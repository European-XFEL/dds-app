<script lang="ts">
  import '$css';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  import AppSidebar from '$components/sidebar/sidebar.svelte';
  import { appState } from '$lib/state.svelte';

  let { children } = $props();

  let state = $state(appState);

  let sample = $derived({
    groundName: state.sample.ground.name,
    excitedName: state.sample.excited.name,
    solventName: state.sample.solvent.name,
    concentration: state.sample.concentration,
  });
</script>

<Sidebar.Provider>
  <AppSidebar {sample} />

  <Sidebar.Inset>
    <div class="flex flex-1 flex-col gap-4 p-4">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
