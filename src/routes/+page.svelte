<script lang="ts">
  import type { EChartsOption, SeriesOption } from 'echarts';

  import { onDestroy } from 'svelte';
  import JSONTree from 'svelte-json-tree';

  import { enhance } from '$app/forms';

  import { Button } from '$shadcn/ui/button/index.js';
  import * as Resizable from '$shadcn/ui/resizable/index.js';
  import { ScrollArea } from '$shadcn/ui/scroll-area/index.js';
  import Toggle from '$shadcn/ui/toggle/toggle.svelte';

  import { useSimulationState } from '$lib/state.svelte';

  import DetectorCard from '$components/DetectorSetupCard.svelte';
  import PumpCard from '$components/PumpSetupCard.svelte';
  import { SampleParametersCard } from '$components/sample';
  import LineChart from '$components/ui/plots/line-chart.svelte';

  import type { PageProps } from './$types';

  const simulation = useSimulationState();

  let short = $state(true);
  let autoRun = $state(true);

  const AUTO_RUN_DEBOUNCE_MS = 300;

  let runForm: HTMLFormElement | null = null;
  let hasRegisteredSnapshot = false;
  let lastSimulationSnapshot = '';

  let previousAutoRun = true;
  let autoSubmitTimeout: ReturnType<typeof setTimeout> | null = null;

  const simulation_json = $derived(JSON.stringify($state.snapshot(simulation)));

  function attachRunForm(node: HTMLFormElement) {
    runForm = node;
    return () => {
      if (runForm === node) runForm = null;
    };
  }

  function submitSimulation() {
    runForm?.requestSubmit();
  }

  $effect(() => {
    const snapshot = simulation_json;

    if (!hasRegisteredSnapshot) {
      hasRegisteredSnapshot = true;
      lastSimulationSnapshot = snapshot;
      return;
    }

    if (!autoRun) {
      lastSimulationSnapshot = snapshot;
      if (autoSubmitTimeout) {
        clearTimeout(autoSubmitTimeout);
        autoSubmitTimeout = null;
      }
      return;
    }

    if (snapshot === lastSimulationSnapshot) {
      return;
    }

    lastSimulationSnapshot = snapshot;
    if (!runForm) {
      return;
    }
    if (autoSubmitTimeout) {
      clearTimeout(autoSubmitTimeout);
    }
    autoSubmitTimeout = setTimeout(() => {
      autoSubmitTimeout = null;
      submitSimulation();
    }, AUTO_RUN_DEBOUNCE_MS);
  });

  $effect(() => {
    if (autoRun && !previousAutoRun && hasRegisteredSnapshot && runForm) {
      if (autoSubmitTimeout) {
        clearTimeout(autoSubmitTimeout);
      }
      autoSubmitTimeout = setTimeout(() => {
        autoSubmitTimeout = null;
        submitSimulation();
      }, AUTO_RUN_DEBOUNCE_MS);
    }

    if (!autoRun && previousAutoRun) {
      if (autoSubmitTimeout) {
        clearTimeout(autoSubmitTimeout);
        autoSubmitTimeout = null;
      }
    }

    previousAutoRun = autoRun.valueOf();
  });

  onDestroy(() => {
    if (autoSubmitTimeout) {
      clearTimeout(autoSubmitTimeout);
      autoSubmitTimeout = null;
    }
  });

  let { form }: PageProps = $props();

  const constant_options: EChartsOption = {
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

  let xAxis = $derived<EChartsOption['xAxis']>({
    id: 'q',
    data: form?.results?.q ?? [],
  });

  const series_common: SeriesOption = {
    type: 'line',
    showSymbol: false,
    symbol: 'none',
  };

  let series = $derived<EChartsOption['series']>([
    {
      id: 'deltaS',
      name: 'ΔS',
      data: form?.results?.deltaS ?? [],
      ...series_common,
    },
    {
      id: 'deltaSSoluteExFrac',
      name: 'ΔS Solute',
      data: form?.results?.deltaSSoluteExFrac ?? [],
      ...series_common,
    },
    {
      id: 'deltaSSolvent',
      name: 'ΔS Solvent',
      data: form?.results?.deltaSSolvent ?? [],
      ...series_common,
    },
  ]);

  let results_dump = $derived({
    ...form?.results,
    q: `<${form?.results?.q?.length} values>`,
    deltaS: `<${form?.results?.deltaS?.length} values>`,
    deltaSSoluteExFrac: `<${form?.results?.deltaSSoluteExFrac?.length} values>`,
    deltaSSolvent: `<${form?.results?.deltaSSolvent?.length} values>`,
  });
</script>

<Resizable.PaneGroup direction="horizontal" class="max-h-svh max-w-full gap-4 rounded-lg">
  <Resizable.Pane defaultSize={70}>
    <LineChart {constant_options} {xAxis} {series} />
    <div class="m-4 max-h-96 overflow-auto rounded-lg border p-4">
      <JSONTree value={results_dump} shouldShowPreview={false} defaultExpandedLevel={3} />
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={30} class="flex min-w-110 flex-col">
    <form
      action="?/run_simulation"
      method="post"
      {@attach attachRunForm}
      use:enhance={({ formData }) => {
        formData.set('state', simulation_json);

        return async ({ update }) => {
          await update({ reset: false });
        };
      }}
    >
      <div class="flex items-center gap-3">
        <Button type="submit" class="flex-1">Run Simulation</Button>
        <label class="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" class="h-4 w-4" bind:checked={autoRun} />
          Auto-Run
        </label>
      </div>
    </form>
    <ScrollArea class="@container h-full">
      <div class="grid flex-1 gap-4 overflow-y-auto p-4 md:grid-rows-1">
        <SampleParametersCard {short} />
        <!-- <SampleGroundCard /> -->
        <!-- <SampleExcitedCard /> -->
        <DetectorCard {short} />
        <PumpCard {short} />
      </div>
    </ScrollArea>
    <Toggle class="mb-4 shrink-0 border-t bg-gray-50 p-0" bind:pressed={short}>
      {short ? 'Short Cards' : 'Detailed Cards'}
    </Toggle>
  </Resizable.Pane>
</Resizable.PaneGroup>
