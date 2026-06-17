<script lang="ts">
  import { Label } from '$shadcn/ui/label/index.js';
  import * as Select from '$shadcn/ui/select/index.js';

  import type { Sample, Solvents } from '$lib/sample/types';

  type Props = {
    solvent: Sample['solvent'];
    solvents?: Solvents;
    loading: boolean;
    short?: boolean;
  };

  let {
    solvent = $bindable(),
    solvents,
    loading,
    short = false,
  }: Props = $props();

  const triggerSolvent = $derived(solvent?.name ?? 'Select a solvent');
</script>

<div class="grid grow gap-2" hidden={short}>
  <Label>Solvent</Label>
  <Select.Root
    type="single"
    name="solvent"
    disabled={loading}
    bind:value={
      () => solvent?.id,
      (v) => {
        if (solvents && v !== undefined) {
          solvent = solvents.find((s) => s.id === v) ?? null;
        }
      }
    }
  >
    <Select.Trigger class="w-full">
      {triggerSolvent}
    </Select.Trigger>
    <Select.Content class="w-(--radix-select-trigger-width)">
      {#each solvents ?? [] as { id, name } (id)}
        <Select.Item value={id} label={name}>
          {name}
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
