<script lang="ts">
  import { ProbeSetupCard } from '$lib/probe';
  import { PumpSetupCard } from '$lib/pump';
  import { useSimulationState } from '$lib/state.svelte';

  const simulation = useSimulationState();
</script>

<div class="flex flex-wrap gap-6 *:min-w-sm *:flex-1">
  <PumpSetupCard bind:pump={simulation.pump} />
  <ProbeSetupCard bind:probe={simulation.probe} />
</div>
