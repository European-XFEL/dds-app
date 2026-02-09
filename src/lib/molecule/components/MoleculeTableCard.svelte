<script lang="ts">
  import type { Molecule, Molecules } from '../types';

  import { fade } from 'svelte/transition';

  import * as Card from '$shadcn/ui/card';
  import { Spinner } from '$shadcn/ui/spinner';

  import MoleculeDataTable from './ui/MoleculeTable.svelte';

  interface Props {
    molecules: Molecules;
    ground?: Molecule | null;
    excited?: Molecule | null;
    loading?: boolean;
  }

  let { ground, excited, molecules, loading = false }: Props = $props();
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
    <MoleculeDataTable {ground} {excited} {molecules} />
  </Card.Content>
</Card.Root>
