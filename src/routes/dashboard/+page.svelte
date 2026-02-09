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

  import { fade } from 'svelte/transition';

  import * as Collapsible from '$shadcn/ui/collapsible/index.js';
  import * as Resizable from '$shadcn/ui/resizable/index.js';
  import { ScrollArea } from '$shadcn/ui/scroll-area/index.js';

  import { listMolecules, listSolvents } from '$remote';

  import { SetupChecklist } from '$lib/dashboard';
  import DSSPlot from '$lib/dashboard/components/DSSPlot.svelte';
  import { DetectorSetupCard } from '$lib/detector';
  import {
    MoleculeCard,
    MoleculeTrajectoryViz,
    MoleculeViz,
  } from '$lib/molecule';
  import { PumpSetupCard } from '$lib/pump';
  import { SolventCard } from '$lib/sample';
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
  let vizOpen = $state(false);
  let vizCollapseShow = $state(true);
  let vizMode = $state<'trajectory' | 'individual'>('trajectory');

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
</script>

<div class="h-lvh">
  <Resizable.PaneGroup
    direction="horizontal"
    class="max-w-full gap-4 rounded-lg"
  >
    <Resizable.Pane defaultSize={70}>
      <!-- <div class="flow-row w-max items-center gap-3">
          <Badge variant="outline"
            >Delta T (K): {result?.deltaTemperatureK.toExponential(3) ?? 'N/A'}</Badge
          >
          <Badge variant="outline"
            >Deposited Energy (J): {result?.depositedEnergyJoule ?? 'N/A'}</Badge
          >
        </div> -->
      <div transition:fade class="mt-8 flex flex-col gap-6">
        <!-- TODO: Add warning based on the expected temperature range that the dSdT data can apply to? -->
        <!-- TODO: Re-enable temperature result badges -->
        <!-- TODO: Improve plot axis/zooming -->
        <!-- Conditionally show checklist or chart -->
        <div class="h-96">
          {#if hasAll}
            <div class="h-full" transition:fade>
              <DSSPlot
                {qValues}
                {deltaSi}
                {deltaSSoluteScaled}
                {deltaSSolvent}
              />
            </div>
          {:else}
            <div class="h-full" transition:fade>
              <SetupChecklist
                {hasGroundMolecule}
                {hasExcitedMolecule}
                {hasSolvent}
                {hasDetector}
                {hasPump}
              />
            </div>
          {/if}
        </div>

        <!-- Molecule Visualizations -->
        <!-- {#if hasAll}
          {#if vizCollapseShow}
            <Collapsible.Root bind:open={vizOpen} class="w-full">
              <Collapsible.Trigger
                class="mb-2 w-full rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium hover:bg-secondary/20"
              >
                {#if vizOpen}
                  Hide Molecule Visualizations
                {:else}
                  Show Molecule Visualizations
                {/if}
              </Collapsible.Trigger>
              <Collapsible.Content class="w-full">
                <div class="mb-3 flex items-center gap-2 text-sm">
                  <span class="font-semibold">View:</span>
                  <button
                    class={`rounded-md border px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
                      vizMode === 'trajectory' ? 'bg-secondary/20' : ''
                    }`}
                    onclick={() => (vizMode = 'trajectory')}
                  >
                    Trajectory
                  </button>
                  <button
                    class={`rounded-md border px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
                      vizMode === 'individual' ? 'bg-secondary/20' : ''
                    }`}
                    onclick={() => (vizMode = 'individual')}
                  >
                    Individual
                  </button>
                </div>
                {#if vizMode === 'trajectory'}
                  <MoleculeTrajectoryViz
                    ground={simulation.sample.ground}
                    excited={simulation.sample.excited}
                  />
                {:else}
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                      <h3 class="text-sm font-semibold">Ground State</h3>
                      {#if simulation.sample.ground}
                        <MoleculeViz molecule={simulation.sample.ground} />
                      {/if}
                    </div>
                    <div class="flex flex-col gap-2">
                      <h3 class="text-sm font-semibold">Excited State</h3>
                      {#if simulation.sample.excited}
                        <MoleculeViz molecule={simulation.sample.excited} />
                      {/if}
                    </div>
                  </div>
                {/if}
              </Collapsible.Content>
            </Collapsible.Root>
          {:else if vizOpen}
            <div>
              <div class="mb-3 flex items-center gap-2 text-sm">
                <span class="font-semibold">View:</span>
                <button
                  class={`rounded-md border px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
                    vizMode === 'trajectory' ? 'bg-secondary/20' : ''
                  }`}
                  onclick={() => (vizMode = 'trajectory')}
                >
                  Trajectory
                </button>
                <button
                  class={`rounded-md border px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
                    vizMode === 'individual' ? 'bg-secondary/20' : ''
                  }`}
                  onclick={() => (vizMode = 'individual')}
                >
                  Individual
                </button>
              </div>
              {#if vizMode === 'trajectory'}
                <MoleculeTrajectoryViz
                  ground={sim.sample.ground}
                  excited={sim.sample.excited}
                />
              {:else}
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Ground State</h3>
                    {#if sim.sample.ground}
                      <MoleculeViz molecule={sim.sample.ground} />
                    {/if}
                  </div>
                  <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Excited State</h3>
                    {#if sim.sample.excited}
                      <MoleculeViz molecule={sim.sample.excited} />
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        {/if} -->
        <MoleculeViz molecule={simulation.sample.ground} />
      </div>
    </Resizable.Pane>

    <Resizable.Handle />

    <Resizable.Pane defaultSize={20} class="flex min-w-110 flex-col">
      <ScrollArea class="mt-8 flex-1">
        <div class="grid h-72 gap-4">
          <SolventCard
            {solvents}
            bind:concentrationSoluteMolar={
              simulation.sample.concentrationSoluteMolar
            }
            bind:solvent={simulation.sample.solvent}
            {short}
          />
          <MoleculeCard
            {molecules}
            bind:ground={simulation.sample.ground}
            bind:excited={simulation.sample.excited}
          />
          <DetectorSetupCard
            bind:distance={simulation.detector.distance}
            bind:beamCenter={simulation.detector.beamCenter}
          />
          <PumpSetupCard bind:pump={simulation.pump} />
        </div>
      </ScrollArea>
    </Resizable.Pane>
  </Resizable.PaneGroup>
</div>
