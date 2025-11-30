<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import DetectorCard from '$components/ui/detector/detector-card.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<DetectorCard detector={simulation.detector} q_range={simulation.qRange} {short} />
