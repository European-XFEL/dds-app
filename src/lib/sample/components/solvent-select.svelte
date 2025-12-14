<script lang="ts">
  import { Info } from '@lucide/svelte';

  import { onMount } from 'svelte';

  import { Label } from '$shadcn/ui/label/index.js';
  import * as Select from '$shadcn/ui/select/index.js';
  import * as Tooltip from '$shadcn/ui/tooltip';

  import { listSolvents } from '$lib/data.remote';
  import type { QRange, Sample } from '$lib/types';

  type Solvents = Awaited<ReturnType<typeof listSolvents>>;

  let {
    solvents: _solvents = listSolvents(),
    solvent = $bindable(),
    qRange = $bindable(),
    short = false,
  }: {
    solvents?: Solvents | Promise<Solvents> | undefined;
    solvent: Sample['solvent'];
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

<div class="grid max-w-120 min-w-40 grow gap-2" hidden={short}>
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
