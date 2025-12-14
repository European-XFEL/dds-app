<script lang="ts">
  import { listMolecules } from '../../data.remote';

  import * as Card from '$shadcn/ui/card/index.js';
  import * as Collapsible from '$shadcn/ui/collapsible/index.js';
  import { Spinner } from '$shadcn/ui/spinner';

  import type { Sample } from '$lib/types';

  import MoleculeSelect from './molecule-select.svelte';
  import MoleculeViz from './molecule-viz.svelte';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  let {
    title,
    molecules: _molecules,
    molecule = $bindable(),
    vizOpen = false,
    vizCollapseShow = false,
  }: {
    title: string;
    molecules?: Molecules | Promise<Molecules>;
    molecule: Sample['ground'] | Sample['excited'];
    vizOpen?: boolean;
    vizCollapseShow?: boolean;
  } = $props();

  const loading = $derived(_molecules instanceof Promise);
</script>

<Card.Root class="flex-auto @sm:gap-3">
  <Card.Header>
    <Card.Title
      >{title}
      {#if loading}<div class="absolute ml-2 inline-block"><Spinner /></div>{/if}
    </Card.Title>
  </Card.Header>

  <Card.Content>
    <form class="flex flex-col gap-6">
      <MoleculeSelect molecules={_molecules} bind:molecule />

      {#if vizCollapseShow}
        <Collapsible.Root bind:open={vizOpen} class="w-full">
          <Collapsible.Trigger
            class="mb-2 w-full rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium hover:bg-secondary/20"
          >
            {#if vizOpen}
              Hide Molecule Visualization
            {:else}
              Show Molecule Visualization
            {/if}
          </Collapsible.Trigger>
          <Collapsible.Content class="w-full">
            <MoleculeViz molecules={_molecules} bind:molecule />
          </Collapsible.Content>
        </Collapsible.Root>
      {:else if vizOpen}
        <MoleculeViz molecules={_molecules} bind:molecule />
      {/if}
    </form>
  </Card.Content>
</Card.Root>
