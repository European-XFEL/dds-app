<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { createSimulationSeed } from '$lib/state.svelte';

  import DetectorSetupCard from '$lib/detector/components/DetectorSetupCard.svelte';

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
