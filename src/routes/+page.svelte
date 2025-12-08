<script lang="ts">
  import type { LineSeriesOption } from 'echarts/charts';
  import type {
    GridComponentOption,
    LegendComponentOption,
    TitleComponentOption,
    TooltipComponentOption,
  } from 'echarts/components';
  import type { ComposeOption } from 'echarts/core';

  import * as Resizable from '$shadcn/ui/resizable/index.js';
  import { ScrollArea } from '$shadcn/ui/scroll-area/index.js';
  import Toggle from '$shadcn/ui/toggle/toggle.svelte';

  import { getSimulationResult } from '$lib/data.remote';
  import { DetectorCard } from '$lib/detector';
  import LineChart from '$lib/plots/line-chart.svelte';
  import { PumpSetupCard } from '$lib/pump';
  import { SampleParametersCard } from '$lib/sample';
  import { useSimulationState } from '$lib/state.svelte';

  type SimulationResult = {
    q: number[];
    iGround: number[];
    iExcited: number[];
    iDiff: number[];
  };

  // Compose type for type-safe options
  type ECOption = ComposeOption<
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
  >;

  const simulation = useSimulationState();

  let short = $state(true);
  let result = $state<SimulationResult | null>(null);

  $effect(() => {
    let { ground, excited } = simulation.sample;
    let { min, max, step } = simulation.qRange;
    if (!ground || !excited || !min || !max || !step) {
      result = null;
      return;
    }

    const resultPromises = [ground.id, excited.id].map((id) => {
      if (!id) return null;
      return getSimulationResult({
        fileId: id,
        qRange: { min, max, step },
      });
    });

    Promise.all(resultPromises).then(([groundResult, excitedResult]) => {
      if (!groundResult || !excitedResult) {
        result = null;
        return;
      }

      result = {
        q: groundResult.q,
        iGround: groundResult.i,
        iExcited: excitedResult.i,
        iDiff: excitedResult.i.map((val, idx) => val - groundResult.i[idx]),
      };
    });
  });

  const constant_options: ECOption = {
    title: { text: 'Difference Scattering Signals ΔS(q)' },
    legend: { top: 'bottom' },
    xAxis: {
      id: 'q',
      name: 'q (Å⁻¹)',
      data: [],
      axisLabel: {
        formatter: (value: number) => Number(value).toPrecision(3),
      },
    },
    yAxis: { type: 'value' },
    series: [],
    animationDuration: 500,
    tooltip: { trigger: 'axis' },
  };

  let xAxis = $derived<ECOption['xAxis']>({
    id: 'q',
    data: result?.q ?? [],
  });

  const series_common: LineSeriesOption = {
    type: 'line',
    showSymbol: false,
    symbol: 'none',
  };

  let series = $derived<ECOption['series']>([
    {
      id: 'deltaS',
      name: 'ΔS',
      data: result?.iDiff ?? [],
      ...series_common,
    },
    {
      id: 'deltaSSoluteExFrac',
      name: 'ΔS Solute',
      data: result?.iExcited ?? [],
      ...series_common,
    },
    {
      id: 'deltaSSolvent',
      name: 'ΔS Solvent',
      data: result?.iGround ?? [],
      ...series_common,
    },
  ]);
</script>

<Resizable.PaneGroup direction="horizontal" class="max-h-svh max-w-full gap-4 rounded-lg">
  <Resizable.Pane defaultSize={70}>
    <!-- <div class="flow-row w-max items-center gap-3">
      <Badge variant="outline"
        >Delta T (K): {result?.deltaTemperatureK.toExponential(3) ?? 'N/A'}</Badge
      >
      <Badge variant="outline"
        >Deposited Energy (J): {result?.depositedEnergyJoule ?? 'N/A'}</Badge
      >
    </div> -->
    <div class="flex flex-col gap-6 pt-4">
      <LineChart {constant_options} {xAxis} {series} />
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={30} class="flex min-w-110 flex-col">
    <!-- <form
      action="?/run_simulation"
      method="post"
    >
      <div class="flex items-center gap-3">
        <Button type="submit" class="flex-1">Run Simulation</Button>
        <label class="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" class="h-4 w-4" bind:checked={autoRun} />
          Auto-Run
        </label>
      </div>
    </form> -->
    <ScrollArea class="@container h-full">
      <div class="grid flex-1 gap-4 overflow-y-auto p-4 md:grid-rows-1">
        <SampleParametersCard {short} />
        <!-- <SampleGroundCard /> -->
        <!-- <SampleExcitedCard /> -->
        <DetectorCard {short} />
        <PumpSetupCard {short} />
      </div>
    </ScrollArea>
    <Toggle class="mb-4 shrink-0 border-t bg-gray-50 p-0" bind:pressed={short}>
      {short ? 'Short Cards' : 'Detailed Cards'}
    </Toggle>
  </Resizable.Pane>
</Resizable.PaneGroup>
