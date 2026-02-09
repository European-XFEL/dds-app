<script lang="ts">
  import { fade } from 'svelte/transition';

  import * as Resizable from '$shadcn/ui/resizable/index.js';
  import { ScrollArea } from '$shadcn/ui/scroll-area/index.js';

  import { listMolecules, listSolvents } from '$remote';

  import { SetupChecklist } from '$lib/dashboard';
  import ConfigPane from '$lib/dashboard/components/ConfigPane.svelte';
  import ResultsPane from '$lib/dashboard/components/ResultsPane.svelte';
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

  const simulation = useSimulationState();

  const [solvents, molecules] = await Promise.all([
    listSolvents(),
    listMolecules(),
  ]);

  let short = $state(true);

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

  const deltaSi = $derived(deltaS?.i ?? null);

  const qValues = $derived(
    deltaS?.q ?? solventResource.value?.q ?? soluteResource.value?.q ?? [],
  );

  // Solute contribution scaled by excited fraction for display
  const deltaSSoluteScaled = $derived(
    scaleSoluteByExcitedFraction(
      soluteResource.value,
      calculations.excitedStateFraction,
    ),
  );

  const deltaSSolvent = $derived(solventResource.value?.i ?? null);

  const detectorQRange: [number | null, number | null] = $derived.by(() => {
    const qRange = simulation.detector?.qRange;
    return qRange ? [qRange.min, qRange.max] : [null, null];
  });

  const hasGroundMolecule = $derived(!!simulation.sample.ground?.id);
  const hasExcitedMolecule = $derived(!!simulation.sample.excited?.id);
  const hasSolvent = $derived(!!simulation.sample.solvent?.id);
  const hasDetector = $derived(!!simulation.detector);
  const hasPump = $derived(!!simulation.pump);
  const hasAll = $derived(
    hasGroundMolecule &&
      hasExcitedMolecule &&
      hasSolvent &&
      hasDetector &&
      hasPump,
  );

  let w: number | null = $state(null);
  let direction: 'horizontal' | 'vertical' = $derived(
    (w ?? 1000) > 900 ? 'horizontal' : 'vertical',
  );
</script>

<div class="-mt-4 -mr-4 h-lvh" bind:clientWidth={w}>
  <Resizable.PaneGroup {direction} class="max-w-full gap-4 rounded-lg">
    <Resizable.Pane
      defaultSize={70}
      class="mt-4 flex items-center justify-center *:w-full"
    >
      {#if hasAll}
        <ResultsPane
          {qValues}
          {deltaSi}
          {deltaSSoluteScaled}
          {deltaSSolvent}
          {detectorQRange}
          deltaTemperatureK={undefined}
          depositedEnergyJoule={undefined}
        />
      {:else}
        <SetupChecklist
          {hasGroundMolecule}
          {hasExcitedMolecule}
          {hasSolvent}
          {hasDetector}
          {hasPump}
        />
      {/if}
    </Resizable.Pane>

    <Resizable.Handle />

    <Resizable.Pane defaultSize={20} class="flex max-w-2xl min-w-110">
      <ScrollArea class="flex-1">
        <div class="mt-4 mr-4 mb-4">
          <ConfigPane {simulation} {molecules} {solvents} {short} />
        </div>
      </ScrollArea>
    </Resizable.Pane>
  </Resizable.PaneGroup>
</div>
