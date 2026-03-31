<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import * as Field from '$shadcn/ui/field/index.js';

  import { getMoleculeFileContent } from '$remote';

  import type { Sample } from '$lib/types';
  import { Placeholder } from '$lib/ui';

  interface Props {
    ground: Sample['ground'];
    excited: Sample['excited'];
  }

  let { ground, excited }: Props = $props();

  // `Trajectory` only accepts a URL — no raw string prop — so we encode the
  // merged XYZ as a data: URI.  This keeps the heavy matterviz dep client-side.
  const mergeXyz = (
    groundXyz?: string,
    excitedXyz?: string,
  ): string | undefined => {
    if (!groundXyz || !excitedXyz) return undefined;
    return `${groundXyz.trimEnd()}\n${excitedXyz.trimEnd()}\n`;
  };

  let Trajectory = $state<
    null | (typeof import('matterviz/trajectory'))['Trajectory']
  >(null);

  let dataUrl = $state<string | null>(null);
  let loading = $state(false);
  let loadError = $state(false);

  $effect(() => {
    const groundId = ground?.id;
    const excitedId = excited?.id;

    if (!groundId || !excitedId) {
      dataUrl = null;
      loading = false;
      loadError = false;
      return;
    }

    let cancelled = false;
    loading = true;
    loadError = false;
    dataUrl = null;

    Promise.all([
      getMoleculeFileContent(groundId),
      getMoleculeFileContent(excitedId),
    ])
      .then(([ground_data, excited_data]) => {
        if (cancelled) return;
        const merged = mergeXyz(ground_data?.contents, excited_data?.contents);
        if (merged) {
          const encoded = encodeURIComponent(merged);
          dataUrl = `data:chemical/x-xyz;charset=utf-8,${encoded}#trajectory.xyz`;
        } else {
          loadError = true;
        }
        loading = false;
      })
      .catch(() => {
        if (cancelled) return;
        loadError = true;
        loading = false;
      });

    return () => {
      cancelled = true;
    };
  });

  onMount(async () => {
    const mod = await import('matterviz/trajectory');
    Trajectory = mod.Trajectory;
  });

  let placeholderTitle = $derived.by(() => {
    if (!Trajectory) return 'Loading MatterViz...';
    if (!ground?.id || !excited?.id)
      return 'Select ground and excited molecules';
    if (loading) return 'Loading trajectory...';
    if (loadError) return 'Molecule files not found';
    return undefined;
  });

  let placeholderDescription = $derived.by(() => {
    if (!Trajectory) return '';
    if (!ground?.id || !excited?.id)
      return 'Select a ground and excited molecule to view the trajectory.';
    if (loading) return 'Concatenating XYZ structures for animation.';
    if (loadError) return 'Check the selected structures.';
    return undefined;
  });
</script>

<Field.Field>
  <Field.Content class="flex items-center justify-center">
    <div
      class="relative aspect-square max-h-[50vh] w-full max-w-3xl border border-muted/50"
    >
      {#if Trajectory && dataUrl}
        <div class="absolute inset-0" transition:fade>
          <Trajectory
            data_url={dataUrl}
            auto_play={false}
            fps={10}
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
