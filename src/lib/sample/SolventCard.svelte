<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import SolventCard from './components/solvent-card.svelte';

  const simulation = useSimulationState();

  type Props = {
    short?: boolean;
  };

  let { short = false }: Props = $props();
</script>

<SolventCard
  bind:concentrationSoluteMolar={simulation.sample.concentrationSoluteMolar}
  bind:solvent={simulation.sample.solvent}
  bind:qRange={simulation.qRange}
  {short}
/>
