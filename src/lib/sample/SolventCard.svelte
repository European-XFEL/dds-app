<script lang="ts">
  import { fade } from 'svelte/transition';

  import * as Card from '$shadcn/ui/card/index.js';
  import { Spinner } from '$shadcn/ui/spinner/index.js';

  import { listSolvents } from '$lib/data.remote';
  import type { Sample } from '$lib/types';

  import SoluteConcentration from './components/SoluteConcentration.svelte';
  import SolventSelect from './components/SolventSelect.svelte';

  type Solvents = Awaited<ReturnType<typeof listSolvents>>;

  interface Props {
    solvent: Sample['solvent'];
    concentrationSoluteMolar: Sample['concentrationSoluteMolar'];
    solvents?: Solvents;
    short?: boolean;
    loading?: boolean;
  }

  let {
    solvent = $bindable(),
    concentrationSoluteMolar = $bindable(),
    solvents,
    short = false,
    loading = true,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  if (!solvents) {
    listSolvents().then((data) => {
      solvents = data;
      loading = false;
    });
  }
</script>

<Card.Root class="flex-auto @sm:gap-3">
  <Card.Header>
    <Card.Title>
      Sample Parameters
      {#if loading}<div transition:fade class="absolute ml-2 inline-block"><Spinner /></div>{/if}
    </Card.Title>
    <Card.Description hidden={short}>
      Parameters shared by both ground and excited states.

      <br /><br />

      Note that the choice of solvent defines the maximum Q range.
    </Card.Description>
  </Card.Header>

  <Card.Content>
    <div class="flex flex-col gap-6">
      <SolventSelect bind:solvent {solvents} {short} {loading} />

      <SoluteConcentration bind:concentrationSoluteMolar />
    </div>
  </Card.Content>
</Card.Root>
