<script lang="ts">
  import { MoleculeCardSelection, MoleculeTableCard } from '$lib/molecule';
  import { SolventCard, SolventInfoCard } from '$lib/sample';
  import { useSimulationState } from '$lib/state.svelte';

  let { sample } = useSimulationState();

  let ground = sample.ground;
  let excited = sample.excited;
</script>

<div class="mt-8 flex flex-col gap-6 @sm:flex-wrap">
  <div class="grid grid-cols-3 gap-6 @sm:grid-cols-1">
    <SolventCard
      bind:solvent={sample.solvent}
      bind:concentrationSoluteMolar={sample.concentrationSoluteMolar}
    />
    <SolventInfoCard solvent={sample.solvent} />
    <MoleculeCardSelection {ground} {excited} />
  </div>

  <MoleculeTableCard bind:ground bind:excited />
</div>
