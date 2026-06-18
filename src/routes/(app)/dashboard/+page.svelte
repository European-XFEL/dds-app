<script lang="ts">
  import ChevronDown from '@lucide/svelte/icons/chevron-down';

  import { Button } from '$shadcn/ui/button/index.js';
  import * as Resizable from '$shadcn/ui/resizable/index.js';
  import { ScrollArea } from '$shadcn/ui/scroll-area/index.js';

  import { SetupChecklist } from '$lib/dashboard';
  import ConfigPane from '$lib/dashboard/components/ConfigPane.svelte';
  import MoleculePane from '$lib/dashboard/components/MoleculePane.svelte';
  import ResultsPane from '$lib/dashboard/components/ResultsPane.svelte';
  import { listMolecules, listSolvents } from '$lib/data/api';
  import { isValidQRange } from '$lib/simulation/math';
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
      !!(simulation.sample.ground?.id && simulation.sample.excited?.id) &&
      isValidQRange(simulation.qRange),
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
      !!simulation.sample.solvent?.id &&
      calculations.ratioSolventSolute != null &&
      calculations.deltaT != null &&
      isValidQRange(simulation.qRange),
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
  const hasAll = $derived(
    hasGroundMolecule && hasExcitedMolecule && hasSolvent,
  );

  // Surface any fetch failure so a backend/DB/parse error is visible rather
  // than silently rendering as an empty chart.
  const fetchError = $derived(
    listResource.error ?? soluteResource.error ?? solventResource.error,
  );
  const isFetching = $derived(
    listResource.loading || soluteResource.loading || solventResource.loading,
  );

  function retryFetches() {
    void listResource.refetch();
    void soluteResource.refetch();
    void solventResource.refetch();
  }

  let w: number | null = $state(null);
  let direction: 'horizontal' | 'vertical' = $derived(
    (w ?? 1000) > 900 ? 'horizontal' : 'vertical',
  );
</script>

<div class="-mt-4 -mr-4 flex h-lvh flex-col" bind:clientWidth={w}>
  <header
    class="flex min-h-20 shrink-0 flex-wrap items-center justify-between gap-4 border-b bg-background px-7 py-4"
  >
    <div class="min-w-0">
      <h1 class="truncate text-lg font-semibold">FeBpy3: LS → HS in DCM</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Untitled run · last run 2 min ago
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <Button variant="outline" class="h-12 bg-transparent px-4 text-sm">
        Save run
      </Button>
      <Button variant="outline" class="h-12 bg-transparent px-4 text-sm">
        Export
        <ChevronDown class="size-4" />
      </Button>
      <Button variant="outline" class="h-12 bg-transparent px-4 text-sm">
        Add to compare
      </Button>
    </div>
  </header>

  <Resizable.PaneGroup
    {direction}
    class="min-h-0 max-w-full flex-1 gap-4 rounded-lg"
  >
    <Resizable.Pane defaultSize={70} class="mt-4 flex overflow-hidden">
      {#if hasAll}
        <ScrollArea class="w-full flex-1">
          <div class="mr-2 pb-4">
            {#if fetchError}
              <div
                role="alert"
                class="mb-2 flex items-center justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <span>Failed to compute scattering: {fetchError.message}</span>
                <button
                  class="rounded border border-destructive/40 px-2 py-1 font-medium hover:bg-destructive/20"
                  onclick={retryFetches}
                >
                  Retry
                </button>
              </div>
            {:else if isFetching}
              <p class="mb-2 px-1 text-sm text-muted-foreground">
                Computing scattering signals…
              </p>
            {/if}
            <ResultsPane {...results} />
            <MoleculePane {simulation} {hasAll} />
          </div>
        </ScrollArea>
      {:else}
        <div class="flex w-full flex-1 items-center justify-center px-4 pb-4">
          <SetupChecklist
            {hasGroundMolecule}
            {hasExcitedMolecule}
            {hasSolvent}
          />
        </div>
      {/if}
    </Resizable.Pane>

    <Resizable.Handle />

    <Resizable.Pane defaultSize={20} class="flex max-w-2xl min-w-110">
      <ScrollArea class="flex-1">
        <div class="m-4">
          <ConfigPane {simulation} {molecules} {solvents} {short} />
        </div>
      </ScrollArea>
    </Resizable.Pane>
  </Resizable.PaneGroup>
</div>
