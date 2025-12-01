<script lang="ts">
  import { onDestroy } from 'svelte';

  import type { Point } from '$lib/math/crystallography_transforms';

  let {
    x,
    y,
    size = 15,
    onDrag,
    svgElement,
  }: {
    x: number;
    y: number;
    size?: number;
    onDrag: (newPos: Point) => void;
    svgElement: SVGSVGElement | null;
  } = $props();

  let is_dragging = false;

  function handle_mouse_down(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!svgElement) return;

    is_dragging = true;
    window.addEventListener('mousemove', handle_mouse_move);
    window.addEventListener('mouseup', handle_mouse_up);
  }

  function handle_mouse_move(event: MouseEvent) {
    if (!is_dragging || !svgElement) return;

    const rect = svgElement.getBoundingClientRect();
    const next_x = event.clientX - rect.left;
    const next_y = event.clientY - rect.top;
    onDrag({ x: next_x, y: next_y });
  }

  function handle_mouse_up() {
    if (!is_dragging) return;

    is_dragging = false;
    remove_global_listeners();
  }

  function remove_global_listeners() {
    if (typeof window === 'undefined') return;

    window.removeEventListener('mousemove', handle_mouse_move);
    window.removeEventListener('mouseup', handle_mouse_up);
  }

  onDestroy(() => {
    remove_global_listeners();
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
  <line x1={x} y1={y - size} x2={x} y2={y + size} stroke="currentColor" stroke-width="2" />
  <line x1={x - size} y1={y} x2={x + size} y2={y} stroke="currentColor" stroke-width="2" />
  <circle
    cx={x}
    cy={y}
    r="6"
    fill="currentColor"
    fill-opacity="0.3"
    stroke="currentColor"
    stroke-width="1.5"
  />
</g>
