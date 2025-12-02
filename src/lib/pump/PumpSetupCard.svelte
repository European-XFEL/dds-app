<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import PumpSetupCard from './components/setup-card.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<PumpSetupCard pump={simulation.pump} {short} />
