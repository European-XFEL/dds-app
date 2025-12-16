<script lang="ts">
  import * as Field from '$shadcn/ui/field/index.js';
  import { Input } from '$shadcn/ui/input/index.js';

  import type { CartesianPoint, DetectorModule, PixelSize, QRange, Shape } from '$lib/types';

  import * as qConvert from './DetectorInfo.helper';

  type Props = {
    modules: DetectorModule[];
    distance: number;
    beamCenter: CartesianPoint;
    imageShape: Shape;
    pixelSize: PixelSize;
    wavelength: number;
  };

  let { modules, distance, beamCenter, imageShape, pixelSize, wavelength }: Props = $props();

  let qRange: QRange = $state({
    min: 0,
    max: 0,
    step: 0,
  });

  let r_range = $state({
    min: 0,
    max: 0,
  });

  $effect(() => {
    let new_q_vals = qConvert.computeQRangeFromModules({
      distance: distance,
      pixelSize: pixelSize,
      beamCenter: beamCenter,
      modules: modules,
      wavelength: wavelength,
    });

    qRange.min = new_q_vals.min;
    qRange.max = new_q_vals.max;
    qRange.step = new_q_vals.step;

    r_range.min = new_q_vals.rMinPx;
    r_range.max = new_q_vals.rMaxPx;
  });

  $inspect(imageShape, beamCenter);

  let qFields = $derived([
    ['Q Min', qRange.min],
    ['Q Max', qRange.max],
    ['Q Step', qRange.step],
  ]);
</script>

<div>
  <Field.Group>
    <Field.Set>
      <Field.Legend>Detector Information</Field.Legend>
      <Field.Description>
        Information about the selected detector and current configuration.
      </Field.Description>
      <Field.Group class="flex flex-row">
        <Field.Field>
          <Field.Label>Pixel size (mm)</Field.Label>
          <Input value={pixelSize} disabled={true} />
        </Field.Field>
        <Field.Field>
          <Field.Label>Image shape (px)</Field.Label>
          <div class="grid grid-cols-2 gap-4">
            <Input value={imageShape.width} disabled={true} />
            <Input value={imageShape.height} disabled={true} />
          </div>
        </Field.Field>
      </Field.Group>
    </Field.Set>

    <Field.Separator />

    <Field.Set>
      <Field.Legend>Q Range (Å⁻¹)</Field.Legend>
      <Field.Description>
        Computed from the current detector configuration. Note that this is
        <span class="font-bold">not</span> the range used by the simulation.
      </Field.Description>
      <Field.Group class="flex flex-row">
        {#each qFields as [label, value]}
          <Field.Field>
            <Field.Label>{label}</Field.Label>
            <Input bind:value={() => value, (v) => null} class="truncate opacity-50" />
          </Field.Field>
        {/each}
      </Field.Group>
    </Field.Set>
  </Field.Group>
</div>
