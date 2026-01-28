<script lang="ts">
  import * as Field from '$shadcn/ui/field/index.js';
  import * as Select from '$shadcn/ui/select/index.js';

  import { listMolecules } from '$remote';
  import type { Sample } from '$lib/types';

  import MoleculeUpload from './MoleculeUpload.svelte';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  interface Props {
    molecule: Sample['ground'] | Sample['excited'];
    molecules?: Molecules;
    loading: boolean;
  }

  let {
    molecule = $bindable(),
    molecules = $bindable(),
    loading,
  }: Props = $props();

  const triggerMolecule = $derived(
    molecules?.find((m) => m.id === molecule?.id)?.name ?? 'Select molecule',
  );
</script>

<Field.Field>
  <Field.Content class="items-stretch gap-2 sm:flex-row">
    <Select.Root
      name="molecule"
      type="single"
      disabled={loading}
      bind:value={
        () => molecule?.id,
        (v) => {
          let res = molecules?.find((m) => m.id === v);
          if (res) {
            molecule = res;
          }
        }
      }
    >
      <Select.Trigger class="w-full justify-between">
        {triggerMolecule}
      </Select.Trigger>
      <Select.Content class="w-(--radix-select-trigger-width)">
        {#each molecules as { id, name } (id)}
          <Select.Item value={id} label={name}>
            {name}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <MoleculeUpload bind:molecules />
  </Field.Content>
</Field.Field>
