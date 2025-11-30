<script lang="ts">
  import { page } from '$app/state';

  import { useSimulationState } from '$lib/state.svelte';

  import { MoleculeCard } from '$components/ui/sample';

  const simulation = useSimulationState();
  const sample = simulation.sample;
</script>

<MoleculeCard title="Ground State" molecules={page.data.molecules} bind:molecule={sample.ground} />
