<script lang="ts">
  import { useSimulationState } from '$lib/state.svelte';

  import DetectorCakeVisualization from './components/cake-vis.svelte';

  const simulation = useSimulationState();

  $effect(() => {
    const modules = simulation.detector.modules;

    const moduleXs = modules.map((m) => m.x);
    const moduleYs = modules.map((m) => m.y);

    const X = Math.max(...moduleXs) - Math.min(...moduleXs);
    const Y = Math.min(...moduleYs) - Math.max(...moduleYs);

    simulation.detector.image_shape = [X + modules[0].width, Y + modules[0].height];
  });
</script>

<DetectorCakeVisualization
  bind:detectorModules={simulation.detector.modules}
  bind:beamCenter={simulation.detector.beam_center}
  detectorDistance={simulation.detector.distance}
/>
