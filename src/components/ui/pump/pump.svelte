<script lang="ts">
  import * as Card from '$shadcn/ui/card';
  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';
  import { Label } from '$shadcn/ui/label';

  import type { Pump } from '$lib/types';

  let { pump = $bindable(), short }: { pump: Pump; short: boolean } = $props();

  const fields = [
    { label: 'Excited State Energy (eV)', key: 'excitedStateEnergyEv' },
    { label: 'Excited State Fraction', key: 'excitedStateFraction' },
    { label: 'Photon Energy (eV)', key: 'photonEnergyEv' },
  ] satisfies Array<{ label: string; key: keyof Pump }>;
</script>

<Card.Root class="max-h-fit @sm:gap-3">
  <Card.Header>
    <Card.Title>Optical Pump Setup</Card.Title>
  </Card.Header>

  <Card.Content>
    <form>
      {#each fields as { label, key } (key)}
        <Field.Field>
          <Field.Label>
            <Label>{label}</Label>
          </Field.Label>
          <Field.Content>
            <div class="flex items-center justify-between gap-2">
              <Input type="range" min="0.01" step="0.01" bind:value={pump[key]} />
              <Input
                type="number"
                min="0.01"
                step="0.01"
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
