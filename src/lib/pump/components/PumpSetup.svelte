<script lang="ts">
  import type { Pump } from '../types';

  import type { ComponentProps } from 'svelte';

  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';

  import Todo from '$lib/ui/Todo.svelte';

  type Props = {
    pump: Pump;
  };

  let { pump = $bindable() }: Props = $props();

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

<Field.Set>
  <Field.Legend>
    IR Optical Pump Configuration
    <Todo text="TODO: Allow setting dE/dT directly instead of via energies" />
  </Field.Legend>
  <Field.Description>Configure the IR optical pump settings for the simulation.</Field.Description>

  <Field.Group>
    {#each fields as { label, key, input } (key)}
      <Field.Field orientation="responsive">
        <Field.Content>
          <Field.Label>{label}</Field.Label>
        </Field.Content>
        <div class="flex min-w-fit flex-2 items-center justify-between gap-x-2">
          {#if pump}
            <Input type="number" {...input} bind:value={pump[key]} class="nodrag w-30" />
            <Input type="range" {...input} bind:value={pump[key]} class="nodrag" />
          {/if}
        </div>
      </Field.Field>
    {/each}
  </Field.Group>
</Field.Set>
