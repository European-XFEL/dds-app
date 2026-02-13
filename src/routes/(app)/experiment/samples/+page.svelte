<script lang="ts">
  import { listMolecules, listSolvents } from '$remote';

  import { MoleculeCardSelection, MoleculeTableCard } from '$lib/molecule';
  import { SolventCard, SolventInfoCard } from '$lib/sample';
  import { useSimulationState } from '$lib/state.svelte';

  const [molecules, solvents] = await Promise.all([
    listMolecules(),
    listSolvents(),
  ]);

  const simulation = useSimulationState();
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-wrap gap-6 [&>div]:min-w-sm [&>div]:flex-1">
    <SolventCard
      {solvents}
      bind:solvent={simulation.sample.solvent}
      bind:concentrationSoluteMolar={simulation.sample.concentrationSoluteMolar}
    />
    <SolventInfoCard solvent={simulation.sample.solvent} />
    <MoleculeCardSelection
      ground={simulation.sample.ground}
      excited={simulation.sample.excited}
    />
  </div>

  <MoleculeTableCard
    {molecules}
    ground={simulation.sample.ground}
    excited={simulation.sample.excited}
  />
</div>
