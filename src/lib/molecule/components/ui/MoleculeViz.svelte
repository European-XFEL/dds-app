<script lang="ts">
  import { fade } from 'svelte/transition';

  import * as Field from '$shadcn/ui/field/index.js';

  import { getMoleculeFileContent } from '$lib/data/api';
  import type { Sample } from '$lib/types';
  import { Placeholder } from '$lib/ui';

  import { useMatterviz } from './useMatterviz.svelte';

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

  const { component: Structure } = useMatterviz(() =>
    import('matterviz/structure').then((m) => m.Structure),
  );

  const placeholder = $derived.by(() => {
    if (!Structure) return { title: 'Loading MatterViz...', description: '' };
    if (!molecule?.id)
      return {
        title: 'No molecule selected',
        description: 'Select a molecule to view its structure.',
      };
    if (notFound)
      return { title: 'Molecule file not found', description: undefined };
    if (loading)
      return { title: undefined, description: 'Loading molecule...' };
    return { title: undefined, description: undefined };
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
        {#key `${placeholder.title}|${placeholder.description}`}
          <div class="absolute inset-0" transition:fade>
            <Placeholder
              title={placeholder.title}
              description={placeholder.description}
            />
          </div>
        {/key}
      {/if}
    </div>
  </Field.Content>
</Field.Field>
