<script lang="ts">
  import * as Collapsible from '$shadcn/ui/collapsible/index.js';

  import { MoleculeTrajectoryViz, MoleculeViz } from '$lib/molecule';
  import type { SimulationState } from '$lib/state.svelte';

  type VizMode = 'trajectory' | 'individual';

  interface Props {
    simulation: SimulationState;
    hasAll?: boolean;
    vizCollapseShow?: boolean;
  }

  let { simulation, hasAll = true, vizCollapseShow = true }: Props = $props();

  let vizOpen = $state(false);
  let vizMode = $state<VizMode>('trajectory');

  const hasGround = $derived(!!simulation.sample.ground?.id);
  const hasExcited = $derived(!!simulation.sample.excited?.id);

  const canVisualize = $derived(hasAll && hasGround && hasExcited);
</script>

{#snippet vizControls()}
  <div class="w-full space-y-3">
    <div class="flex items-center gap-2 text-sm">
      <span class="font-semibold text-muted-foreground">View:</span>
      <button
        class={`rounded-md border border-border/60 px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
          vizMode === 'trajectory' ? 'bg-secondary/20' : ''
        }`}
        onclick={() => (vizMode = 'trajectory')}
      >
        Trajectory
      </button>
      <button
        class={`rounded-md border border-border/60 px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
          vizMode === 'individual' ? 'bg-secondary/20' : ''
        }`}
        onclick={() => (vizMode = 'individual')}
      >
        Individual
      </button>
    </div>
    {#if vizMode === 'trajectory'}
      <MoleculeTrajectoryViz
        ground={simulation.sample.ground}
        excited={simulation.sample.excited}
      />
    {:else}
      <div class="grid gap-3 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <h3 class="text-xs font-semibold text-muted-foreground">
            Ground State
          </h3>
          <MoleculeViz molecule={simulation.sample.ground} />
        </div>
        <div class="flex flex-col gap-2">
          <h3 class="text-xs font-semibold text-muted-foreground">
            Excited State
          </h3>
          <MoleculeViz molecule={simulation.sample.excited} />
        </div>
      </div>
    {/if}
  </div>
{/snippet}

{#if canVisualize}
  <section
    class="mt-3 w-full rounded-lg border border-border/50 bg-secondary/5 p-3"
  >
    {#if vizCollapseShow}
      <Collapsible.Root bind:open={vizOpen} class="w-full">
        <Collapsible.Trigger
          class="w-full rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium transition hover:bg-secondary/20"
        >
          {#if vizOpen}
            Hide Molecule Visualizations
          {:else}
            Show Molecule Visualizations
          {/if}
        </Collapsible.Trigger>
        <Collapsible.Content class="mt-3 w-full">
          {@render vizControls()}
        </Collapsible.Content>
      </Collapsible.Root>
    {:else}
      {@render vizControls()}
    {/if}
  </section>
{/if}
