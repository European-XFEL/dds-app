<script lang="ts">
  import { BadgeInfo } from '@lucide/svelte';

  import * as Card from '$shadcn/ui/card/index.js';
  import * as Tooltip from '$shadcn/ui/tooltip/index.js';

  import { useSimulationState } from '$lib/state.svelte';

  import { resolve_module_color } from './components/Cake.helper';
  import CakeViewCartesian from './components/CakeCartesian.svelte';
  import CakeViewPolar from './components/CakePolar.svelte';
  import CakeModuleLegend from './components/ui/CakeModuleLegend.svelte';

  const simulation = useSimulationState();

  $effect(() => {
    const modules = simulation.detector.modules;

    const moduleXs = modules.map((m) => m.x);
    const moduleYs = modules.map((m) => m.y);

    const X = Math.max(...moduleXs) - Math.min(...moduleXs);
    const Y = Math.min(...moduleYs) - Math.max(...moduleYs);

    simulation.detector.imageShape = { width: X + modules[0].width, height: Y + modules[0].height };
  });

  let modulesWithColor = $derived(
    simulation.detector.modules.map((module, idx) => ({
      ...module,
      color: resolve_module_color(idx),
    })),
  );
</script>

<Card.Root class="@container w-full min-w-fit">
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
      <CakeViewCartesian
        bind:beamCenter={simulation.detector.beamCenter}
        bind:modulesWithColor
        panelWidth={450}
        panelHeight={600}
      />
      <CakeViewPolar
        bind:beamCenter={simulation.detector.beamCenter}
        bind:modulesWithColor
        detectorDistance={simulation.detector.distance}
        panelWidth={450}
        panelHeight={600}
        tessellationGrid={20}
      />
    </div>
    <CakeModuleLegend {modulesWithColor} />
  </Card.Content>
</Card.Root>
