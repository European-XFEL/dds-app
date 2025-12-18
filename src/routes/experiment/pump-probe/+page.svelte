<script lang="ts">
  import { ProbeSetupCard } from '$lib/probe';
  import { PumpSetupCard } from '$lib/pump';
  import { useSimulationState } from '$lib/state.svelte';

  let { pump, probe } = useSimulationState();
</script>

<div class="flex flex-wrap gap-4 *:min-w-sm *:flex-1">
  <PumpSetupCard bind:pump />
  <ProbeSetupCard bind:probe />
</div>
