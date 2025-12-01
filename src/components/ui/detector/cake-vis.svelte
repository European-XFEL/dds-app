<script lang="ts">
  import { BadgeInfo } from '@lucide/svelte';

  import * as Card from '$shadcn/ui/card/index.js';
  import * as Tooltip from '$shadcn/ui/tooltip/index.js';

  import {
    generateCakedGridLines,
    radiusToTwoTheta,
    tessellatedModuleToSvgPaths,
    transformModuleTessellated,
  } from '$lib/math/crystallography_transforms';
  import type { DetectorModule, Point, TransformedModuleTessellated } from '$lib/types/';

  import Crosshair from './cake-crosshair.svelte';
  import DraggableModule from './cake-module.svelte';

  let {
    detectorModules = $bindable(),
    beamCenter = $bindable(),
    detectorDistance = 300,
    panelWidth = 450,
    panelHeight = 350,
    radiusRange = [0, 250] as [number, number],
    tessellationGrid = 20,
  }: {
    detectorModules: DetectorModule[];
    beamCenter: Point;
    detectorDistance?: number;
    panelWidth?: number;
    panelHeight?: number;
    radiusRange?: [number, number];
    tessellationGrid?: number;
  } = $props();

  let detectorSvgElement = $state<SVGSVGElement | null>(null);

  const tailwind_gradient_tokens = [
    '--color-red-500',
    '--color-amber-500',
    '--color-lime-500',
    '--color-emerald-500',
    '--color-sky-500',
    '--color-indigo-500',
    '--color-fuchsia-500',
    '--color-rose-600',
  ] as const;

  function resolve_module_color(index: number, explicit?: string): string {
    if (explicit) return explicit;
    const token = tailwind_gradient_tokens[index % tailwind_gradient_tokens.length];
    return `var(${token})`;
  }

  let modules_with_color = $derived(
    detectorModules.map((module, index) => ({
      ...module,
      color: resolve_module_color(index, module.color),
    })),
  );

  function attachDetectorSvg(node: SVGSVGElement) {
    detectorSvgElement = node;
    return {
      destroy() {
        if (detectorSvgElement === node) {
          detectorSvgElement = null;
        }
      },
    };
  }

  const chi_range: [number, number] = [-Math.PI, Math.PI];
  const two_theta_step_degrees = 5;
  const chi_step_degrees = 45;

  let two_theta_range = $derived<[number, number]>([
    radiusToTwoTheta(radiusRange[0], detectorDistance),
    radiusToTwoTheta(radiusRange[1], detectorDistance),
  ]);
  let two_theta_span = $derived(Math.max(two_theta_range[1] - two_theta_range[0], Number.EPSILON));

  let transformed_modules = $derived<TransformedModuleTessellated[]>(
    modules_with_color.map((module) =>
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

  function handleCenterDrag(newPos: Point) {
    beamCenter = {
      x: Math.max(10, Math.min(panelWidth - 10, newPos.x)),
      y: Math.max(10, Math.min(panelHeight - 10, newPos.y)),
    };
  }

  function handleModuleDrag(id: string, newPos: Point) {
    detectorModules = detectorModules.map((module) =>
      module.id === id ? { ...module, x: newPos.x, y: newPos.y } : module,
    );
  }

  const radius_rings = [50, 100, 150, 200] as const;

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

<Card.Root class="@container w-full min-w-fit">
  <Card.Header class="gap-3">
    <div class="items-center gap-3">
      <Card.Title>Detector Caking Visualization</Card.Title>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger><BadgeInfo size={14} /></Tooltip.Trigger>
          <Tooltip.Content class="max-w-xs">
            Drag the <span class="font-medium text-destructive">red crosshair</span> to move the
            beam center or drag the <span class="font-medium text-foreground">colored modules</span>
            to reposition them. The caked projection updates in real time.
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  </Card.Header>

  <Card.Content class="space-y-6">
    <div class="flex flex-wrap justify-center gap-6">
      <section class="flex min-w-fit flex-col gap-3">
        <p class="text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Detector view (x, y)
        </p>
        <div class="rounded-2xl border border-border/80 bg-muted/30 p-3 shadow-inner">
          <svg
            {@attach attachDetectorSvg}
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
                cx={beamCenter.x}
                cy={beamCenter.y}
                r={radius}
                fill="none"
                stroke="currentColor"
                stroke-opacity="0.15"
                stroke-width="1"
                stroke-dasharray="4 4"
              />
            {/each}

            {#each modules_with_color as module (module.id)}
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
        <p class="text-center text-xs text-muted-foreground">
          Center: ({beamCenter.x.toFixed(0)}, {beamCenter.y.toFixed(0)})
        </p>
      </section>

      <section class="flex min-w-fit flex-col gap-3">
        <p class="text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Caked view (2θ, χ)
        </p>
        <div class="rounded-2xl border border-border/80 bg-muted/30 p-3 shadow-inner">
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
      </section>
    </div>

    <!-- Module legend -->
    <div class="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
      {#each modules_with_color as module (module.id)}
        <div
          class="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 shadow-sm"
        >
          <span
            class="size-3 rounded-full border border-border/70"
            style={`background-color: ${module.color}; opacity: 0.7;`}
            aria-hidden="true"
          ></span>
          <span class="font-medium">{module.id.replace('module-', 'Module ')}</span>
        </div>
      {/each}
    </div>
  </Card.Content>
</Card.Root>
