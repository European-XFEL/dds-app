<script lang="ts">
  import type { Molecule } from '../../../types';

  import { Button } from '$shadcn/ui/button';

  import { useSimulationState } from '$lib/state.svelte';

  const simulation = useSimulationState();

  type Props = {
    molecule: Molecule;
  };

  let { molecule }: Props = $props();
</script>

<div class="flex items-center gap-1">
  <Button
    variant={simulation.sample.ground?.id === molecule.id
      ? 'default'
      : 'outline'}
    size="sm"
    class={`h-7 px-2 text-xs ${simulation.sample.ground?.id === molecule.id ? 'border-blue-400 bg-blue-500 text-white hover:bg-blue-300' : 'hover:bg-gray-100'}`}
    onclick={() => {
      if (simulation.sample.ground?.id === molecule?.id) {
        simulation.sample.ground = null;
        return;
      }

      simulation.sample.ground = molecule;

      if (simulation.sample.excited?.id === molecule.id) {
        simulation.sample.excited = null;
      }
    }}
  >
    Ground
  </Button>
  <Button
    variant={simulation.sample.excited?.id === molecule.id
      ? 'default'
      : 'outline'}
    size="sm"
    class={`h-7 px-2 text-xs ${simulation.sample.excited?.id === molecule.id ? 'border-orange-400 bg-orange-500 text-white hover:bg-orange-300' : 'hover:bg-gray-100'}`}
    onclick={() => {
      if (simulation.sample.excited?.id === molecule?.id) {
        simulation.sample.excited = null;
        return;
      }

      simulation.sample.excited = molecule;

      if (simulation.sample.ground?.id === molecule.id) {
        simulation.sample.ground = null;
      }
    }}
  >
    Excited
  </Button>
</div>
