<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { createSimulationSeed } from '$lib/state.svelte';

  import ProbeSetupCard from '$lib/probe/components/ProbeSetupCard.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: ProbeSetupCard,
    args: {
      probe: defaultState.probe,
      short: false,
    },
  });
</script>

<Story name="Default" />

<Story name="Short" args={{ short: true }} />
