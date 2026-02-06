<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';
  import * as Table from '$shadcn/ui/table/index.js';

  import type { Sample } from '$lib/types';

  interface Props {
    solvent: Sample['solvent'];
  }

  let { solvent }: Props = $props();

  const tooltip = $derived.by(() => {
    // if (!solvent) return;
    return [
      ['ρ<sub>m</sub>', 'mol/m<sup>3</sup>', solvent?.rhom.toPrecision(5)],
      ['Cpm', 'J/mol/K', solvent?.cpm.toPrecision(3)],
      ['Q Min', 'Å<sup>-1</sup>', solvent?.qMin.toPrecision(3)],
      ['Q Max', 'Å<sup>-1</sup>', solvent?.qMax.toPrecision(3)],
      ['Q Step', 'Å<sup>-1</sup>', solvent?.qStep.toPrecision(3)],
    ];
  });
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Solvent Information</Card.Title>
    <Card.Description>Summary of solvent information.</Card.Description>
  </Card.Header>

  <!-- TODO: Add reference link to where solvent files downloaded from  -->

  <Card.Content class="max-w-md">
    <Table.Root>
      <Table.Body>
        {#each tooltip as [key, unit, value], i (key)}
          <Table.Row>
            <Table.Cell class="font-medium">{@html key}</Table.Cell>
            <Table.Cell>{value}</Table.Cell>
            <Table.Cell class="text-end">{@html unit}</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>
