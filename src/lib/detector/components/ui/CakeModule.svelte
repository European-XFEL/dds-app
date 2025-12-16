<script lang="ts">
  import { draw } from 'svelte/transition';

  import type { CartesianPoint, DetectorModule } from '$lib/types';

  import { useDrag } from './useDrag.svelte';

  interface Props {
    module: DetectorModule;
    onDrag: (id: string, newPos: CartesianPoint) => void;
    svgElement: SVGSVGElement | null;
  }

  let { module, onDrag, svgElement }: Props = $props();

  const moduleLabel = $derived(module.id.replace('module-', 'Module '));
  const moduleColor = $derived(module.color ?? 'var(--color-slate-500)');

  const drag = useDrag({
    getSvgElement: () => svgElement,
    onDrag: (pos) => onDrag(module.id, pos),
    getOffset: () => ({ x: module.x, y: module.y }),
  });
</script>

<g
  role="button"
  tabindex="0"
  aria-label={`${moduleLabel} detector module`}
  class="cursor-grab transition-[transform] outline-none active:cursor-grabbing"
  style="touch-action: none;"
  data-module-id={module.id}
  onmousedown={drag.handleMouseDown}
>
  <rect
    in:draw|global={{ duration: 1200, delay: 200 }}
    x={module.x}
    y={module.y}
    width={module.width}
    height={module.height}
    fill={moduleColor}
    fill-opacity="0.25"
    stroke={moduleColor}
    stroke-width="2"
    class="hover:fill-opacity-40 pointer-events-auto transition-[fill-opacity]"
  />
  <text
    x={module.x + module.width / 2}
    y={module.y + module.height / 2}
    text-anchor="middle"
    dominant-baseline="middle"
    fill={moduleColor}
    font-size="11"
    font-weight="600"
    class="pointer-events-none tracking-tight select-none"
  >
    {moduleLabel.replace('Module ', 'M')}
  </text>
</g>
