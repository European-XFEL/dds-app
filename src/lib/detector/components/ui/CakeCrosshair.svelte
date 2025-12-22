<script lang="ts">
  import { draw } from 'svelte/transition';

  import type { CartesianPoint } from '$lib/types';

  import { useDrag } from './useDrag.svelte';

  interface Props {
    pos: CartesianPoint;
    size?: number;
    onDrag: (newPos: CartesianPoint) => void;
    svgElement: SVGSVGElement | null;
  }

  let { pos, size = 15, onDrag, svgElement }: Props = $props();

  const drag = useDrag({
    getSvgElement: () => svgElement,
    onDrag: (pos) => onDrag(pos),
  });
</script>

<g
  class="cursor-move text-destructive"
  style="touch-action: none;"
  role="button"
  tabindex="0"
  aria-label="Beam center crosshair"
  onmousedown={drag.handleMouseDown}
>
  <line
    in:draw|global={{ duration: 1200, delay: 200 }}
    x1={pos.x}
    y1={pos.y - size}
    x2={pos.x}
    y2={pos.y + size}
    stroke="currentColor"
    stroke-width="2"
  />
  <line
    in:draw|global={{ duration: 1200, delay: 200 }}
    x1={pos.x - size}
    y1={pos.y}
    x2={pos.x + size}
    y2={pos.y}
    stroke="currentColor"
    stroke-width="2"
  />
  <circle
    in:draw|global={{ duration: 3000, delay: 500 }}
    cx={pos.x}
    cy={pos.y}
    r="6"
    fill="currentColor"
    fill-opacity="0.3"
    stroke="currentColor"
    stroke-width="1.5"
  />
</g>
