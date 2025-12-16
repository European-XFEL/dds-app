<script lang="ts">
  import { onDestroy } from 'svelte';
  import { draw, fade } from 'svelte/transition';

  import type { CartesianPoint } from '$lib/types';

  interface Props {
    x: number;
    y: number;
    size?: number;
    onDrag: (newPos: CartesianPoint) => void;
    svgElement: SVGSVGElement | null;
  }

  let { x, y, size = 15, onDrag, svgElement }: Props = $props();

  });
</script>

<g
  class="cursor-move text-destructive"
  style="touch-action: none;"
  role="button"
  tabindex="0"
  aria-label="Beam center crosshair"
  onmousedown={handle_mouse_down}
>
  <line
    in:draw|global={{ duration: 1200, delay: 200 }}
    x1={x}
    y1={y - size}
    x2={x}
    y2={y + size}
    stroke="currentColor"
    stroke-width="2"
  />
  <line
    in:draw|global={{ duration: 1200, delay: 200 }}
    x1={x - size}
    y1={y}
    x2={x + size}
    y2={y}
    stroke="currentColor"
    stroke-width="2"
  />
  <circle
    in:draw|global={{ duration: 3000, delay: 500 }}
    cx={x}
    cy={y}
    r="6"
    fill="currentColor"
    fill-opacity="0.3"
    stroke="currentColor"
    stroke-width="1.5"
  />
</g>
