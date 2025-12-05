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

  // Store the resolved structure content to avoid flashing during fast loads
  let structure_string = $state<string | undefined>(undefined);
  let loading_structure = $state(false);
  let show_loading_indicator = $state(false);
  let loading_timeout: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    const molecule_id = molecule?.id;

    // Clear any pending loading indicator timeout
    if (loading_timeout) {
      clearTimeout(loading_timeout);
      loading_timeout = undefined;
    }

    if (!molecule_id) {
      structure_string = undefined;
      loading_structure = false;
      show_loading_indicator = false;
      return;
    }

    loading_structure = true;

    // Only show loading indicator after a short delay to avoid flashing
    loading_timeout = setTimeout(() => {
      if (loading_structure) {
        show_loading_indicator = true;
      }
    }, 200);

    getMoleculeFileContent(molecule_id).then((data) => {
      // Only update if we're still looking at the same molecule
      if (molecule?.id === molecule_id) {
        structure_string = data?.contents;
        loading_structure = false;
        show_loading_indicator = false;
        if (loading_timeout) {
          clearTimeout(loading_timeout);
          loading_timeout = undefined;
        }
      }
    });
  });

  // Determine what to display
  let display_state = $derived.by(() => {
    if (!molecule?.id) return 'empty';
    if (show_loading_indicator && !structure_string) return 'loading';
    if (structure_string) return 'ready';
    if (!loading_structure && !structure_string) return 'not-found';
    // Keep showing the previous structure while loading new one
    return 'ready';
  });

  const triggerMolecule = $derived(
    molecules.find((m) => m.id === molecule?.id)?.name ?? 'Select molecule',
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
          <div class="relative h-120 w-full min-w-150 border border-muted/50">
            {#if display_state === 'empty'}
              <div class="absolute inset-0" transition:fade>
                <LabeledPlaceholder label="No molecule selected" class="h-full w-full opacity-50" />
              </div>
            {:else if display_state === 'loading'}
              <div class="absolute inset-0" transition:fade>
                <LabeledPlaceholder label="Loading molecule..." class="h-full w-full opacity-50" />
              </div>
            {:else if display_state === 'not-found'}
              <div class="absolute inset-0" transition:fade>
                <LabeledPlaceholder
                  label="Molecule file not found"
                  class="h-full w-full opacity-50"
                />
              </div>
            {:else if structure_string}
              <div class="absolute inset-0" transition:fade>
                <Structure {structure_string} style="height: 100%; width: 100%" />
              </div>
            {/if}
          </div>
        </Field.Content>
      </Field.Field>
    </form>
  </Card.Content>
</Card.Root>
