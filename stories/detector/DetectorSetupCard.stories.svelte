<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import DetectorSetupCard from '$lib/detector/components/DetectorSetupCard.svelte';
  import { createSimulationSeed } from '$lib/state.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: DetectorSetupCard,
    args: {
      distance: defaultState.detector.distance,
      beamCenter: defaultState.detector.beamCenter,
    },
  });
</script>

<Story name="Default" />
