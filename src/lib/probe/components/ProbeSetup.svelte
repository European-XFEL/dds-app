<script lang="ts">
  import type { XRayProbe } from '../types';

  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';

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
      <Field.Content>
        <Field.Label>X-Ray Wavelength (Å)</Field.Label>
      </Field.Content>
      <div class="flex min-w-fit flex-2 items-center justify-between gap-x-2">
        <Input type="number" bind:value={wavelength} class="nodrag w-30" />
        <Input type="range" bind:value={wavelength} class="nodrag w-full" />
      </div>
    </Field.Field>
  </Field.Group>
</Field.Set>
