<script lang="ts">
  import { DetectorCakeCard, DetectorInfoCard, DetectorSetupCard } from '$lib/detector/';
  import { useSimulationState } from '$lib/state.svelte';

  let {
    detector: { modules, beamCenter, distance, imageShape, pixelSize },
    probe: { wavelength },
  } = useSimulationState();
</script>

<div class="flex flex-wrap gap-6">
  <DetectorSetupCard bind:distance bind:beamCenter />
  <DetectorInfoCard {modules} {beamCenter} {distance} {imageShape} {pixelSize} {wavelength} />
  <DetectorCakeCard bind:modules bind:beamCenter bind:distance bind:imageShape />
</div>
