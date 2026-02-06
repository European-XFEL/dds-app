<script lang="ts">
  import { ProbeSetupCard } from '$lib/probe';
  import { PumpSetupCard } from '$lib/pump';
  import { useSimulationState } from '$lib/state.svelte';

  let { pump, probe } = useSimulationState();
</script>

<div class="mt-8 flex flex-wrap gap-6 *:min-w-sm *:flex-1">
  <PumpSetupCard bind:pump />
  <ProbeSetupCard bind:probe />
</div>
