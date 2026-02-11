<script lang="ts">
  import { Badge } from '$shadcn/ui/badge';

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

  const { ...results }: Props = $props();
</script>

<div class="flex h-lvh flex-col items-center gap-6 overflow-hidden p-4">
  <h1 class="text-2xl font-bold">Simulation Results</h1>

  <div class="flow-row w-max items-center gap-3">
    <Badge variant="outline">
      Delta T (K): {results?.deltaTemperatureK?.toExponential(3) ?? 'N/A'}
    </Badge>

    <Badge variant="outline">
      Deposited Energy (J): {results?.depositedEnergyJoule ?? 'N/A'}
    </Badge>
  </div>
  <!-- TODO: Add warning based on the expected temperature range that the dSdT data can apply to? -->

  <div class="w-full rounded-lg bg-secondary/10 p-4">
    <DSSPlot {...results} />
  </div>
</div>
