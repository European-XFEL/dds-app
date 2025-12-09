<script lang="ts">
  import { listSolvents } from '$lib/data.remote';
  import { useSimulationState } from '$lib/state.svelte';

  import SampleSharedCard from './components/shared-card.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<SampleSharedCard
  solvents={listSolvents()}
  bind:concentrationSoluteMolar={simulation.sample.concentrationSoluteMolar}
  bind:solvent={simulation.sample.solvent}
  bind:qRange={simulation.qRange}
  {short}
/>
