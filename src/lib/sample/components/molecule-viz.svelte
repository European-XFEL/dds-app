<script lang="ts">
  import { getMoleculeFileContent, listMolecules } from '../../data.remote';
  import { Structure } from 'matterviz';

  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import * as Field from '$shadcn/ui/field/index.js';

  import type { Sample } from '$lib/types';
  import LabeledPlaceholder from '$lib/ui/components/placeholder.svelte';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  let {
    molecules: _molecules = listMolecules(),
    molecule = $bindable(),
  }: {
    molecules?: Molecules | Promise<Molecules>;
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
</script>

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
          <LabeledPlaceholder label="Molecule file not found" class="h-full w-full opacity-50" />
        </div>
      {:else if structure_string}
        <div class="absolute inset-0" transition:fade>
          <Structure {structure_string} style="height: 100%; width: 100%" />
        </div>
      {/if}
    </div>
  </Field.Content>
</Field.Field>
