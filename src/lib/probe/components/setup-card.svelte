<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card';
  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';
  import { Label } from '$shadcn/ui/label';

  import type { XRayProbe } from '$lib/types';

  let { probe = $bindable() }: { probe: XRayProbe } = $props();
</script>

<Card.Root class="max-h-fit min-w-fit flex-auto whitespace-nowrap @sm:gap-3">
  <Card.Header class="min-w-fit">
    <Card.Title>X-Ray Probe Setup</Card.Title>
  </Card.Header>

  <Card.Content class="flex flex-col gap-4">
    <Field.Field class="flex min-w-fit">
      <Field.Label>
        <Label class="min-w-fit">X-Ray Wavelength</Label>
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
  </Card.Content>
</Card.Root>
