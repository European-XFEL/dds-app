<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import DetectorCakeCard from '$lib/detector/components/DetectorCakeCard.svelte';
  import { createSimulationSeed } from '$lib/state.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: DetectorCakeCard,
    args: {
      beamCenter: defaultState.detector.beamCenter,
      imageShape: defaultState.detector.imageShape,
      modules: defaultState.detector.modules,
    },
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default" />
