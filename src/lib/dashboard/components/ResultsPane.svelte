<script lang="ts">
  import DSSPlot from './DSSPlot.svelte';

  interface Props {
    qValues: number[];
    deltaSi: number[] | null;
    deltaSSoluteScaled: number[] | null;
    deltaSSolvent: number[] | null;
    deltaSSolventPerMolecule: number[] | null;
    deltaTemperatureK: number | undefined;
    depositedEnergyJoule: number | undefined;
    detectorQRange: [number | null, number | null];
  }

  const results: Props = $props();

  function fmt(value: number, sigFigs = 3): string {
    const abs = Math.abs(value);
    if (abs === 0) return '0';
    if (abs >= 0.01 && abs < 10000) return +value.toPrecision(sigFigs) + '';
    return value.toExponential(sigFigs - 1);
  }

  const deltaT = $derived(results.deltaTemperatureK);
  const energy = $derived(results.depositedEnergyJoule);
  const [qMin, qMax] = $derived(results.detectorQRange);
</script>

<div class="flex w-full flex-col items-center gap-6 p-4">
  <h1 class="text-2xl font-bold">Simulation Results</h1>

  <div class="flex flex-wrap justify-center gap-3">
    {#snippet metric(label: string, unit: string, display: string, full: string)}
      <div
        title={full}
        class="flex flex-col items-center rounded-lg border px-4 py-2 text-center"
      >
        <span class="text-muted-foreground text-xs">{label}</span>
        <span class="font-mono text-sm font-medium">
          {display}
          <span class="text-muted-foreground text-xs font-normal">{unit}</span>
        </span>
      </div>
    {/snippet}

    {#if deltaT != null}
      {@render metric('ΔT', 'K', fmt(deltaT), deltaT + ' K')}
    {:else}
      {@render metric('ΔT', 'K', 'N/A', '')}
    {/if}

    {#if energy != null}
      {@render metric('Deposited Energy', 'J', fmt(energy), energy + ' J')}
    {:else}
      {@render metric('Deposited Energy', 'J', 'N/A', '')}
    {/if}

    {#if qMin != null && qMax != null}
      {@render metric('Q range', 'Å⁻¹', fmt(qMin) + ' – ' + fmt(qMax), qMin + ' – ' + qMax + ' Å⁻¹')}
    {:else}
      {@render metric('Q range', 'Å⁻¹', 'N/A', '')}
    {/if}
  </div>
  <!-- TODO: Add warning based on the expected temperature range that the dSdT data can apply to? -->

  <div class="w-full rounded-lg bg-secondary/10 p-4">
    <DSSPlot {...results} />
  </div>
</div>
