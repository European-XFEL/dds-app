<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import DetectorInfoCard from '$lib/detector/components/DetectorInfoCard.svelte';
  import { createSimulationSeed } from '$lib/state.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: DetectorInfoCard,
    args: {
      modules: defaultState.detector.modules,
      distance: defaultState.detector.distance,
      beamCenter: defaultState.detector.beamCenter,
      imageShape: defaultState.detector.imageShape,
      pixelSize: defaultState.detector.pixelSize,
      wavelength: defaultState.probe.wavelength,
    },
  });
</script>

<Story name="Default" />
