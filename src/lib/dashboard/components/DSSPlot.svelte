<script lang="ts">
  import { ScatterPlot } from 'matterviz';

  const { qValues, deltaSi, deltaSSoluteScaled, deltaSSolvent } = $props();

  const series = $derived.by(() => {
    const q = qValues;
    const markers: 'line' = 'line';

    return [
      {
        x: q,
        y: deltaSi ?? [],
        label: 'ΔS (Total)',
        markers,
      },
      {
        x: q,
        y: deltaSSoluteScaled ?? [],
        label: 'ΔS Solute (α·ΔS)',
        markers,
      },
      {
        x: q,
        y: deltaSSolvent ?? [],
        label: 'ΔS Solvent',
        markers,
      },
    ];
  });
</script>

<ScatterPlot
  {series}
  x_axis={{ label: 'q (Å⁻¹)' }}
  y_axis={{ label: 'ΔS (a.u.)' }}
  style="height: 320px"
/>
