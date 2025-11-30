<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import Pump from '$components/ui/pump/pump.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<Pump pump={simulation.pump} {short} />
