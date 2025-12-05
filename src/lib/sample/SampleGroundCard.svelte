<script lang="ts">
  import { listMolecules } from '$lib/data.remote';
  import { useSimulationState } from '$lib/state.svelte';

  import MoleculeCard from './components/molecule-card.svelte';

  const simulation = useSimulationState();
</script>

<MoleculeCard
  title="Ground State"
  molecules={listMolecules()}
  bind:molecule={simulation.sample.ground}
/>
