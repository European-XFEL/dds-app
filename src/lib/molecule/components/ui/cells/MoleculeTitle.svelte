<script lang="ts">
  import type { GroupRow } from '../../columns';

  import { Button } from '$shadcn/ui/button';

  import { useSimulationState } from '$lib/state.svelte';

  const simulation = useSimulationState();

  type Props = {
    group: GroupRow;
  };

  let { group }: Props = $props();
</script>

<Button
  variant="ghost"
  size="sm"
  onclick={() => {
    for (const molecule of group.molecules) {
      if (molecule.state === 0) {
        simulation.sample.ground = molecule;
      } else if (molecule.state === 1) {
        simulation.sample.excited = molecule;
      }
    }
  }}
>
  {group?.moleculeName}
</Button>
