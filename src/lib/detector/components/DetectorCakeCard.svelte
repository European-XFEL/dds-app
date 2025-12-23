<script lang="ts">
  import { BadgeInfo } from '@lucide/svelte';

  import { fade } from 'svelte/transition';

  import * as Card from '$shadcn/ui/card/index.js';
  import { Skeleton } from '$shadcn/ui/skeleton/index.js';
  import * as Tooltip from '$shadcn/ui/tooltip/index.js';

  import type { CartesianPoint, DetectorModule, Shape } from '$lib/types';

  import CakeModuleLegend from './ui/CakeModuleLegend.svelte';

  interface Props {
    modules: DetectorModule[];
    distance: number;
    beamCenter: CartesianPoint;
    panelShape?: Shape;
  }

  let {
    modules = $bindable(),
    distance = $bindable(),
    beamCenter = $bindable(),
    panelShape = { width: 450, height: 600 },
  }: Props = $props();
</script>

<Card.Root class="w-full min-w-fit">
  <Card.Header class="relative gap-0">
    <Card.Title>Detector Caking Visualization</Card.Title>

    <Card.Action class="absolute -top-4 right-3">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger><BadgeInfo size={16} /></Tooltip.Trigger>
          <Tooltip.Content class="w-fit max-w-xs">
            Drag the <span class="font-medium text-destructive">red crosshair</span> to move the
            beam center or drag the <span class="font-medium text-blue-600">colored modules</span>
            to reposition them. The caked projection updates in real time.
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </Card.Action>
  </Card.Header>

  <Card.Content class="flex min-w-fit flex-col gap-6">
    <div class="flex grow flex-wrap justify-center-safe gap-6">
      <div class="min-w-fit">
        <div class="flow rounded-2xl border border-border/80 bg-muted/30 p-3 shadow-inner">
          {#await import('./ui/CakeCartesian.svelte')}
            <Skeleton
              class="h-[{panelShape.height}px] w-[{panelShape.width}px] mx-auto block rounded-lg bg-muted/30"
            />
          {:then { default: CakeViewCartesian }}
            <div in:fade|global={{ duration: 200 }}>
              <CakeViewCartesian bind:beamCenter bind:modules {panelShape} />
            </div>
          {/await}
        </div>
      </div>
      <div class="min-w-fit">
        <div class="flow rounded-2xl border border-border/80 bg-muted/30 p-3 shadow-inner">
          {#await import('./ui/CakePolar.svelte')}
            <Skeleton
              class="h-[{panelShape.height}px] w-[{panelShape.width}px] mx-auto block rounded-lg bg-muted/30"
            />
          {:then { default: CakeViewPolar }}
            <div in:fade|global={{ duration: 200 }}>
              <CakeViewPolar {beamCenter} {modules} {distance} {panelShape} tessellationGrid={20} />
            </div>
          {/await}
        </div>
      </div>
    </div>
    <CakeModuleLegend {modules} />
  </Card.Content>
</Card.Root>
