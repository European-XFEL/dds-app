<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import ProbeSetupCard from './components/setup-card.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<ProbeSetupCard bind:probe={simulation.probe} {short} />
