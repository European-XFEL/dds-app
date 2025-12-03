<script lang="ts">
  import { listSolvents } from '../../routes/data.remote';

  import { useSimulationState } from '$lib/state.svelte';

  import SampleSharedCard from './components/shared-card.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<SampleSharedCard solvents={listSolvents()} bind:sample={simulation.sample} {short} />
