<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import PumpSetupCard from '$lib/pump/components/PumpSetupCard.svelte';
  import { createSimulationSeed } from '$lib/state.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: PumpSetupCard,
    args: {
      pump: defaultState.pump,
    },
  });
</script>

<Story name="Default" />
