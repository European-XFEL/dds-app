<script lang="ts">
  import { Structure } from 'matterviz';

  import { fade } from 'svelte/transition';

  import * as Field from '$shadcn/ui/field/index.js';

  import { getMoleculeFileContent } from '$lib/data.remote';
  import type { Sample } from '$lib/types';
  import { Placeholder } from '$lib/ui';

  interface Props {
    molecule: Sample['ground'] | Sample['excited'];
  }

  let { molecule }: Props = $props();

  // Store the resolved structure content to avoid flashing during fast loads
  let structure_string = $state<string | undefined>(undefined);
  let loading_structure = $state(false);
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
      return;
    }

    loading_structure = true;

    // Only show loading indicator after a short delay to avoid flashing
    loading_timeout = setTimeout(() => {}, 200);

    getMoleculeFileContent(molecule_id).then((data) => {
      // Only update if we're still looking at the same molecule
      if (molecule?.id === molecule_id) {
        structure_string = data?.contents;
        loading_structure = false;
        if (loading_timeout) {
          clearTimeout(loading_timeout);
          loading_timeout = undefined;
        }
      }
    });
  });

  let placeholder_title = $derived.by(() => {
    if (!molecule?.id) return 'No molecule selected';
    if (molecule?.id && !loading_structure && !structure_string) return 'Molecule file not found';
  });

  let placeholder_description = $derived.by(() => {
    if (!molecule?.id) return 'Select a molecule to view its structure.';
    if (loading_structure && !structure_string) return 'Loading molecule';
  });
</script>

<Field.Field>
  <Field.Content class="flex items-center justify-center">
    <div class="relative aspect-square w-full max-w-3xl border border-muted/50">
      {#if structure_string}
        <div class="absolute inset-0" transition:fade>
          <Structure {structure_string} style="height: 100%; width: 100%;" />
        </div>
      {:else}
        {#key `${placeholder_title}? + ${placeholder_description}`}
          <div class="absolute inset-0" transition:fade>
            <Placeholder title={placeholder_title} description={placeholder_description} />
          </div>
        {/key}
      {/if}
    </div>
  </Field.Content>
</Field.Field>
