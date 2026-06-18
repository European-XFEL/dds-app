<script lang="ts">
  import { onMount } from 'svelte';
  import { ScatteringRenderer } from './scattering-engine';

  let canvas: HTMLCanvasElement;
  let renderer: ScatteringRenderer | null = null;

  onMount(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');

    try {
      renderer = new ScatteringRenderer(canvas, isDarkMode);
      renderer.start();
    } catch (e) {
      console.error(e);
      return;
    }

    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      renderer?.setDarkMode(dark);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      renderer?.dispose();
      renderer = null;
      observer.disconnect();
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="pointer-events-none absolute inset-0 h-full w-full"
  aria-hidden="true"
></canvas>
