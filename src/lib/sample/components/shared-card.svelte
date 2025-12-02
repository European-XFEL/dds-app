<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';
  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';
  import * as Select from '$shadcn/ui/select/index.js';

  import type { Sample } from '$lib/types';

  let {
    solvents,
    sample = $bindable(),
    short = false,
  }: {
    solvents: { id: string; name: string }[];
    sample: Sample;
    short?: boolean;
  } = $props();

  const triggerSolvent = $derived(
    solvents.find((s) => s.id === sample.solvent.id)?.name ?? 'Select a solvent',
  );
</script>

<Card.Root class="w-full @sm:gap-3">
  <Card.Header>
    <Card.Title>Sample Parameters</Card.Title>
    <Card.Description hidden={short}
      >Parameters shared by both ground and excited states.</Card.Description
    >
  </Card.Header>

  <Card.Content class="grid gap-4 @sm:gap-2">
    <div class="grid gap-2" hidden={short}>
      <Label>Solvent</Label>
      <Select.Root
        type="single"
        name="solvent"
        bind:value={
          () => sample.solvent.id,
          (v) => (
            (sample.solvent.id = v),
            (sample.solvent.name = solvents.find((s) => s.id === v)?.name ?? sample.solvent.name)
          )
        }
      >
        <Select.Trigger class="w-full justify-between">
          {triggerSolvent}
        </Select.Trigger>
        <Select.Content class="w-(--radix-select-trigger-width)">
          {#each solvents as { id, name } (id)}
            <Select.Item value={id} label={name}>
              {name}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    <hr class="my-4" hidden={short} />

    <div class="grid">
      <Label>Solute Concentration (%)</Label>
      <div class="flex items-center justify-between gap-4">
        <Input
          type="range"
          min="0.001"
          max="5"
          step="0.001"
          bind:value={sample.concentrationSoluteMolar}
        />
        <Input
          type="number"
          min="0.001"
          max="5"
          step="0.001"
          bind:value={sample.concentrationSoluteMolar}
          disabled={false}
          class="w-30 text-sm text-muted-foreground"
        />
      </div>
    </div>
  </Card.Content>
</Card.Root>
