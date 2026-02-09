<script lang="ts">
  import { fade } from 'svelte/transition';

  import * as Card from '$shadcn/ui/card/index.js';
  import { Spinner } from '$shadcn/ui/spinner/index.js';

  import type { Sample, Solvents } from '$lib/types';
  import NumSlider from '$lib/ui/NumSlider.svelte';

  import SolventSelect from './ui/SolventSelect.svelte';

  interface Props {
    solvent: Sample['solvent'];
    concentrationSoluteMolar: Sample['concentrationSoluteMolar'];
    solvents: Solvents;
    short?: boolean;
    loading?: boolean;
  }

  let {
    solvent = $bindable(),
    concentrationSoluteMolar = $bindable(),
    solvents,
    short = false,
    loading = false,
  }: Props = $props();
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>
      Sample Parameters
      {#if loading}
        <div transition:fade class="absolute ml-2 inline-block">
          <Spinner />
        </div>
      {/if}
    </Card.Title>
    <Card.Description hidden={short}>
      Parameters shared by both ground and excited states.
      <br /><br />
      Note that the choice of solvent defines the maximum Q range.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-col gap-6">
      <SolventSelect bind:solvent {solvents} {loading} />
      <NumSlider
        label="Solute Concentration (mol/L)"
        min="0.001"
        max="5"
        step="0.001"
        bind:value={concentrationSoluteMolar}
      />
    </div>
  </Card.Content>
</Card.Root>
