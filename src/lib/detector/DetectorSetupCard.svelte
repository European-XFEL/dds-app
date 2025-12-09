<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import DetectorSetupCard from './components/setup-card.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<DetectorSetupCard detector={simulation.detector} bind:q_range={simulation.qRange} {short} />
