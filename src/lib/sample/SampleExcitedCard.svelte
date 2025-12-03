<script lang="ts">
  import { listMolecules } from '../../routes/data.remote';

  import { useSimulationState } from '$lib/state.svelte';

  import MoleculeCard from './components/molecule-card.svelte';

  const simulation = useSimulationState();
  const sample = simulation.sample;
</script>

<MoleculeCard title="Excited State" molecules={listMolecules()} bind:molecule={sample.excited} />
