<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import DetectorSetupCard from './components/SetupCard.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<DetectorSetupCard detector={simulation.detector} bind:q_range={simulation.qRange} {short} />
