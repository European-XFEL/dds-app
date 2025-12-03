<script lang="ts">
  import { onMount } from 'svelte';

  import * as Card from '$shadcn/ui/card/index.js';
  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';
  import * as Select from '$shadcn/ui/select/index.js';
  import { Spinner } from '$shadcn/ui/spinner/index.js';

  import type { Sample } from '$lib/types';

  type Solvents = { id: string; name: string }[];

  let {
    solvents: _solvents,
    sample = $bindable(),
    short = false,
  }: {
    solvents: Solvents | Promise<Solvents>;
    sample: Sample;
    short?: boolean;
  } = $props();

  let solvents = $state<Solvents>([]);
  let loading = $state(true);

  onMount(() => {
    Promise.resolve(_solvents).then((data) => {
      solvents = data;
      loading = false;
    });
  });

  const triggerSolvent = $derived(
    solvents.find((s) => s.id === sample.solvent.id)?.name ?? 'Select a solvent',
  );
</script>

<Card.Root class="w-full @sm:gap-3">
  <Card.Header>
    <Card.Title
      >Sample Parameters {#if loading}<div class="absolute ml-2 inline-block"><Spinner /></div>{/if}
    </Card.Title>
    <Card.Description hidden={short}
      >Parameters shared by both ground and excited states.</Card.Description
    >
  </Card.Header>

  <Card.Content class="flex flex-wrap justify-between gap-4 @sm:gap-2">
    <div class="grid min-w-80 gap-2" hidden={short}>
      <Label>Solvent</Label>
      <Select.Root
        type="single"
        name="solvent"
        disabled={loading}
        bind:value={
          () => sample.solvent.id,
          (v) => (
            (sample.solvent.id = v),
            (sample.solvent.name = solvents.find((s) => s.id === v)?.name ?? sample.solvent.name)
          )
        }
      >
        <Select.Trigger class="w-full items-center">
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

    <div class="grid min-w-100 grow">
      <Label>Solute Concentration (%)</Label>
      <div class="flex items-center justify-between gap-4">
        <Input
          type="number"
          min="0.001"
          max="5"
          step="0.001"
          bind:value={sample.concentrationSoluteMolar}
          disabled={false}
          class="w-30 text-sm text-muted-foreground"
        />
        <Input
          type="range"
          min="0.001"
          max="5"
          step="0.001"
          bind:value={sample.concentrationSoluteMolar}
        />
      </div>
    </div>
  </Card.Content>
</Card.Root>
