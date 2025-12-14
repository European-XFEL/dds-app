<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import PumpSetupCard from './components/setup-card.svelte';

  const simulation = useSimulationState();
</script>

<PumpSetupCard bind:pump={simulation.pump} />
