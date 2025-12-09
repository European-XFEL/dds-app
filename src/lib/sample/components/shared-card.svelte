<script lang="ts">
  import { Info } from '@lucide/svelte';

  import { onMount } from 'svelte';

  import * as Card from '$shadcn/ui/card/index.js';
  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';
  import * as Select from '$shadcn/ui/select/index.js';
  import { Spinner } from '$shadcn/ui/spinner/index.js';
  import * as Tooltip from '$shadcn/ui/tooltip';

  import type { listSolvents } from '$lib/data.remote';
  import type { QRange, Sample } from '$lib/types';

  type Solvents = Awaited<ReturnType<typeof listSolvents>>;

  let {
    solvents: _solvents,
    solvent = $bindable(),
    concentrationSoluteMolar = $bindable(),
    qRange = $bindable(),
    short = false,
  }: {
    solvents: Solvents | Promise<Solvents>;
    solvent: Sample['solvent'];
    concentrationSoluteMolar: Sample['concentrationSoluteMolar'];
    qRange: QRange;
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

  const triggerSolvent = $derived(solvent?.name ?? 'Select a solvent');

  // TODO: make this consistent - sample sets the maximum q values, user can set values
  // lower than those, which then bins the data via frontend js
  $effect(() => {
    qRange.min = solvent?.qMin ?? 0;
    qRange.max = solvent?.qMax ?? 0;
    qRange.step = solvent?.qStep ?? 0;
  });

  const tooltip = $derived.by(() => {
    if (!solvent) return;
    return [
      ['ρ', 'm<sup>3</sup>/mol', solvent.rhom.toPrecision(3)],
      ['Cpm', 'J/mol/K', solvent.cpm.toPrecision(3)],
      ['Q Min', 'Å<sup>-1</sup>', solvent.qMin.toPrecision(3)],
      ['Q Max', 'Å<sup>-1</sup>', solvent.qMax.toPrecision(3)],
      ['Q Step', 'Å<sup>-1</sup>', solvent.qStep.toPrecision(3)],
    ];
  });
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

  <Card.Content>
    <div class="flex flex-wrap justify-between gap-4">
      <div class="grid min-w-80 gap-2" hidden={short}>
        <Label
          >Solvent
          {#if tooltip}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger><Info class="size-4" /></Tooltip.Trigger>
                <Tooltip.Content>
                  <div class="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 p-2 text-sm">
                    {#each tooltip as [key, unit, value], i (key)}
                      <span>{key}</span>
                      <span class="text-right tabular-nums">{value}</span>
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -- unit contains trusted superscript HTML -->
                      <span class="text-xs">{@html unit}</span>
                    {/each}
                  </div>
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          {/if}
        </Label>
        <Select.Root
          type="single"
          name="solvent"
          disabled={loading}
          bind:value={
            () => solvent?.id,
            (v) => {
              if (v !== undefined) {
                solvent = solvents.find((s) => s.id === v);
              }
            }
          }
        >
          <Select.Trigger class="w-full">
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

      <div class="grid min-w-100 grow gap-2 @sm:min-w-40">
        <Label>Solute Concentration (%)</Label>
        <div class="flex items-center justify-between gap-4">
          <Input
            type="number"
            min="0.001"
            max="5"
            step="0.001"
            bind:value={concentrationSoluteMolar}
            disabled={false}
            class="w-30 text-sm text-muted-foreground"
          />
          <Input
            type="range"
            min="0.001"
            max="5"
            step="0.001"
            bind:value={concentrationSoluteMolar}
          />
        </div>
      </div>
    </div>
  </Card.Content>
</Card.Root>
