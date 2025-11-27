<script lang="ts">
  import '$css';

  import { Separator } from '$shadcn/ui/separator';
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import { appState } from '$lib/state.svelte';

  import AppSidebar from '$components/sidebar/sidebar.svelte';

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
    <header class="flex h-fit shrink-0 items-center gap-2 border-b px-4">
      <Sidebar.Trigger class="-ms-1" />
      <Separator orientation="vertical" class="me-2 h-4" />
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
