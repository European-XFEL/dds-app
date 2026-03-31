<script lang="ts">
  import { type DataSeries, type RefLine } from 'matterviz';

  import { Checkbox } from '$shadcn/ui/checkbox/index.js';
  import { Label } from '$shadcn/ui/label';

  const {
    qValues,
    deltaSi,
    deltaSSoluteScaled,
    deltaSSolvent,
    deltaSSolventPerMolecule,
    detectorQRange,
  } = $props();

  let clipToDetector = $state(false);

  const refLines = $derived.by(() => {
    if (!detectorQRange) return [];
    return [
      {
        type: 'vertical',
        x: detectorQRange[0],
        style: { color: `#9b59b6`, width: 1.5, dash: `4 2` },
        annotation: { text: `q min`, position: `start`, side: `below` },
      },
      {
        type: 'vertical',
        x: detectorQRange[1],
        style: { color: `#9b59b6`, width: 1.5, dash: `4 2` },
        annotation: { text: `q max`, position: `start`, side: `below` },
      },
    ];
  }) as RefLine[];

  const series = $derived.by(() => {
    const q = qValues;
    const markers = 'line' as const;

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
        label: 'ΔS Solvent (normalized)',
        markers,
      },
      {
        x: q,
        y: deltaSSolventPerMolecule ?? [],
        label: 'ΔS Solvent (per molecule)',
        markers,
      },
    ];
  }) as DataSeries[];

  const xRange: [number | null, number | null] = $derived.by(() => {
    if (!clipToDetector) return [0, qValues[qValues.length - 1]];

    let min = detectorQRange ? detectorQRange[0] * 0.9 : null;
    let max = detectorQRange ? detectorQRange[1] * 1.1 : null;
    return [min, max];
  });
</script>

<div class="flow-col">
  {#await import('matterviz/plot') then { ScatterPlot }}
    <ScatterPlot
      {series}
      ref_lines={refLines}
      x_axis={{ label: 'q (Å⁻¹)', range: xRange }}
      y_axis={{ label: 'ΔS (a.u.)' }}
      style="height: 320px"
      legend={{ layout: 'horizontal' }}
    />
  {/await}

  <div class="flow-row w-max items-center gap-3">
    <div class="flex items-center gap-3">
      <Checkbox bind:checked={clipToDetector} />
      <Label>Clip to Detector Q Range</Label>
    </div>
  </div>
</div>
