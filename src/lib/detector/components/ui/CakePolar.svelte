<script lang="ts">
  import { draw } from 'svelte/transition';

  import type { CartesianPoint, DetectorModule, Shape } from '$lib/types';

  import type { TessellatedModule } from './Cake.helper';
  import {
    generateCakedGridLines,
    radiusToTwoTheta,
    tessellatedModuleToSvgPaths,
    transformModuleTessellated,
  } from './Cake.helper';

  interface Props {
    modules: DetectorModule[];
    beamCenter: CartesianPoint;
    distance?: number;
    panelShape?: Shape;
    radiusRange: { min: number; max: number };
    tessellationGrid?: number;
  }

  let {
    modules,
    beamCenter,
    distance = 300,
    panelShape = { width: 600, height: 400 },
    radiusRange,
    tessellationGrid = 20,
  }: Props = $props();

  const chiRange: [number, number] = [-Math.PI, Math.PI];
  const twoThetaStepDegrees = 5;
  const chiStepDegrees = 45;

  let twoThetaRange = $derived<[number, number]>([
    radiusToTwoTheta(Math.max(radiusRange.min - 5, 0), distance),
    radiusToTwoTheta(radiusRange.max, distance),
  ]);
  let twoThetaSpan = $derived(Math.max(twoThetaRange[1] - twoThetaRange[0], Number.EPSILON));

  let transformedModules = $derived<TessellatedModule[]>(
    modules.map((module) =>
      transformModuleTessellated(module, beamCenter, distance, tessellationGrid),
    ),
  );

  let gridLines = $derived(
    generateCakedGridLines(
      panelShape,
      twoThetaRange,
      chiRange,
      twoThetaStepDegrees,
      chiStepDegrees,
    ),
  );

  let transformedPaths = $derived(
    transformedModules.flatMap((module) => {
      const paths = tessellatedModuleToSvgPaths(module, panelShape, twoThetaRange, chiRange);
      return paths.map((path, idx) => ({
        id: `${module.id}-quad-${idx}`,
        color: module.color,
        path,
      }));
    }),
  );

  const chiLabels = [-180, -135, -90, -45, 0, 45, 90, 135, 180];
  let twoThetaLabels = $derived.by(() => genTwoThetaLabels(twoThetaRange, twoThetaStepDegrees));

  function genTwoThetaLabels(range: [number, number], step: number): number[] {
    const [min, max] = range;
    if (step <= 0) return [];
    const labels: number[] = [];
    const start = Math.ceil(min / step) * step;
    for (let value = start; value <= max + 1e-6; value += step) {
      labels.push(Number(value.toFixed(2)));
    }
    return labels;
  }

  function formatTwoThetaLabel(value: number): string {
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1).replace(/\.0$/, '');
  }

  // This was previously in a div wrapper:
  // <div class="flow max-w-fit rounded-2xl border border-border/80 bg-muted/30 p-3 shadow-inner">
</script>

<svg
  width={panelShape.width}
  height={panelShape.height}
  class="mx-auto block rounded-lg bg-muted/30"
>
  {#each gridLines.twoThetaLines as x, idx (idx)}
    <line
      x1={x}
      y1="0"
      x2={x}
      y2={panelShape.height}
      stroke="currentColor"
      stroke-opacity="0.15"
      stroke-width="1"
    />
  {/each}
  {#each gridLines.chiLines as y, idx (idx)}
    <line
      x1="0"
      y1={y}
      x2={panelShape.width}
      y2={y}
      stroke="currentColor"
      stroke-opacity="0.15"
      stroke-width="1"
    />
  {/each}
  {#each transformedPaths as tp (tp.id)}
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
  {#each twoThetaLabels as theta (theta)}
    {@const x = ((theta - twoThetaRange[0]) / twoThetaSpan) * panelShape.width}
    <text
      {x}
      y={panelShape.height - 4}
      text-anchor="middle"
      font-size="9"
      fill="currentColor"
      fill-opacity="0.6"
    >
      {formatTwoThetaLabel(theta)}
    </text>
  {/each}
  {#each chiLabels as chi (chi)}
    {@const chi_rad = (chi * Math.PI) / 180}
    {@const y = ((chi_rad - chiRange[0]) / (chiRange[1] - chiRange[0])) * panelShape.height}
    <text x="6" {y} dy="3" text-anchor="start" font-size="9" fill="currentColor" fill-opacity="0.6">
      {chi}°
    </text>
  {/each}
  <text
    x={panelShape.width / 2}
    y={panelShape.height - 14}
    text-anchor="middle"
    font-size="10"
    fill="currentColor"
    fill-opacity="0.7"
  >
    Scattering angle 2θ (°)
  </text>
  <text
    x={-panelShape.height / 2}
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
