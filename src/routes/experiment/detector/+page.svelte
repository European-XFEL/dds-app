<script lang="ts">
  import {
    DetectorCakeCard,
    DetectorInfoCard,
    DetectorSetupCard,
  } from '$lib/detector/';
  import { useSimulationState } from '$lib/state.svelte';

  const simulation = useSimulationState();
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-wrap gap-6 [&>div]:min-w-sm [&>div]:flex-1">
    <DetectorSetupCard
      bind:distance={simulation.detector.distance}
      bind:beamCenter={simulation.detector.beamCenter}
    />
    <DetectorInfoCard
      imageShape={simulation.detector.imageShape}
      pixelSize={simulation.detector.pixelSize}
      qRange={simulation.detector.qRange}
    />
  </div>

  <DetectorCakeCard
    bind:modules={simulation.detector.modules}
    bind:beamCenter={simulation.detector.beamCenter}
    bind:distance={simulation.detector.distance}
    radiusRange={simulation.detector.radiusRange}
  />
</div>
