<script lang="ts">
  import * as Field from '$shadcn/ui/field/index.js';
  import { Input } from '$shadcn/ui/input/index.js';

  import type { QRange, Shape } from '$lib/types';

  type Props = {
    imageShape: Shape;
    pixelSize: number;
    qRange: QRange;
  };

  let { imageShape, pixelSize, qRange }: Props = $props();

  let qFields = $derived([
    ['Q Min', qRange.min],
    ['Q Max', qRange.max],
    ['Q Step', qRange.step],
  ]);
</script>

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

  <Field.Separator />

  <Field.Set>
    <Field.Legend>Q Range (Å⁻¹)</Field.Legend>
    <Field.Description>
      Computed from the current detector configuration. Note that this is
      <span class="font-bold">not</span> the range used by the simulation.
    </Field.Description>
    <Field.Group class="flex flex-row">
      {#each qFields as [label, value] (label)}
        <Field.Field>
          <Field.Label>{label}</Field.Label>
          <Input {value} readonly class="truncate opacity-50" />
        </Field.Field>
      {/each}
    </Field.Group>
  </Field.Set>
</Field.Set>
