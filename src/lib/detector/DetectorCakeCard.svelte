<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import DetectorCakeVisualization from './components/cake-vis.svelte';

  const simulation = useSimulationState();

  $effect(() => {
    let maxX = 0;
    let maxY = 0;
    for (const module of simulation.detector.modules) {
      const moduleMaxX = module.x + module.width;
      const moduleMaxY = module.y + module.height;
      if (moduleMaxX > maxX) {
        maxX = moduleMaxX;
      }
      if (moduleMaxY > maxY) {
        maxY = moduleMaxY;
      }
    }
    simulation.detector.image_shape = [maxY, maxX];
  });
</script>

<DetectorCakeVisualization
  bind:detectorModules={simulation.detector.modules}
  bind:beamCenter={simulation.detector.beam_center}
  detectorDistance={simulation.detector.distance}
/>
