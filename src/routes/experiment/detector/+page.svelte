<script lang="ts">
  import {
    DetectorCakeCard,
    DetectorInfoCard,
    DetectorSetupCard,
  } from '$lib/detector/';
  import { useSimulationState } from '$lib/state.svelte';

  const simulation = useSimulationState();
</script>

<div class="mt-8 flex flex-wrap gap-6">
  <DetectorSetupCard
    bind:distance={simulation.detector.distance}
    bind:beamCenter={simulation.detector.beamCenter}
  />
  <DetectorInfoCard
    imageShape={simulation.detector.imageShape}
    pixelSize={simulation.detector.pixelSize}
    qRange={simulation.detector.qRange}
  />
  <DetectorCakeCard
    bind:modules={simulation.detector.modules}
    bind:beamCenter={simulation.detector.beamCenter}
    bind:distance={simulation.detector.distance}
    radiusRange={simulation.detector.radiusRange}
  />
</div>
