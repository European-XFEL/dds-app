<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card';
  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';
  import { Label } from '$shadcn/ui/label';

  import type { Pump } from '$lib/types';

  let { pump = $bindable(), short }: { pump: Pump; short: boolean } = $props();

  let photonEnergyInvalid = $derived(pump.photonEnergyEv < pump.excitedStateEnergyEv);

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

<Card.Root class="max-h-fit @sm:gap-3">
  <Card.Header>
    <Card.Title>Optical Pump Setup</Card.Title>
  </Card.Header>

  <Card.Content>
    <form>
      {#each fields as { label, key, input } (key)}
        <Field.Field>
          <Field.Label>
            <Label>{label}</Label>
          </Field.Label>
          <Field.Content>
            <div class="flex items-center justify-between gap-2">
              <Input type="range" {...input} bind:value={pump[key]} />
              <Input
                type="number"
                {...input}
                bind:value={pump[key]}
                class="w-30 text-sm text-muted-foreground"
              />
            </div>
          </Field.Content>
        </Field.Field>
      {/each}
    </form>
  </Card.Content>
</Card.Root>
