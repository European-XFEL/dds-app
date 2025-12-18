<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { createSimulationSeed } from '$lib/state.svelte';

  import DetectorCakeCard from '$lib/detector/components/DetectorCakeCard.svelte';

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
