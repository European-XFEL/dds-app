<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import * as Field from '$shadcn/ui/field/index.js';

  import { getMoleculeFileContent } from '$remote';

  import type { Sample } from '$lib/types';
  import { Placeholder } from '$lib/ui';

  interface Props {
    molecule: Sample['ground'] | Sample['excited'];
  }

  let { molecule }: Props = $props();

  let structure_string = $state<string | undefined>(undefined);
  let loading = $state(false);
  let not_found = $state(false);

  $effect(() => {
    const molecule_id = molecule?.id;

    if (!molecule_id) {
      structure_string = undefined;
      loading = false;
      not_found = false;
      return;
    }

    let cancelled = false;
    loading = true;
    not_found = false;
    structure_string = undefined;

    getMoleculeFileContent(molecule_id).then((data) => {
      if (cancelled) return;
      structure_string = data?.contents;
      not_found = !data?.contents;
      loading = false;
    });

    return () => {
      cancelled = true;
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Structure = $state<any>(null);

  onMount(async () => {
    const mod = await import('matterviz/structure');
    Structure = mod.Structure;
  });

  let placeholder_title = $derived.by(() => {
    if (!Structure) return 'Loading MatterViz...';
    if (!molecule?.id) return 'No molecule selected';
    if (not_found) return 'Molecule file not found';
    return undefined;
  });

  let placeholder_description = $derived.by(() => {
    if (!Structure) return '';
    if (!molecule?.id) return 'Select a molecule to view its structure.';
    if (loading) return 'Loading molecule...';
    return undefined;
  });
</script>

<Field.Field>
  <Field.Content class="flex items-center justify-center">
    <div class="relative aspect-square w-full max-w-3xl border border-muted/50">
      {#if Structure && structure_string}
        <div class="absolute inset-0" transition:fade>
          <Structure {structure_string} style="height: 100%; width: 100%" />
        </div>
      {:else}
        {#key `${placeholder_title}|${placeholder_description}`}
          <div class="absolute inset-0" transition:fade>
            <Placeholder
              title={placeholder_title}
              description={placeholder_description}
            />
          </div>
        {/key}
      {/if}
    </div>
  </Field.Content>
</Field.Field>
