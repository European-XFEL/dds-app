<script lang="ts">
  import { draw } from 'svelte/transition';

  import type { CartesianPoint, DetectorModule } from '$lib/types';

  import Crosshair from './ui/CakeCrosshair.svelte';
  import DraggableModule from './ui/CakeModule.svelte';

  interface Props {
    modules: DetectorModule[];
    beamCenter: CartesianPoint;
    panelWidth?: number;
    panelHeight?: number;
  }

  let {
    modules = $bindable(),
    beamCenter = $bindable(),
    panelWidth = 450,
    panelHeight = 600,
  }: Props = $props();

  let detectorSvgElement = $state<SVGSVGElement | null>(null);

  function handleCenterDrag(newPos: CartesianPoint) {
    beamCenter = {
      x: Math.max(10, Math.min(panelWidth - 10, newPos.x)),
      y: Math.max(10, Math.min(panelHeight - 10, newPos.y)),
    };
  }

  function handleModuleDrag(id: string, newPos: CartesianPoint) {
    modules = modules.map((module) =>
      module.id === id ? { ...module, x: newPos.x, y: newPos.y } : module,
    );
  }

  const radius_rings = [50, 100, 150, 200] as const;
</script>

<div class="flow max-w-fit rounded-2xl border border-border/80 bg-muted/30 p-3 shadow-inner">
  <svg
    bind:this={detectorSvgElement}
    width={panelWidth}
    height={panelHeight}
    class="mx-auto block rounded-lg bg-muted/30 text-muted-foreground/80"
  >
    <defs>
      <pattern id="detectorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          stroke-opacity="0.1"
          stroke-width="1"
        />
      </pattern>
    </defs>
    <rect width={panelWidth} height={panelHeight} fill="url(#detectorGrid)" />
    {#each radius_rings as radius (radius)}
      <circle
        in:draw|global={{ duration: 3000, delay: 500 }}
        cx={beamCenter.x}
        cy={beamCenter.y}
        r={radius}
        fill="none"
        stroke="currentColor"
        stroke-opacity="0.35"
        stroke-width="1"
        stroke-dasharray="4 1"
      />
    {/each}
    {#each modules as module (module.id)}
      <DraggableModule {module} onDrag={handleModuleDrag} svgElement={detectorSvgElement} />
    {/each}
    <Crosshair
      x={beamCenter.x}
      y={beamCenter.y}
      onDrag={handleCenterDrag}
      svgElement={detectorSvgElement}
    />
    <text
      x={panelWidth - 5}
      y={panelHeight - 5}
      text-anchor="end"
      font-size="10"
      fill="currentColor"
      fill-opacity="0.5"
    >
      x →
    </text>
    <text x="5" y="15" font-size="10" fill="currentColor" fill-opacity="0.5">y ↓</text>
  </svg>
</div>
