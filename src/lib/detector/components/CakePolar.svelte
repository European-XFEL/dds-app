<script lang="ts">
  import { draw } from 'svelte/transition';

  import {
    generateCakedGridLines,
    radiusToTwoTheta,
    tessellatedModuleToSvgPaths,
    transformModuleTessellated,
  } from '$lib/detector/components/Cake.helper';
  import type { CartesianPoint, DetectorModule, TransformedModuleTessellated } from '$lib/types';

  let {
    modulesWithColor = $bindable(),
    beamCenter = $bindable(),
    detectorDistance = 300,
    panelWidth = 450,
    panelHeight = 600,
    radiusRange = [0, 250] as [number, number],
    tessellationGrid = 20,
  }: {
    modulesWithColor: DetectorModule[];
    beamCenter: CartesianPoint;
    detectorDistance?: number;
    panelWidth?: number;
    panelHeight?: number;
    radiusRange?: [number, number];
    tessellationGrid?: number;
  } = $props();

  const chi_range: [number, number] = [-Math.PI, Math.PI];
  const two_theta_step_degrees = 5;
  const chi_step_degrees = 45;

  let two_theta_range = $derived<[number, number]>([
    radiusToTwoTheta(radiusRange[0], detectorDistance),
    radiusToTwoTheta(radiusRange[1], detectorDistance),
  ]);
  let two_theta_span = $derived(Math.max(two_theta_range[1] - two_theta_range[0], Number.EPSILON));

  let transformed_modules = $derived<TransformedModuleTessellated[]>(
    modulesWithColor.map((module) =>
      transformModuleTessellated(module, beamCenter, detectorDistance, tessellationGrid),
    ),
  );

  let grid_lines = $derived(
    generateCakedGridLines(
      panelWidth,
      panelHeight,
      two_theta_range,
      chi_range,
      two_theta_step_degrees,
      chi_step_degrees,
    ),
  );

  let transformed_paths = $derived(
    transformed_modules.flatMap((module) => {
      const paths = tessellatedModuleToSvgPaths(
        module,
        panelWidth,
        panelHeight,
        two_theta_range,
        chi_range,
      );
      return paths.map((path, idx) => ({
        id: `${module.id}-quad-${idx}`,
        color: module.color,
        path,
      }));
    }),
  );

  const chi_labels = [-180, -135, -90, -45, 0, 45, 90, 135, 180];
  let two_theta_labels = $derived.by(() =>
    generate_two_theta_labels(two_theta_range, two_theta_step_degrees),
  );

  function generate_two_theta_labels(range: [number, number], step: number): number[] {
    const [min, max] = range;
    if (step <= 0) return [];
    const labels: number[] = [];
    const start = Math.ceil(min / step) * step;
    for (let value = start; value <= max + 1e-6; value += step) {
      labels.push(Number(value.toFixed(2)));
    }
    return labels;
  }

  function format_two_theta_label(value: number): string {
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1).replace(/\.0$/, '');
  }
</script>

<div class="flow max-w-fit rounded-2xl border border-border/80 bg-muted/30 p-3 shadow-inner">
  <svg width={panelWidth} height={panelHeight} class="mx-auto block rounded-lg bg-muted/30">
    {#each grid_lines.twoThetaLines as x, idx (idx)}
      <line
        x1={x}
        y1="0"
        x2={x}
        y2={panelHeight}
        stroke="currentColor"
        stroke-opacity="0.15"
        stroke-width="1"
      />
    {/each}
    {#each grid_lines.chiLines as y, idx (idx)}
      <line
        x1="0"
        y1={y}
        x2={panelWidth}
        y2={y}
        stroke="currentColor"
        stroke-opacity="0.15"
        stroke-width="1"
      />
    {/each}
    {#each transformed_paths as tp (tp.id)}
      <path
        in:draw|global={{ duration: 1200, delay: 200 }}
        d={tp.path}
        fill={tp.color}
        fill-opacity="0.35"
        stroke={tp.color}
        stroke-width="0.5"
        stroke-opacity="0.3"
      />
    {/each}
    {#each two_theta_labels as theta (theta)}
      {@const x = ((theta - two_theta_range[0]) / two_theta_span) * panelWidth}
      <text
        {x}
        y={panelHeight - 4}
        text-anchor="middle"
        font-size="9"
        fill="currentColor"
        fill-opacity="0.6"
      >
        {format_two_theta_label(theta)}
      </text>
    {/each}
    {#each chi_labels as chi (chi)}
      {@const chi_rad = (chi * Math.PI) / 180}
      {@const y = ((chi_rad - chi_range[0]) / (chi_range[1] - chi_range[0])) * panelHeight}
      <text
        x="6"
        {y}
        dy="3"
        text-anchor="start"
        font-size="9"
        fill="currentColor"
        fill-opacity="0.6"
      >
        {chi}°
      </text>
    {/each}
    <text
      x={panelWidth / 2}
      y={panelHeight - 14}
      text-anchor="middle"
      font-size="10"
      fill="currentColor"
      fill-opacity="0.7"
    >
      Scattering angle 2θ (°)
    </text>
    <text
      x={-panelHeight / 2}
      y="12"
      text-anchor="middle"
      font-size="10"
      fill="currentColor"
      fill-opacity="0.7"
      transform="rotate(-90)"
    >
      Chi χ (°)
    </text>
  </svg>
</div>
