<script lang="ts">
  import { page } from '$app/state';

  import { useSimulationState } from '$lib/state.svelte';

  import { MoleculeSharedCard } from '$components/ui/sample';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<MoleculeSharedCard solvents={page.data.solvents} sample={simulation.sample} {short} />
