<script lang="ts">
  import { listMolecules } from '../../../data.remote';
  import { Upload } from '@lucide/svelte';

  import { Button } from '$shadcn/ui/button/index.js';
  import * as Field from '$shadcn/ui/field/index.js';
  import * as Select from '$shadcn/ui/select/index.js';

  import type { Sample } from '$lib/types';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  interface Props {
    molecule: Sample['ground'] | Sample['excited'];
    molecules?: Molecules;
    loading: boolean;
  }

  let { molecule = $bindable(), molecules, loading }: Props = $props();

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
    <Button type="button" variant="outline" class="whitespace-nowrap" disabled>
      <Upload class="mr-2 h-4 w-4" /> Upload file
    </Button>
  </Field.Content>
</Field.Field>
