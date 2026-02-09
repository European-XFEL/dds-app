<script lang="ts">
  import { MoleculeCardSelection, MoleculeTableCard } from '$lib/molecule';
  import { SolventCard, SolventInfoCard } from '$lib/sample';
  import { useSimulationState } from '$lib/state.svelte';

  const simulation = useSimulationState();
</script>

<div class="mt-8 flex flex-col gap-6 @sm:flex-wrap">
  <div class="grid grid-cols-3 gap-6 @sm:grid-cols-1">
    <SolventCard
      bind:solvent={simulation.sample.solvent}
      bind:concentrationSoluteMolar={simulation.sample.concentrationSoluteMolar}
    />
    <SolventInfoCard solvent={simulation.sample.solvent} />
    <MoleculeCardSelection
      ground={simulation.sample.ground ?? null}
      excited={simulation.sample.excited ?? null}
    />
  </div>

  <MoleculeTableCard
    ground={simulation.sample.ground}
    excited={simulation.sample.excited}
  />
</div>
