<script lang="ts">
  import * as Field from '$shadcn/ui/field/index.js';
  import { Input } from '$shadcn/ui/input/index.js';

  import type { CartesianPoint } from '$lib/types';
  import NumSlider from '$lib/ui/NumSlider.svelte';

  type Props = {
    distance: number;
    beamCenter: CartesianPoint;
  };

  let { distance = $bindable(), beamCenter = $bindable() }: Props = $props();
</script>

<Field.Set>
  <Field.Legend>Detector Configuration</Field.Legend>
  <Field.Description
    >Select detector type and configure module positions.</Field.Description
  >

  <Field.Field>
    <Field.Label>Detector</Field.Label>
    <p class="text-sm font-medium">LPD</p>
  </Field.Field>

  <Field.Field>
    <NumSlider
      label="Sample Detector Distance(mm)"
      bind:value={distance}
      min="100"
      max="500"
    />
  </Field.Field>

  <Field.Group class="flex flex-wrap">
    <Field.Field>
      <Field.Label>Beam Center (px)</Field.Label>
      <div class="grid grid-cols-2 gap-4">
        <Input type="number" bind:value={beamCenter.x} />
        <Input type="number" bind:value={beamCenter.y} />
      </div>
    </Field.Field>
  </Field.Group>
</Field.Set>
