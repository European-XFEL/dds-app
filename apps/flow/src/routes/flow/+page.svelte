<script lang="ts">
  import type { LineSeriesOption } from 'echarts/charts';
  import type {
    DataZoomComponentOption,
    GridComponentOption,
    LegendComponentOption,
    TitleComponentOption,
    TooltipComponentOption,
  } from 'echarts/components';
  import type { ComposeOption } from 'echarts/core';

  import FlowDashboard from '$lib/flow-dashboard/FlowDashboard.svelte';
  import {
    createScatteringResource,
    fetchDeltaSSolute,
    fetchDeltaSSolvent,
  } from '$lib/simulation/scattering-fetcher.svelte';
  import {
    computeDeltaS,
    createScatteringCalculations,
    scaleSoluteByExcitedFraction,
  } from '$lib/simulation/scattering.svelte';
  import { useSimulationState } from '$lib/state.svelte';

  // Compose type for type-safe options
  type ECOption = ComposeOption<
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
    | DataZoomComponentOption
  >;

  const simulation = useSimulationState();

  // Use extracted calculations module
  const calculations = createScatteringCalculations(simulation);

  // Reactive scattering data fetching using resource pattern
  const soluteResource = createScatteringResource(
    () =>
      fetchDeltaSSolute(
        simulation.qRange,
        simulation.sample.ground!.id,
        simulation.sample.excited!.id,
      ),
    () =>
      !!(
        simulation.sample.ground?.id &&
        simulation.sample.excited?.id &&
        simulation.qRange
      ),
  );

  const solventResource = createScatteringResource(
    () =>
      fetchDeltaSSolvent(
        simulation.sample.solvent!.id,
        calculations.ratioSolventSolute!,
        calculations.deltaT!,
      ),
    () =>
      !!(
        simulation.sample.solvent?.id &&
        calculations.ratioSolventSolute &&
        calculations.deltaT
      ),
  );

  // Combined difference scattering signal
  const deltaS = $derived(
    computeDeltaS(
      soluteResource.value,
      solventResource.value,
      calculations.excitedStateFraction,
    ),
  );

  // Solute contribution scaled by excited fraction for display
  const deltaSSoluteScaled = $derived(
    scaleSoluteByExcitedFraction(
      soluteResource.value,
      calculations.excitedStateFraction,
    ),
  );

  const constant_options: ECOption = {
    title: { text: 'Difference Scattering Signals ΔS(q)' },
    legend: { top: 'bottom' },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
    },
    xAxis: {
      id: 'q',
      name: 'q (Å⁻¹)',
      data: [],
      axisLabel: {
        formatter: (value: number) => Number(value).toPrecision(3),
      },
    },
    yAxis: { type: 'value', animationDuration: 150 },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none',
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'none',
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'none',
        height: 20,
        bottom: 10,
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'none',
        width: 20,
        right: 10,
      },
    ],
    series: [],
    animationDuration: 150,
    tooltip: { trigger: 'axis' },
  };

  let xAxis = $derived<ECOption['xAxis']>({
    id: 'q',
    data:
      deltaS?.q ?? solventResource.value?.q ?? soluteResource.value?.q ?? [],
  });

  const series_common: LineSeriesOption = {
    type: 'line',
    showSymbol: false,
    symbol: 'none',
    smooth: true,
    animationDuration: 150,
    animationEasing: 'cubicOut',
  };

  let series = $derived.by<ECOption['series']>(() => [
    {
      id: 'deltaS',
      name: 'ΔS (Total)',
      data: deltaS?.i ?? [],
      ...series_common,
    },
    {
      id: 'deltaSSoluteExFrac',
      name: 'ΔS Solute (α·ΔS)',
      data: deltaSSoluteScaled ?? [],
      ...series_common,
    },
    {
      id: 'deltaSSolvent',
      name: 'ΔS Solvent',
      data: solventResource.value?.i ?? [],
      ...series_common,
    },
  ]);

  // Prepare chart data for FlowDashboard
  let chartData = $derived({
    constantOptions: constant_options,
    xAxis,
    series,
  });
</script>

<FlowDashboard />
