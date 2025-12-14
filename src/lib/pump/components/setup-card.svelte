<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card';
  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';
  import { Label } from '$shadcn/ui/label';

  import type { Pump } from '$lib/types';

  let { pump = $bindable() }: { pump: Pump } = $props();

  let photonEnergyInvalid = $derived(pump?.photonEnergyEv < pump?.excitedStateEnergyEv);

  const fields = $derived([
    {
      label: 'Excited State Energy (eV)',
      key: 'excitedStateEnergyEv',
      input: { min: 0.1, max: 2, step: 0.1 },
    },
    {
      label: 'Photon Energy (eV)',
      key: 'photonEnergyEv',
      input: { min: 1.0, max: 5.0, step: 0.1, 'aria-invalid': photonEnergyInvalid },
    },
    {
      label: 'Excited State Fraction',
      key: 'excitedStateFraction',
      input: { min: 0.0, max: 1.0, step: 0.01 },
    },
  ]) satisfies Array<{ label: string; key: keyof Pump; input: ComponentProps<typeof Input> }>;
</script>

<Card.Root class="max-h-fit min-w-fit flex-auto whitespace-nowrap @sm:gap-3">
  <Card.Header class="min-w-fit">
    <Card.Title>IR Optical Pump Setup</Card.Title>
  </Card.Header>

  <Card.Content class="flex flex-col gap-4">
    <!-- TODO: Consider allowing setting delta E/delta T directly instead of via energies -->
    {#each fields as { label, key, input } (key)}
      <Field.Field class="flex min-w-fit">
        <Field.Label>
          <Label class="min-w-fit">{label}</Label>
        </Field.Label>
        <Field.Content>
          <div class="flex min-w-fit items-center justify-between gap-x-2">
            {#if pump}
              <Input
                type="number"
                {...input}
                bind:value={pump[key]}
                class="nodrag w-30 text-sm text-muted-foreground"
              />
              <Input type="range" {...input} bind:value={pump[key]} class="nodrag" />
            {/if}
          </div>
        </Field.Content>
      </Field.Field>
    {/each}
  </Card.Content>
</Card.Root>
