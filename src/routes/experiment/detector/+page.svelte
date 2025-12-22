<script lang="ts">
  import { DetectorCakeCard, DetectorInfoCard, DetectorSetupCard } from '$lib/detector/';
  import { useSimulationState } from '$lib/state.svelte';

  let {
    detector,
    probe: { wavelength },
  } = useSimulationState();
</script>

<div class="flex flex-wrap gap-6">
  <DetectorSetupCard bind:distance={detector.distance} bind:beamCenter={detector.beamCenter} />
  <DetectorInfoCard
    modules={detector.modules}
    beamCenter={detector.beamCenter}
    distance={detector.distance}
    imageShape={detector.imageShape}
    pixelSize={detector.pixelSize}
    {wavelength}
  />
  <DetectorCakeCard
    bind:modules={detector.modules}
    bind:beamCenter={detector.beamCenter}
    bind:distance={detector.distance}
  />
</div>
