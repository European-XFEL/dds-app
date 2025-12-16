<script lang="ts">
  import * as Card from '$shadcn/ui/card';
  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';
  import { Label } from '$shadcn/ui/label';

  import type { XRayProbe } from '../types';

  type Props = {
    probe: XRayProbe;
    short?: boolean;
  };

  let { probe = $bindable(), short = false }: Props = $props();
</script>

<div>
  <form>
    <Field.Set>
      {#if !short}
        <Field.Legend>X-Ray Probe Configuration</Field.Legend>
        <Field.Description>Configure the X-ray probe wavelength settings.</Field.Description>
      {/if}

      <Field.Field>
        <Field.Label>
          <Label class="min-w-fit">X-Ray Wavelength (Å)</Label>
        </Field.Label>
        <Field.Content>
          <div class="flex min-w-fit items-center justify-between gap-x-2">
            <Input
              type="number"
              bind:value={probe.wavelength}
              class="nodrag w-30 text-sm text-muted-foreground"
            />
            <Input type="range" bind:value={probe.wavelength} class="nodrag" />
          </div>
        </Field.Content>
      </Field.Field>
    </Field.Set>
  </form>
</div>
