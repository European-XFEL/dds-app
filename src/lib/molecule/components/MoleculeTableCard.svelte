<script lang="ts">
  import { listMolecules } from '$remote';
  import type { Molecule, Molecules } from '../types';

  import { fade } from 'svelte/transition';

  import * as Card from '$shadcn/ui/card';
  import { Spinner } from '$shadcn/ui/spinner';

  import MoleculeDataTable from './MoleculeTable.svelte';

  interface Props {
    molecules: Molecules;
    ground?: Molecule;
    excited?: Molecule;
    loading?: boolean;
  }

  let {
    ground = $bindable(),
    excited = $bindable(),
    molecules,
    loading = true,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  if (!molecules) {
    listMolecules().then((data) => {
      molecules = data;
      loading = false;
    });
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>
      Molecule Library
      {#if loading}
        <div transition:fade class="absolute ml-2 inline-block">
          <Spinner />
        </div>
      {/if}
    </Card.Title>
    <Card.Description>
      Browse available molecules. Use the Ground and Excited buttons to select
      molecules for analysis.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <MoleculeDataTable
      bind:ground
      bind:excited
      molecules={molecules || []}
      {loading}
    />
  </Card.Content>
</Card.Root>
