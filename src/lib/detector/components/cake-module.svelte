<script lang="ts">
  import { onDestroy } from 'svelte';

  import type { DetectorModule, CartesianPoint } from '$lib/types';

  let {
    module,
    onDrag,
    svgElement,
  }: {
    module: DetectorModule;
    onDrag: (id: string, newPos: CartesianPoint) => void;
    svgElement: SVGSVGElement | null;
  } = $props();

  let is_dragging = false;
  let drag_offset: CartesianPoint = { x: 0, y: 0 };

  const module_label = $derived(module.id.replace('module-', 'Module '));
  const module_color = $derived(module.color ?? 'var(--color-slate-500)');

  function handle_mouse_down(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!svgElement) return;

    is_dragging = true;

    const rect = svgElement.getBoundingClientRect();
    drag_offset = {
      x: event.clientX - rect.left - module.x,
      y: event.clientY - rect.top - module.y,
    };

    window.addEventListener('mousemove', handle_mouse_move);
    window.addEventListener('mouseup', handle_mouse_up);
  }

  function handle_mouse_move(event: MouseEvent) {
    if (!is_dragging || !svgElement) return;

    const rect = svgElement.getBoundingClientRect();
    const next_x = event.clientX - rect.left - drag_offset.x;
    const next_y = event.clientY - rect.top - drag_offset.y;
    onDrag(module.id, { x: next_x, y: next_y });
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
  role="button"
  tabindex="0"
  aria-label={`${module_label} detector module`}
  class="cursor-grab transition-[transform] outline-none active:cursor-grabbing"
  style="touch-action: none;"
  data-module-id={module.id}
  onmousedown={handle_mouse_down}
>
  <rect
    x={module.x}
    y={module.y}
    width={module.width}
    height={module.height}
    fill={module_color}
    fill-opacity="0.25"
    stroke={module_color}
    stroke-width="2"
    class="hover:fill-opacity-40 pointer-events-auto transition-[fill-opacity]"
  />
  <text
    x={module.x + module.width / 2}
    y={module.y + module.height / 2}
    text-anchor="middle"
    dominant-baseline="middle"
    fill={module_color}
    font-size="11"
    font-weight="600"
    class="pointer-events-none tracking-tight select-none"
  >
    {module_label.replace('Module ', 'M')}
  </text>
</g>
