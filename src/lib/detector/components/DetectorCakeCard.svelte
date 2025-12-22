<script lang="ts">
  import { BadgeInfo } from '@lucide/svelte';

  import * as Card from '$shadcn/ui/card/index.js';
  import * as Tooltip from '$shadcn/ui/tooltip/index.js';

  import type { CartesianPoint, DetectorModule, Shape } from '$lib/types';

  import CakeViewCartesian from './ui/CakeCartesian.svelte';
  import CakeModuleLegend from './ui/CakeModuleLegend.svelte';
  import CakeViewPolar from './ui/CakePolar.svelte';

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
  <Card.Header class="gap-3">
    <Card.Title
      >Detector Caking Visualization
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger><BadgeInfo size={14} /></Tooltip.Trigger>
          <Tooltip.Content class="max-w-xs">
            Drag the <span class="font-medium text-destructive">red crosshair</span> to move the
            beam center or drag the <span class="font-medium text-blue-600">colored modules</span>
            to reposition them. The caked projection updates in real time.
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </Card.Title>
  </Card.Header>

  <Card.Content class="flex flex-col gap-6">
    <div class="flex grow flex-wrap justify-center-safe gap-6">
      <div class="min-w-sm">
        <CakeViewCartesian bind:beamCenter bind:modules {panelShape} />
      </div>
      <div class="min-w-sm">
        <CakeViewPolar {beamCenter} {modules} {distance} {panelShape} tessellationGrid={20} />
      </div>
    </div>
    <CakeModuleLegend {modules} />
  </Card.Content>
</Card.Root>
