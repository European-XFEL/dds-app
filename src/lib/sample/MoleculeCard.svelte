<script lang="ts">
  import { listMolecules } from '../data.remote';

  import * as Card from '$shadcn/ui/card/index.js';
  import * as Collapsible from '$shadcn/ui/collapsible/index.js';
  import { Spinner } from '$shadcn/ui/spinner';

  import type { Sample } from '$lib/types';

  import MoleculeSelect from './components/MoleculeSelect.svelte';
  import MoleculeViz from './components/MoleculeViz.svelte';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  type Props = {
    title: string;
    molecule: Sample['ground'] | Sample['excited'];
    molecules?: Molecules;
    vizOpen?: boolean;
    vizCollapseShow?: boolean;
    loading: boolean;
  };

  let {
    title,
    molecule = $bindable(),
    molecules,
    loading,
    vizOpen = false,
    vizCollapseShow = false,
  }: Props = $props();
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>
      {title}
      {#if loading}<div class="absolute ml-2 inline-block"><Spinner /></div>{/if}
    </Card.Title>
  </Card.Header>

  <Card.Content>
    <form class="flex flex-col gap-6">
      <MoleculeSelect {molecules} bind:molecule {loading} />

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
            <MoleculeViz {molecule} />
          </Collapsible.Content>
        </Collapsible.Root>
      {:else if vizOpen}
        <MoleculeViz {molecule} />
      {/if}
    </form>
  </Card.Content>
</Card.Root>
