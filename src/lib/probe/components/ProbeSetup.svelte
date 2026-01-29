<script lang="ts">
  import type { XRayProbe } from '../types';

  import * as Field from '$shadcn/ui/field';

  import NumSlider from '$lib/ui/NumSlider.svelte';

  type Props = {
    probe: XRayProbe;
    short?: boolean;
  };

  let { probe = $bindable(), short = false }: Props = $props();

  let wavelength = $state(probe?.wavelength);
</script>

<Field.Set>
  {#if !short}
    <Field.Legend>X-Ray Probe Configuration</Field.Legend>
    <Field.Description
      >Configure the X-ray probe wavelength settings.</Field.Description
    >
  {/if}

  <Field.Group>
    <Field.Field orientation="responsive">
      <NumSlider
        label="X-Ray Wavelength (Å)"
        bind:value={wavelength}
        min="0.1"
        max="2.0"
        step="0.01"
      />
    </Field.Field>
  </Field.Group>
</Field.Set>
