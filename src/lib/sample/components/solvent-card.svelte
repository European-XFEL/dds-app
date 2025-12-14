<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';
  import { Spinner } from '$shadcn/ui/spinner/index.js';

  import type { listSolvents } from '$lib/data.remote';
  import type { QRange, Sample } from '$lib/types';

  import SoluteConcentration from './solute-concentration.svelte';
  import SolventSelect from './solvent-select.svelte';

  type Solvents = Awaited<ReturnType<typeof listSolvents>>;

  let {
    solvents: _solvents,
    solvent = $bindable(),
    concentrationSoluteMolar = $bindable(),
    qRange = $bindable(),
    short = false,
  }: {
    solvents?: Solvents | Promise<Solvents>;
    solvent: Sample['solvent'];
    concentrationSoluteMolar: Sample['concentrationSoluteMolar'];
    qRange: QRange;
    short?: boolean;
  } = $props();

  const loading = $derived(_solvents instanceof Promise);
</script>

<Card.Root class="w-full min-w-fit @sm:gap-3">
  <Card.Header>
    <Card.Title
      >Sample Parameters {#if loading}<div class="absolute ml-2 inline-block"><Spinner /></div>{/if}
    </Card.Title>
    <Card.Description hidden={short}
      >Parameters shared by both ground and excited states.</Card.Description
    >
  </Card.Header>

  <Card.Content>
    <div class="flex min-w-fit flex-wrap justify-between gap-4">
      <SolventSelect solvents={_solvents} bind:solvent bind:qRange {short} />

      <SoluteConcentration bind:concentrationSoluteMolar />
    </div>
  </Card.Content>
</Card.Root>
