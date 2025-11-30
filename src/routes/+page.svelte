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

  import DetectorCard from '$components/detector/detector-card.svelte';
  import PumpCard from '$components/pump/pump-card.svelte';
  import { SampleCardParameters } from '$components/sample';
  import LineChart from '$components/ui/plots/line.svelte';

  import type { PageProps } from './$types';

  const simulation = useSimulationState();

  let short = $state(true);
  let autoRun = $state(true);

  const AUTO_RUN_DEBOUNCE_MS = 600;

  let runForm: HTMLFormElement | null = null;
  let hasRegisteredSnapshot = false;
  let lastSimulationSnapshot = '';

  let previousAutoRun = true;
  const autoSubmitScheduler = createDebouncedSubmitter(AUTO_RUN_DEBOUNCE_MS);

  const simulation_json = $derived(JSON.stringify($state.snapshot(simulation)));

  function createDebouncedSubmitter(delay: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return {
      schedule(callback: () => void) {
        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          timeout = null;
          callback();
        }, delay);
      },
      cancel() {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      },
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
      autoSubmitScheduler.cancel();
      return;
    }

    if (snapshot === lastSimulationSnapshot) {
      return;
    }

    lastSimulationSnapshot = snapshot;
    if (!runForm) {
      return;
    }
    autoSubmitScheduler.schedule(submitSimulation);
  });

  $effect(() => {
    if (autoRun && !previousAutoRun && hasRegisteredSnapshot && runForm) {
      autoSubmitScheduler.schedule(submitSimulation);
    }

    if (!autoRun && previousAutoRun) {
      autoSubmitScheduler.cancel();
    }

    previousAutoRun = autoRun.valueOf();
  });

  onDestroy(() => {
    autoSubmitScheduler.cancel();
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

<Resizable.PaneGroup direction="horizontal" class="max-w-full gap-4 rounded-lg">
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
      bind:this={runForm}
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
        <SampleCardParameters {short} />
        <!-- <SampleCardGround /> -->
        <!-- <SampleCardExcited /> -->
        <DetectorCard {short} />
        <PumpCard {short} />
      </div>
    </ScrollArea>
    <Toggle class="mb-4 shrink-0 border-t bg-gray-50 p-0" bind:pressed={short}>
      {short ? 'Short Cards' : 'Detailed Cards'}
    </Toggle>
  </Resizable.Pane>
</Resizable.PaneGroup>
