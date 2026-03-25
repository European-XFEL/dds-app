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
  const merge_xyz = (
    ground_xyz?: string,
    excited_xyz?: string,
  ): string | undefined => {
    if (!ground_xyz || !excited_xyz) return undefined;
    return `${ground_xyz.trimEnd()}\n${excited_xyz.trimEnd()}\n`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Trajectory = $state<any>(null);

  let data_url = $state<string | null>(null);
  let loading = $state(false);
  let load_error = $state(false);

  $effect(() => {
    const ground_id = ground?.id;
    const excited_id = excited?.id;

    if (!ground_id || !excited_id) {
      data_url = null;
      loading = false;
      load_error = false;
      return;
    }

    let cancelled = false;
    loading = true;
    load_error = false;
    data_url = null;

    Promise.all([
      getMoleculeFileContent(ground_id),
      getMoleculeFileContent(excited_id),
    ])
      .then(([ground_data, excited_data]) => {
        if (cancelled) return;
        const merged = merge_xyz(ground_data?.contents, excited_data?.contents);
        if (merged) {
          const encoded = encodeURIComponent(merged);
          data_url = `data:chemical/x-xyz;charset=utf-8,${encoded}#trajectory.xyz`;
        } else {
          load_error = true;
        }
        loading = false;
      })
      .catch(() => {
        if (cancelled) return;
        load_error = true;
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

  let placeholder_title = $derived.by(() => {
    if (!Trajectory) return 'Loading MatterViz...';
    if (!ground?.id || !excited?.id)
      return 'Select ground and excited molecules';
    if (loading) return 'Loading trajectory...';
    if (load_error) return 'Molecule files not found';
    return undefined;
  });

  let placeholder_description = $derived.by(() => {
    if (!Trajectory) return '';
    if (!ground?.id || !excited?.id)
      return 'Select a ground and excited molecule to view the trajectory.';
    if (loading) return 'Concatenating XYZ structures for animation.';
    if (load_error) return 'Check the selected structures.';
    return undefined;
  });
</script>

<Field.Field>
  <Field.Content class="flex items-center justify-center">
    <div
      class="relative aspect-square max-h-[50vh] w-full max-w-3xl border border-muted/50"
    >
      {#if Trajectory && data_url}
        <div class="absolute inset-0" transition:fade>
          <Trajectory
            {data_url}
            auto_play={false}
            fps={10}
            style="height: 100%; width: 100%"
          />
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
