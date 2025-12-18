<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { createSimulationSeed } from '$lib/state.svelte';

  import SolventCard from '$lib/sample/components/SolventCard.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: SolventCard,
    args: {
      solvent: defaultState.sample.solvent,
      concentrationSoluteMolar: defaultState.sample.concentrationSoluteMolar,
      qRange: defaultState.qRange,
      short: false,
    },
  });
</script>

<Story name="Default" />

<Story name="Short" args={{ short: true }} />
