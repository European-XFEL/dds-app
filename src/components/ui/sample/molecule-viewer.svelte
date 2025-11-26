<script lang="ts">
  import * as TDmol from '3dmol';

  import { onMount } from 'svelte';

  import type { SampleDetails } from '$lib/types';

  let {
    molecule,
  }: {
    molecule: SampleDetails['ground'] | SampleDetails['excited'];
  } = $props();

  let container: HTMLDivElement | null = null;

  let viewer: TDmol.GLViewer | null = null;

  let config = { backgroundColor: 'white', antialias: true };

  onMount(() => {
    viewer = TDmol.createViewer(container, config);
  });

  $effect(() => {
    if (!viewer || !molecule?.content) return;
    let xyz = molecule.content;
    viewer.removeAllModels();
    viewer.addModel(xyz, 'xyz');
    viewer.setStyle({}, { stick: {} });
    viewer.zoomTo();
    viewer.render();
  });
</script>

<div bind:this={container} class="mol-container"></div>

<style>
  .mol-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
