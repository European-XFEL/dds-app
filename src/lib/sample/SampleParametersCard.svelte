<script lang="ts">
  import { page } from '$app/state';

  import { useSimulationState } from '$lib/state.svelte';

  import SampleSharedCard from './components/shared-card.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<SampleSharedCard solvents={page.data.solvents} sample={simulation.sample} {short} />
