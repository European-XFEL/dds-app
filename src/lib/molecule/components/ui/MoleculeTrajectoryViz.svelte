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

  const merge_xyz = (ground_xyz?: string, excited_xyz?: string) => {
    if (!ground_xyz || !excited_xyz) return undefined;

    return `${ground_xyz.trimEnd()}\n${excited_xyz.trimEnd()}\n`;
  };

  // The `Structure` component accepts the file contents as just a string via `structure_string` prop
  // but `Trajectory` doesn't. Instead some awkward url generation with `data:` is used to provide it
  // with the 'url' for the merged XYZ content...
  let trajectory_data_url = $derived.by(() => {
    const ground_id = ground?.id;
    const excited_id = excited?.id;

    if (!ground_id || !excited_id) return null;

    return Promise.all([
      getMoleculeFileContent(ground_id),
      getMoleculeFileContent(excited_id),
    ]).then(([ground_data, excited_data]) => {
      const merged = merge_xyz(ground_data?.contents, excited_data?.contents);
      if (!merged) return null;

      const encoded = encodeURIComponent(merged);
      return `data:chemical/x-xyz;charset=utf-8,${encoded}#trajectory.xyz`;
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Trajectory = $state<any>(null);

  let placeholder_title = $derived.by(() => {
    if (!Trajectory) return 'Loading MatterViz...';
    if (!ground?.id || !excited?.id)
      return 'Select ground and excited molecules';
    return undefined;
  });

  let placeholder_description = $derived.by(() => {
    if (!Trajectory) return '';
    if (!ground?.id || !excited?.id)
      return 'Select a ground and excited molecule to view the trajectory.';
    return undefined;
  });

  onMount(async () => {
    Trajectory = await import('matterviz/trajectory');
  });
</script>

<Field.Field>
  <Field.Content class="flex items-center justify-center">
    <div
      class="relative aspect-square max-h-[50vh] w-full max-w-3xl border border-muted/50"
    >
      <!-- TODO: improve messy branches and catches -->
      {#if !Trajectory || !ground?.id || !excited?.id}
        {#key `${placeholder_title}? + ${placeholder_description}`}
          <div class="absolute inset-0" transition:fade>
            <Placeholder
              title={placeholder_title}
              description={placeholder_description}
            />
          </div>
        {/key}
      {:else}
        {#await trajectory_data_url}
          <div class="absolute inset-0" transition:fade>
            <Placeholder
              title="Loading molecule trajectory..."
              description="Concatenating XYZ structures for animation."
            />
          </div>
        {:then data_url}
          {#if data_url}
            <div class="absolute inset-0" transition:fade>
              <Trajectory
                {data_url}
                auto_play={false}
                fps={10}
                style="height: 100%; width: 100%"
              />
            </div>
          {:else}
            <div class="absolute inset-0" transition:fade>
              <Placeholder
                title="Molecule files not found"
                description="Check the selected structures."
              />
            </div>
          {/if}
        {:catch}
          <div class="absolute inset-0" transition:fade>
            <Placeholder
              title="Failed to load trajectory"
              description="Please try again."
            />
          </div>
        {/await}
      {/if}
    </div>
  </Field.Content>
</Field.Field>
