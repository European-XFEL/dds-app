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

  let structureString = $state<string | undefined>(undefined);
  let loading = $state(false);
  let notFound = $state(false);

  $effect(() => {
    const moleculeId = molecule?.id;

    if (!moleculeId) {
      structureString = undefined;
      loading = false;
      notFound = false;
      return;
    }

    let cancelled = false;
    loading = true;
    notFound = false;
    structureString = undefined;

    getMoleculeFileContent(moleculeId)
      .then((data) => {
        if (cancelled) return;
        structureString = data?.contents;
        notFound = !data?.contents;
        loading = false;
      })
      .catch(() => {
        if (cancelled) return;
        structureString = undefined;
        notFound = true;
        loading = false;
      });

    return () => {
      cancelled = true;
    };
  });

  let Structure = $state<
    null | (typeof import('matterviz/structure'))['Structure']
  >(null);

  onMount(async () => {
    const mod = await import('matterviz/structure');
    Structure = mod.Structure;
  });

  let placeholderTitle = $derived.by(() => {
    if (!Structure) return 'Loading MatterViz...';
    if (!molecule?.id) return 'No molecule selected';
    if (notFound) return 'Molecule file not found';
    return undefined;
  });

  let placeholderDescription = $derived.by(() => {
    if (!Structure) return '';
    if (!molecule?.id) return 'Select a molecule to view its structure.';
    if (loading) return 'Loading molecule...';
    return undefined;
  });
</script>

<Field.Field>
  <Field.Content class="flex items-center justify-center">
    <div
      class="relative aspect-square max-h-[50vh] w-full max-w-3xl border border-muted/50"
    >
      {#if Structure && structureString}
        <div class="absolute inset-0" transition:fade>
          <Structure
            structure_string={structureString}
            style="height: 100%; width: 100%"
          />
        </div>
      {:else}
        {#key `${placeholderTitle}|${placeholderDescription}`}
          <div class="absolute inset-0" transition:fade>
            <Placeholder
              title={placeholderTitle}
              description={placeholderDescription}
            />
          </div>
        {/key}
      {/if}
    </div>
  </Field.Content>
</Field.Field>
