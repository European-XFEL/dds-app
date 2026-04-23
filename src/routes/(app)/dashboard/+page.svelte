<script lang="ts">
  
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

  type ListsResult = {
    solvents: Awaited<ReturnType<typeof listSolvents>>;
    molecules: Awaited<ReturnType<typeof listMolecules>>;
  };

  const listResource = createScatteringResource<ListsResult>(
    async () => {
      const [solvents, molecules] = await Promise.all([
        listSolvents(),
        listMolecules(),
      ]);
      return { solvents, molecules };
    },
    () => true,
  );

  const solvents = $derived(listResource.value?.solvents ?? []);
  const molecules = $derived(listResource.value?.molecules ?? []);

  let short = $state(true);

  const calculations = createScatteringCalculations(simulation);

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
        simulation.qRange,
        simulation.sample.solvent!.id,
        calculations.ratioSolventSolute!,
        calculations.deltaT!,
      ),
    () =>
      !!(
        simulation.sample.solvent?.id &&
        calculations.ratioSolventSolute != null &&
        calculations.deltaT != null
      ),
  );

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

  const deltaSSoluteScaled = $derived(
    scaleSoluteByExcitedFraction(
      soluteResource.value,
      calculations.excitedStateFraction,
    ),
  );

  const deltaSSolvent = $derived(solventResource.value?.i ?? null);
  const deltaSSolventPerMolecule = $derived(
    solventResource.value && calculations.ratioSolventSolute != null
      ? solventResource.value.i.map(
          (value) => value / calculations.ratioSolventSolute!,
        )
      : null,
  );

  const detectorQRange: [number | null, number | null] = $derived.by(() => {
    const qRange = simulation.detector?.qRange;
    return qRange ? [qRange.min, qRange.max] : [null, null];
  });

  const results = $derived({
    qValues,
    deltaSi,
    deltaSSoluteScaled,
    deltaSSolvent,
    deltaSSolventPerMolecule,
    detectorQRange,
    deltaTemperatureK: calculations.deltaT,
    depositedEnergyJoule: calculations.deltaEJ,
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
</script>

<div class="h-lvh pr-[460px]" bind:clientWidth={w}>
  <div class="flex h-full items-center justify-center">
    {#if hasAll}
      <ResultsPane {...results} />
    {:else}
      <SetupChecklist
        {hasGroundMolecule}
        {hasExcitedMolecule}
        {hasSolvent}
        {hasDetector}
        {hasPump}
      />
    {/if}
  </div>

  <div
    class="bg-background/80 fixed top-16 right-4 bottom-4 w-[440px] overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm"
  >
    <ScrollArea class="h-full">
      <div class="p-4">
        <ConfigPane {simulation} {molecules} {solvents} {short} />
      </div>
    </ScrollArea>
  </div>
</div>
