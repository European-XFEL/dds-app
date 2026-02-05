<script lang="ts">
  import type { Molecule, Molecules } from '../types';

  import * as Card from '$shadcn/ui/card';

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
</script>

<Card.Root>
  <Card.Header class="pb-4">
    <Card.Title class="text-lg">Molecule Library</Card.Title>
    <Card.Description>
      Browse available molecules. Use the Ground and Excited buttons to select
      molecules for analysis.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <MoleculeDataTable bind:ground bind:excited {molecules} {loading} />
  </Card.Content>
</Card.Root>
