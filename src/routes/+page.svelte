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

  import { getDebyeResult, getSolventIQ } from '$lib/data.remote';
  import { DetectorCard } from '$lib/detector';
  import LineChart from '$lib/plots/line-chart.svelte';
  import { PumpSetupCard } from '$lib/pump';
  import { SampleParametersCard } from '$lib/sample';
  import { useSimulationState } from '$lib/state.svelte';
  import type { QRange } from '$lib/types';

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

  const N_AVOGADRO = 6.02214076e23;
  const N_E = 1.602e-19;

  // Scalars

  let concentrationSolvent = $derived.by(() => {
    const rhom = simulation.sample.solvent?.rhom;
    if (!rhom) return;
    return rhom / 1000;
  });

  let concentrationExcited = $derived.by(() => {
    const concentrationSolute = simulation.sample.concentrationSoluteMolar;
    const excitedFraction = simulation.pump.excitedStateFraction;
    if (!concentrationSolute || !excitedFraction) return;
    return concentrationSolute * excitedFraction;
  });

  let ratioSolventSolute = $derived.by(() => {
    const concentrationSolute = simulation.sample.concentrationSoluteMolar;
    if (!concentrationSolute || !concentrationSolvent) return;
    return concentrationSolvent / concentrationSolute;
  });

  let deltaEeV = $derived(simulation.pump.photonEnergyEv - simulation.pump.excitedStateEnergyEv);
  let deltaEJ = $derived(deltaEeV * N_E);

  let deltaT = $derived.by(() => {
    const cpm = simulation.sample?.solvent?.cpm;
    if (!concentrationExcited || !concentrationSolvent || !deltaEJ || !cpm) return;
    return (((concentrationExcited / concentrationSolvent) * deltaEJ) / cpm) * N_AVOGADRO;
  });

  // Difference Scattering Signals

  // Solute
  async function getDeltaSSolute(qRange: QRange, groundId: string, excitedId: string) {
    const [ground, excited] = await Promise.all([
      getDebyeResult({ fileId: groundId, qRange }),
      getDebyeResult({ fileId: excitedId, qRange }),
    ]);

    if (!ground || !excited) return;

    if (
      ground.q.map((v) => v.toFixed(6)).toString() !== excited.q.map((v) => v.toFixed(6)).toString()
    ) {
      throw new Error('Q ranges of ground and excited states do not match.');
    }
    const deltaS = excited.i.map((val, index) => val - ground.i[index]);

    return { q: ground.q, i: deltaS };
  }

  let deltaSSolute = $state<{
    q: number[];
    i: number[];
  } | null>(null);

  $effect(() => {
    let groundId = simulation.sample.ground?.id;
    let excitedId = simulation.sample.excited?.id;
    let qRange = simulation.qRange;
    if (!groundId || !excitedId || !qRange) {
      deltaSSolute = null;
      return;
    }
    getDeltaSSolute(qRange, groundId, excitedId).then((data) => {
      deltaSSolute = data ? data : null;
    });
  });

  // Solvent
  async function getDeltaSSolvent(solventId: string, ratioSolventSolute: number, deltaT: number) {
    const iqSolvent = await getSolventIQ(solventId);
    const deltaS = iqSolvent.dSdT.map((val) => val * ratioSolventSolute * deltaT);
    return { q: iqSolvent.q, i: deltaS };
  }

  let deltaSSolvent = $state<{
    q: number[];
    i: number[];
  } | null>(null);
  $effect(() => {
    let solventId = simulation.sample.solvent?.id;
    if (!solventId || !ratioSolventSolute || !deltaT) {
      deltaSSolvent = null;
        return;
      }
    getDeltaSSolvent(solventId, ratioSolventSolute, deltaT).then((data) => {
      deltaSSolvent = data ? data : null;
    });
  });

  let deltaS = $derived.by<{ q: number[]; i: number[] } | null>(() => {
    if (!deltaSSolute || !deltaSSolvent) return null;

    // Check that Q ranges match (they should be the same)
    if (deltaSSolute.q.length !== deltaSSolvent.q.length) {
      console.warn('Q ranges of solute and solvent do not match');
      return null;
    }

    const excitedFraction = simulation.pump.excitedStateFraction;

    // Combine: ExFrac * ΔS_solute + ΔS_solvent (already scaled by ratio and deltaT)
    const combinedI = deltaSSolute.i.map((soluteVal, index) => {
      const soluteContribution = excitedFraction * soluteVal;
      const solventContribution = deltaSSolvent!.i[index];
      return soluteContribution + solventContribution;
    });

    return { q: deltaSSolute.q, i: combinedI };
  });

  // Solute contribution scaled by excited fraction for display
  let deltaSSoluteScaled = $derived.by<number[] | null>(() => {
    if (!deltaSSolute) return null;
    const excitedFraction = simulation.pump.excitedStateFraction;
    return deltaSSolute.i.map((val) => val * excitedFraction);
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
    data: deltaS?.q ?? deltaSSolvent?.q ?? deltaSSolute?.q ?? [],
  });

  const series_common: LineSeriesOption = {
    type: 'line',
    showSymbol: false,
    symbol: 'none',
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
      data: deltaSSolvent?.i ?? [],
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
