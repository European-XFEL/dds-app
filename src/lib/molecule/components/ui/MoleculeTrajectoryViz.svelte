<script lang="ts">
  import { fade } from 'svelte/transition';

  import * as Field from '$shadcn/ui/field/index.js';

  import { getMoleculeFileContent } from '$remote';

  import type { Sample } from '$lib/types';
  import { Placeholder } from '$lib/ui';
  import { useMatterviz } from './useMatterviz.svelte';

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

  const { component: Trajectory } = useMatterviz(() =>
    import('matterviz/trajectory').then((m) => m.Trajectory),
  );

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

  const placeholder = $derived.by(() => {
    if (!Trajectory) return { title: 'Loading MatterViz...', description: '' };
    if (!ground?.id || !excited?.id) return { title: 'Select ground and excited molecules', description: 'Select a ground and excited molecule to view the trajectory.' };
    if (loading) return { title: 'Loading trajectory...', description: 'Concatenating XYZ structures for animation.' };
    if (loadError) return { title: 'Molecule files not found', description: 'Check the selected structures.' };
    return { title: undefined, description: undefined };
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
