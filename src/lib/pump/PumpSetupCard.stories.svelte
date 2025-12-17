<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { createSimulationSeed } from '$lib/state.svelte';

  import PumpSetupCard from './PumpSetupCard.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: PumpSetupCard,
    args: {
      pump: defaultState.pump,
    },
  });
</script>

<Story name="Default" />
