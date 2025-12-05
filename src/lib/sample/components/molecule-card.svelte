<script lang="ts">
  import { getMoleculeFileContent, listMolecules } from '../../data.remote';
  import { Upload } from '@lucide/svelte';
  import { Structure } from 'matterviz';

  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { Button } from '$shadcn/ui/button/index.js';
  import * as Card from '$shadcn/ui/card/index.js';
  import * as Field from '$shadcn/ui/field/index.js';
  import * as Select from '$shadcn/ui/select/index.js';
  import { Spinner } from '$shadcn/ui/spinner';

  import type { Sample } from '$lib/types';
  import LabeledPlaceholder from '$lib/ui/components/placeholder.svelte';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  let {
    title,
    molecules: _molecules,
    molecule = $bindable(),
  }: {
    title: string;
    molecules: Molecules | Promise<Molecules>;
    molecule: Sample['ground'] | Sample['excited'];
  } = $props();

  let molecules = $state<Molecules>([]);
  let loading = $state(true);

  onMount(() => {
    Promise.resolve(_molecules).then((data) => {
      molecules = data;
      loading = false;
    });
  });

  let molecule_file_contents = $derived(
    getMoleculeFileContent(molecule.id).then((data) => data?.fileTable.contents),
  );

  const triggerMolecule = $derived(
    molecules.find((m) => m.id === molecule.id)?.name ?? 'Select molecule',
  );
</script>

<Card.Root class="flex-auto @sm:gap-3">
  <Card.Header>
    <Card.Title
      >{title}
      {#if loading}<div class="absolute ml-2 inline-block"><Spinner /></div>{/if}
    </Card.Title>
  </Card.Header>

  <Card.Content>
    <form class="flex flex-col gap-6">
      <Field.Field>
        <Field.Content class="items-stretch gap-2 sm:flex-row">
          <Select.Root
            name="molecule"
            type="single"
            disabled={loading}
            bind:value={
              () => molecule?.id,
              (v) => {
                let res = molecules.find((m) => m.id === v);
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
      <Field.Field>
        <Field.Content>
          <div class="h-120 w-full min-w-150 border border-muted/50">
            {#if molecule.id === ''}
              <span transition:fade>
                <LabeledPlaceholder label="No molecule selected" class="h-full w-full opacity-50" />
              </span>
            {:else}
              {#await molecule_file_contents}
                <span transition:fade>
                  <LabeledPlaceholder
                    label="No molecule selected"
                    class="h-full w-full opacity-50"
                  />
                </span>
              {:then structure_string}
                <span transition:fade={{ delay: 200 }}>
                  <Structure {structure_string} style="height: 100%; width: 100%" />
                </span>
              {/await}
            {/if}
          </div>
        </Field.Content>
      </Field.Field>
    </form>
  </Card.Content>
</Card.Root>
