<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';
  import * as Table from '$shadcn/ui/table/index.js';

  import type { Sample } from '$lib/types';

  interface Props {
    solvent: Sample['solvent'];
  }

  let { solvent }: Props = $props();

  const tooltip = $derived.by(() => {
    if (!solvent) return;
    return [
      ['ρ', 'm<sup>3</sup>/mol', solvent.rhom.toPrecision(3)],
      ['Cpm', 'J/mol/K', solvent.cpm.toPrecision(3)],
      ['Q Min', 'Å<sup>-1</sup>', solvent.qMin.toPrecision(3)],
      ['Q Max', 'Å<sup>-1</sup>', solvent.qMax.toPrecision(3)],
      ['Q Step', 'Å<sup>-1</sup>', solvent.qStep.toPrecision(3)],
    ];
  });
</script>

<Card.Root class="flex-auto @sm:gap-3">
  <Card.Header>
    <Card.Title>Solvent Information</Card.Title>
  </Card.Header>

  <Card.Content>
    <Table.Root>
      <Table.Body>
        {#each tooltip as [key, unit, value], i (key)}
          <Table.Row>
            <Table.Cell class="font-medium">{key}</Table.Cell>
            <Table.Cell>{value}</Table.Cell>
            <Table.Cell class="text-end">{@html unit}</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>
