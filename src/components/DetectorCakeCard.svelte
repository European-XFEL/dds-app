<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import DetectorCakeVisualization from '$components/ui/detector/cake-vis.svelte';

  const simulation = useSimulationState();

  $inspect(simulation.detector.beam_center);
</script>

<DetectorCakeVisualization
  bind:detectorModules={simulation.detector.modules}
  bind:beamCenter={simulation.detector.beam_center}
  detectorDistance={simulation.detector.distance}
/>
