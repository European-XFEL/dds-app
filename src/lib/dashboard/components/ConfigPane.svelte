<script lang="ts">
  import { DetectorSetupCard } from '$lib/detector';
  import { MoleculeCard } from '$lib/molecule';
  import { PumpSetupCard } from '$lib/pump';
  import { SolventCard } from '$lib/sample';

  const { simulation, molecules, solvents, short } = $props();
</script>

<div class="flex flex-col gap-4 *:flex-1">
  <SolventCard
    {solvents}
    bind:concentrationSoluteMolar={simulation.sample.concentrationSoluteMolar}
    bind:solvent={simulation.sample.solvent}
    {short}
  />
  <MoleculeCard
    {molecules}
    bind:ground={simulation.sample.ground}
    bind:excited={simulation.sample.excited}
  />
  <DetectorSetupCard
    bind:distance={simulation.detector.distance}
    bind:beamCenter={simulation.detector.beamCenter}
  />
  <PumpSetupCard bind:pump={simulation.pump} />
</div>
