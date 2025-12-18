<script lang="ts">
  import { MoleculeCard, SolventCard, SolventInfoCard } from '$lib/sample';
  import { useSimulationState } from '$lib/state.svelte';

  let { sample } = useSimulationState();
</script>

<div class="flex flex-col gap-6 @sm:flex-wrap">
  <div class="grid grid-cols-2 gap-6 @sm:grid-cols-1">
    <SolventCard
      bind:solvent={sample.solvent}
      bind:concentrationSoluteMolar={sample.concentrationSoluteMolar}
    />
    <SolventInfoCard solvent={sample.solvent} />
  </div>
  <div class="grid grid-cols-2 gap-6 @sm:grid-cols-1">
    <MoleculeCard bind:molecule={sample.ground} title="Ground Molecule" vizOpen={true} />
    <MoleculeCard bind:molecule={sample.excited} title="Excited Molecule" vizOpen={true} />
  </div>
</div>
