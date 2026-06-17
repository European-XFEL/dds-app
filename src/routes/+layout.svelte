<script lang="ts">
  import '$css';

  import { asset } from '$app/paths';

  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import { createSimulationState, setSimulationState } from '$lib/state.svelte';

  let { children } = $props();

  const simulation = createSimulationState();
  setSimulationState(simulation);
</script>

<svelte:head>
  <link rel="icon" href={asset('/favicon.png')} />
  {#await import('katex/dist/katex.min.css') then katexCss}
    {katexCss.default}
  {/await}
</svelte:head>

<Sidebar.Provider style="--sidebar-width: 19rem">
  {@render children()}
</Sidebar.Provider>
