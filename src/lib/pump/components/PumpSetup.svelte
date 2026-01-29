<script lang="ts">
  import type { Pump } from '../types';

  import type { ComponentProps } from 'svelte';

  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';

  import NumSlider from '$lib/ui/NumSlider.svelte';

  type Props = {
    pump: Pump;
  };

  let { pump = $bindable() }: Props = $props();

  let photonEnergyInvalid = $derived(
    pump?.photonEnergyEv < pump?.excitedStateEnergyEv,
  );

  const fields = $derived([
    {
      label: 'Excited State Energy (eV)',
      key: 'excitedStateEnergyEv',
      input: { min: 0.1, max: 2, step: 0.1 },
    },
    {
      label: 'Photon Energy (eV)',
      key: 'photonEnergyEv',
      input: {
        min: 1.0,
        max: 5.0,
        step: 0.1,
        'aria-invalid': photonEnergyInvalid,
      },
    },
    {
      label: 'Excited State Fraction',
      key: 'excitedStateFraction',
      input: { min: 0.0, max: 1.0, step: 0.01 },
    },
  ]) satisfies Array<{
    label: string;
    key: keyof Pump;
    input: ComponentProps<typeof Input>;
  }>;
</script>

<Field.Set>
  <Field.Legend>Optical Pump Configuration</Field.Legend>
  <Field.Description
    >Configure the optical pump settings for the simulation.</Field.Description
  >

  <!-- TODO: Allow setting dE/dT directly instead of via energies -->

  <Field.Group>
    {#each fields as { label, key, input } (key)}
      <Field.Field orientation="responsive">
        <NumSlider
          {label}
          bind:value={pump[key]}
          min={input.min}
          max={input.max}
          step={input.step}
        />
      </Field.Field>
    {/each}
  </Field.Group>
</Field.Set>
