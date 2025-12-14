<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { useSimulationState } from '$lib/state.svelte';

  import MoleculeCard from './components/molecule-card.svelte';

  const simulation = useSimulationState();

  type Kind = 'ground' | 'excited';

  type Props = Omit<ComponentProps<typeof MoleculeCard>, 'title' | 'molecule'> & { kind: Kind };

  let { kind, vizOpen = true, ...restProps }: Props = $props();
</script>

{#if kind === 'ground'}
  <MoleculeCard
    title="Ground State"
    bind:molecule={simulation.sample.ground}
    {vizOpen}
    {...restProps}
  />
{:else}
  <MoleculeCard
    title="Excited State"
    bind:molecule={simulation.sample.excited}
    {vizOpen}
    {...restProps}
  />
{/if}
