<script lang="ts">
  import '$css';
  import { pwaInfo } from 'virtual:pwa-info';

  import { onMount } from 'svelte';

  import { asset } from '$app/paths';

  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import { createSimulationState, setSimulationState } from '$lib/state.svelte';

  let { children } = $props();

  const simulation = createSimulationState();
  setSimulationState(simulation);

  function applySystemTheme() {
    document.documentElement.classList.toggle(
      'dark',
      localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches),
    );
  }

  const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

  onMount(async () => {
    applySystemTheme();
  });
</script>

<svelte:head>
  <link rel="icon" href={asset('/favicon.png')} />
  {@html webManifest}
</svelte:head>

<Sidebar.Provider style="--sidebar-width: 19rem">
  {@render children()}
</Sidebar.Provider>
